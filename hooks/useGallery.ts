// hooks/useGallery.ts
import { useState, useEffect } from "react";
import { GalleryItem, SortOption } from "@/lib/gallery/types";
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
        toast.success(`Loaded ${response.total} gallery items`);
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

  useEffect(() => {
    fetchGalleryItems();
  }, []);

  return {
    galleryItems,
    isLoading,
    fetchGalleryItems,
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
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
          item.category.toLowerCase().includes(searchQuery.toLowerCase())
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
          return a.title.localeCompare(b.title);
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
