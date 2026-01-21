// lib/team/schema.ts
import * as z from "zod";
import type { FormField } from "@/components/ui/reusable-form";

// Zod schema for creating a team member
export const createSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  role: z.string().min(1, { message: "Role is required" }),
  image: z.instanceof(File, { message: "Image is required" }),
  bio: z.string().optional(),
  socialLinks: z.array(z.string().url({ message: "Must be a valid URL" })).optional(),
  order: z.number().optional(),
  published: z.boolean().optional().default(true),
});

// Zod schema for editing (image optional)
export const editSchema = createSchema.extend({
  image: z.union([z.instanceof(File), z.string()]).nullable().optional(),
  socialLinks: z.array(z.string()).optional(), // Allow non-URL strings during editing
});

// Form field definitions
export const teamFormFields: FormField[] = [
  {
    name: "name",
    label: "Name",
    type: "text",
    placeholder: "Enter team member name",
    required: true,
    description: "Full name of the team member",
  },
  {
    name: "role",
    label: "Role/Position",
    type: "text",
    placeholder: "e.g., CEO & Founder",
    required: true,
    description: "The role or position of the team member",
  },
  {
    name: "bio",
    label: "Biography",
    type: "textarea",
    placeholder: "Enter a brief biography (optional)",
    required: false,
    description: "A short bio about the team member",
    className: "min-h-[100px]",
  },
  {
    name: "image",
    label: "Profile Image",
    type: "image",
    accept: "image/*",
    maxSize: 10,
    showPreview: true,
    required: true,
    description: "Upload a profile image for the team member",
  },
  {
    name: "socialLinks",
    label: "Social Links",
    type: "tags",
    required: false,
    placeholder: "Add social media links (press Enter or comma to add)",
    description: "Add social media profile URLs (Twitter, LinkedIn, etc.)",
    allowCustom: true,
    suggestions: [
      "https://twitter.com/",
      "https://linkedin.com/in/",
      "https://github.com/",
      "https://facebook.com/",
      "https://instagram.com/",
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
    description: "Whether this team member should be visible to the public",
  },
];

