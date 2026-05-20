"use client";

import React from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

interface PageLayoutProps {
  children: React.ReactNode;
  pageTitle: string;
  className?: string;
}

export function PageLayout({ children, pageTitle, className }: PageLayoutProps) {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing)*72)",
          "--header-height": "calc(var(--spacing)*12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader pageTitle={pageTitle} />
        <div className={className || "p-4 md:p-8 space-y-4"}>
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
} 