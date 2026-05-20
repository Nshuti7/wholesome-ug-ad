"use client";

import React, { useState } from "react";
import { PageLayout } from "@/components/layouts/page-layout";
import { useBookingOperations } from "@/hooks/useBookingOperations";
import { useBookingFilters } from "@/hooks/useBookingFilters";
import { FormDialog } from "@/components/ui/form-dialog";
import { ReusableForm } from "@/components/ui/reusable-form";

import type { Booking, BookingFormData } from "@/lib/bookings/types";
import { bookingFormFields, updateBookingSchema, formatDate } from "@/lib/bookings/schema";

import { BookingPageHeader } from "@/components/bookings/BookingPageHeader";
import { BookingFilters } from "@/components/bookings/BookingFilters";
import { BookingTable } from "@/components/bookings/BookingTable";

export default function BookingsPage() {
  const {
    bookings,
    loading,
    formLoading,
    stats,
    updateBooking,
    deleteBooking,
  } = useBookingOperations();

  const { filters, filteredBookings, updateFilters, clearFilters } =
    useBookingFilters(bookings);

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const handleEdit = (booking: Booking) => {
    setSelectedBooking(booking);
    setEditDialogOpen(true);
  };

  const handleUpdate = async (data: BookingFormData) => {
    if (!selectedBooking) return false;
    
    const success = await updateBooking(selectedBooking._id, data);
    if (success) {
      setEditDialogOpen(false);
      setSelectedBooking(null);
    }
    return success;
  };

  const handleDelete = (id: string) => {
    deleteBooking(id);
  };

  const handleStatusChange = async (id: string, status: string) => {
    // Find the current booking
    const booking = bookings.find(b => b._id === id);
    if (!booking) return;

    // Update only the status
    const success = await updateBooking(id, {
      status: status as any,
      totalPrice: booking.totalPrice,
      currency: booking.currency,
      notes: booking.notes || "",
      adminNotes: booking.adminNotes || "",
    });

    if (success) {
      // Show a quick success message
      // The toast is already handled in updateBooking
    }
  };

  const editDefaults = (booking: Booking): Partial<BookingFormData> => ({
    status: booking.status,
    totalPrice: booking.totalPrice,
    currency: booking.currency,
    notes: booking.notes || "",
    adminNotes: booking.adminNotes || "",
  });

  return (
    <PageLayout pageTitle="Bookings">
      {/* Stats Header */}
      <BookingPageHeader stats={stats} />

      {/* Filters */}
      <BookingFilters
        filters={filters}
        onFiltersChange={updateFilters}
        onClearFilters={clearFilters}
      />

      {/* Table */}
      <BookingTable
        items={filteredBookings}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onStatusChange={handleStatusChange}
        formatDate={formatDate}
      />

      {/* Edit Dialog */}
      <FormDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        title="Edit Booking"
        description="Update booking status and details"
        fields={bookingFormFields}
        defaultValues={selectedBooking ? editDefaults(selectedBooking) : {}}
        onSubmit={handleUpdate}
        isLoading={formLoading}
        submitButtonText="Update Booking"
        validationSchema={updateBookingSchema}
      />
    </PageLayout>
  );
} 