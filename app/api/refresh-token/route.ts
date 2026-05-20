import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const cookieHeader = req.headers.get("cookie") || "";

  try {
    const apiRes = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/refresh-token`,
      {
        method: "POST",
        headers: {
          "Cookie": cookieHeader,
          "Content-Type": "application/json",
        },
      }
    );

    const data = await apiRes.json();

    // Forward the response cookies from backend to frontend
    const response = NextResponse.json(data, { status: apiRes.status });

    // Copy cookies from backend response to frontend response
    const setCookieHeaders = apiRes.headers.getSetCookie();
    if (setCookieHeaders && setCookieHeaders.length > 0) {
      setCookieHeaders.forEach((cookie) => {
        response.headers.append("Set-Cookie", cookie);
      });
    }

    return response;
  } catch (err: any) {
    console.error("⚠️ /api/refresh-token proxy error:", err.message || err);
    const status = err.status || 502;
    return NextResponse.json(
      { message: "Token refresh failed", error: err.message },
      { status }
    );
  }
} 