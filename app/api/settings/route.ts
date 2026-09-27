import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";

/**
 * GET /api/settings
 * Fetch store settings
 * Cached at Cloudflare Edge for 60s for public requests, instant dynamic for admin
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const noCache = searchParams.get("nocache") === "true";

    const rows = await sql(`SELECT * FROM public.store_settings ORDER BY id ASC LIMIT 1`);

    const defaultSettings = {
      storeName: "VietBlox",
      whatsappNumber: "6281234567890",
      qrisImageUrl: "/payments/qris.svg",
      logoImageUrl: "/logo_background.PNG",
      bannerImageUrl: "/banner_background.jpg",
      isPromoActive: true,
      selectedPromoPackageId: "pkg-2200",
      promoRobuxAmount: 2200,
      promoDiscountPrice: 45000,
      promoTagline: "Top Up Robux Instant, Cepat, Legal, Aman & Bergaransi 100% Uang",
      promoEndDate: "1 Oktober 2026, 06:59 WIB",
      defaultActivationUrl: "",
    };

    if (rows.length === 0) {
      const response = NextResponse.json({
        success: true,
        settings: defaultSettings,
      });

      if (!noCache) {
        response.headers.set("Cache-Control", "public, s-maxage=60, stale-while-revalidate=300");
      } else {
        response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate");
      }
      return response;
    }

    const r = rows[0];
    const settings = {
      storeName: r.store_name || "VietBlox",
      whatsappNumber: r.whatsapp_number || "6281234567890",
      qrisImageUrl: r.qris_image_path || "/payments/qris.svg",
      logoImageUrl: r.logo_image_path || "/logo_background.PNG",
      bannerImageUrl: r.banner_image_path || "/banner_background.jpg",
      isPromoActive: r.promo_active !== false,
      selectedPromoPackageId: `pkg-${r.promo_robux_amount || 2200}`,
      promoRobuxAmount: r.promo_robux_amount || 2200,
      promoDiscountPrice: r.promo_discount_price || 45000,
      promoTagline: r.promo_subtitle || "Top Up Robux Instant, Cepat, Legal, Aman & Bergaransi 100% Uang",
      promoEndDate: r.promo_end_date
        ? typeof r.promo_end_date === "string" && r.promo_end_date.includes("WIB")
          ? r.promo_end_date
          : new Date(r.promo_end_date).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })
        : "1 Oktober 2026, 06:59 WIB",
      defaultActivationUrl: r.default_activation_url || "",
    };

    const response = NextResponse.json({
      success: true,
      settings,
    });

    if (!noCache) {
      // Cloudflare Edge Cache for 60s, background revalidate for 300s
      response.headers.set("Cache-Control", "public, s-maxage=60, stale-while-revalidate=300");
    } else {
      response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate");
    }

    return response;
  } catch (error: any) {
    console.error("GET /api/settings error:", error);
    // Return default settings safely with 200 OK so storefront never crashes
    return NextResponse.json({
      success: true,
      settings: {
        storeName: "VietBlox",
        whatsappNumber: "6281234567890",
        qrisImageUrl: "/payments/qris.svg",
        logoImageUrl: "/logo_background.PNG",
        bannerImageUrl: "/banner_background.jpg",
        isPromoActive: true,
        selectedPromoPackageId: "pkg-2200",
        promoRobuxAmount: 2200,
        promoDiscountPrice: 45000,
        promoTagline: "Top Up Robux Instant, Cepat, Legal, Aman & Bergaransi 100% Uang",
        promoEndDate: "1 Oktober 2026, 06:59 WIB",
        defaultActivationUrl: "",
      },
      warning: error.message,
    });
  }
}

/**
 * POST or PATCH /api/settings
 * Update store settings (Admin)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      storeName,
      whatsappNumber,
      qrisImageUrl,
      logoImageUrl,
      bannerImageUrl,
      isPromoActive,
      selectedPromoPackageId,
      promoTagline,
      promoEndDate,
      defaultActivationUrl,
    } = body;

    const promoAmount = selectedPromoPackageId
      ? parseInt(String(selectedPromoPackageId).replace(/[^0-9]/g, "")) || 2200
      : 2200;

    // Ensure default_activation_url column exists safely without failing
    try {
      await sql(`ALTER TABLE public.store_settings ADD COLUMN IF NOT EXISTS default_activation_url text;`);
    } catch {}

    const existing = await sql(`SELECT id FROM public.store_settings ORDER BY id ASC LIMIT 1`);

    if (existing.length > 0) {
      await sql(
        `
        UPDATE public.store_settings
        SET
          store_name = COALESCE($1, store_name),
          whatsapp_number = COALESCE($2, whatsapp_number),
          qris_image_path = COALESCE($3, qris_image_path),
          logo_image_path = COALESCE($4, logo_image_path),
          banner_image_path = COALESCE($5, banner_image_path),
          promo_active = COALESCE($6, promo_active),
          promo_subtitle = COALESCE($7, promo_subtitle),
          promo_robux_amount = COALESCE($8, promo_robux_amount),
          default_activation_url = COALESCE($9, default_activation_url),
          updated_at = NOW()
        WHERE id = $10
        `,
        [
          storeName || "VietBlox",
          whatsappNumber || "6281234567890",
          qrisImageUrl || "/payments/qris.svg",
          logoImageUrl || "/logo_background.PNG",
          bannerImageUrl || "/banner_background.jpg",
          isPromoActive !== undefined ? isPromoActive : true,
          promoTagline || "Top Up Robux Instant, Cepat, Legal, Aman & Bergaransi 100% Uang",
          promoAmount,
          defaultActivationUrl !== undefined ? defaultActivationUrl : null,
          existing[0].id,
        ]
      );
    } else {
      await sql(
        `
        INSERT INTO public.store_settings (
          store_name,
          whatsapp_number,
          qris_image_path,
          logo_image_path,
          banner_image_path,
          promo_active,
          promo_subtitle,
          promo_robux_amount,
          default_activation_url,
          updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())
        `,
        [
          storeName || "VietBlox",
          whatsappNumber || "6281234567890",
          qrisImageUrl || "/payments/qris.svg",
          logoImageUrl || "/logo_background.PNG",
          bannerImageUrl || "/banner_background.jpg",
          isPromoActive !== undefined ? isPromoActive : true,
          promoTagline || "Top Up Robux Instant, Cepat, Legal, Aman & Bergaransi 100% Uang",
          promoAmount,
          defaultActivationUrl || "",
        ]
      );
    }

    const response = NextResponse.json({
      success: true,
      message: "Pengaturan toko berhasil disimpan ke database Neon!",
    });
    response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate");
    return response;
  } catch (error: any) {
    console.error("POST /api/settings error:", error);
    return NextResponse.json({ success: false, error: error.message || "Failed to update settings" }, { status: 500 });
  }
}
