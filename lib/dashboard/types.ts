// admin/lib/dashboard/types.ts

// Basic type for a monthly statistic item
export interface MonthlyStat {
  month: string;
  count: number;
}

// Overview counts for the entire radio station
export interface OverviewStats {
  totalPrograms: number;
  totalTeamMembers: number;
  totalAdvertisingInquiries: number;
  totalGalleryItems: number;
  totalNewsletters: number;
  totalContacts: number;
  totalUsers: number;
  totalLivePrograms: number;
  totalLogos: number;
}

// Program statistics
export interface ProgramSummary {
  total: number;
  active: number;
  live: number;
  byCategory: Record<string, number>;
  byStatus: Record<string, number>;
}

// Advertising inquiry statistics
export interface AdvertisingSummary {
  total: number;
  newInquiries: number;
  inProgress: number;
  successful: number;
  byBudget: Record<string, number>;
  byStatus: Record<string, number>;
}

// Team member statistics
export interface TeamSummary {
  total: number;
  byCategory: Record<string, number>;
  presenters: number;
  management: number;
  technical: number;
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

export interface RecentProgram {
  id: string;
  title: string;
  category: string;
  status: string;
  createdAt: string;
}

export interface RecentAdvertisingInquiry {
  id: string;
  name: string;
  company: string;
  budget: string;
  status: string;
  createdAt: string;
}

export interface RecentTeamMember {
  id: string;
  name: string;
  category: string;
  role: string;
  createdAt: string;
}

// Analytics data for charts and visualizations
export interface AnalyticsData {
  programCategories: Record<string, number>;
  advertisingStatus: Record<string, number>;
  teamCategories: Record<string, number>;
  contactStatus: Record<string, number>;
  monthlyStats: {
    programs: MonthlyStat[];
    advertising: MonthlyStat[];
    team: MonthlyStat[];
    contacts: MonthlyStat[];
    newsletters: MonthlyStat[];
    gallery: MonthlyStat[];
  };
  performanceMetrics: {
    programs: { current: number; previous: number; growth: number };
    advertising: { current: number; previous: number; growth: number };
    contacts: { current: number; previous: number; growth: number };
    team: { current: number; previous: number; growth: number };
  };
  contentDistribution: {
    programs: { count: number; percentage: number };
    advertising: { count: number; percentage: number };
    team: { count: number; percentage: number };
    gallery: { count: number; percentage: number };
    contacts: { count: number; percentage: number };
  };
  engagementMetrics: {
    totalPrograms: number;
    livePrograms: number;
    activeInquiries: number;
    responseRate: number;
  };
}

// Top-level structure for the entire dashboard API response
export interface DashboardData {
  overview: OverviewStats;
  programs: ProgramSummary;
  advertising: AdvertisingSummary;
  team: TeamSummary;
  recentActivities: {
    contacts: RecentContact[];
    programs: RecentProgram[];
    advertising: RecentAdvertisingInquiry[];
    team: RecentTeamMember[];
  };
  analytics: AnalyticsData;
  quickStats: {
    totalPrograms: number;
    livePrograms: number;
    newInquiries: number;
    totalTeamMembers: number;
    recentGrowth: number;
    pendingInquiries: number;
  };
  summaryCards: {
    recentContacts: number;
    recentPrograms: number;
    recentInquiries: number;
    recentTeamMembers: number;
  };
}

// The API response may not include the top-level 'data' property
// so we define the response type directly as DashboardData
export type DashboardResponse = DashboardData; 