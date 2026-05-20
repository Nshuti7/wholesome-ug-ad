"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface PageHeaderProps {
  title: string;
  description?: string;
  onCreateClick?: () => void;
  createButtonText?: string;
  children?: React.ReactNode;
}

export function PageHeader({
  title,
  description,
  onCreateClick,
  createButtonText = "Create New",
  children,
}: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        {description && (
          <p className="text-muted-foreground">{description}</p>
        )}
      </div>
      <div className="flex items-center gap-2">
        {children}
        {onCreateClick && (
          <Button onClick={onCreateClick} className="gap-2">
            <Plus className="h-4 w-4" />
            {createButtonText}
          </Button>
        )}
      </div>
    </div>
  );
} 