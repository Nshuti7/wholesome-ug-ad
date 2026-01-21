// lib/blogs/types.ts

export interface Blog {
  _id: string;
  slug: string;
  title: string;
  author: string;
  date: string;
  category: string;
  excerpt: string;
  image: string;
  readTime: string;
  content: string;
  published?: boolean;
  tags?: string[];
  cloudinaryId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BlogFormData {
  title: string;
  slug?: string; // Optional - will be generated from title if not provided
  author: string;
  date: string;
  category: string;
  excerpt: string;
  readTime: string;
  content: string;
  image: File | string | null; // Can be File for new uploads or string URL for existing
  published?: boolean;
  tags?: string[];
}
