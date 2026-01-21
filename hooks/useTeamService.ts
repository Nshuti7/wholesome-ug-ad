// hooks/useTeamService.ts
import api from "@/utils/api";
import {
  TeamResponse,
  TeamMember,
} from "@/lib/team/types";

export class TeamService {
  static async fetchTeamMembers(published?: boolean): Promise<TeamResponse> {
    const queryParam = published !== undefined ? `?published=${published}` : '';
    const response = await api.get<TeamResponse>(`/team${queryParam}`);
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

  static async fetchTeamMember(id: string): Promise<TeamMember | null> {
    try {
      const response = await api.get(`/team/${id}`);
      const data = response.data?.data || response.data;
      return data || null;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  }

  static async createTeamMember(formData: FormData): Promise<any> {
    const response = await api.post("/team", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  }

  static async updateTeamMember(id: string, formData: FormData): Promise<any> {
    const response = await api.patch(`/team/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  }

  static async deleteTeamMember(id: string): Promise<void> {
    await api.delete(`/team/${id}`);
  }
}

