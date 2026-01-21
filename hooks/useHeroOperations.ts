import { useState, useEffect } from "react";
import { toast } from "sonner";
import { HeroService } from "@/lib/hero/service";
import type { HeroImage, HeroFormData } from "@/lib/hero/types";

export const useHeroOperations = () => {
  const [heroImages, setHeroImages] = useState<HeroImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchHeroImages = async () => {
    try {
      setLoading(true);
      setError(null);
      const items = await HeroService.getAllHeroImages();
      setHeroImages(items);
    } catch (err: any) {
      console.error("Error fetching hero images:", err);
      
      // Set error message for UI display
      let errorMessage = "Failed to fetch hero images";
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001/api";
      
      if (err.code === 'ECONNREFUSED' || err.message?.includes('Network Error') || !err.response) {
        errorMessage = `Cannot connect to backend at ${apiBaseUrl}/hero. Please ensure:
1. Backend server is running (npm run start:dev in backend folder)
2. Backend is running on port 3001 (or update NEXT_PUBLIC_API_BASE_URL)
3. CORS is configured correctly in backend`;
        console.error("Backend connection failed:", {
          attemptedUrl: `${apiBaseUrl}/hero`,
          errorCode: err?.code,
          errorMessage: err?.message,
          errorName: err?.name,
          fullError: err,
          errorString: JSON.stringify(err, Object.getOwnPropertyNames(err)),
        });
        toast.error("Cannot connect to backend. Check console for details.");
      } else if (err.response?.status === 401) {
        errorMessage = "Authentication required. Please log in again.";
        toast.error(errorMessage);
      } else if (err.response?.status === 403) {
        errorMessage = "You don't have permission to access hero images.";
        toast.error(errorMessage);
      } else {
        errorMessage = err.response?.data?.message || err.message || errorMessage;
        toast.error(errorMessage);
      }
      
      setError(errorMessage);
      setHeroImages([]);
    } finally {
      setLoading(false);
    }
  };

  // Auto-fetch on mount
  useEffect(() => {
    fetchHeroImages();
  }, []);

  const handleCreate = async (data: HeroFormData) => {
    setFormLoading(true);
    try {
      const fd = new FormData();
      
      // Always append required fields
      fd.append("title", data.title);
      fd.append("displayType", data.displayType);
      
      // Handle optional subtitle
      if (data.subtitle) {
        fd.append("subtitle", data.subtitle);
      }
      
      // Handle image - must be a file for create
      if (data.image instanceof File) {
        fd.append("image", data.image);
      } else if (data.image && typeof data.image === "string") {
        // If it's a string URL, use it
        fd.append("image", data.image);
      }
      
      // Handle order - convert to number string
      if (data.order !== undefined && data.order !== null) {
        fd.append("order", String(data.order));
      } else {
        fd.append("order", "0");
      }
      
      // Handle active - convert boolean to string
      fd.append("active", String(data.active ?? true));

      // Handle alt text
      if (data.alt) {
        fd.append("alt", data.alt);
      }

      const res = await HeroService.createHeroImage(fd);
      if (res?.success || res?.data) {
        toast.success("Hero image created!");
        await fetchHeroImages();
        return true;
      } else {
        toast.error("Create failed");
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || "Create failed");
    } finally {
      setFormLoading(false);
    }
    return false;
  };

  const handleUpdate = async (data: HeroFormData, imageId: string) => {
    setFormLoading(true);
    try {
      const fd = new FormData();
      
      // Append fields that are provided
      if (data.title) fd.append("title", data.title);
      if (data.subtitle !== undefined) fd.append("subtitle", data.subtitle || "");
      if (data.displayType) fd.append("displayType", data.displayType);
      
      // Handle image - can be file or existing URL
      if (data.image instanceof File) {
        fd.append("image", data.image);
      } else if (data.image && typeof data.image === "string") {
        fd.append("image", data.image);
      }
      
      // Handle order
      if (data.order !== undefined && data.order !== null) {
        fd.append("order", String(data.order));
      }
      
      // Handle active
      if (data.active !== undefined) {
        fd.append("active", String(data.active));
      }

      // Handle alt text
      if (data.alt !== undefined) {
        fd.append("alt", data.alt || "");
      }

      const res = await HeroService.updateHeroImage(imageId, fd);
      if (res?.success || res?.data) {
        toast.success("Hero image updated!");
        await fetchHeroImages();
        return true;
      } else {
        toast.error("Update failed");
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setFormLoading(false);
    }
    return false;
  };

  const handleDelete = async (imageId: string) => {
    try {
      await HeroService.deleteHeroImage(imageId);
      toast.success("Hero image deleted!");
      await fetchHeroImages();
      return true;
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || "Delete failed");
      return false;
    }
  };

  return {
    heroImages,
    loading,
    formLoading,
    error,
    handleCreate,
    handleUpdate,
    handleDelete,
    refetch: fetchHeroImages,
  };
};

