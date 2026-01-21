export interface User {
  _id: string;
  name: string;
  email: string;
  profileImage: string | null;
  role: "user" | "admin";
  createdAt: string;
  updatedAt: string;
}

// Alias for consistency with NavUser component
export type MeUser = User; 