// lib/destinations/types.ts

export interface Destination {
  _id: string;
  name: string;
  location: string;
  region: string;
  bestTimeToVisit: string;
  climate: string;
  description: string;
  history: string;
  googleMapsLink: string;
  latitude?: number;
  longitude?: number;
  attractions: string[];
  wildlife: string[];
  destinationType: string;
  featured: boolean;
  facts: string[];
  backgroundImage: { url: string; cloudinaryId: string };
  additionalImages: { url: string; cloudinaryId: string }[];
  createdAt: string;
  updatedAt: string;
}

export interface DestinationFormData {
  name: string;
  location: string;
  region: string;
  bestTimeToVisit: string;
  climate: string;
  description: string;
  history: string;
  googleMapsLink: string;
  latitude?: number;
  longitude?: number;
  attractions: string[];
  wildlife: string[];
  destinationType: string;
  featured: boolean;
  facts: string[];
  backgroundImage: File | null;
  additionalImages: File[] | null;
}
