import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";

/**
 * GET /api/blacklist
 * Fetch blacklist users
 */
export async function GET() {
  try {
    const rows = await sql(
      `SELECT id, roblox_username, roblox_user_id, phone, reason, created_at FROM public.blacklists ORDER BY created_at DESC`
    );
    return NextResponse.json({ success: true, blacklists: rows });
  } catch (error: any) {
    console.error("GET /api/blacklist error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

/**
 * POST /api/blacklist
 * Add a username to blacklist
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { robloxUsername, robloxUserId = null, phone = null, reason = "Indikasi penipuan atau penyalahgunaan" } = body;

    if (!robloxUsername) {
      return NextResponse.json({ success: false, error: "Username Roblox wajib diisi" }, { status: 400 });
    }

    const cleanUsername = robloxUsername.trim().replace(/^@/, "");

    const result = await sql(
      `
      INSERT INTO public.blacklists (roblox_username, roblox_user_id, phone, reason)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (roblox_username) DO UPDATE SET
        reason = EXCLUDED.reason,
        phone = COALESCE(EXCLUDED.phone, public.blacklists.phone)
      RETURNING id, roblox_username, reason, created_at
      `,
      [cleanUsername, robloxUserId, phone, reason]
    );

    return NextResponse.json({
      success: true,
      message: `Akun @${cleanUsername} berhasil dimasukkan ke daftar Blacklist`,
      item: result[0],
    });
  } catch (error: any) {
    console.error("POST /api/blacklist error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

/**
 * DELETE /api/blacklist
 * Remove a username from blacklist
 */
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const username = searchParams.get("username")?.trim().replace(/^@/, "");

    if (!id && !username) {
      return NextResponse.json({ success: false, error: "ID or username is required" }, { status: 400 });
    }

    if (id) {
      await sql(`DELETE FROM public.blacklists WHERE id = $1`, [id]);
    } else {
      await sql(`DELETE FROM public.blacklists WHERE lower(roblox_username) = lower($1)`, [username]);
    }

    return NextResponse.json({ success: true, message: "Akun berhasil dihapus dari blacklist" });
  } catch (error: any) {
    console.error("DELETE /api/blacklist error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
