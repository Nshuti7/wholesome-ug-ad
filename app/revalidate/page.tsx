"use client";

import React, { useState } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
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
  RefreshCw,
  Zap,
  Globe,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Info,
} from "lucide-react";
import api from "@/utils/api";

interface RevalidationPath {
  path: string;
  label: string;
  description: string;
  priority: "high" | "medium" | "low";
}

interface NotificationState {
  show: boolean;
  message: string;
  type: "success" | "error" | "info" | "warning";
}

const REVALIDATION_PATHS: RevalidationPath[] = [
  {
    path: "/",
    label: "Home Page",
    description: "Main landing page",
    priority: "high",
  },
  {
    path: "/about",
    label: "About Page",
    description: "About us and team information",
    priority: "high",
  },
  {
    path: "/destinations",
    label: "Destinations",
    description: "All destinations listing",
    priority: "high",
  },
  {
    path: "/tours",
    label: "Tours",
    description: "All tours listing",
    priority: "high",
  },
  {
    path: "/blogs",
    label: "Blogs",
    description: "Blog posts and articles",
    priority: "high",
  },
  {
    path: "/contact",
    label: "Contact",
    description: "Contact page",
    priority: "medium",
  },
  {
    path: "/gallery",
    label: "Gallery",
    description: "Photo gallery",
    priority: "medium",
  },
  {
    path: "/privacy",
    label: "Privacy Policy",
    description: "Privacy policy page",
    priority: "low",
  },
  {
    path: "/terms",
    label: "Terms of Service",
    description: "Terms of service page",
    priority: "low",
  },
  {
    path: "/book-trip",
    label: "Book Trip",
    description: "Booking page",
    priority: "high",
  },
];

export default function RevalidationPage() {
  const [selectedPath, setSelectedPath] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [showBulkDialog, setShowBulkDialog] = useState(false);
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

  const handleSingleRevalidation = async () => {
    if (!selectedPath) {
      showNotification("Please select a page to revalidate", "warning");
      return;
    }

    try {
      setIsLoading(true);
      await api.post("/revalidate", { path: selectedPath });
      showNotification(`Successfully revalidated ${selectedPath}`, "success");
      setSelectedPath("");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to revalidate page";
      showNotification(errorMessage, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBulkRevalidation = async () => {
    try {
      setIsLoading(true);
      setShowBulkDialog(false);
      await api.post("/revalidate", {});
      showNotification("Successfully revalidated all pages", "success");
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to revalidate all pages";
      showNotification(errorMessage, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickRevalidation = async (path: string) => {
    try {
      setIsLoading(true);
      await api.post("/revalidate", { path });
      showNotification(`Successfully revalidated ${path}`, "success");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to revalidate page";
      showNotification(errorMessage, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-4 w-4" />;
      case "error":
        return <XCircle className="h-4 w-4" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4" />;
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
        <SiteHeader pageTitle="ISR Revalidation" />

        <div className="flex-1 space-y-6 p-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-3">
              <div className="p-2 bg-blue-100 rounded-full">
                <Zap className="h-8 w-8 text-blue-600" />
              </div>
              <h1 className="text-3xl font-bold">ISR Revalidation Center</h1>
            </div>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Trigger Incremental Static Regeneration to update your static
              pages with fresh content
            </p>
          </div>

          {/* Loading Progress */}
          {isLoading && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Revalidating...</span>
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

          <div className="grid gap-6 md:grid-cols-2">
            {/* Single Page Revalidation */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <RefreshCw className="h-5 w-5" />
                  Single Page Revalidation
                </CardTitle>
                <CardDescription>
                  Revalidate a specific page to update its content with the
                  latest data
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Select Page</label>
                  <Select
                    value={selectedPath}
                    onValueChange={setSelectedPath}
                    disabled={isLoading}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a page to revalidate..." />
                    </SelectTrigger>
                    <SelectContent>
                      {REVALIDATION_PATHS.map((item) => (
                        <SelectItem key={item.path} value={item.path}>
                          <div className="flex items-center justify-between w-full">
                            <div>
                              <div className="font-medium">{item.label}</div>
                              <div className="text-xs text-muted-foreground">
                                {item.path}
                              </div>
                            </div>
                            <Badge className={getPriorityColor(item.priority)}>
                              {item.priority}
                            </Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  onClick={handleSingleRevalidation}
                  disabled={isLoading || !selectedPath}
                  className="w-full"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  {isLoading ? "Revalidating..." : "Revalidate Page"}
                </Button>
              </CardContent>
            </Card>

            {/* Bulk Revalidation */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Bulk Revalidation
                </CardTitle>
                <CardDescription>
                  Revalidate all static pages at once
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    This will trigger revalidation for all static pages. Use
                    sparingly as it may impact server performance.
                  </AlertDescription>
                </Alert>

                <Button
                  onClick={() => setShowBulkDialog(true)}
                  disabled={isLoading}
                  variant="secondary"
                  className="w-full"
                >
                  <Globe className="mr-2 h-4 w-4" />
                  {isLoading ? "Revalidating..." : "Revalidate All Pages"}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Quick Actions
              </CardTitle>
              <CardDescription>
                One-click revalidation for frequently updated pages
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {REVALIDATION_PATHS.filter((p) => p.priority === "high").map(
                  (item) => (
                    <Button
                      key={item.path}
                      variant="outline"
                      onClick={() => handleQuickRevalidation(item.path)}
                      disabled={isLoading}
                      className="justify-start h-auto p-3"
                    >
                      <div className="text-left">
                        <div className="font-medium">{item.label}</div>
                        <div className="text-xs text-muted-foreground">
                          {item.path}
                        </div>
                      </div>
                    </Button>
                  )
                )}
              </div>
            </CardContent>
          </Card>

          {/* Bulk Confirmation Dialog */}
          <Dialog open={showBulkDialog} onOpenChange={setShowBulkDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirm Bulk Revalidation</DialogTitle>
                <DialogDescription>
                  Are you sure you want to revalidate all static pages? This
                  action will refresh the entire site and may impact server
                  performance.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setShowBulkDialog(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleBulkRevalidation} disabled={isLoading}>
                  Revalidate All
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
