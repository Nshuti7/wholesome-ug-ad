// app/verify-otp/page.tsx
"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Loader2, ArrowLeft, RefreshCw } from "lucide-react";

import { AuthLayout } from "@/components/authlayout";
import { OTPInput } from "@/components/ui/otp-input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import api from "@/utils/api";

export default function VerifyOtpPage() {
  const router = useRouter();
  const params = useSearchParams();
  const email = params.get("email") || "";

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 4) {
      return setError("Enter the full 4-digit code");
    }
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      await api.post("/auth/verify-code", { email, otp });
      setSuccess("Code verified! Redirecting…");
      setTimeout(() => router.push(`/reset-password?email=${email}`), 1500);
    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid or expired code");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResendLoading(true);
    setError(null);
    setSuccess(null);
    setOtp("");
    try {
      await api.post("/auth/forgot-password", { email });
      setSuccess("New code sent!");
    } catch {
      setError("Failed to resend code");
    } finally {
      setResendLoading(false);
    }
  };

  if (!email) {
    return (
      <AuthLayout title="Verify Code">
        <Card className="max-w-md mx-auto p-4 space-y-4">
          <div className="text-center text-sm text-red-500">
            No email provided. Please restart the flow.
          </div>
          <Link
            href="/forgot-password"
            className="flex items-center justify-center text-sm text-[#30b264] hover:underline"
          >
            <ArrowLeft className="mr-1 h-4 w-4" /> Back to Forgot Password
          </Link>
        </Card>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title="Check Your Email">
      <Card className="max-w-md mx-auto p-4 space-y-4">
        {/* Header */}
        <div className="text-center space-y-1">
          <h2 className="text-lg font-semibold text-[#0b2b36]">
            Check Your Email
          </h2>
          <p className="text-sm text-[#606060]">
            A 4-digit code was sent to{" "}
            <span className="font-medium text-[#0b2b36]">{email}</span>
          </p>
        </div>

        {/* Alerts */}
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {success && (
          <Alert variant="default">
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <OTPInput
            value={otp}
            onChange={setOtp}
            length={4}
            disabled={loading}
            autoFocus
          />
          <Button
            type="submit"
            disabled={loading || otp.length !== 4}
            className="w-full bg-[#30b264] hover:bg-[#28a056] text-white"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Verifying…
              </>
            ) : (
              "Verify Code"
            )}
          </Button>
        </form>

        {/* Actions */}
        <div className="flex justify-between items-center text-sm">
          <button
            onClick={handleResend}
            disabled={resendLoading || loading}
            className="flex items-center text-[#30b264] hover:text-[#28a056] hover:bg-green-50 px-2 py-1 rounded disabled:opacity-50"
          >
            {resendLoading ? (
              <>
                <RefreshCw className="mr-1 h-4 w-4 animate-spin" /> Sending…
              </>
            ) : (
              <>
                <RefreshCw className="mr-1 h-4 w-4" /> Resend Code
              </>
            )}
          </button>
          <Link
            href="/forgot-password"
            className="flex items-center text-[#606060] hover:text-[#0b2b36] hover:underline"
          >
            <ArrowLeft className="mr-1 h-4 w-4" /> Back
          </Link>
        </div>
      </Card>
    </AuthLayout>
  );
}
