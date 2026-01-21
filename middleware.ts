// middleware.ts
import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  // Middleware can be used for future features like rate limiting, logging, etc.
  return NextResponse.next();
}

export const config = {
  matcher: "/:path*",
};
