// components/gallery/gallery-header.tsx
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, ImageIcon, Search } from "lucide-react";
import { GalleryUploadForm } from "./gallery-upload-form";
import { UploadFormData } from "@/lib/gallery/types";

interface GalleryHeaderProps {
  totalImages: number;
  filteredImages: number;
  searchQuery: string;
  uploadDialogOpen: boolean;
  onUploadDialogChange: (open: boolean) => void;
  onUpload: (data: UploadFormData) => Promise<void>;
  isUploading: boolean;
}

export function GalleryHeader({
  totalImages,
  filteredImages,
  searchQuery,
  uploadDialogOpen,
  onUploadDialogChange,
  onUpload,
  isUploading,
}: GalleryHeaderProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gallery</h1>
          <p className="text-muted-foreground">
            Manage and view your image collection
          </p>
        </div>

        <Dialog open={uploadDialogOpen} onOpenChange={onUploadDialogChange}>
          <DialogTrigger asChild>
            <Button size="lg" className="gap-2">
              <Plus className="h-4 w-4" />
              Upload Images
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Upload New Images</DialogTitle>
              <DialogDescription>
                Select multiple images to add to your gallery. All images will
                share the same description.
              </DialogDescription>
            </DialogHeader>

            <GalleryUploadForm onSubmit={onUpload} isLoading={isUploading} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-4">
        <Badge variant="secondary" className="gap-2">
          <ImageIcon className="h-3 w-3" />
          {filteredImages} {filteredImages === 1 ? "Image" : "Images"}
        </Badge>
        {searchQuery && (
          <Badge variant="outline" className="gap-2">
            <Search className="h-3 w-3" />
            Filtered: {filteredImages} of {totalImages}
          </Badge>
        )}
      </div>
    </div>
  );
}
