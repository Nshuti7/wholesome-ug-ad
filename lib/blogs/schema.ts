// lib/blogs/schema.ts
import * as z from "zod";

// Helper function to generate slug from title
export const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
};

// Zod schema for creating a blog
export const createSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  slug: z.string().optional(), // Will be generated from title if not provided
  author: z.string().min(1, { message: "Author is required" }),
  category: z.string().min(1, { message: "Category is required" }),
  date: z.preprocess((val) => {
    if (val instanceof Date) {
      const y = val.getFullYear();
      const m = String(val.getMonth() + 1).padStart(2, "0");
      const d = String(val.getDate()).padStart(2, "0");
      return `${y}-${m}-${d}`;
    }
    return val;
  }, z.string().min(1, { message: "Date is required" })),
  readTime: z.string().min(1, { message: "Read time is required" }),
  excerpt: z.string().min(1, { message: "Excerpt is required" }),
  content: z.string().min(1, { message: "Content is required" }),
  image: z.instanceof(File, { message: "Image is required" }),
  published: z.boolean().optional().default(true),
  tags: z.array(z.string()).optional(),
});

// Zod schema for editing (image optional)
export const editSchema = createSchema.extend({
  image: z.union([z.instanceof(File), z.string()]).nullable().optional(),
  slug: z.string().optional(),
});

// Form-field definitions for your ReusableForm
import type { FormField } from "@/components/ui/reusable-form";
export const BLOG_CATEGORIES = [
  "Community Impact",
  "Education",
  "Health & Wellness",
  "Youth Development",
  "Women Empowerment",
  "Environmental Conservation",
  "Agriculture",
  "Technology",
  "Events",
  "Success Stories",
  "Partnerships",
  "News & Updates",
  "Volunteer Stories",
  "Programs",
  "Resources",
  "General",
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
    name: "author",
    label: "Author",
    type: "text",
    placeholder: "Enter the author's name",
    required: true,
    description: "The name of the blog post author",
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
  {
    name: "published",
    label: "Published",
    type: "switch",
    required: false,
    description: "Whether this blog post should be visible to the public",
  },
  {
    name: "tags",
    label: "Tags",
    type: "tags",
    required: false,
    placeholder: "Add tags (press Enter or comma to add)",
    description: "Add relevant tags to help categorize and find your blog post",
    allowCustom: true,
    suggestions: [
      "community",
      "education",
      "health",
      "wellness",
      "youth",
      "women",
      "environment",
      "agriculture",
      "technology",
      "innovation",
      "success",
      "partnership",
      "volunteer",
      "program",
      "update",
      "news",
    ],
  },
];
