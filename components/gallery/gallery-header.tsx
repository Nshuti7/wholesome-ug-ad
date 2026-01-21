// components/gallery/gallery-header.tsx
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ImageIcon } from "lucide-react";

interface GalleryHeaderProps {
  totalImages: number;
  filteredImages: number;
  searchQuery: string;
}

export function GalleryHeader({
  totalImages,
  filteredImages,
  searchQuery,
}: GalleryHeaderProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Images</CardTitle>
          <ImageIcon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalImages}</div>
          <p className="text-xs text-muted-foreground">
            All images uploaded
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Filtered Images</CardTitle>
          <ImageIcon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{filteredImages}</div>
          <p className="text-xs text-muted-foreground">
            {searchQuery ? `Matching "${searchQuery}"` : "All images visible"}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
