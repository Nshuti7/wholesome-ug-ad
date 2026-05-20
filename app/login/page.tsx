"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { AuthLayout } from "@/components/authlayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import api from "@/utils/api";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await api.post("/auth/login", { email, password });
      router.push("/");
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Sign in">
      <Card className="max-w-md mx-auto">
        <CardContent className="p-4 space-y-4">
          <p className="text-sm text-[#606060]">Enter your credentials</p>

          {error && <div className="text-sm text-red-500">{error}</div>}

          <form onSubmit={onSubmit} className="space-y-4">
            <Input
              type="email"
              placeholder="you@company.domain"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="text-sm"
              required
            />
            <Input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="text-sm"
              required
            />

            <div className="flex justify-between items-center gap-4">
              <Link
                href="/forgot-password"
                className="text-sm text-[#606060] hover:underline"
              >
                Forgot password?
              </Link>
              <Button
                type="submit"
                disabled={loading}
                className="bg-[#30b264] hover:bg-[#28a056] text-white text-sm px-4 h-8"
              >
                {loading ? "Signing in…" : "Sign in"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </AuthLayout>
  );
}
