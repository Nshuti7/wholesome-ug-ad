// services/auth.ts
import api from "../utils/api";

export interface LoginData {
  email: string;
  password: string;
}

export const login = (data: LoginData) => api.post("/auth/login", data);
export const getMe = () => api.get("/auth/me");
export const logout = () => api.post("/auth/logout");
export const refreshToken = () => api.post("/auth/refresh-token");
export const updateProfile = (formData: FormData) =>
  api.put("/auth/update", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
export const updatePassword = (data: {
  currentPassword: string;
  newPassword: string;
}) => api.put("/auth/update-password", data);
