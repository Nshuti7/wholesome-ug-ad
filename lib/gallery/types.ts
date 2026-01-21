export interface GalleryItem {
  _id: string;
  title: string;
  image: string;
  category: string;
  description?: string;
  order?: number;
  published?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GalleryResponse {
  success: boolean;
  total: number;
  data: GalleryItem[];
  message?: string;
}

export type GridLayout = "2" | "3" | "4";
export type SortOption = "newest" | "oldest" | "name";
