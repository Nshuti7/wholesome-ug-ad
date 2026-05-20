"use client";

import { useEffect, useState } from "react";
import { PageLayout } from "@/components/layouts/page-layout";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { SectionCards } from "@/components/section-cards";
import { dashboardService } from "@/services/dashboard";
import { getMe } from "@/services/auth";
import type { DashboardData } from "@/lib/dashboard/types";
import Loader from "@/components/ui/Loader";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
import Logo from "@/components/ui/logo";
import { ContentDistributionChart } from "@/components/content-distribution-chart";
import { HealthStatus } from "@/components/health-status";

// Simple User interface
interface User {
  _id: string;
  name: string;
  email: string;
  profileImage?: string;
  role: "user" | "admin";
  createdAt: string;
  updatedAt: string;
}

export default function Page() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [dashboardData, userResponse] = await Promise.all([
          dashboardService.getDashboardData(),
          getMe(),
        ]);
        
        const userData = userResponse.data;
        
        setData(dashboardData);
        setUser(userData);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
        setError("Failed to load dashboard. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <PageLayout pageTitle="Dashboard">
        <Alert variant="destructive" className="m-4">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </PageLayout>
    );
  }

  if (!data || !user) {
    return (
      <PageLayout pageTitle="Dashboard">
        <Alert className="m-4">
          <Terminal className="h-4 w-4" />
          <AlertTitle>No Data</AlertTitle>
          <AlertDescription>
            Dashboard data could not be loaded.
          </AlertDescription>
        </Alert>
      </PageLayout>
    );
  }

  return (
    <PageLayout pageTitle="Dashboard">
      {/* Creative Header */}
      <div className="mb-6 flex flex-col items-start justify-between gap-4 rounded-lg border bg-card p-6 sm:flex-row sm:items-center">
        <div className="flex items-center gap-4">
          <Logo className="h-12 w-12" />
          <div>
            <h1 className="text-2xl font-bold">
              Welcome back, {user?.name || "Admin"}!
            </h1>
            <p className="text-muted-foreground">
              Here's a snapshot of your platform's activity.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 flex-col gap-6">
        <SectionCards data={data} />
        
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
          {/* Main Chart */}
          <div className="lg:col-span-3">
            <ChartAreaInteractive analytics={data.analytics} />
          </div>
          {/* Donut Chart */}
          <div className="lg:col-span-2">
            <ContentDistributionChart data={data.analytics.contentDistribution} />
          </div>
        </div>
        
        {/* Health Status Row - Full Width - Bottom of Dashboard */}
        <HealthStatus />
      </div>
    </PageLayout>
  );
}
