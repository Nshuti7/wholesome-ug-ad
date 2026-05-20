import * as z from "zod";
import type { FormField } from "@/components/ui/reusable-form";

// --- Constants for selects ---
export const BOOKING_STATUSES = [
  "pending",
  "confirmed", 
  "in progress",
  "completed",
  "cancelled",
] as const;

export const BOOKING_SOURCES = [
  "website",
  "phone",
  "email", 
  "social_media",
] as const;

export const CURRENCIES = [
  "USD",
  "EUR",
  "GBP",
  "UGX",
  "KES",
  "TZS",
] as const;

// --- Zod schemas ---
export const updateBookingSchema = z.object({
  status: z.enum(BOOKING_STATUSES),
  totalPrice: z.number().min(0, "Total price must be non-negative"),
  currency: z.enum(CURRENCIES),
  notes: z.string().optional(),
  adminNotes: z.string().optional(),
});

// --- FormField config ---
export const bookingFormFields: FormField[] = [
  {
    name: "status",
    label: "Status",
    type: "select",
    options: BOOKING_STATUSES.map((s) => ({ 
      value: s, 
      label: s.charAt(0).toUpperCase() + s.slice(1).replace(/([A-Z])/g, ' $1')
    })),
    required: true,
  },
  {
    name: "totalPrice",
    label: "Total Price",
    type: "number",
    required: true,
    min: 0,
    step: 0.01,
  },
  {
    name: "currency",
    label: "Currency",
    type: "select",
    options: CURRENCIES.map((c) => ({ value: c, label: c })),
    required: true,
  },
  {
    name: "notes",
    label: "Notes",
    type: "textarea",
    placeholder: "Add any notes about this booking...",
  },
  {
    name: "adminNotes",
    label: "Admin Notes",
    type: "textarea",
    placeholder: "Internal notes for admin use only...",
  },
];

// --- Utility ---
export const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

export const formatDateTime = (iso: string) =>
  new Date(iso).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

export const getStatusColor = (status: string) => {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "confirmed":
      return "bg-blue-100 text-blue-800";
    case "in progress":
      return "bg-purple-100 text-purple-800";
    case "completed":
      return "bg-green-100 text-green-800";
    case "cancelled":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export const getSourceIcon = (source: string) => {
  switch (source) {
    case "website":
      return "Globe";
    case "phone":
      return "Phone";
    case "email":
      return "Mail";
    case "social_media":
      return "Smartphone";
    default:
      return "FileText";
  }
}; 