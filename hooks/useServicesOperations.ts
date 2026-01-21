// hooks/useServicesOperations.ts
"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import type { Service } from "@/lib/services/types";
import { ServicesService } from "./useServicesService";

export interface ServiceFormData {
  title: string;
  description: string;
  icon: string;
  image: File | string | null;
  longDescription?: string;
  features?: string[];
  order?: number;
  published?: boolean;
}

export const useServicesOperations = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const response = await ServicesService.fetchServices();
      if (response.success) {
        setServices(Array.isArray(response.data) ? response.data : []);
      } else {
        toast.error(response.message || "Failed to load services");
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to fetch services");
    } finally {
      setLoading(false);
    }
  };

  // Auto-fetch on mount
  useEffect(() => {
    fetchServices();
  }, []);

  const handleCreate = async (data: ServiceFormData) => {
    setFormLoading(true);
    try {
      const fd = new FormData();
      
      // Always append required fields
      fd.append("title", data.title);
      fd.append("description", data.description);
      fd.append("icon", data.icon);
      
      // Handle optional longDescription
      if (data.longDescription) {
        fd.append("longDescription", data.longDescription);
      }
      
      // Handle image - must be a file for create
      if (data.image instanceof File) {
        fd.append("image", data.image);
      } else if (data.image && typeof data.image === "string") {
        // If it's a string URL, use it
        fd.append("image", data.image);
      }
      // If no image provided at all, backend will reject it
      
      // Handle features array
      if (data.features && Array.isArray(data.features) && data.features.length > 0) {
        data.features.forEach((feature) => {
          if (feature && typeof feature === "string" && feature.trim()) {
            fd.append("features", feature.trim());
          }
        });
      }
      
      // Handle order - convert to number string
      if (data.order !== undefined && data.order !== null) {
        fd.append("order", String(data.order));
      } else {
        fd.append("order", "0");
      }
      
      // Handle published - convert boolean to string
      fd.append("published", String(data.published ?? true));

      const res = await ServicesService.createService(fd);
      if (res?.success || res?.data) {
        toast.success("Service created!");
        await fetchServices();
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

  const handleUpdate = async (data: ServiceFormData, serviceId: string) => {
    setFormLoading(true);
    try {
      const fd = new FormData();
      
      // Append fields that are provided
      if (data.title) fd.append("title", data.title);
      if (data.description) fd.append("description", data.description);
      if (data.icon) fd.append("icon", data.icon);
      if (data.longDescription !== undefined) {
        fd.append("longDescription", data.longDescription || "");
      }
      
      // Handle image - only append if it's a File (new upload)
      // If it's a string, keep existing image (backend will handle it)
      if (data.image instanceof File) {
        fd.append("image", data.image);
      } else if (data.image && typeof data.image === "string") {
        // Keep existing image URL
        fd.append("image", data.image);
      }
      
      // Handle features array
      if (data.features !== undefined) {
        if (Array.isArray(data.features) && data.features.length > 0) {
          data.features.forEach((feature) => {
            if (feature && typeof feature === "string" && feature.trim()) {
              fd.append("features", feature.trim());
            }
          });
        } else {
          // Empty array - send empty string to clear features
          fd.append("features", "");
        }
      }
      
      // Handle order - convert to number string
      if (data.order !== undefined && data.order !== null) {
        fd.append("order", String(data.order));
      }
      
      // Handle published - convert boolean to string
      if (data.published !== undefined) {
        fd.append("published", String(data.published));
      }

      const res = await ServicesService.updateService(serviceId, fd);
      if (res?.success || res?.data) {
        toast.success("Service updated!");
        await fetchServices();
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
      await ServicesService.deleteService(id);
      toast.success("Service deleted!");
      await fetchServices();
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || "Delete failed");
    }
  };

  return {
    services,
    loading,
    formLoading,
    handleCreate,
    handleUpdate,
    handleDelete,
    fetchServices,
  };
};

