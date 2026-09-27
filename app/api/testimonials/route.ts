import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";

/**
 * GET /api/testimonials
 * Cached at Cloudflare Edge for 60s for public storefront, dynamic for admin / order_code checks
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const all = searchParams.get("all") === "true"; // Admin view
    const orderCode = searchParams.get("order_code")?.trim();
    const noCache = searchParams.get("nocache") === "true" || all || !!orderCode;

    if (orderCode) {
      const rows = await sql(
        `SELECT id, name, message, rating, status, order_code, created_at FROM public.testimonials WHERE order_code = $1 LIMIT 1`,
        [orderCode]
      );
      const res = NextResponse.json({
        success: true,
        hasReviewed: rows.length > 0,
        testimonial: rows[0] || null,
      });
      res.headers.set("Cache-Control", "no-store, no-cache, must-revalidate");
      return res;
    }

    let query = `
      SELECT id, name, message, rating, image_path, status, admin_reply, order_code, created_at
      FROM public.testimonials
    `;

    if (!all) {
      query += ` WHERE status = 'approved' OR status = 'active'`;
    }

    query += ` ORDER BY created_at DESC LIMIT 50`;

    const rows = await sql(query);

    const formattedRows = rows.map((row: any) => {
      let reply = row.admin_reply;
      if (reply && typeof reply === "object") {
        reply = reply.message || reply.text || reply.reply || JSON.stringify(reply);
      }
      return {
        ...row,
        admin_reply: reply || null,
      };
    });

    const response = NextResponse.json({ success: true, testimonials: formattedRows });

    if (!noCache) {
      response.headers.set("Cache-Control", "public, s-maxage=60, stale-while-revalidate=300");
    } else {
      response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate");
    }

    return response;
  } catch (error: any) {
    console.error("GET /api/testimonials error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

/**
 * POST /api/testimonials
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, message, rating = 5, orderCode = null } = body;

    if (!name || !message) {
      return NextResponse.json({ success: false, error: "Nama dan pesan ulasan wajib diisi" }, { status: 400 });
    }

    const cleanUsername = name.replace(/^@+/, "").trim();
    const cleanOrderCode = orderCode ? String(orderCode).replace(/^#/, "").trim() : null;
    const parsedRating = Math.min(Math.max(parseInt(rating) || 5, 1), 5);

    // Fetch Roblox avatar headshot
    let avatarUrl: string | null = null;
    try {
      const userRes = await fetch("https://users.roblox.com/v1/usernames/users", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ usernames: [cleanUsername], excludeBannedUsers: false }),
        signal: AbortSignal.timeout(3000),
      });
      if (userRes.ok) {
        const uData = await userRes.json();
        if (uData?.data?.[0]?.id) {
          const thumbRes = await fetch(
            `https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${uData.data[0].id}&size=150x150&format=Png&isCircular=false`,
            { signal: AbortSignal.timeout(3000) }
          );
          if (thumbRes.ok) {
            const tData = await thumbRes.json();
            avatarUrl = tData?.data?.[0]?.imageUrl ?? null;
          }
        }
      }
    } catch {}

    // 1. Prevent duplicate testimonials for the same order code (1 order = 1 testimonial)
    if (cleanOrderCode) {
      const existing = await sql(
        `SELECT id FROM public.testimonials WHERE order_code = $1 LIMIT 1`,
        [cleanOrderCode]
      );

      if (existing.length > 0) {
        // Update existing testimonial instead of inserting duplicate
        const updated = await sql(
          `
          UPDATE public.testimonials
          SET message = $1, rating = $2, name = $3, image_path = COALESCE($4, image_path)
          WHERE order_code = $5
          RETURNING id, name, message, rating, image_path, admin_reply, status, created_at
          `,
          [message.trim(), parsedRating, `@${cleanUsername}`, avatarUrl, cleanOrderCode]
        );

        const res = NextResponse.json({
          success: true,
          message: "Ulasan kamu untuk pesanan ini berhasil diperbarui!",
          item: updated[0],
          isUpdated: true,
        });
        res.headers.set("Cache-Control", "no-store, no-cache, must-revalidate");
        return res;
      }
    }

    // 2. Insert new testimonial
    const result = await sql(
      `
      INSERT INTO public.testimonials (name, message, rating, order_code, image_path, status)
      VALUES ($1, $2, $3, $4, $5, 'approved')
      RETURNING id, name, message, rating, image_path, admin_reply, status, created_at
      `,
      [`@${cleanUsername}`, message.trim(), parsedRating, cleanOrderCode, avatarUrl || "/logo_background.PNG"]
    );

    const response = NextResponse.json({ success: true, message: "Testimoni berhasil ditambahkan!", item: result[0] });
    response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate");
    return response;
  } catch (error: any) {
    console.error("POST /api/testimonials error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

/**
 * PATCH /api/testimonials
 */
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status, adminReply } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: "Testimonial ID is required" }, { status: 400 });
    }

    const updates: string[] = [];
    const params: any[] = [];

    if (status !== undefined) {
      params.push(status);
      updates.push(`status = $${params.length}`);
    }

    if (adminReply !== undefined) {
      if (adminReply === null || String(adminReply).trim() === "") {
        updates.push(`admin_reply = NULL`);
      } else {
        params.push(String(adminReply).trim());
        updates.push(`admin_reply = to_json($${params.length}::text)`);
      }
    }

    if (updates.length === 0) {
      return NextResponse.json({ success: false, error: "No fields to update" }, { status: 400 });
    }

    updates.push(`updated_at = NOW()`);
    params.push(id);

    const result = await sql(
      `
      UPDATE public.testimonials
      SET ${updates.join(", ")}
      WHERE id = $${params.length}
      RETURNING id, name, status, admin_reply
      `,
      params
    );

    const updatedItem = result[0]
      ? {
          ...result[0],
          admin_reply:
            typeof result[0].admin_reply === "object" && result[0].admin_reply !== null
              ? result[0].admin_reply.message || result[0].admin_reply.text || JSON.stringify(result[0].admin_reply)
              : result[0].admin_reply || null,
        }
      : null;

    const response = NextResponse.json({ success: true, message: "Testimoni berhasil diperbarui!", item: updatedItem });
    response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate");
    return response;
  } catch (error: any) {
    console.error("PATCH /api/testimonials error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

/**
 * DELETE /api/testimonials
 */
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "Testimonial ID is required" }, { status: 400 });
    }

    await sql(`DELETE FROM public.testimonials WHERE id = $1`, [id]);
    const response = NextResponse.json({ success: true, message: "Testimoni berhasil dihapus" });
    response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate");
    return response;
  } catch (error: any) {
    console.error("DELETE /api/testimonials error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
