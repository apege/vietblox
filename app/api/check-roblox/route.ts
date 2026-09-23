import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get("username");

  if (!username || username.trim().length === 0) {
    return NextResponse.json({ valid: false, error: "Username tidak boleh kosong" }, { status: 400 });
  }

  const trimmed = username.trim();

  if (trimmed.length < 3 || trimmed.length > 20) {
    return NextResponse.json({ valid: false, error: "Username harus 3-20 karakter" }, { status: 200 });
  }

  try {
    // Step 1: Resolve username → user ID
    const userRes = await fetch("https://users.roblox.com/v1/usernames/users", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify({ usernames: [trimmed], excludeBannedUsers: false }),
      signal: AbortSignal.timeout(6000),
    });

    if (!userRes.ok) {
      return NextResponse.json({ valid: false, error: "Gagal menghubungi server Roblox" }, { status: 200 });
    }

    const userData = await userRes.json();

    if (!userData?.data || userData.data.length === 0) {
      return NextResponse.json({ valid: false, error: "Username tidak ditemukan" }, { status: 200 });
    }

    const user = userData.data[0];

    // Step 2: Fetch headshot thumbnail from Roblox Thumbnails API
    let avatarUrl: string | null = null;
    try {
      const thumbRes = await fetch(
        `https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${user.id}&size=150x150&format=Png&isCircular=false`,
        { signal: AbortSignal.timeout(4000) }
      );
      if (thumbRes.ok) {
        const thumbData = await thumbRes.json();
        avatarUrl = thumbData?.data?.[0]?.imageUrl ?? null;
      }
    } catch {
      // Avatar fetch failed — non-fatal, return without avatar
    }

    return NextResponse.json({
      valid: true,
      id: user.id,
      username: user.name,
      displayName: user.displayName,
      avatarUrl,
    });

  } catch (err) {
    console.error("[check-roblox]", err);
    return NextResponse.json({ valid: false, error: "Koneksi ke server Roblox gagal" }, { status: 200 });
  }
}
