// hooks/useGallery.ts
import { useState, useEffect } from "react";
import { GalleryItem, UploadFormData, SortOption } from "@/lib/gallery/types";
import { GalleryService } from "./useGalleryService";
import { useToast } from "./useToast";

export function useGallery() {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchGalleryItems = async () => {
    try {
      setIsLoading(true);
      const response = await GalleryService.fetchGalleryItems();

      if (response.success) {
        setGalleryItems(response.data);
        toast.success(`Loaded ${response.count} images`);
      } else {
        toast.error("Failed to load gallery items");
      }
    } catch (error: any) {
      console.error("Failed to fetch gallery items:", error);
      toast.error(error.response?.data?.message || "Failed to load gallery");
    } finally {
      setIsLoading(false);
    }
  };

  const uploadImages = async (data: UploadFormData) => {
    try {
      const response = await GalleryService.uploadImages(data);

      if (response.success) {
        toast.success(`Successfully uploaded ${data.images.length} image(s)`);
        await fetchGalleryItems(); // Refresh the gallery
        return true;
      } else {
        toast.error(response.message || "Upload failed");
        return false;
      }
    } catch (error: any) {
      console.error("Upload error:", error);
      toast.error(error.response?.data?.message || "Failed to upload images");
      return false;
    }
  };

  const deleteImage = async (id: string) => {
    try {
      const response = await GalleryService.deleteImage(id);

      if (response.success) {
        toast.success("Image deleted successfully");
        setGalleryItems((prev) => prev.filter((item) => item._id !== id));
        return true;
      } else {
        toast.error("Failed to delete image");
        return false;
      }
    } catch (error: any) {
      console.error("Delete error:", error);
      toast.error(error.response?.data?.message || "Failed to delete image");
      return false;
    }
  };

  useEffect(() => {
    fetchGalleryItems();
  }, []);

  return {
    galleryItems,
    isLoading,
    fetchGalleryItems,
    uploadImages,
    deleteImage,
  };
}

export function useGalleryFilters(items: GalleryItem[]) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [filteredItems, setFilteredItems] = useState<GalleryItem[]>([]);

  useEffect(() => {
    let filtered = [...items];

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (item) =>
          item.filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        case "oldest":
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        case "name":
          return a.filename.localeCompare(b.filename);
        default:
          return 0;
      }
    });

    setFilteredItems(filtered);
  }, [items, searchQuery, sortBy]);

  return {
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    filteredItems,
  };
}
