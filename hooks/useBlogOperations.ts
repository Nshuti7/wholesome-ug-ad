// hooks/useBlogOperations.ts
"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import api from "@/utils/api";
import type { Blog, BlogFormData } from "@/lib/blogs/types";
import { generateSlug } from "@/lib/blogs/schema";

export const useBlogOperations = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const res = await api.get("/blog");
      // Handle both wrapped and unwrapped responses
      const blogData = res.data?.data || res.data;
      if (res.data?.success || Array.isArray(blogData)) {
        setBlogs(Array.isArray(blogData) ? blogData : blogData);
      } else {
        toast.error(res.data?.message || "Failed to load blogs");
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to fetch blogs");
    } finally {
      setLoading(false);
    }
  };

  // 🔥 auto-fetch on mount
  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleCreate = async (data: BlogFormData) => {
    setFormLoading(true);
    try {
      const fd = new FormData();
      // Ensure slug is always included (generate from title if not provided)
      if (!data.slug && data.title) {
        fd.append("slug", generateSlug(data.title));
      } else if (data.slug) {
        fd.append("slug", data.slug);
      }
      
      Object.entries(data).forEach(([k, v]) => {
        // Skip null/undefined values and slug (already handled above)
        if (v != null && k !== "slug") {
          if (k === "image" && v instanceof File) {
            fd.append("image", v);
          } else if (k === "date") {
            // Ensure date is in ISO format (YYYY-MM-DD or ISO string)
            const dateValue = v instanceof Date 
              ? v.toISOString().split('T')[0] // Convert Date to YYYY-MM-DD
              : typeof v === "string" 
              ? v.includes('T') ? v.split('T')[0] : v // Ensure YYYY-MM-DD format
              : String(v);
            fd.append(k, dateValue);
          } else if (k === "tags" && Array.isArray(v)) {
            // Handle tags array - send each tag with the same field name
            // NestJS will automatically parse multiple fields with same name as array
            v.forEach((tag) => {
              if (tag && typeof tag === "string" && tag.trim()) {
                fd.append("tags", tag.trim());
              }
            });
          } else if (k !== "image" || typeof v === "string") {
            // For non-file fields or existing image URLs (strings), append as string
            // Convert boolean to string for FormData
            const value = typeof v === "boolean" ? String(v) : (v as string);
            fd.append(k, value);
          }
        }
      });
      const res = await api.post("/blog", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.data?.success || res.status === 201) {
        toast.success("Blog created!");
        await fetchBlogs();
        return true;
      } else {
        toast.error(res.data?.message || "Create failed");
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || "Create failed");
    } finally {
      setFormLoading(false);
    }
    return false;
  };

  const handleUpdate = async (data: BlogFormData, blogId: string) => {
    setFormLoading(true);
    try {
      const fd = new FormData();
      // Include slug if provided (for updates, slug might change)
      if (data.slug) {
        fd.append("slug", data.slug);
      }
      
      Object.entries(data).forEach(([k, v]) => {
        // Skip null/undefined values and slug (already handled above if provided)
        if (v != null && k !== "slug") {
          // Only append image if it's a File (new upload)
          // Skip existing image URLs (strings) to avoid overwriting
          if (k === "image" && v instanceof File) {
            fd.append("image", v);
          } else if (k === "date") {
            // Ensure date is in ISO format (YYYY-MM-DD or ISO string)
            const dateValue = v instanceof Date 
              ? v.toISOString().split('T')[0] // Convert Date to YYYY-MM-DD
              : typeof v === "string" 
              ? v.includes('T') ? v.split('T')[0] : v // Ensure YYYY-MM-DD format
              : String(v);
            fd.append(k, dateValue);
          } else if (k === "tags" && Array.isArray(v)) {
            // Handle tags array - send each tag with the same field name
            // NestJS will automatically parse multiple fields with same name as array
            v.forEach((tag) => {
              if (tag && typeof tag === "string" && tag.trim()) {
                fd.append("tags", tag.trim());
              }
            });
          } else if (k !== "image" || typeof v === "string") {
            // For non-file fields or existing image URLs (strings), append as string
            // Convert boolean to string for FormData
            const value = typeof v === "boolean" ? String(v) : (v as string);
            fd.append(k, value);
          }
        }
      });
      const res = await api.patch(`/blog/${blogId}`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.data?.success || res.status === 200) {
        toast.success("Blog updated!");
        await fetchBlogs();
        return true;
      } else {
        toast.error(res.data?.message || "Update failed");
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
      const res = await api.delete(`/blog/${id}`);
      if (res.data?.success || res.status === 200) {
        toast.success("Blog deleted!");
        await fetchBlogs();
      } else {
        toast.error(res.data?.message || "Delete failed");
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || "Delete failed");
    }
  };

  return {
    blogs,
    loading,
    formLoading,
    handleCreate,
    handleUpdate,
    handleDelete,
  };
};
