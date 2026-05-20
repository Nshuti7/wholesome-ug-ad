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

  const handleDownload = () => {
    if (!selectedImage) return;

    const link = document.createElement("a");
    link.href = selectedImage.image;
    link.download = selectedImage.filename;
    link.click();
  };

  return (
    <Dialog open={!!selectedImage} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-full">
        {selectedImage && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between">
                <span>{selectedImage.filename}</span>
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
                  alt={selectedImage.filename}
                  className="w-full max-h-[60vh] object-contain rounded-lg"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h4 className="font-medium mb-2">Details</h4>
                  <div className="space-y-1 text-muted-foreground">
                    <div>
                      <span className="font-medium">Filename:</span>{" "}
                      {selectedImage.filename}
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
