"use client";

import React, { useState } from "react";
import { GalleryHeader } from "./gallery-header";
import { GalleryControls } from "./gallery-controls";
import { GalleryGrid } from "./gallery-grid";
import { GalleryViewer } from "./gallery-viewer";
import { useGallery, useGalleryFilters } from "@/hooks/useGallery";
import { GalleryItem, GridLayout } from "@/lib/gallery/types";

export function GalleryComponent() {
  const { galleryItems, isLoading, uploadImages, deleteImage } = useGallery();
  const { searchQuery, setSearchQuery, sortBy, setSortBy, filteredItems } =
    useGalleryFilters(galleryItems);

  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);
  const [gridLayout, setGridLayout] = useState<GridLayout>("3");
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const handleUpload = async (data: any) => {
    setIsUploading(true);
    const success = await uploadImages(data);
    if (success) {
      setUploadDialogOpen(false);
    }
    setIsUploading(false);
  };

  const handleDelete = async (id: string) => {
    setIsDeleting(id);
    await deleteImage(id);
    setIsDeleting(null);
  };

  const handleView = (item: GalleryItem) => {
    setSelectedImage(item);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  const handleOpenUpload = () => {
    setUploadDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <GalleryHeader
        totalImages={galleryItems.length}
        filteredImages={filteredItems.length}
        searchQuery={searchQuery}
        uploadDialogOpen={uploadDialogOpen}
        onUploadDialogChange={setUploadDialogOpen}
        onUpload={handleUpload}
        isUploading={isUploading}
      />

      <GalleryControls
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        sortBy={sortBy}
        onSortChange={setSortBy}
        gridLayout={gridLayout}
        onGridLayoutChange={setGridLayout}
      />

      <GalleryGrid
        items={filteredItems}
        gridLayout={gridLayout}
        isLoading={isLoading}
        searchQuery={searchQuery}
        onView={handleView}
        onDelete={handleDelete}
        onUpload={handleOpenUpload}
        onClearSearch={handleClearSearch}
        deletingId={isDeleting}
      />

      <GalleryViewer
        selectedImage={selectedImage}
        onClose={() => setSelectedImage(null)}
      />
    </div>
  );
}
