"use client";

import React, { useState } from "react";
import { GalleryHeader } from "./gallery-header";
import { GalleryControls } from "./gallery-controls";
import { GalleryGrid } from "./gallery-grid";
import { GalleryViewer } from "./gallery-viewer";
import { useGallery, useGalleryFilters } from "@/hooks/useGallery";
import { GalleryItem, GridLayout } from "@/lib/gallery/types";

export function GalleryComponent() {
  const { galleryItems, isLoading } = useGallery();
  const { searchQuery, setSearchQuery, sortBy, setSortBy, filteredItems } =
    useGalleryFilters(galleryItems);

  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);
  const [gridLayout, setGridLayout] = useState<GridLayout>("3");

  const handleView = (item: GalleryItem) => {
    setSelectedImage(item);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  return (
    <div className="space-y-6">
      <GalleryHeader
        totalImages={galleryItems.length}
        filteredImages={filteredItems.length}
        searchQuery={searchQuery}
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
        onClearSearch={handleClearSearch}
      />

      <GalleryViewer
        selectedImage={selectedImage}
        onClose={() => setSelectedImage(null)}
      />
    </div>
  );
}
