"use client";

import { useState, useMemo } from "react";
import type { Booking, BookingFilters } from "@/lib/bookings/types";

export function useBookingFilters(bookings: Booking[]) {
  const [filters, setFilters] = useState<BookingFilters>({});

  const filteredBookings = useMemo(() => {
    return bookings.filter((booking) => {
      // Status filter
      if (filters.status && booking.status !== filters.status) {
        return false;
      }

      // Search filter
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        const matchesName = booking.name.toLowerCase().includes(searchTerm);
        const matchesEmail = booking.email.toLowerCase().includes(searchTerm);
        const matchesPhone = booking.phone.includes(searchTerm);
        
        if (!matchesName && !matchesEmail && !matchesPhone) {
          return false;
        }
      }

      // Date range filter
      if (filters.dateFrom || filters.dateTo) {
        const bookingDate = new Date(booking.travelDate);
        
        if (filters.dateFrom) {
          const fromDate = new Date(filters.dateFrom);
          if (bookingDate < fromDate) {
            return false;
          }
        }
        
        if (filters.dateTo) {
          const toDate = new Date(filters.dateTo);
          if (bookingDate > toDate) {
            return false;
          }
        }
      }

      return true;
    });
  }, [bookings, filters]);

  const updateFilters = (newFilters: Partial<BookingFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const clearFilters = () => {
    setFilters({});
  };

  return {
    filters,
    filteredBookings,
    updateFilters,
    clearFilters,
  };
} 