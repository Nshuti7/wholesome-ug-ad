// lib/gallery/schema.ts
import * as z from "zod";
import type { FormField } from "@/components/ui/reusable-form";

// Zod schema for creating a gallery item
export const createSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  category: z.string().min(1, { message: "Category is required" }),
  description: z.string().optional(),
  image: z.instanceof(File, { message: "Image is required" }),
  order: z.number().optional(),
  published: z.boolean().optional().default(true),
});

// Zod schema for editing (image optional)
export const editSchema = createSchema.extend({
  image: z.union([z.instanceof(File), z.string()]).nullable().optional(),
});

// Gallery categories
export const GALLERY_CATEGORIES = [
  "Fashion",
  "Art",
  "Tourism",
  "Events",
  "Community",
  "Education",
  "Health",
  "Agriculture",
  "Technology",
  "Creative",
  "General",
];

// Form field definitions
export const galleryFormFields: FormField[] = [
  {
    name: "title",
    label: "Title",
    type: "text",
    placeholder: "Enter gallery item title",
    required: true,
    description: "A descriptive title for the gallery item",
  },
  {
    name: "category",
    label: "Category",
    type: "select",
    options: GALLERY_CATEGORIES.map((c) => ({ value: c, label: c })),
    placeholder: "Select a category",
    required: true,
    description: "Categorize your gallery item",
  },
  {
    name: "description",
    label: "Description",
    type: "textarea",
    placeholder: "Enter a description (optional)",
    required: false,
    description: "Optional description for the gallery item",
  },
  {
    name: "image",
    label: "Image",
    type: "image",
    accept: "image/*",
    maxSize: 10,
    showPreview: true,
    required: true,
    description: "Upload an image for the gallery",
  },
  {
    name: "order",
    label: "Display Order",
    type: "number",
    placeholder: "0",
    required: false,
    description: "Order for display (lower numbers appear first)",
  },
  {
    name: "published",
    label: "Published",
    type: "switch",
    required: false,
    description: "Whether this item should be visible to the public",
  },
];

