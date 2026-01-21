// app/forgot-password/page.tsx
"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

import { AuthLayout } from "@/components/authlayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import api from "@/utils/api";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState(params.get("email") || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return setError("Email is required");
    setError(null);
    setLoading(true);
    try {
      await api.post("/auth/forgot-password", { email });
      router.push(`/verify-otp?email=${encodeURIComponent(email)}`);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to send code");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Forgot Password">
      <Card className="max-w-md mx-auto">
        <CardContent className="p-4 space-y-4">
          <p className="text-sm text-[#606060]">
            Enter your email and we'll send you a 4-digit reset code.
          </p>

          {error && <div className="text-sm text-red-500">{error}</div>}

          <form onSubmit={onSubmit} className="space-y-4">
            <Input
              type="email"
              placeholder="you@company.domain"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="text-sm"
            />

            <div className="flex justify-between items-center">
              <Link
                href="/login"
                className="text-sm text-[#606060] hover:underline"
              >
                Back to login
              </Link>
              <Button
                type="submit"
                disabled={loading}
                className="bg-[#30b264] hover:bg-[#28a056] text-white text-sm px-4 h-8"
              >
                {loading ? "Sending…" : "Send code"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </AuthLayout>
  );
}
