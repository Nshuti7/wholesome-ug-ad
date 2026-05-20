"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

import { AuthLayout } from "@/components/authlayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import api from "@/utils/api";

export default function ResetPasswordPage() {
  const router = useRouter();
  const params = useSearchParams();
  const email = params.get("email") || "";
  const token = params.get("token") || "";

  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPwd !== confirmPwd) {
      return setError("Passwords do not match");
    }
    setError(null);
    setLoading(true);
    try {
      await api.post("/auth/reset-password", {
        email,
        token,
        newPassword: newPwd,
      });
      router.push("/login");
    } catch (err: any) {
      setError(err.response?.data?.message || "Reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Reset Password">
      <Card className="max-w-md mx-auto">
        <CardContent className="p-4 space-y-4">
          <p className="text-sm text-[#606060]">
            New password for{" "}
            <span className="font-medium text-[#0b2b36]">{email}</span>
          </p>

          {error && <div className="text-sm text-red-500">{error}</div>}

          <form onSubmit={onSubmit} className="space-y-4">
            <Input
              type="password"
              placeholder="••••••••"
              value={newPwd}
              onChange={(e) => setNewPwd(e.target.value)}
              className="text-sm"
              required
            />
            <Input
              type="password"
              placeholder="Confirm password"
              value={confirmPwd}
              onChange={(e) => setConfirm(e.target.value)}
              className="text-sm"
              required
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
                {loading ? "Resetting…" : "Reset"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </AuthLayout>
  );
}
