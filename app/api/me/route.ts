// app/api/me/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const cookieHeader = req.headers.get("cookie") || "";
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001/api";
  
  try {
    const apiRes = await fetch(
      `${apiBaseUrl}/auth/me`,
      {
        method: "GET",
        headers: {
          Cookie: cookieHeader,
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );

    // Handle non-OK responses
    if (!apiRes.ok) {
      let errorData: any = {};
      try {
        errorData = await apiRes.json();
      } catch {
        // If response is not JSON, get text
        const errorText = await apiRes.text().catch(() => "Unknown error");
        errorData = { message: errorText };
      }
      
      // Return the error response from backend
      return NextResponse.json(
        {
          success: false,
          ...errorData,
        },
        { status: apiRes.status }
      );
    }

    // Parse successful response
    let data: any = {};
    try {
      data = await apiRes.json();
    } catch (jsonErr) {
      console.error("Failed to parse backend response as JSON");
      return NextResponse.json(
        {
          success: false,
          message: "Invalid response from backend",
        },
        { status: 500 }
      );
    }
    
    // Forward response cookies if any
    const response = NextResponse.json(data, { status: apiRes.status });
    const setCookieHeaders = apiRes.headers.getSetCookie();
    if (setCookieHeaders && setCookieHeaders.length > 0) {
      setCookieHeaders.forEach((cookie) => {
        response.headers.append("Set-Cookie", cookie);
      });
    }
    
    return response;
  } catch (err: any) {
    console.error("Error in /api/me:", err.message || err);
    return NextResponse.json(
      { 
        success: false,
        message: "Error fetching user", 
        error: err.message || "Unknown error"
      },
      { status: 500 }
    );
  }
}
