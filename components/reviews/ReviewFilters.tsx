"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter, X } from "lucide-react";
import type { ReviewFilters } from "@/lib/reviews/types";

interface ReviewFiltersProps {
  filters: ReviewFilters;
  onFiltersChange: (filters: ReviewFilters) => void;
  onClearFilters: () => void;
  totalReviews: number;
}

export function ReviewFilters({
  filters,
  onFiltersChange,
  onClearFilters,
  totalReviews,
}: ReviewFiltersProps) {
  const handleFilterChange = (key: keyof ReviewFilters, value: string) => {
    // Convert __all__ back to empty string for filter logic
    const actualValue = value === "__all__" ? "" : value;
    
    onFiltersChange({
      ...filters,
      [key]: actualValue,
      page: 1, // Reset to first page when filters change
    });
  };

  // Convert empty strings to __all__ for display
  const displayStatus = filters.status === "" ? "__all__" : filters.status;
  const displayReviewType = filters.reviewType === "" ? "__all__" : filters.reviewType;

  const hasActiveFilters = filters.status || filters.reviewType;

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Filters</span>
          {totalReviews > 0 && (
            <span className="text-sm text-muted-foreground">
              ({totalReviews} reviews)
            </span>
          )}
        </div>
        
        {hasActiveFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={onClearFilters}
            className="h-8"
          >
            <X className="h-3 w-3 mr-1" />
            Clear filters
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Status Filter */}
        <div className="space-y-2">
          <Label htmlFor="status-filter">Status</Label>
          <Select
            value={displayStatus}
            onValueChange={(value) => handleFilterChange("status", value)}
          >
            <SelectTrigger id="status-filter">
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__all__">All statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Review Type Filter */}
        <div className="space-y-2">
          <Label htmlFor="type-filter">Review Type</Label>
          <Select
            value={displayReviewType}
            onValueChange={(value) => handleFilterChange("reviewType", value)}
          >
            <SelectTrigger id="type-filter">
              <SelectValue placeholder="All types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__all__">All types</SelectItem>
              <SelectItem value="company">Company</SelectItem>
              <SelectItem value="itinerary">Itinerary</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Sort Filter */}
        <div className="space-y-2">
          <Label htmlFor="sort-filter">Sort By</Label>
          <Select
            value={filters.sort || "-createdAt"}
            onValueChange={(value) => handleFilterChange("sort", value)}
          >
            <SelectTrigger id="sort-filter">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="-createdAt">Newest first</SelectItem>
              <SelectItem value="createdAt">Oldest first</SelectItem>
              <SelectItem value="-rating">Highest rating</SelectItem>
              <SelectItem value="rating">Lowest rating</SelectItem>
              <SelectItem value="-helpfulCount">Most helpful</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Items per page */}
        <div className="space-y-2">
          <Label htmlFor="limit-filter">Per Page</Label>
          <Select
            value={filters.limit?.toString() || "10"}
            onValueChange={(value) => handleFilterChange("limit", value)}
          >
            <SelectTrigger id="limit-filter">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
} 