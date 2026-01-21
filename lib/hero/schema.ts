import { z } from "zod";
import { FormField } from "@/components/ui/reusable-form";

export const heroSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title must be less than 100 characters"),
  subtitle: z.string().max(200, "Subtitle must be less than 200 characters").optional(),
  image: z.union([z.instanceof(File), z.string()]).optional(),
  displayType: z.enum(['mobile', 'desktop-top-left', 'desktop-top-right', 'desktop-bottom-left', 'desktop-bottom-right']),
  order: z.number().int().min(0).optional().default(0),
  active: z.boolean().optional().default(true),
  alt: z.string().max(200, "Alt text must be less than 200 characters").optional(),
});

export const editSchema = heroSchema.partial().extend({
  image: z.union([z.instanceof(File), z.string()]).optional(),
});

export type HeroFormData = z.infer<typeof heroSchema>;

export const DISPLAY_TYPES = [
  { value: 'mobile', label: 'Mobile' },
  { value: 'desktop-top-left', label: 'Desktop - Top Left' },
  { value: 'desktop-top-right', label: 'Desktop - Top Right' },
  { value: 'desktop-bottom-left', label: 'Desktop - Bottom Left' },
  { value: 'desktop-bottom-right', label: 'Desktop - Bottom Right' },
] as const;

export const heroFormFields: FormField[] = [
  {
    name: "title",
    label: "Title",
    type: "text",
    placeholder: "Enter image title",
    required: true,
  },
  {
    name: "subtitle",
    label: "Subtitle",
    type: "text",
    placeholder: "Enter subtitle (optional)",
    required: false,
  },
  {
    name: "image",
    label: "Image",
    type: "image",
    accept: "image/*",
    maxSize: 5,
    showPreview: true,
    required: true,
    description: "Upload an image (max 5MB). Supported formats: JPEG, PNG, WebP, SVG",
  },
  {
    name: "displayType",
    label: "Display Position",
    type: "select",
    options: DISPLAY_TYPES.map(type => ({ value: type.value, label: type.label })),
    required: true,
    description: "Where this image should appear on the homepage",
  },
  {
    name: "order",
    label: "Order",
    type: "number",
    placeholder: "0",
    required: false,
    description: "Lower numbers appear first (for same display type)",
  },
  {
    name: "active",
    label: "Active",
    type: "checkbox",
    required: false,
    description: "Only active images are displayed on the frontend",
  },
  {
    name: "alt",
    label: "Alt Text",
    type: "text",
    placeholder: "Enter alt text for accessibility",
    required: false,
    description: "Alternative text for screen readers",
  },
];


