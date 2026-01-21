// lib/services/schema.ts
import * as z from "zod";
import type { FormField } from "@/components/ui/reusable-form";

// Zod schema for creating a service
export const createSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  icon: z.string().min(1, { message: "Icon is required" }),
  image: z.instanceof(File, { message: "Image is required" }),
  longDescription: z.string().optional(),
  features: z.array(z.string()).optional(),
  order: z.number().optional(),
  published: z.boolean().optional().default(true),
});

// Zod schema for editing (image optional)
export const editSchema = createSchema.extend({
  image: z.union([z.instanceof(File), z.string()]).nullable().optional(),
});

// Common icon options (Lucide React icons)
export const ICON_OPTIONS = [
  { value: "Shirt", label: "Shirt" },
  { value: "Palette", label: "Palette" },
  { value: "Camera", label: "Camera" },
  { value: "Plane", label: "Plane" },
  { value: "Heart", label: "Heart" },
  { value: "Book", label: "Book" },
  { value: "Stethoscope", label: "Stethoscope" },
  { value: "Sprout", label: "Sprout" },
  { value: "Laptop", label: "Laptop" },
  { value: "Lightbulb", label: "Lightbulb" },
  { value: "Users", label: "Users" },
  { value: "Music", label: "Music" },
  { value: "Microphone", label: "Microphone" },
  { value: "Video", label: "Video" },
  { value: "Image", label: "Image" },
  { value: "FileText", label: "FileText" },
  { value: "Mail", label: "Mail" },
  { value: "Phone", label: "Phone" },
  { value: "MapPin", label: "MapPin" },
  { value: "Globe", label: "Globe" },
];

// Form field definitions
export const serviceFormFields: FormField[] = [
  {
    name: "title",
    label: "Title",
    type: "text",
    placeholder: "Enter service title",
    required: true,
    description: "A clear, descriptive title for the service",
  },
  {
    name: "description",
    label: "Short Description",
    type: "textarea",
    placeholder: "Enter a brief description",
    required: true,
    description: "A concise description that appears in listings",
    className: "min-h-[80px]",
  },
  {
    name: "longDescription",
    label: "Long Description",
    type: "textarea",
    placeholder: "Enter detailed description (optional)",
    required: false,
    description: "A detailed description of the service",
    className: "min-h-[150px]",
  },
  {
    name: "icon",
    label: "Icon",
    type: "select",
    options: ICON_OPTIONS,
    placeholder: "Select an icon",
    required: true,
    description: "Choose an icon to represent this service",
  },
  {
    name: "image",
    label: "Service Image",
    type: "image",
    accept: "image/*",
    maxSize: 10,
    showPreview: true,
    required: true,
    description: "Upload an image for the service",
  },
  {
    name: "features",
    label: "Features",
    type: "tags",
    required: false,
    placeholder: "Add features (press Enter or comma to add)",
    description: "List key features or benefits of this service",
    allowCustom: true,
    suggestions: [
      "Custom designs",
      "Quality materials",
      "Professional service",
      "Fast delivery",
      "Affordable pricing",
      "Expert team",
      "24/7 support",
      "Certified professionals",
    ],
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
    description: "Whether this service should be visible to the public",
  },
];

