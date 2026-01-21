// components/gallery/gallery-controls.tsx
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Grid2X2, Grid3X3 } from "lucide-react";
import { GridLayout, SortOption } from "@/lib/gallery/types";

interface GalleryControlsProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  gridLayout: GridLayout;
  onGridLayoutChange: (layout: GridLayout) => void;
}

export function GalleryControls({
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  gridLayout,
  onGridLayoutChange,
}: GalleryControlsProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search images..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={sortBy} onValueChange={onSortChange}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="name">By Name</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Grid:</span>
            <div className="flex items-center border rounded-md">
              <Button
                variant={gridLayout === "2" ? "default" : "ghost"}
                size="sm"
                onClick={() => onGridLayoutChange("2")}
                className="rounded-r-none"
              >
                <Grid2X2 className="h-4 w-4" />
              </Button>
              <Button
                variant={gridLayout === "3" ? "default" : "ghost"}
                size="sm"
                onClick={() => onGridLayoutChange("3")}
                className="rounded-none border-x"
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={gridLayout === "4" ? "default" : "ghost"}
                size="sm"
                onClick={() => onGridLayoutChange("4")}
                className="rounded-l-none"
              >
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect x="3" y="3" width="4" height="4" />
                  <rect x="10" y="3" width="4" height="4" />
                  <rect x="17" y="3" width="4" height="4" />
                  <rect x="3" y="10" width="4" height="4" />
                  <rect x="10" y="10" width="4" height="4" />
                  <rect x="17" y="10" width="4" height="4" />
                  <rect x="3" y="17" width="4" height="4" />
                  <rect x="10" y="17" width="4" height="4" />
                  <rect x="17" y="17" width="4" height="4" />
                </svg>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
