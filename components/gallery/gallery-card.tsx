// components/gallery/gallery-card.tsx
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Eye, Trash2, Calendar, Loader2 } from "lucide-react";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { GalleryItem } from "@/lib/gallery/types";

interface GalleryCardProps {
  item: GalleryItem;
  onView: (item: GalleryItem) => void;
  onDelete: (id: string) => void;
  isDeleting: boolean;
}

export function GalleryCard({
  item,
  onView,
  onDelete,
  isDeleting,
}: GalleryCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-200">
      <div className="relative aspect-square overflow-hidden">
        <img
          src={item.image}
          alt={item.filename}
          className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
        />

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

            <ConfirmDialog
              trigger={
                <Button
                  size="sm"
                  variant="destructive"
                  disabled={isDeleting}
                  className="gap-2"
                >
                  {isDeleting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                  Delete
                </Button>
              }
              title="Delete Image"
              description={`Are you sure you want to delete "${item.filename}"? This action cannot be undone.`}
              confirmText="Delete"
              onConfirm={() => onDelete(item._id)}
              isDestructive
              disabled={isDeleting}
            />
          </div>
        </div>
      </div>

      <CardContent className="p-4">
        <div className="space-y-2">
          <h3 className="font-medium truncate" title={item.filename}>
            {item.filename}
          </h3>
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
