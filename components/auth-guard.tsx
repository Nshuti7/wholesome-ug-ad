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
        
        if (!res.ok) {
          // If 401, try to refresh token first
          if (res.status === 401) {
            try {
              const refreshRes = await fetch("/api/refresh-token", {
                method: "POST",
                credentials: "include",
              });
              
              if (refreshRes.ok) {
                // Token refreshed, try /api/me again
                const retryRes = await fetch("/api/me", {
                  credentials: "include",
                  cache: "no-store",
                });
                
                if (retryRes.ok) {
                  // ✅ Authenticated after refresh
                  if (active) setLoading(false);
                  return;
                }
              }
            } catch (refreshErr) {
              // Refresh failed, continue to logout
            }
          }
          
          // Authentication failed after refresh attempt
          throw new Error(`Status ${res.status}`);
        }
        
        // ✅ Authenticated
        if (active) setLoading(false);
      } catch (err) {
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
