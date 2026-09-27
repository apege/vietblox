import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";

// Helper to format date in Indonesian locale
function formatIndoDate(d: Date = new Date()) {
  const months = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];
  const day = d.getDate();
  const month = months[d.getMonth()];
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  return `${day} ${month} ${year} pukul ${hours}:${minutes} WIB`;
}

/**
 * GET /api/orders
 * Fetch orders for admin list with search & status filter
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status"); // "pending" | "processing" | "completed" | "cancelled" | "all"
    const search = searchParams.get("search")?.trim() || "";
    const limit = Math.min(parseInt(searchParams.get("limit") || "100"), 200);

    let query = `
      SELECT 
        o.id,
        o.order_code,
        o.product_id,
        o.roblox_username,
        o.roblox_user_id,
        o.customer_phone,
        o.robux,
        o.price,
        o.payment_method,
        o.payment_status,
        o.payment_proof_path,
        o.order_status,
        o.activation_url,
        o.gamepass_url,
        o.gamepass_id,
        o.customer_notes,
        o.admin_notes,
        o.created_at,
        o.updated_at
      FROM public.orders o
      WHERE 1=1
    `;
    const params: any[] = [];

    if (status && status !== "all") {
      params.push(status);
      query += ` AND o.order_status = $${params.length}`;
    }

    if (search) {
      params.push(`%${search.toLowerCase()}%`);
      query += ` AND (lower(o.order_code) LIKE $${params.length} OR lower(o.roblox_username) LIKE $${params.length} OR o.customer_phone LIKE $${params.length})`;
    }

    query += ` ORDER BY o.created_at DESC LIMIT ${limit}`;

    const rows = await sql(query, params);

    // Map rows to match frontend OrderItem format
    const mapped = rows.map((r: any) => {
      const createdDate = new Date(r.created_at);
      const shortDate = `${createdDate.getDate()} ${["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agu","Sep","Okt","Nov","Des"][createdDate.getMonth()]}, ${String(createdDate.getHours()).padStart(2,"0")}.${String(createdDate.getMinutes()).padStart(2,"0")}`;

      const statusMap: Record<string, { status: "masuk" | "diproses" | "selesai" | "dibatalkan"; label: string }> = {
        pending: { status: "masuk", label: "Menunggu Bayar" },
        processing: { status: "diproses", label: "Sedang Diproses" },
        completed: { status: "selesai", label: "Selesai" },
        cancelled: { status: "dibatalkan", label: "Dibatalkan" },
      };

      const mappedStatus = statusMap[r.order_status] || { status: "masuk", label: "Menunggu Bayar" };

      return {
        id: r.order_code,
        dbId: r.id,
        username: String(r.roblox_username || "").replace(/^@+/, ""),
        robloxUserId: r.roblox_user_id || "",
        avatarUrl: null,
        robuxAmount: r.robux,
        price: `Rp ${Number(r.price).toLocaleString("id-ID")}`,
        numericPrice: Number(r.price),
        paymentMethod: r.payment_method?.toUpperCase() === "WHATSAPP" ? "WHATSAPP" : "WEBSITE",
        paymentStatus: r.payment_status,
        status: mappedStatus.status,
        statusLabel: mappedStatus.label,
        date: shortDate,
        fullDate: formatIndoDate(createdDate),
        phone: r.customer_phone,
        customerNotes: r.customer_notes || "",
        adminNotes: r.admin_notes || "",
        paymentProof: r.payment_proof_path || null,
        activationUrl: r.activation_url || null,
        gamepassUrl: r.gamepass_url || null,
        gamepassId: r.gamepass_id || null,
      };
    });

    return NextResponse.json({ success: true, orders: mapped });
  } catch (error: any) {
    console.error("GET /api/orders error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

/**
 * POST /api/orders
 * Create a new order from checkout storefront
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      robloxUsername,
      robloxUserId,
      customerPhone,
      robuxAmount,
      price,
      paymentMethod = "Website",
      customerNotes = "",
      productId = null,
      gamepassUrl = null,
      gamepassId = null,
      paymentProofPath = null,
      orderStatus = "pending",
      paymentStatus = "pending",
      activationUrl = null,
    } = body;

    if (!robloxUsername || !robuxAmount || !price) {
      return NextResponse.json(
        { success: false, error: "Username Roblox, nominal Robux, dan harga wajib diisi" },
        { status: 400 }
      );
    }

    const cleanRobloxUsername = String(robloxUsername).trim().replace(/^@+/, "");

    // 1. Check if user is in blacklist
    const blacklistCheck = await sql(
      `SELECT id, reason FROM public.blacklists WHERE lower(roblox_username) = lower($1) LIMIT 1`,
      [cleanRobloxUsername]
    );

    if (blacklistCheck.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: `Akun @${cleanRobloxUsername} masuk dalam daftar Blacklist (${blacklistCheck[0].reason || "Dibatasi"}). Hubungi CS untuk info lebih lanjut.`,
          isBlacklisted: true,
        },
        { status: 403 }
      );
    }

    // 2. Generate unique order code (e.g. VBX84910243)
    const randomDigits = Math.floor(10000000 + Math.random() * 90000000);
    const orderCode = `VBX${randomDigits}`;

    // 3. Numeric price parse
    const numericPrice = typeof price === "number" ? price : parseInt(String(price).replace(/[^0-9]/g, "")) || 0;
    const numericRobux = typeof robuxAmount === "number" ? robuxAmount : parseInt(String(robuxAmount).replace(/[^0-9]/g, "")) || 0;

    // 4. Insert into database
    const insertResult = await sql(
      `
      INSERT INTO public.orders (
        order_code,
        product_id,
        roblox_username,
        roblox_user_id,
        customer_phone,
        robux,
        price,
        payment_method,
        payment_status,
        payment_proof_path,
        order_status,
        activation_url,
        customer_notes,
        gamepass_url,
        gamepass_id
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
      RETURNING id, order_code, roblox_username, robux, price, payment_proof_path, activation_url, order_status, created_at
      `,
      [
        orderCode,
        productId,
        cleanRobloxUsername,
        robloxUserId ? String(robloxUserId) : null,
        customerPhone ? customerPhone.trim() : "-",
        numericRobux,
        numericPrice,
        paymentMethod,
        paymentStatus,
        paymentProofPath,
        orderStatus,
        activationUrl,
        customerNotes,
        gamepassUrl,
        gamepassId,
      ]
    );

    const createdOrder = insertResult[0];

    return NextResponse.json({
      success: true,
      message: "Pesanan berhasil dibuat!",
      order: {
        orderCode: createdOrder.order_code,
        robloxUsername: createdOrder.roblox_username,
        robux: createdOrder.robux,
        price: createdOrder.price,
        trackingUrl: `/tracking?order_code=${createdOrder.order_code}`,
      },
    });
  } catch (error: any) {
    console.error("POST /api/orders error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

/**
 * PATCH /api/orders
 * Update order status, notes, or activation URL (Admin)
 */
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderCode, status, adminNotes, activationUrl, paymentStatus, paymentProofPath } = body;

    if (!orderCode) {
      return NextResponse.json({ success: false, error: "orderCode is required" }, { status: 400 });
    }

    // Map Indonesian frontend status to DB status
    const statusMap: Record<string, string> = {
      masuk: "pending",
      diproses: "processing",
      selesai: "completed",
      dibatalkan: "cancelled",
      pending: "pending",
      processing: "processing",
      completed: "completed",
      cancelled: "cancelled",
    };

    const updateFields: string[] = [];
    const params: any[] = [];

    if (status !== undefined) {
      const dbStatus = statusMap[status] || status;
      params.push(dbStatus);
      updateFields.push(`order_status = $${params.length}`);

      // Auto update payment status if order is completed
      if (dbStatus === "completed") {
        params.push("paid");
        updateFields.push(`payment_status = $${params.length}`);
      }
    }

    if (adminNotes !== undefined) {
      params.push(adminNotes);
      updateFields.push(`admin_notes = $${params.length}`);
    }

    if (activationUrl !== undefined) {
      params.push(activationUrl);
      updateFields.push(`activation_url = $${params.length}`);
    }

    if (paymentStatus !== undefined) {
      params.push(paymentStatus);
      updateFields.push(`payment_status = $${params.length}`);
    }

    if (paymentProofPath !== undefined) {
      params.push(paymentProofPath);
      updateFields.push(`payment_proof_path = $${params.length}`);
    }

    if (updateFields.length === 0) {
      return NextResponse.json({ success: false, error: "No fields to update" }, { status: 400 });
    }

    updateFields.push(`updated_at = NOW()`);
    params.push(orderCode);

    const result = await sql(
      `
      UPDATE public.orders
      SET ${updateFields.join(", ")}
      WHERE order_code = $${params.length}
      RETURNING id, order_code, order_status, payment_status, activation_url, updated_at
      `,
      params
    );

    if (result.length === 0) {
      return NextResponse.json({ success: false, error: "Pesanan tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Status pesanan berhasil diperbarui!",
      order: result[0],
    });
  } catch (error: any) {
    console.error("PATCH /api/orders error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
