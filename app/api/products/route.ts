import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { defaultPackages, RobuxPackage } from "@/lib/adminStore";

/**
 * GET /api/products
 * Fetch products list
 * Cached at Cloudflare Edge for 60s for public storefront, dynamic for admin (?all=true or ?nocache=true)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const includeInactive = searchParams.get("all") === "true";
    const noCache = searchParams.get("nocache") === "true" || includeInactive;

    let query = `
      SELECT 
        id,
        name,
        robux,
        price,
        is_active,
        is_sold_out,
        display_order,
        image_path
      FROM public.products
    `;

    if (!includeInactive) {
      query += ` WHERE is_active = true`;
    }

    query += ` ORDER BY display_order ASC, robux ASC`;

    let rows = await sql(query);

    // Auto-seed default packages if table is empty
    if (rows.length === 0) {
      for (const p of defaultPackages) {
        await sql(
          `
          INSERT INTO public.products (name, robux, price, is_active, is_sold_out, display_order)
          VALUES ($1, $2, $3, $4, $5, $6)
          `,
          [
            `${p.amount.toLocaleString("id-ID")} Robux`,
            p.amount,
            p.numericPrice,
            p.status !== "inactive",
            p.status === "sold_out",
            p.amount,
          ]
        );
      }
      rows = await sql(query);
    }

    const mapped = rows.map((r: any) => ({
      id: `pkg-${r.robux}`,
      dbId: r.id,
      name: r.name,
      amount: r.robux,
      price: `Rp ${Number(r.price).toLocaleString("id-ID")}`,
      numericPrice: Number(r.price),
      isActive: r.is_active,
      isSoldOut: r.is_sold_out,
      inStock: !r.is_sold_out && r.is_active,
      status: r.is_sold_out ? "sold_out" : r.is_active ? "active" : "inactive",
      displayOrder: r.display_order,
      imagePath: r.image_path,
    }));

    const response = NextResponse.json({ success: true, products: mapped });

    if (!noCache) {
      // Cloudflare Edge Cache for 60 seconds
      response.headers.set("Cache-Control", "public, s-maxage=60, stale-while-revalidate=300");
    } else {
      response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate");
    }

    return response;
  } catch (error: any) {
    console.error("GET /api/products error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

/**
 * POST /api/products
 * Add new product (Admin)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, robux, price, isActive = true, isSoldOut = false, displayOrder = 0 } = body;

    if (!robux || !price) {
      return NextResponse.json(
        { success: false, error: "Nominal Robux dan harga wajib diisi" },
        { status: 400 }
      );
    }

    const numericPrice = typeof price === "number" ? price : parseInt(String(price).replace(/[^0-9]/g, "")) || 0;
    const numericRobux = typeof robux === "number" ? robux : parseInt(String(robux).replace(/[^0-9]/g, "")) || 0;
    const productName = name || `${numericRobux.toLocaleString("id-ID")} Robux`;

    const result = await sql(
      `
      INSERT INTO public.products (name, robux, price, is_active, is_sold_out, display_order)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, name, robux, price, is_active, is_sold_out, display_order
      `,
      [productName, numericRobux, numericPrice, isActive, isSoldOut, displayOrder || numericRobux]
    );

    const response = NextResponse.json({
      success: true,
      message: "Paket Robux berhasil ditambahkan!",
      product: result[0],
    });
    response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate");
    return response;
  } catch (error: any) {
    console.error("POST /api/products error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

/**
 * PATCH /api/products
 * Update product price, status, or sold out state (Admin)
 * Supports single product or batch array update
 */
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();

    // 1. Batch sync all packages
    if (body.packages && Array.isArray(body.packages)) {
      const incomingPkgs: RobuxPackage[] = body.packages;

      for (const p of incomingPkgs) {
        const numericPrice = p.numericPrice || parseInt(String(p.price).replace(/[^0-9]/g, "")) || 0;
        const isSoldOut = p.status === "sold_out" || p.inStock === false;
        const isActive = p.status !== "inactive";
        const name = `${p.amount.toLocaleString("id-ID")} Robux`;

        const existing = await sql(`SELECT id FROM public.products WHERE robux = $1 LIMIT 1`, [p.amount]);

        if (existing.length > 0) {
          await sql(
            `
            UPDATE public.products
            SET 
              price = $1,
              is_active = $2,
              is_sold_out = $3,
              display_order = $4,
              name = $5,
              updated_at = NOW()
            WHERE robux = $6
            `,
            [numericPrice, isActive, isSoldOut, p.amount, name, p.amount]
          );
        } else {
          await sql(
            `
            INSERT INTO public.products (name, robux, price, is_active, is_sold_out, display_order)
            VALUES ($1, $2, $3, $4, $5, $6)
            `,
            [name, p.amount, numericPrice, isActive, isSoldOut, p.amount]
          );
        }
      }

      const response = NextResponse.json({
        success: true,
        message: "Semua paket Robux berhasil disinkronkan ke database!",
      });
      response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate");
      return response;
    }

    // 2. Single product update
    const { id, robux, price, isActive, isSoldOut, displayOrder, name } = body;

    if (!id && !robux) {
      return NextResponse.json({ success: false, error: "Product ID or robux amount is required" }, { status: 400 });
    }

    const updates: string[] = [];
    const params: any[] = [];

    if (name !== undefined) {
      params.push(name);
      updates.push(`name = $${params.length}`);
    }

    if (price !== undefined) {
      const numPrice = typeof price === "number" ? price : parseInt(String(price).replace(/[^0-9]/g, "")) || 0;
      params.push(numPrice);
      updates.push(`price = $${params.length}`);
    }

    if (isActive !== undefined) {
      params.push(Boolean(isActive));
      updates.push(`is_active = $${params.length}`);
    }

    if (isSoldOut !== undefined) {
      params.push(Boolean(isSoldOut));
      updates.push(`is_sold_out = $${params.length}`);
    }

    if (displayOrder !== undefined) {
      params.push(parseInt(displayOrder) || 0);
      updates.push(`display_order = $${params.length}`);
    }

    if (updates.length === 0) {
      return NextResponse.json({ success: false, error: "No fields to update" }, { status: 400 });
    }

    updates.push(`updated_at = NOW()`);

    let whereClause = "";
    if (id) {
      params.push(id);
      whereClause = `WHERE id = $${params.length}`;
    } else {
      params.push(robux);
      whereClause = `WHERE robux = $${params.length}`;
    }

    const result = await sql(
      `
      UPDATE public.products
      SET ${updates.join(", ")}
      ${whereClause}
      RETURNING id, name, robux, price, is_active, is_sold_out, display_order
      `,
      params
    );

    const response = NextResponse.json({
      success: true,
      message: "Paket Robux berhasil diperbarui!",
      product: result[0],
    });
    response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate");
    return response;
  } catch (error: any) {
    console.error("PATCH /api/products error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

/**
 * DELETE /api/products
 * Delete a product (Admin)
 */
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const robux = searchParams.get("robux");

    if (!id && !robux) {
      return NextResponse.json({ success: false, error: "Product ID or robux is required" }, { status: 400 });
    }

    if (id) {
      await sql(`DELETE FROM public.products WHERE id = $1`, [id]);
    } else {
      await sql(`DELETE FROM public.products WHERE robux = $1`, [robux]);
    }

    const response = NextResponse.json({ success: true, message: "Paket Robux berhasil dihapus!" });
    response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate");
    return response;
  } catch (error: any) {
    console.error("DELETE /api/products error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
