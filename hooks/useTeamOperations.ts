// hooks/useTeamOperations.ts
"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import type { TeamMember } from "@/lib/team/types";
import { TeamService } from "./useTeamService";

export interface TeamFormData {
  name: string;
  role: string;
  image: File | string | null;
  bio?: string;
  socialLinks?: string[];
  order?: number;
  published?: boolean;
}

export const useTeamOperations = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);

  const fetchTeamMembers = async () => {
    setLoading(true);
    try {
      const response = await TeamService.fetchTeamMembers();
      if (response.success) {
        setTeamMembers(Array.isArray(response.data) ? response.data : []);
      } else {
        toast.error(response.message || "Failed to load team members");
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to fetch team members");
    } finally {
      setLoading(false);
    }
  };

  // Auto-fetch on mount
  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const handleCreate = async (data: TeamFormData) => {
    setFormLoading(true);
    try {
      const fd = new FormData();
      
      // Always append required fields
      fd.append("name", data.name);
      fd.append("role", data.role);
      
      // Handle optional bio
      if (data.bio) {
        fd.append("bio", data.bio);
      }
      
      // Handle image - must be a file for create
      if (data.image instanceof File) {
        fd.append("image", data.image);
      } else if (data.image && typeof data.image === "string") {
        // If it's a string URL, use it
        fd.append("image", data.image);
      }
      // If no image provided at all, backend will reject it
      
      // Handle socialLinks array
      if (data.socialLinks && Array.isArray(data.socialLinks) && data.socialLinks.length > 0) {
        data.socialLinks.forEach((link) => {
          if (link && typeof link === "string" && link.trim()) {
            fd.append("socialLinks", link.trim());
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

      const res = await TeamService.createTeamMember(fd);
      if (res?.success || res?.data) {
        toast.success("Team member created!");
        await fetchTeamMembers();
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

  const handleUpdate = async (data: TeamFormData, memberId: string) => {
    setFormLoading(true);
    try {
      const fd = new FormData();
      
      // Append fields that are provided
      if (data.name) fd.append("name", data.name);
      if (data.role) fd.append("role", data.role);
      if (data.bio !== undefined) {
        fd.append("bio", data.bio || "");
      }
      
      // Handle image - only append if it's a File (new upload)
      // If it's a string, keep existing image (backend will handle it)
      if (data.image instanceof File) {
        fd.append("image", data.image);
      } else if (data.image && typeof data.image === "string") {
        // Keep existing image URL
        fd.append("image", data.image);
      }
      
      // Handle socialLinks array
      if (data.socialLinks !== undefined) {
        if (Array.isArray(data.socialLinks) && data.socialLinks.length > 0) {
          data.socialLinks.forEach((link) => {
            if (link && typeof link === "string" && link.trim()) {
              fd.append("socialLinks", link.trim());
            }
          });
        } else {
          // Empty array - send empty string to clear social links
          fd.append("socialLinks", "");
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

      const res = await TeamService.updateTeamMember(memberId, fd);
      if (res?.success || res?.data) {
        toast.success("Team member updated!");
        await fetchTeamMembers();
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
      await TeamService.deleteTeamMember(id);
      toast.success("Team member deleted!");
      await fetchTeamMembers();
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || "Delete failed");
    }
  };

  return {
    teamMembers,
    loading,
    formLoading,
    handleCreate,
    handleUpdate,
    handleDelete,
    fetchTeamMembers,
  };
};

