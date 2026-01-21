// components/gallery/gallery-viewer.tsx
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Download } from "lucide-react";
import { GalleryItem } from "@/lib/gallery/types";

interface GalleryViewerProps {
  selectedImage: GalleryItem | null;
  onClose: () => void;
}

export function GalleryViewer({ selectedImage, onClose }: GalleryViewerProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getFilename = (imageUrl: string, title: string): string => {
    try {
      // Try to extract filename from URL
      const url = new URL(imageUrl);
      const pathname = url.pathname;
      const filename = pathname.split('/').pop() || '';
      
      // If we got a filename with extension, use it
      if (filename && filename.includes('.')) {
        return filename;
      }
    } catch (e) {
      // If URL parsing fails, fall through to title-based filename
    }
    
    // Fallback: generate filename from title
    const sanitizedTitle = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    return `${sanitizedTitle}.jpg`;
  };

  const handleDownload = () => {
    if (!selectedImage) return;

    const link = document.createElement("a");
    link.href = selectedImage.image;
    link.download = getFilename(selectedImage.image, selectedImage.title);
    link.click();
  };

  return (
    <Dialog open={!!selectedImage} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-full">
        {selectedImage && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between">
                <span>{selectedImage.title}</span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDownload}
                    className="gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Download
                  </Button>
                </div>
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div className="relative">
                <img
                  src={selectedImage.image}
                  alt={selectedImage.title}
                  className="w-full max-h-[60vh] object-contain rounded-lg"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h4 className="font-medium mb-2">Details</h4>
                  <div className="space-y-1 text-muted-foreground">
                    <div>
                      <span className="font-medium">Title:</span>{" "}
                      {selectedImage.title}
                    </div>
                    <div>
                      <span className="font-medium">Category:</span>{" "}
                      {selectedImage.category}
                    </div>
                    <div>
                      <span className="font-medium">Uploaded:</span>{" "}
                      {formatDate(selectedImage.createdAt)}
                    </div>
                  </div>
                </div>

                {selectedImage.description && (
                  <div>
                    <h4 className="font-medium mb-2">Description</h4>
                    <p className="text-muted-foreground">
                      {selectedImage.description}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
