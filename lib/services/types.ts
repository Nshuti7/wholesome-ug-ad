// lib/services/types.ts
export interface Service {
  _id: string;
  title: string;
  description: string;
  icon: string;
  image: string;
  longDescription?: string;
  features?: string[];
  order?: number;
  published?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceResponse {
  success: boolean;
  total?: number;
  count?: number;
  data: Service | Service[];
  message?: string;
}

