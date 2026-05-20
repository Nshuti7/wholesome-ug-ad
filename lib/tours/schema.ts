// lib/tours/schema.ts

import * as z from "zod";
import type { FormField } from "@/components/ui/reusable-form";

export const ITINERARY_INCLUSIONS = [
  "Hotel pickup and drop-off",
  "Road transport",
  "Speedboat transfers",
  "Transfer to a private pier",
  "Buffet lunch",
  "Morning tea",
  "Snacks",
  "Drinking water",
  "Soft drinks",
  "Alcoholic beverages",
  "Snorkeling",
  "Swimming",
  "Sightseeing",
  "Wildlife viewing",
  "Snorkeling equipment",
  "Towel",
  "Tour guide",
  "Insurance",
  "Local taxes",
  "Tips",
] as const;

export const ACTIVITY_TYPES = [
  "Wildlife Safari",
  "Cultural Experience",
  "Adventure Tour",
  "Photography Tour",
  "Nature Walk",
  "Bird Watching",
  "Gorilla Trekking",
  "Chimpanzee Tracking",
  "Canopy Walk",
  "Boat Safari",
  "Hiking",
  "Community Visit",
  "Conservation Tour",
  "Scenic Drive",
  "Sunset Viewing",
  "Crater Lake Tour",
] as const;

export const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

// --- day sub‐schema ---
const daySchema = z.object({
  dayNumber: z.number().int().nonnegative(),
  activity: z.string().nonempty("Activity is required"),
  description: z.string().nonempty("Description is required"),
});

// --- destination ref sub‐schema ---
const destinationRefSchema = z.object({
  name: z.string().nonempty("Destination name is required"),
  duration: z.string().nonempty("Duration is required"),
});

// --- create schema ---
const baseTourSchema = z.object({
  title: z.string().nonempty("Title is required"),
  description: z.string().nonempty("Description is required"),
  daysCount: z.number().int().nonnegative(),
  nightsCount: z.number().int().nonnegative(),
  price: z.number().min(0.01, "Price must be greater than 0"),
  oldPrice: z.number().min(0, "Old price must be positive").optional().nullable(),
  currency: z.enum(["USD", "EUR", "GBP"]).default("USD"),
  featured: z.boolean().default(false),
  discount: z.number().min(0, "Discount must be positive").max(100, "Discount cannot exceed 100%").default(0),
  activityTypes: z.array(z.string()).max(10, "Maximum 10 activity types allowed").optional(),
  highlights: z.array(z.string()).optional(),
  backgroundImage: z.instanceof(File, { message: "Image is required" }),
  additionalImages: z.array(z.instanceof(File))
    .min(4, "At least 4 additional images are required"),
  inclusions: z.array(z.string()).optional(),
  days: z.array(daySchema).optional(),
  destinations: z.array(destinationRefSchema).optional(),
});

export const createTourSchema = baseTourSchema.refine(
  (data) => {
    if (data.oldPrice && data.price && data.oldPrice > 0) {
      return data.oldPrice >= data.price;
    }
    return true;
  },
  {
    message: "Old price must be greater than or equal to current price",
    path: ["oldPrice"],
  }
);

// --- edit schema (make images & days optional) ---
export const editTourSchema = baseTourSchema.partial({
  backgroundImage: true,
  additionalImages: true,
  days: true,
  destinations: true,
}).refine(
  (data) => {
    if (data.oldPrice && data.price && data.oldPrice > 0) {
      return data.oldPrice >= data.price;
    }
    return true;
  },
  {
    message: "Old price must be greater than or equal to current price",
    path: ["oldPrice"],
  }
);

// --- FormField config ---
export const tourFormFields: FormField[] = [
  { name: "title", label: "Title", type: "text", required: true },
  { name: "description", label: "Description", type: "textarea", required: true },
  { name: "daysCount", label: "Days Count", type: "number", required: true },
  { name: "nightsCount", label: "Nights Count", type: "number", required: true },
  { name: "price", label: "Price (USD)", type: "number", required: true, min: 0, step: 0.01 },
  { name: "oldPrice", label: "Old Price (USD) - Optional", type: "number", min: 0, step: 0.01, description: "Leave empty if no discount. Must be higher than current price." },
  { 
    name: "currency", 
    label: "Currency", 
    type: "select", 
    options: [
      { value: "USD", label: "USD" },
      { value: "EUR", label: "EUR" },
      { value: "GBP", label: "GBP" }
    ]
  },
  { name: "featured", label: "Featured Tour", type: "checkbox" },
  { name: "discount", label: "Discount (%)", type: "number", min: 0, max: 100, step: 1 },
  {
    name: "activityTypes",
    label: "Activity Types",
    type: "multiselect",
    options: ACTIVITY_TYPES.map((type) => ({ value: type, label: type })),
  },
  { name: "highlights", label: "Highlights", type: "tags" },
  {
    name: "inclusions",
    label: "Inclusions",
    type: "multiselect",
    options: ITINERARY_INCLUSIONS.map((i) => ({ value: i, label: i })),
  },
  {
    name: "backgroundImage",
    label: "Background Image",
    type: "image",
    accept: "image/*",
    required: true,
    showPreview: true,
  },
  {
    name: "additionalImages",
    label: "Additional Images (min. 4)",
    type: "multiimage",
    accept: "image/*",
    maxFiles: 5,
    minFiles: 4,
    showPreview: true,
    required: true,
    description: "Upload at least 4 additional images for the tour",
  },
];
