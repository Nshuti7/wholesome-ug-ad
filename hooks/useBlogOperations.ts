// hooks/useBlogOperations.ts
"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import api from "@/utils/api";
import type { Blog, BlogFormData } from "@/lib/blogs/types";

export const useBlogOperations = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const res = await api.get("/blogs");
      if (res.data.success) setBlogs(res.data.data);
      else toast.error(res.data.message || "Failed to load blogs");
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch blogs");
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
      Object.entries(data).forEach(
        ([k, v]) => v != null && fd.append(k, v as any)
      );
      const res = await api.post("/blogs", fd);
      if (res.data.success) {
        toast.success("Blog created!");
        await fetchBlogs();
        return true;
      } else {
        toast.error(res.data.message || "Create failed");
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
      Object.entries(data).forEach(
        ([k, v]) => v != null && fd.append(k, v as any)
      );
      const res = await api.put(`/blogs/${blogId}`, fd);
      if (res.data.success) {
        toast.success("Blog updated!");
        await fetchBlogs();
        return true;
      } else {
        toast.error(res.data.message || "Update failed");
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
      const res = await api.delete(`/blogs/${id}`);
      if (res.data.success) {
        toast.success("Deleted!");
        await fetchBlogs();
      } else {
        toast.error(res.data.message || "Delete failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Delete failed");
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
