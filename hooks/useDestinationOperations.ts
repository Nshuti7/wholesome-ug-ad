"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import api from "@/utils/api";
import type {
  Destination,
  DestinationFormData,
} from "@/lib/destinations/types";

export function useDestinationOperations() {
  const [items, setItems] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const res = await api.get("/destinations");
      if (res.data.success) setItems(res.data.data);
      else toast.error(res.data.message);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load destinations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const createItem = async (data: DestinationFormData) => {
    setFormLoading(true);
    try {
      const fd = new FormData();
      Object.entries(data).forEach(
        ([k, v]) => v != null && fd.append(k, v as any)
      );
      
      // Show upload progress toast
      toast.info("Uploading images to Cloudinary... This may take a moment.");
      
      const res = await api.post("/destinations", fd);
      if (res.data.success) {
        toast.success("Destination created successfully!");
        await fetchAll();
        return true;
      }
      toast.error(res.data.message);
    } catch (err: any) {
      console.error(err);
      
      // Handle specific timeout error
      if (err.code === 'ECONNABORTED' || err.message?.includes('timeout')) {
        toast.error("Upload timed out. Please try again with smaller images or check your internet connection.");
      } else if (err.response?.status === 413) {
        toast.error("Files are too large. Please use images smaller than 5MB each.");
      } else {
        toast.error(err.response?.data?.message || err.message || "Failed to create destination");
      }
    } finally {
      setFormLoading(false);
    }
    return false;
  };

  const updateItem = async (id: string, data: DestinationFormData) => {
    setFormLoading(true);
    try {
      const fd = new FormData();
      Object.entries(data).forEach(
        ([k, v]) => v != null && fd.append(k, v as any)
      );
      const res = await api.put(`/destinations/${id}`, fd);
      if (res.data.success) {
        toast.success("Destination updated");
        await fetchAll();
        return true;
      }
      toast.error(res.data.message);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Update failed");
    } finally {
      setFormLoading(false);
    }
    return false;
  };

  const deleteItem = async (id: string) => {
    try {
      const res = await api.delete(`/destinations/${id}`);
      if (res.data.success) {
        toast.success("Destination deleted");
        await fetchAll();
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      console.error(err);
      toast.error("Delete failed");
    }
  };

  return {
    items,
    loading,
    formLoading,
    createItem,
    updateItem,
    deleteItem,
    fetchAll,
  };
}
