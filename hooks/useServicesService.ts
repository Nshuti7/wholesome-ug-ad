// hooks/useServicesService.ts
import api from "@/utils/api";
import {
  ServiceResponse,
  Service,
} from "@/lib/services/types";

export class ServicesService {
  static async fetchServices(published?: boolean): Promise<ServiceResponse> {
    const queryParam = published !== undefined ? `?published=${published}` : '';
    const response = await api.get<ServiceResponse>(`/services${queryParam}`);
    // Handle both wrapped and unwrapped responses
    const data = response.data?.data || response.data;
    const success = response.data?.success !== false;
    return {
      success,
      total: Array.isArray(data) ? data.length : 0,
      count: Array.isArray(data) ? data.length : 0,
      data: Array.isArray(data) ? data : [],
      message: response.data?.message,
    };
  }

  static async fetchService(id: string): Promise<Service | null> {
    try {
      const response = await api.get(`/services/${id}`);
      const data = response.data?.data || response.data;
      return data || null;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  }

  static async createService(formData: FormData): Promise<any> {
    const response = await api.post("/services", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  }

  static async updateService(id: string, formData: FormData): Promise<any> {
    const response = await api.patch(`/services/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  }

  static async deleteService(id: string): Promise<void> {
    await api.delete(`/services/${id}`);
  }
}

