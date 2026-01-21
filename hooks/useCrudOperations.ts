"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import api from "@/utils/api";

interface CrudOperationsConfig<T, TFormData> {
  endpoint: string;
  entityName: string;
  transformData?: (data: any) => T;
  transformFormData?: (data: TFormData) => FormData;
}

export function useCrudOperations<T, TFormData>({
  endpoint,
  entityName,
  transformData,
  transformFormData,
}: CrudOperationsConfig<T, TFormData>) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const res = await api.get(endpoint);
      if (res.data.success) {
        const data = transformData ? res.data.data.map(transformData) : res.data.data;
        setItems(data);
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      console.error(err);
      toast.error(`Failed to load ${entityName.toLowerCase()}s`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const createItem = async (data: TFormData) => {
    setFormLoading(true);
    try {
      const formData = transformFormData ? transformFormData(data) : new FormData();
      if (!transformFormData) {
        Object.entries(data as Record<string, any>).forEach(([k, v]) => {
          if (v != null) {
            if (Array.isArray(v)) {
              // Handle arrays by appending each element separately
              v.forEach((item) => formData.append(k, item));
            } else {
              formData.append(k, v as any);
            }
          }
        });
      }
      
      const res = await api.post(endpoint, formData);
      
      // Check both HTTP status and response success field
      if (res.status >= 200 && res.status < 300 && res.data.success) {
        toast.success(`${entityName} created successfully`);
        await fetchAll();
        return true;
      } else {
        // Handle case where response has success: false
        const errorMessage = res.data.message || `Failed to create ${entityName.toLowerCase()}`;
        toast.error(errorMessage);
        return false;
      }
    } catch (err: any) {
      console.error(err);
      // Handle HTTP errors (4xx, 5xx)
      if (err.response) {
        const errorMessage = err.response.data?.message || err.response.data?.error || `Failed to create ${entityName.toLowerCase()}`;
        toast.error(errorMessage);
      } else {
        toast.error(err.message || `Failed to create ${entityName.toLowerCase()}`);
      }
      return false;
    } finally {
      setFormLoading(false);
    }
  };

  const updateItem = async (id: string, data: TFormData) => {
    setFormLoading(true);
    try {
      const formData = transformFormData ? transformFormData(data) : new FormData();
      if (!transformFormData) {
        Object.entries(data as Record<string, any>).forEach(([k, v]) => {
          if (v != null) {
            if (Array.isArray(v)) {
              // Handle arrays by appending each element separately
              v.forEach((item) => formData.append(k, item));
            } else {
              formData.append(k, v as any);
            }
          }
        });
      }
      
      const res = await api.put(`${endpoint}/${id}`, formData);
      
      // Check both HTTP status and response success field
      if (res.status >= 200 && res.status < 300 && res.data.success) {
        toast.success(`${entityName} updated successfully`);
        await fetchAll();
        return true;
      } else {
        // Handle case where response has success: false
        const errorMessage = res.data.message || `Failed to update ${entityName.toLowerCase()}`;
        toast.error(errorMessage);
        return false;
      }
    } catch (err: any) {
      console.error(err);
      // Handle HTTP errors (4xx, 5xx)
      if (err.response) {
        const errorMessage = err.response.data?.message || err.response.data?.error || `Failed to update ${entityName.toLowerCase()}`;
        toast.error(errorMessage);
      } else {
        toast.error(err.message || `Failed to update ${entityName.toLowerCase()}`);
      }
      return false;
    } finally {
      setFormLoading(false);
    }
  };

  const deleteItem = async (id: string) => {
    try {
      const res = await api.delete(`${endpoint}/${id}`);
      
      // Check both HTTP status and response success field
      if (res.status >= 200 && res.status < 300 && res.data.success) {
        toast.success(`${entityName} deleted successfully`);
        await fetchAll();
      } else {
        // Handle case where response has success: false
        const errorMessage = res.data.message || `Failed to delete ${entityName.toLowerCase()}`;
        toast.error(errorMessage);
      }
    } catch (err: any) {
      console.error(err);
      // Handle HTTP errors (4xx, 5xx)
      if (err.response) {
        const errorMessage = err.response.data?.message || err.response.data?.error || `Failed to delete ${entityName.toLowerCase()}`;
        toast.error(errorMessage);
      } else {
        toast.error(`Failed to delete ${entityName.toLowerCase()}`);
      }
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