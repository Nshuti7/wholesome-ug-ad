// lib/blogs/schema.ts
import * as z from "zod";

// Zod schema for creating a blog
export const createSchema = z.object({
  title: z.string().nonempty({ message: "Title is required" }),
  category: z.string().nonempty({ message: "Category is required" }),
  date: z.preprocess((val) => {
    if (val instanceof Date) {
      const y = val.getFullYear();
      const m = String(val.getMonth() + 1).padStart(2, "0");
      const d = String(val.getDate()).padStart(2, "0");
      return `${y}-${m}-${d}`;
    }
    return val;
  }, z.string().nonempty({ message: "Date is required" })),
  readTime: z.string().nonempty({ message: "Read time is required" }),
  excerpt: z.string().nonempty({ message: "Excerpt is required" }),
  content: z.string().nonempty({ message: "Content is required" }),
  image: z.instanceof(File, { message: "Image is required" }),
});

// Zod schema for editing (image optional)
export const editSchema = createSchema.extend({
  image: createSchema.shape.image.nullable(),
});

// Form-field definitions for your ReusableForm
import type { FormField } from "@/components/ui/reusable-form";
export const BLOG_CATEGORIES = [
  "Travel Destinations",
  "Adventure Tourism",
  "Cultural Experiences",
  "Wildlife & Nature",
  "Eco-Tourism",
  "Travel Tips",
  "Local Cuisine",
  "Historical Sites",
  "Photography",
  "Travel Planning",
  "Accommodation",
  "Transportation",
  "Travel Safety",
  "Seasonal Travel",
  "Budget Travel",
  "Relocate To Rwanda",
];

export const blogFormFields: FormField[] = [
  {
    name: "title",
    label: "Blog Title",
    type: "text",
    placeholder: "Enter an engaging blog title",
    required: true,
    description:
      "A compelling title that captures the essence of your blog post",
  },
  {
    name: "category",
    label: "Category",
    type: "select",
    options: BLOG_CATEGORIES.map((c) => ({ value: c, label: c })),
    placeholder: "Select a category",
    required: true,
    description: "Help readers find your content with the right category",
  },
  {
    name: "date",
    label: "Publication Date",
    type: "date",
    required: true,
    description: "When should this blog post be published?",
  },
  {
    name: "readTime",
    label: "Estimated Read Time",
    type: "text",
    placeholder: "e.g., 5 min read",
    required: true,
    description: "Help readers gauge the time commitment",
  },
  {
    name: "excerpt",
    label: "Excerpt",
    type: "textarea",
    placeholder: "Write a compelling summary of your blog post…",
    required: true,
    description: "A brief, engaging summary that appears in blog listings",
  },
  {
    name: "image",
    label: "Featured Image",
    type: "image",
    accept: "image/*",
    maxSize: 5,
    showPreview: true,
    required: true,
    description: "Upload a high-quality image that represents your blog post",
  },
  {
    name: "content",
    label: "Blog Content",
    type: "textarea",
    placeholder: "Write your blog content here…",
    required: true,
    description: "The main content of your blog post",
    className: "min-h-[200px]",
  },
];
