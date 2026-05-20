export interface Booking {
  _id: string;
  name: string;
  email: string;
  phone: string;
  phoneCountryCode: string;
  country: string;
  preferredTour?: {
    _id: string;
    title: string;
    daysCount: number;
    nightsCount: number;
    description?: string;
    backgroundImage?: { url: string; cloudinaryId: string };
  };
  travelDate: string;
  numberOfPeople: number;
  specialRequests?: string;
  status: "pending" | "confirmed" | "in progress" | "completed" | "cancelled";
  totalPrice: number;
  currency: string;
  notes?: string;
  adminNotes?: string;
  isRead: boolean;
  source: "website" | "phone" | "email" | "social_media";
  createdAt: string;
  updatedAt: string;
}

export interface BookingFormData {
  status: "pending" | "confirmed" | "in progress" | "completed" | "cancelled";
  totalPrice: number;
  currency: string;
  notes?: string;
  adminNotes?: string;
}

export interface BookingStats {
  total: number;
  pending: number;
  confirmed: number;
  completed: number;
  recent: number;
  monthlyStats: Array<{
    month: string;
    count: number;
  }>;
}

export interface BookingFilters {
  status?: string;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
} 