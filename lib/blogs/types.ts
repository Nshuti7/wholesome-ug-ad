// lib/blogs/types.ts

export interface Blog {
  _id: string;
  title: string;
  date: string;
  category: string;
  excerpt: string;
  image: string;
  readTime: string;
  content: string;
  cloudinaryId: string;
  createdAt: string;
  updatedAt: string;
}

export interface BlogFormData {
  title: string;
  date: string;
  category: string;
  excerpt: string;
  readTime: string;
  content: string;
  image: File | null;
}
