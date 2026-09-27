import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/auth
 * Environment-based Admin Authentication with Cloudflare & Local fallback
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: "Username dan password wajib diisi" },
        { status: 400 }
      );
    }

    // Read from environment variables, with fallback to match the .env.local configuration
    // (Prevents deployment block if Cloudflare variables haven't redeployed yet)
    const envUsername = process.env.ADMIN_USERNAME || "admin_vietblox";
    const envPassword = process.env.ADMIN_PASSWORD || "@Vietblox2026";
    const sessionSecret = process.env.ADMIN_SESSION_SECRET || "vietblox_super_secret_admin_session_key_2026";

    const trimmedUsername = String(username).trim();
    const trimmedPassword = String(password);

    // Strict comparison
    if (trimmedUsername === envUsername && trimmedPassword === envPassword) {
      const token = `vbx_adm_${Buffer.from(`${Date.now()}_${trimmedUsername}_${sessionSecret}`).toString("base64")}`;

      const res = NextResponse.json({
        success: true,
        message: "Login admin berhasil!",
        token,
      });

      res.headers.set("Cache-Control", "no-store, no-cache, must-revalidate");
      return res;
    }

    return NextResponse.json(
      { success: false, error: "Username atau password admin salah!" },
      { status: 401 }
    );
  } catch (error: any) {
    console.error("POST /api/auth error:", error);
    return NextResponse.json({ success: false, error: error.message || "Gagal memproses login" }, { status: 500 });
  }
}
