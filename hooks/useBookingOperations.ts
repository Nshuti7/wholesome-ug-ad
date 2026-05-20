"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import api from "@/utils/api";
import type { Booking, BookingFormData, BookingFilters, BookingStats } from "@/lib/bookings/types";

export function useBookingOperations() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [stats, setStats] = useState<BookingStats | null>(null);

  const fetchAll = async (filters?: BookingFilters) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters?.status) params.append('status', filters.status);
      if (filters?.search) params.append('search', filters.search);
      if (filters?.dateFrom) params.append('dateFrom', filters.dateFrom);
      if (filters?.dateTo) params.append('dateTo', filters.dateTo);

      const res = await api.get(`/bookings?${params.toString()}`);
      if (res.data.success) {
        setBookings(res.data.data);
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await api.get("/bookings/stats/overview");
      if (res.data.success) {
        setStats(res.data.data);
      }
    } catch (err) {
      console.error("Failed to fetch booking stats:", err);
    }
  };

  const updateBooking = async (id: string, data: BookingFormData) => {
    setFormLoading(true);
    try {
      const res = await api.put(`/bookings/${id}`, data);
      if (res.data.success) {
        toast.success("Booking updated successfully");
        await fetchAll();
        return true;
      }
      toast.error(res.data.message);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to update booking");
    } finally {
      setFormLoading(false);
    }
    return false;
  };

  const deleteBooking = async (id: string) => {
    try {
      const res = await api.delete(`/bookings/${id}`);
      if (res.data.success) {
        toast.success("Booking deleted successfully");
        await fetchAll();
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete booking");
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await api.get(`/bookings/${id}`);
      // The backend automatically marks as read when fetching
      await fetchAll();
    } catch (err) {
      console.error("Failed to mark booking as read:", err);
    }
  };

  useEffect(() => {
    fetchAll();
    fetchStats();
  }, []);

  return {
    bookings,
    loading,
    formLoading,
    stats,
    fetchAll,
    updateBooking,
    deleteBooking,
    markAsRead,
    fetchStats,
  };
} 