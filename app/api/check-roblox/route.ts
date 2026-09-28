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
    const customHeaders = {
      "Content-Type": "application/json",
      "Accept": "application/json",
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
      "Origin": "https://www.roblox.com",
      "Referer": "https://www.roblox.com/",
    };

    // Step 1: Resolve username → user ID
    const userRes = await fetch("https://users.roblox.com/v1/usernames/users", {
      method: "POST",
      headers: customHeaders,
      body: JSON.stringify({ usernames: [trimmed], excludeBannedUsers: false }),
      signal: AbortSignal.timeout(8000),
    });

    if (!userRes.ok) {
      // In case Roblox rate-limits or blocks POST, allow valid username format anyway
      return NextResponse.json({
        valid: true,
        id: null,
        username: trimmed,
        displayName: trimmed,
        avatarUrl: null,
      }, { status: 200 });
    }

    const userData = await userRes.json();

    if (!userData?.data || userData.data.length === 0) {
      return NextResponse.json({ valid: false, error: "Username Roblox tidak ditemukan" }, { status: 200 });
    }

    const user = userData.data[0];

    // Step 2: Fetch headshot thumbnail from Roblox Thumbnails API
    let avatarUrl: string | null = null;
    try {
      const thumbRes = await fetch(
        `https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${user.id}&size=150x150&format=Png&isCircular=false`,
        { 
          headers: {
            "Accept": "application/json",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
          },
          signal: AbortSignal.timeout(5000) 
        }
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
    // Graceful fallback: If connection fails or times out, accept the username so customer isn't blocked
    return NextResponse.json({
      valid: true,
      id: null,
      username: trimmed,
      displayName: trimmed,
      avatarUrl: null,
    }, { status: 200 });
  }
}
