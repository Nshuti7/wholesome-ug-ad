"use client";

import React, { useState } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Lock,
  Eye,
  EyeOff,
  Shield,
  Save,
  AlertCircle,
  CheckCircle,
  Info,
} from "lucide-react";
import { updatePassword } from "@/services/auth";

interface PasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface PasswordStrength {
  score: number;
  feedback: string;
  color: string;
}

interface NotificationState {
  show: boolean;
  message: string;
  type: "success" | "error" | "info" | "warning";
}

export default function SettingsPage() {
  const [form, setForm] = useState<PasswordForm>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>({
    score: 0,
    feedback: "Enter a password",
    color: "gray",
  });

  const [notification, setNotification] = useState<NotificationState>({
    show: false,
    message: "",
    type: "info",
  });

  const showNotification = (
    message: string,
    type: NotificationState["type"]
  ) => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification((prev) => ({ ...prev, show: false }));
    }, 5000);
  };

  const handleInputChange = (field: keyof PasswordForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));

    if (field === "newPassword") {
      checkPasswordStrength(value);
    }
  };

  const checkPasswordStrength = (password: string) => {
    if (!password) {
      setPasswordStrength({
        score: 0,
        feedback: "Enter a password",
        color: "gray",
      });
      return;
    }

    let score = 0;
    let feedback = "";

    // Length check
    if (password.length >= 8) score += 1;

    // Character variety checks
    if (/[A-Z]/.test(password)) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    // Feedback based on score
    if (password.length < 8) {
      feedback = "Password is too short";
    } else if (score === 5) {
      feedback = "Very strong password";
    } else if (score === 4) {
      feedback = "Strong password";
    } else if (score === 3) {
      feedback = "Good password";
    } else if (score === 2) {
      feedback = "Moderate password";
    } else {
      feedback = "Weak password";
    }

    // Color based on score
    let color;
    switch (score) {
      case 1:
        color = "red";
        break;
      case 2:
        color = "orange";
        break;
      case 3:
        color = "yellow";
        break;
      case 4:
      case 5:
        color = "green";
        break;
      default:
        color = "gray";
    }

    setPasswordStrength({ score, feedback, color });
  };

  const togglePasswordVisibility = (field: keyof typeof showPassword) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const validateForm = (): boolean => {
    if (!form.currentPassword || !form.newPassword || !form.confirmPassword) {
      showNotification("All fields are required", "error");
      return false;
    }

    if (form.newPassword !== form.confirmPassword) {
      showNotification(
        "New password and confirm password do not match",
        "error"
      );
      return false;
    }

    if (passwordStrength.score < 3) {
      showNotification("Please choose a stronger password", "warning");
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setShowConfirmDialog(true);
  };

  const confirmPasswordChange = async () => {
    try {
      setIsLoading(true);
      setShowConfirmDialog(false);

      await updatePassword({
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });

      showNotification("Password updated successfully", "success");
      setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setPasswordStrength({
        score: 0,
        feedback: "Enter a password",
        color: "gray",
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update password";
      showNotification(errorMessage, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-4 w-4" />;
      case "error":
        return <AlertCircle className="h-4 w-4" />;
      case "warning":
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader pageTitle="Security Settings" />

        <div className="flex-1 space-y-6 p-6 max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-3">
              <div className="p-2 bg-blue-100 rounded-full">
                <Shield className="h-8 w-8 text-blue-600" />
              </div>
              <h1 className="text-3xl font-bold">Security Settings</h1>
            </div>
            <p className="text-muted-foreground">
              Manage your account security and password preferences
            </p>
          </div>

          {/* Loading Progress */}
          {isLoading && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Updating password...</span>
                <span>Please wait</span>
              </div>
              <Progress value={undefined} className="h-2" />
            </div>
          )}

          {/* Notification */}
          {notification.show && (
            <Alert
              className={`border-l-4 ${
                notification.type === "success"
                  ? "border-green-500 bg-green-50"
                  : notification.type === "error"
                  ? "border-red-500 bg-red-50"
                  : notification.type === "warning"
                  ? "border-yellow-500 bg-yellow-50"
                  : "border-blue-500 bg-blue-50"
              }`}
            >
              {getNotificationIcon(notification.type)}
              <AlertDescription>{notification.message}</AlertDescription>
            </Alert>
          )}

          {/* Password Change Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Change Password
              </CardTitle>
              <CardDescription>
                Update your password to keep your account secure
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  For security purposes, use a strong unique password that you
                  don't use for other accounts.
                </AlertDescription>
              </Alert>

              <Separator />

              <div className="space-y-4">
                {/* Current Password */}
                <div className="space-y-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <div className="relative">
                    <Input
                      id="current-password"
                      type={showPassword.current ? "text" : "password"}
                      value={form.currentPassword}
                      onChange={(e) =>
                        handleInputChange("currentPassword", e.target.value)
                      }
                      placeholder="Enter your current password"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => togglePasswordVisibility("current")}
                    >
                      {showPassword.current ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                {/* New Password */}
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <div className="relative">
                    <Input
                      id="new-password"
                      type={showPassword.new ? "text" : "password"}
                      value={form.newPassword}
                      onChange={(e) =>
                        handleInputChange("newPassword", e.target.value)
                      }
                      placeholder="Enter your new password"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => togglePasswordVisibility("new")}
                    >
                      {showPassword.new ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>

                  {/* Password Strength Indicator */}
                  {form.newPassword && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          Password strength:
                        </span>
                        <span
                          className={`font-medium ${
                            passwordStrength.color === "green"
                              ? "text-green-600"
                              : passwordStrength.color === "yellow"
                              ? "text-yellow-600"
                              : passwordStrength.color === "orange"
                              ? "text-orange-600"
                              : passwordStrength.color === "red"
                              ? "text-red-600"
                              : "text-gray-600"
                          }`}
                        >
                          {passwordStrength.feedback}
                        </span>
                      </div>
                      <Progress
                        value={(passwordStrength.score / 5) * 100}
                        className="h-2"
                      />
                      <p className="text-xs text-muted-foreground">
                        Use at least 8 characters with uppercase, lowercase,
                        numbers, and special characters
                      </p>
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <div className="relative">
                    <Input
                      id="confirm-password"
                      type={showPassword.confirm ? "text" : "password"}
                      value={form.confirmPassword}
                      onChange={(e) =>
                        handleInputChange("confirmPassword", e.target.value)
                      }
                      placeholder="Confirm your new password"
                      className={
                        form.confirmPassword &&
                        form.newPassword !== form.confirmPassword
                          ? "border-red-500 focus:border-red-500"
                          : ""
                      }
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => togglePasswordVisibility("confirm")}
                    >
                      {showPassword.confirm ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  {form.confirmPassword &&
                    form.newPassword !== form.confirmPassword && (
                      <p className="text-sm text-red-600">
                        Passwords do not match
                      </p>
                    )}
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSubmit} disabled={isLoading}>
                  <Save className="mr-2 h-4 w-4" />
                  {isLoading ? "Updating..." : "Update Password"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Confirmation Dialog */}
          <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirm Password Change</DialogTitle>
                <DialogDescription>
                  Are you sure you want to change your password? You'll need to
                  use the new password the next time you log in.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setShowConfirmDialog(false)}
                >
                  Cancel
                </Button>
                <Button onClick={confirmPasswordChange} disabled={isLoading}>
                  Change Password
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
