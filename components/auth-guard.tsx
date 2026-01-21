// components/AuthGuard.tsx
"use client";

import { ReactNode, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Loader from "@/components/ui/Loader";

const PUBLIC_PATHS = [
  "/login",
  "/forgot-password",
  "/verify-otp",
  "/reset-password",
];

export default function AuthGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const path = usePathname();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function check() {
      // 1) Don't guard public routes
      if (PUBLIC_PATHS.some((p) => path.startsWith(p))) {
        if (active) setLoading(false);
        return;
      }

      try {
        // 2) Call same-origin /api/me
        const res = await fetch("/api/me", {
          credentials: "include",
          cache: "no-store",
        });
        
        // Read response once (can only be read once)
        let data: any = {};
        try {
          data = await res.json();
        } catch (jsonErr) {
          // Response might not be JSON, try to get text
          const text = await res.text().catch(() => "");
          console.error("Failed to parse /api/me response as JSON:", text);
          throw new Error(`Invalid response from /api/me: ${res.status}`);
        }
        
        if (!res.ok) {
          // If 401, try to refresh token first
          if (res.status === 401) {
            try {
              const refreshRes = await fetch("/api/refresh-token", {
                method: "POST",
                credentials: "include",
                cache: "no-store",
              });
              
              if (refreshRes.ok) {
                // Token refreshed, try /api/me again
                const retryRes = await fetch("/api/me", {
                  credentials: "include",
                  cache: "no-store",
                });
                
                if (retryRes.ok) {
                  // Read retry response
                  const retryData = await retryRes.json().catch(() => ({}));
                  if (retryData.success !== false && (retryData.data || retryData.success)) {
                    // ✅ Authenticated after refresh
                    if (active) setLoading(false);
                    return;
                  }
                }
              }
            } catch (refreshErr: any) {
              console.error("Token refresh failed in AuthGuard:", refreshErr.message || refreshErr);
              // Refresh failed, continue to logout
            }
          }
          
          // Authentication failed after refresh attempt
          console.error("Auth check failed:", res.status, data);
          throw new Error(`Status ${res.status}`);
        }
        
        // ✅ Authenticated - verify response structure
        // Accept if: success is true OR data exists OR response is 200
        // Only reject if we explicitly have success: false AND no data AND not 200
        const hasValidData = data.success === true || data.data || res.status === 200;
        
        if (!hasValidData && data.success === false && !data.data) {
          console.error("Invalid auth response:", data);
          throw new Error("Invalid authentication response");
        }
        
        // If we got here with a 200 status, we're authenticated
        // Trust the 200 status code even if structure is slightly off
        if (active) setLoading(false);
      } catch (err: any) {
        // Authentication failed

        // 3) Always clear _all_ cookies via Next.js
        try {
          await fetch("/api/clear-session", { method: "POST" });
        } catch (clearErr) {
          // Failed to clear session
        }

        // 4) Redirect to login
        if (active) {
          setLoading(false);
          router.replace(`/login?from=${encodeURIComponent(path)}`);
        }
      }
    }

    check();
    return () => {
      active = false;
    };
  }, [path, router]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader />
      </div>
    );
  }

  return <>{children}</>;
}
