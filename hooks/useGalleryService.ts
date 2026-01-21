import api from "@/utils/api";
import {
  GalleryResponse,
  GalleryItem,
} from "@/lib/gallery/types";

export class GalleryService {
  static async fetchGalleryItems(published?: boolean): Promise<GalleryResponse> {
    const queryParam = published !== undefined ? `?published=${published}` : '';
    const response = await api.get<GalleryResponse>(`/gallery${queryParam}`);
    // Handle both wrapped and unwrapped responses
    const data = response.data?.data || response.data;
    const success = response.data?.success !== false;
    return {
      success,
      total: Array.isArray(data) ? data.length : 0,
      data: Array.isArray(data) ? data : [],
      message: response.data?.message,
    };
  }

  static async fetchGalleryItem(id: string): Promise<GalleryItem | null> {
    try {
      const response = await api.get(`/gallery/${id}`);
      const data = response.data?.data || response.data;
      return data || null;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  }

  static async createGalleryItem(formData: FormData): Promise<any> {
    const response = await api.post("/gallery", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  }

  static async updateGalleryItem(id: string, formData: FormData): Promise<any> {
    const response = await api.patch(`/gallery/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  }

  static async deleteGalleryItem(id: string): Promise<void> {
    await api.delete(`/gallery/${id}`);
  }

  static async getCategories(): Promise<string[]> {
    try {
      const response = await api.get("/gallery/categories");
      const data = response.data?.data || response.data;
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error("Error fetching categories:", error);
      return [];
    }
  }
}
