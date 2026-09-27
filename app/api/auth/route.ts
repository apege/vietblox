import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/auth
 * Strict Environment-based Admin Authentication (.env.local / Cloudflare Environment Variables)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;

    const envUsername = process.env.ADMIN_USERNAME;
    const envPassword = process.env.ADMIN_PASSWORD;

    if (!envUsername || !envPassword) {
      console.error("ADMIN_USERNAME or ADMIN_PASSWORD is not configured in environment variables!");
      return NextResponse.json(
        { success: false, error: "Konfigurasi ADMIN_USERNAME atau ADMIN_PASSWORD di .env belum disetel!" },
        { status: 500 }
      );
    }

    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: "Username dan password wajib diisi" },
        { status: 400 }
      );
    }

    const trimmedUsername = String(username).trim();
    const trimmedPassword = String(password);

    // Strict comparison directly against environment variables
    if (trimmedUsername === envUsername && trimmedPassword === envPassword) {
      const sessionSecret = process.env.ADMIN_SESSION_SECRET || "vbx_secret";
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
