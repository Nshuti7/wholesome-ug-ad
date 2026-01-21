// lib/team/types.ts
export interface TeamMember {
  _id: string;
  name: string;
  role: string;
  image: string;
  bio?: string;
  socialLinks?: string[];
  order?: number;
  published?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TeamResponse {
  success: boolean;
  total?: number;
  count?: number;
  data: TeamMember | TeamMember[];
  message?: string;
}

