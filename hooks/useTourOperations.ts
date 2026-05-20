// hooks/useTourOperations.ts
"use client";

import { useState } from "react";
import api from "@/utils/api";
import { toast } from "sonner";
import type { Tour } from "@/lib/tours/types";

export function useTourOperations() {
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchTours() {
    setLoading(true);
    try {
      const res = await api.get("/itineraries");
      if (res.data.success) {
        setTours(res.data.data);
      }
    } catch {
      toast.error("Failed to fetch tours");
    } finally {
      setLoading(false);
    }
  }

  async function deleteTour(id: string) {
    try {
      const res = await api.delete(`/itineraries/${id}`);
      if (res.data.success) {
        toast.success("Tour deleted");
        await fetchTours();
      }
    } catch {
      toast.error("Delete failed");
    }
  }

  return { tours, loading, fetchTours, deleteTour };
}
