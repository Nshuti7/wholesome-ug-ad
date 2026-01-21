// components/gallery/gallery-grid.tsx
import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Loader from "@/components/ui/Loader";
import { ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { GalleryCard } from "./gallery-card";
import { GalleryItem, GridLayout } from "@/lib/gallery/types";

interface GalleryGridProps {
  items: GalleryItem[];
  gridLayout: GridLayout;
  isLoading: boolean;
  searchQuery: string;
  onView: (item: GalleryItem) => void;
  onClearSearch: () => void;
}

export function GalleryGrid({
  items,
  gridLayout,
  isLoading,
  searchQuery,
  onView,
  onClearSearch,
}: GalleryGridProps) {
  const getGridClasses = () => {
    switch (gridLayout) {
      case "2":
        return "grid-cols-1 md:grid-cols-2";
      case "3":
        return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";
      case "4":
        return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";
      default:
        return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <Card className="p-12">
        <div className="text-center space-y-4">
          <div className="mx-auto h-24 w-24 rounded-full bg-muted flex items-center justify-center">
            <ImageIcon className="h-12 w-12 text-muted-foreground" />
          </div>
          <div>
            <h3 className="text-xl font-semibold">
              {searchQuery ? "No images found" : "No images yet"}
            </h3>
            <p className="text-muted-foreground mt-2">
              {searchQuery
                ? `No images match "${searchQuery}". Try a different search term.`
                : "No images are currently available in the gallery."}
            </p>
          </div>
          {searchQuery && (
            <Button variant="outline" onClick={onClearSearch}>
              Clear Search
            </Button>
          )}
        </div>
      </Card>
    );
  }

  return (
    <div className={cn("grid gap-4", getGridClasses())}>
      {items.map((item) => (
        <GalleryCard
          key={item._id}
          item={item}
          onView={onView}
        />
      ))}
    </div>
  );
}
