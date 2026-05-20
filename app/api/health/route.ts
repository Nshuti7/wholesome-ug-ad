import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Use the same API base URL that other parts of the admin dashboard use
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api";
    // Remove /api suffix to get the base backend URL
    const backendUrl = apiBaseUrl.replace('/api', '');
    
    const response = await fetch(`${backendUrl}/api/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Backend responded with status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('Health check failed:', error);
    
    // Return a degraded status if backend is unreachable
    return NextResponse.json({
      status: "degraded",
      timestamp: new Date().toISOString(),
      uptime: 0,
      services: {
        redis: {
          status: "unhealthy",
          connected: false,
          connectionRetries: 0,
          fallbackStorageSize: 0,
          usingFallback: true
        },
        mongodb: {
          status: "unhealthy",
          state: "unknown",
          connected: false
        },
        memory: {
          status: "healthy",
          rss: "0 MB",
          heapUsed: "0 MB",
          heapTotal: "0 MB"
        }
      }
    }, { status: 200 });
  }
}
