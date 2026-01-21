// app/api/clear-session/route.ts
import { NextResponse } from "next/server";

export async function POST() {
  const res = NextResponse.json({ ok: true });

  const authCookies = ["access_token", "refresh_token"];

  authCookies.forEach((cookieName) => {
    res.cookies.set(cookieName, "", {
      path: "/",
      maxAge: 0,
    });
  });

  return res;
}
