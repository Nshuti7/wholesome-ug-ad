// admin/lib/dashboard/types.ts

// Basic type for a monthly statistic item
export interface MonthlyStat {
  month: string;
  count: number;
}

// Overview counts for the entire application
export interface OverviewStats {
  totalSubscribers: number;
  totalBlogs: number;
  totalGalleryItems: number;
  totalDestinations: number;
  totalItineraries: number;
  totalTeamMembers: number;
  totalContacts: number;
  totalUsers: number;
  totalBookings: number;
}

// Detailed review statistics
export interface ReviewSummary {
  company: {
    averageRating: number;
    totalReviews: number;
    ratingDistribution: Record<string, number>;
  };
  itineraries: {
    averageRating: number;
    totalReviews: number;
  };
  overall: {
    totalReviews: number;
    pendingReviews: number;
    approvedReviews: number;
    rejectedReviews: number;
  };
}

// Structures for recent activity items
export interface RecentContact {
  id: string;
  name: string;
  email: string;
  subject: string;
  status: string;
  createdAt: string;
}

export interface RecentBlog {
  id: string;
  title: string;
  createdAt: string;
}

export interface RecentDestination {
  id: string;
  name: string;
  region: string;
  createdAt: string;
}

export interface RecentItinerary {
  id: string;
  title: string;
  duration: string;
  createdAt: string;
}

export interface RecentReview {
  id: string;
  name: string;
  rating: number;
  reviewType: string;
  status: string;
  createdAt: string;
}

export interface RecentBooking {
  id: string;
  name: string;
  email: string;
  status: string;
  travelDate: string;
  numberOfPeople: number;
  createdAt: string;
}

// Analytics data for charts and visualizations
export interface AnalyticsData {
  contactStatus: Record<string, number>;
  destinationRegions: Record<string, number>;
  teamCategories: Record<string, number>;
  bookingStatus: Record<string, number>;
  monthlyStats: {
    contacts: MonthlyStat[];
    blogs: MonthlyStat[];
    destinations: MonthlyStat[];
    itineraries: MonthlyStat[];
    reviews: MonthlyStat[];
    subscribers: MonthlyStat[];
    gallery: MonthlyStat[];
    bookings: MonthlyStat[];
  };
  performanceMetrics: {
    contacts: { current: number; previous: number; growth: number };
    reviews: { current: number; previous: number; growth: number };
    subscribers: { current: number; previous: number; growth: number };
    bookings: { current: number; previous: number; growth: number };
  };
  contentDistribution: {
    blogs: { count: number; percentage: number };
    destinations: { count: number; percentage: number };
    itineraries: { count: number; percentage: number };
    gallery: { count: number; percentage: number };
    bookings: { count: number; percentage: number };
  };
  engagementMetrics: {
    totalInteractions: number;
    avgRating: number;
    engagementRate: number;
  };
}

// Top-level structure for the entire dashboard API response
export interface DashboardData {
  overview: OverviewStats;
  reviews: ReviewSummary;
  recentActivities: {
    contacts: RecentContact[];
    blogs: RecentBlog[];
    destinations: RecentDestination[];
    itineraries: RecentItinerary[];
    reviews: RecentReview[];
    bookings: RecentBooking[];
  };
  analytics: AnalyticsData;
  quickStats: {
    pendingReviews: number;
    newContacts: number;
    totalImages: number;
    averageRating: number;
    recentGrowth: number;
    pendingBookings: number;
  };
  summaryCards: {
    recentContacts: number;
    recentReviews: number;
    recentBlogs: number;
    recentDestinations: number;
    recentBookings: number;
  };
}

// The API response may not include the top-level 'data' property
// so we define the response type directly as DashboardData
export type DashboardResponse = DashboardData; 