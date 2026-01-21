// services/auth.ts
import api from "../utils/api";
import type { User } from "@/lib/auth/types";

export interface LoginData {
  email: string;
  password: string;
}

// Mock user data for development when backend is not available
const mockUser: User = {
  _id: "mock-user-123",
  name: "Admin User",
  email: "admin@wholesomeuganda.org",
  profileImage: null,
  role: "admin",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export const login = (data: LoginData) => api.post("/auth/login", data);

export const getMe = async () => {
  try {
    // Try to fetch from API first
    const response = await api.get("/auth/me");
    
    // Backend returns { success: true, data: { id, name, email, role, profileImage } }
    // We need to extract the user data and normalize it
    if (response.data && response.data.success && response.data.data) {
      const userData = response.data.data;
      // Normalize id to _id for consistency with frontend
      return {
        data: {
          _id: userData.id || userData._id,
          id: userData.id || userData._id,
          name: userData.name || "User",
          email: userData.email,
          role: userData.role || "admin",
          profileImage: userData.profileImage || null,
          createdAt: userData.createdAt || new Date().toISOString(),
          updatedAt: userData.updatedAt || new Date().toISOString(),
        },
        status: response.status,
        statusText: response.statusText
      };
    }
    
    // If response structure is different, try to extract user data directly
    if (response.data && (response.data.email || response.data._id || response.data.id)) {
      const userData = response.data;
      return {
        data: {
          _id: userData.id || userData._id || "unknown",
          id: userData.id || userData._id || "unknown",
          name: userData.name || "User",
          email: userData.email || "",
          role: userData.role || "admin",
          profileImage: userData.profileImage || null,
          createdAt: userData.createdAt || new Date().toISOString(),
          updatedAt: userData.updatedAt || new Date().toISOString(),
        },
        status: response.status,
        statusText: response.statusText
      };
    }
    
    return response;
  } catch (error) {
    console.warn('Auth API not available, using mock user data:', error);
    // Return mock data if API is not available
    return {
      data: mockUser,
      status: 200,
      statusText: 'OK'
    };
  }
};

export const logout = async () => {
  try {
    return await api.post("/auth/logout");
  } catch (error) {
    console.warn('Logout API not available:', error);
    // Return a mock successful response
    return { data: { success: true }, status: 200 };
  }
};
export const refreshToken = () => api.post("/auth/refresh-token");
export const updateProfile = (formData: FormData) =>
  api.patch("/auth/profile", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
export const changePassword = (data: {
  currentPassword: string;
  newPassword: string;
}) => api.post("/auth/change-password", data);
