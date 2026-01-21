import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Use the same API base URL that other parts of the admin dashboard use
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001/api";
    
    // Health endpoint is at the root of the API, not /api/health
    const response = await fetch(`${apiBaseUrl.replace('/api', '')}/api`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Handle non-OK responses gracefully
    if (!response.ok) {
      // For 401/403, backend might be up but health endpoint requires auth (shouldn't happen now)
      // For other errors, backend might be unreachable
      const status = response.status;
      const errorText = await response.text().catch(() => 'Unknown error');
      
      // Don't log 401 errors as failures since we handle them gracefully
      if (status !== 401) {
        console.error(`Health check failed with status ${status}:`, errorText);
      }
      
      // Return degraded status for any error
      return NextResponse.json({
        status: "degraded",
        message: `Backend responded with status: ${status}`,
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

    const data = await response.json();
    
    // Backend returns { success: true, status, services, ... }
    // Extract the health data (it might be wrapped in data field by interceptor)
    const healthData = data.data || data;
    
    return NextResponse.json(healthData);
    
  } catch (error: any) {
    // Network errors, timeouts, etc.
    console.error('Health check failed:', error.message || error);
    
    // Return a degraded status if backend is unreachable
    return NextResponse.json({
      status: "degraded",
      message: error.message || "Backend unreachable",
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
