// middleware.ts
import { NextRequest, NextResponse } from "next/server";

const PUBLIC_PATHS = [
  "/login",
  "/forgot-password",
  "/verify-otp",
  "/reset-password",
];
const STATIC_PATHS = ["/_next", "/static", "/favicon.ico", "/robots.txt"];

function isPublic(path: string) {
  return (PUBLIC_PATHS.some((p) => path === p || path.startsWith(p + "/")) ||
  STATIC_PATHS.some((p) => path === p || path.startsWith(p + "/")) || /\.(css|js|png|jpg|svg)$/.test(path));
}

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const accessToken = req.cookies.get("access_token")?.value;
  const refreshToken = req.cookies.get("refresh_token")?.value;

  // 1) If they hit /login but are already authenticated, send them home:
  if (pathname === "/login" && accessToken) {
    const homeUrl = req.nextUrl.clone();
    homeUrl.pathname = "/";
    return NextResponse.redirect(homeUrl);
  }

  // 2) Otherwise, let through public + static paths
  if (isPublic(pathname)) {
    return NextResponse.next();
  }

  // 3) If no tokens at all, then it's a redirect to login
  if (!accessToken && !refreshToken) {
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 4) You have at least a refresh token.
  // Let the client-side AuthGuard handle the logic of refreshing.
  return NextResponse.next();
}

export const config = {
  matcher: "/:path*",
};
