export interface GalleryItem {
  _id: string;
  filename: string;
  description: string;
  image: string;
  cloudinaryId: string;
  createdAt: string;
  updatedAt: string;
}

export interface GalleryResponse {
  success: boolean;
  count: number;
  data: GalleryItem[];
  message?: string;
}

export interface UploadFormData {
  images: File[];
  description: string;
}

export type GridLayout = "2" | "3" | "4";
export type SortOption = "newest" | "oldest" | "name";
