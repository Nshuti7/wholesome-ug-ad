"use client";

import { useEffect } from "react";

export default function TokenRefresh() {
  useEffect(() => {
    // Only run in browser environment
    if (typeof window === "undefined") return;

    const refreshInterval = setInterval(async () => {
      try {
        // This will automatically send HttpOnly cookies.
        // If the user is not authenticated, the request will fail, which is fine.
        await fetch("/api/refresh-token", {
          method: "POST",
          credentials: "include",
        });
      } catch (error) {
        // Silent fail is okay here. The interceptor will handle actual errors.
      }
    }, 14 * 60 * 1000); // Refresh every 14 minutes (before 15-min expiry)

    // Cleanup interval on unmount
    return () => clearInterval(refreshInterval);
  }, []);

  // This component doesn't render anything
  return null;
} 