import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";

/**
 * GET /api/tracking?q=username_or_order_code
 * Super optimized, lightweight query for customer tracking (< 400 bytes per response)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q")?.trim() || searchParams.get("username")?.trim() || searchParams.get("order_code")?.trim() || "";

    if (!query) {
      const emptyRes = NextResponse.json({ success: true, orders: [], count: 0 });
      emptyRes.headers.set("Cache-Control", "public, s-maxage=10, stale-while-revalidate=30");
      return emptyRes;
    }

    const cleanQuery = query.replace(/^@+/, "").toLowerCase();

    // Query matching username or order code (Limit to last 10 orders to prevent heavy payloads)
    const rows = await sql(
      `
      SELECT 
        o.order_code,
        o.roblox_username,
        o.roblox_user_id,
        o.robux,
        o.price,
        o.payment_method,
        o.payment_status,
        o.payment_proof_path,
        o.order_status,
        o.activation_url,
        o.gamepass_url,
        o.customer_notes,
        o.created_at,
        o.updated_at
      FROM public.orders o
      WHERE lower(regexp_replace(o.roblox_username, '^@+', '')) = $1 
         OR lower(o.order_code) = $1
      ORDER BY o.created_at DESC
      LIMIT 10
      `,
      [cleanQuery]
    );

    const mapped = rows.map((r: any) => {
      let formattedDate = "-";
      try {
        const createdDate = new Date(r.created_at);
        const formatter = new Intl.DateTimeFormat("id-ID", {
          timeZone: "Asia/Jakarta",
          day: "numeric",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        });
        const parts = formatter.formatToParts(createdDate);
        const get = (type: string) => parts.find((p) => p.type === type)?.value || "";
        formattedDate = `${get("day")} ${get("month")} ${get("year")}, ${get("hour")}:${get("minute")} WIB`;
      } catch {
        formattedDate = new Date(r.created_at).toLocaleString("id-ID");
      }

      const statusLabels: Record<string, { label: string; step: number; color: string }> = {
        pending: { label: "Menunggu Pembayaran", step: 1, color: "text-amber-600 bg-amber-50 border-amber-200" },
        processing: { label: "Sedang Diproses", step: 2, color: "text-blue-600 bg-blue-50 border-blue-200" },
        completed: { label: "Pesanan Selesai", step: 3, color: "text-emerald-600 bg-emerald-50 border-emerald-200" },
        cancelled: { label: "Pesanan Dibatalkan", step: 0, color: "text-rose-600 bg-rose-50 border-rose-200" },
      };

      const meta = statusLabels[r.order_status] || statusLabels.pending;

      return {
        orderCode: r.order_code,
        robloxUsername: String(r.roblox_username || "").replace(/^@+/, ""),
        robloxUserId: r.roblox_user_id || null,
        robuxAmount: r.robux,
        priceFormatted: `Rp ${Number(r.price).toLocaleString("id-ID")}`,
        numericPrice: Number(r.price),
        paymentMethod: r.payment_method,
        paymentStatus: r.payment_status,
        paymentProofPath: r.payment_proof_path || null,
        orderStatus: r.order_status,
        statusLabel: meta.label,
        currentStep: meta.step,
        statusColor: meta.color,
        activationUrl: r.activation_url || null,
        gamepassUrl: r.gamepass_url || null,
        customerNotes: r.customer_notes || "",
        date: formattedDate,
      };
    });

    const response = NextResponse.json({
      success: true,
      query: query,
      count: mapped.length,
      orders: mapped,
    });
    response.headers.set("Cache-Control", "public, s-maxage=10, stale-while-revalidate=30");
    return response;
  } catch (error: any) {
    console.error("GET /api/tracking error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
