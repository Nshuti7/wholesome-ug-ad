// lib/tours/types.ts

export interface Tour {
  _id: string;
  title: string;
  description: string;
  daysCount: number;
  nightsCount: number;
  highlights?: string[];
  backgroundImage: { url: string; cloudinaryId: string };
  additionalImages: { url: string; cloudinaryId: string }[];
  inclusions: string[];
  days: TourDay[];
  destinations: DestinationRef[];
  // Pricing fields
  price: number;
  oldPrice?: number;
  currency: string;
  featured: boolean;
  discount: number;
  activityTypes: string[];
  // Virtual fields
  hasDiscount?: boolean;
  discountAmount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface TourDay {
  dayNumber: number;
  activity: string;
  description: string;
}

export interface DestinationRef {
  name: string;
  duration: string;
}

export interface TourFormData {
  title: string;
  description: string;
  daysCount: number;
  nightsCount: number;
  highlights?: string[];
  backgroundImage: File | null;
  additionalImages?: File[];
  inclusions?: string[];
  days: TourDay[];
  destinations?: DestinationRef[];
  // Pricing fields
  price: number;
  oldPrice?: number;
  currency: string;
  featured: boolean;
  discount: number;
  activityTypes: string[];
}
