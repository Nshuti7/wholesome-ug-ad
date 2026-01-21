// components/gallery/gallery-card.tsx
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Eye, Calendar } from "lucide-react";
import { GalleryItem } from "@/lib/gallery/types";

interface GalleryCardProps {
  item: GalleryItem;
  onView: (item: GalleryItem) => void;
}

export function GalleryCard({
  item,
  onView,
}: GalleryCardProps) {
  const formatDate = (dateString: string) => {
    if (!dateString) return 'Unknown date';
    
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      return 'Invalid date';
    }
  };

  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-200">
      <div className="relative aspect-square overflow-hidden">
        {item.image ? (
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <span className="text-muted-foreground">No image</span>
          </div>
        )}

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="secondary"
              onClick={() => onView(item)}
              className="gap-2"
            >
              <Eye className="h-4 w-4" />
              View
            </Button>
          </div>
        </div>
      </div>

      <CardContent className="p-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="font-medium truncate" title={item.title}>
              {item.title}
            </h3>
            {item.category && (
              <span className="text-xs px-2 py-1 bg-secondary rounded capitalize">
                {item.category}
              </span>
            )}
          </div>
          {item.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {item.description}
            </p>
          )}
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            {formatDate(item.createdAt)}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
