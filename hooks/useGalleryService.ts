import api from "@/utils/api";
import {
  GalleryResponse,
  GalleryItem,
  UploadFormData,
} from "@/lib/gallery/types";

export class GalleryService {
  static async fetchGalleryItems(): Promise<GalleryResponse> {
    const response = await api.get<GalleryResponse>("/gallery");
    return response.data;
  }

  static async uploadImages(data: UploadFormData): Promise<{
    success: boolean;
    message: string;
    data: GalleryItem[];
  }> {
    const formData = new FormData();

    // Add all selected images
    data.images.forEach((file) => {
      formData.append("images", file);
    });

    // Add description
    if (data.description) {
      formData.append("description", data.description);
    }

    const response = await api.post<{
      success: boolean;
      message: string;
      data: GalleryItem[];
    }>("/gallery", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  }

  static async deleteImage(
    id: string
  ): Promise<{ success: boolean; message?: string }> {
    const response = await api.delete(`/gallery/${id}`);
    return response.data;
  }
}
