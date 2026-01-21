import api from "@/utils/api";
import type { HeroImage } from "./types";

export const HeroService = {
  async getAllHeroImages(): Promise<HeroImage[]> {
    try {
      // Try with axios first (normal way)
      const response = await api.get("/hero");
      // Handle both wrapped and unwrapped responses (same pattern as gallery)
      const data = response.data?.data || response.data;
      
      if (Array.isArray(data)) {
        return data;
      }
      return [];
    } catch (error: any) {
      // If axios fails, try direct fetch as fallback for debugging
      if (!error.response && error.message?.includes('Network Error')) {
        console.warn("Axios failed, trying direct fetch as fallback...");
        try {
          const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001/api";
          const fetchResponse = await fetch(`${apiBaseUrl}/hero`, {
            method: 'GET',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
          });
          
          if (fetchResponse.ok) {
            const fetchData = await fetchResponse.json();
            const data = fetchData?.data || fetchData;
            if (Array.isArray(data)) {
              console.log("Direct fetch succeeded! Axios may have a configuration issue.");
              return data;
            }
          } else {
            console.error("Direct fetch also failed:", fetchResponse.status, fetchResponse.statusText);
          }
        } catch (fetchError) {
          console.error("Direct fetch error:", fetchError);
        }
      }
      // Log comprehensive error details
      const errorDetails = {
        message: error?.message,
        code: error?.code,
        name: error?.name,
        stack: error?.stack,
        response: error?.response ? {
          status: error.response.status,
          statusText: error.response.statusText,
          data: error.response.data,
          headers: error.response.headers,
        } : null,
        request: error?.request ? {
          method: error.request.method,
          url: error.request.url,
          headers: error.request.headers,
        } : null,
        config: error?.config ? {
          url: error.config.url,
          method: error.config.method,
          baseURL: error.config.baseURL,
          headers: error.config.headers,
        } : null,
      };
      
      console.error("HeroService.getAllHeroImages - Full error details:", JSON.stringify(errorDetails, null, 2));
      throw error;
    }
  },

  async getHeroImage(id: string): Promise<HeroImage> {
    const response = await api.get(`/hero/${id}`);
    const data = response.data;
    
    if (data && typeof data === 'object' && 'data' in data) {
      return data.data;
    }
    return data;
  },

  async createHeroImage(formData: FormData): Promise<{ success: boolean; data: HeroImage }> {
    const response = await api.post("/hero", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  async updateHeroImage(id: string, formData: FormData): Promise<{ success: boolean; data: HeroImage }> {
    const response = await api.patch(`/hero/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  async deleteHeroImage(id: string): Promise<void> {
    await api.delete(`/hero/${id}`);
  },
};

