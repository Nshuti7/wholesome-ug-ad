// hooks/useGalleryOperations.ts
"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import api from "@/utils/api";
import type { GalleryItem } from "@/lib/gallery/types";
import { GalleryService } from "./useGalleryService";

export interface GalleryFormData {
  title: string;
  category: string;
  description?: string;
  image: File | string | null;
  order?: number;
  published?: boolean;
}

export const useGalleryOperations = () => {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);

  const fetchGalleryItems = async () => {
    setLoading(true);
    try {
      const response = await GalleryService.fetchGalleryItems();
      if (response.success) {
        setGalleryItems(response.data);
      } else {
        toast.error(response.message || "Failed to load gallery items");
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to fetch gallery items");
    } finally {
      setLoading(false);
    }
  };

  // Auto-fetch on mount
  useEffect(() => {
    fetchGalleryItems();
  }, []);

  const handleCreate = async (data: GalleryFormData) => {
    setFormLoading(true);
    try {
      const fd = new FormData();
      
      // Always append required fields
      fd.append("title", data.title);
      fd.append("category", data.category);
      
      // Handle optional description
      if (data.description) {
        fd.append("description", data.description);
      }
      
      // Handle image - must be a file for create
      if (data.image instanceof File) {
        fd.append("image", data.image);
      } else if (data.image && typeof data.image === "string") {
        // If it's a string URL, use it
        fd.append("image", data.image);
      }
      // If no image provided at all, backend will reject it
      
      // Handle order - convert to number string
      if (data.order !== undefined && data.order !== null) {
        fd.append("order", String(data.order));
      } else {
        fd.append("order", "0");
      }
      
      // Handle published - convert boolean to string
      fd.append("published", String(data.published ?? true));

      const res = await GalleryService.createGalleryItem(fd);
      if (res?.success || res?.data) {
        toast.success("Gallery item created!");
        await fetchGalleryItems();
        return true;
      } else {
        toast.error(res?.message || "Create failed");
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || "Create failed");
    } finally {
      setFormLoading(false);
    }
    return false;
  };

  const handleUpdate = async (data: GalleryFormData, itemId: string) => {
    setFormLoading(true);
    try {
      const fd = new FormData();
      
      // Append fields that are provided
      if (data.title) fd.append("title", data.title);
      if (data.category) fd.append("category", data.category);
      if (data.description !== undefined) {
        fd.append("description", data.description || "");
      }
      
      // Handle image - only append if it's a File (new upload)
      // If it's a string, keep existing image (backend will handle it)
      if (data.image instanceof File) {
        fd.append("image", data.image);
      } else if (data.image && typeof data.image === "string") {
        // Keep existing image URL
        fd.append("image", data.image);
      }
      
      // Handle order - convert to number string
      if (data.order !== undefined && data.order !== null) {
        fd.append("order", String(data.order));
      }
      
      // Handle published - convert boolean to string
      if (data.published !== undefined) {
        fd.append("published", String(data.published));
      }

      const res = await GalleryService.updateGalleryItem(itemId, fd);
      if (res?.success || res?.data) {
        toast.success("Gallery item updated!");
        await fetchGalleryItems();
        return true;
      } else {
        toast.error(res?.message || "Update failed");
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setFormLoading(false);
    }
    return false;
  };

  const handleDelete = async (id: string) => {
    try {
      await GalleryService.deleteGalleryItem(id);
      toast.success("Gallery item deleted!");
      await fetchGalleryItems();
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || "Delete failed");
    }
  };

  return {
    galleryItems,
    loading,
    formLoading,
    handleCreate,
    handleUpdate,
    handleDelete,
    fetchGalleryItems,
  };
};

