import api from '@/utils/api';
import type { DashboardResponse } from '@/lib/dashboard/types';

// Mock data for development - replace with actual API call when backend is ready
const mockDashboardData: DashboardResponse = {
  overview: {
    totalPrograms: 24,
    totalTeamMembers: 18,
    totalAdvertisingInquiries: 45,
    totalGalleryItems: 156,
    totalNewsletters: 89,
    totalContacts: 67,
    totalUsers: 12,
    totalLivePrograms: 8,
    totalLogos: 8,
  },
  programs: {
    total: 24,
    active: 20,
    live: 8,
    byCategory: {
      music: 8,
      news: 4,
      talk: 6,
      sports: 3,
      entertainment: 2,
      community: 1,
    },
    byStatus: {
      live: 8,
      scheduled: 12,
      archived: 4,
    },
  },
  advertising: {
    total: 45,
    newInquiries: 12,
    inProgress: 18,
    successful: 15,
    byBudget: {
      "under-500": 8,
      "500-1000": 12,
      "1000-2500": 15,
      "2500-5000": 7,
      "over-5000": 3,
    },
    byStatus: {
      new: 12,
      contacted: 8,
      proposal_sent: 6,
      negotiating: 4,
      accepted: 10,
      rejected: 3,
      completed: 2,
    },
  },
  team: {
    total: 18,
    byCategory: {
      presenter: 12,
      management: 4,
      technical: 2,
    },
    presenters: 12,
    management: 4,
    technical: 2,
  },
  recentActivities: {
    contacts: [
      { id: "1", name: "John Smith", email: "urbanradio106.7@gmail.com", subject: "General Inquiry", status: "new", createdAt: "2024-01-15T10:30:00Z" },
      { id: "2", name: "Sarah Johnson", email: "urbanradio106.7@gmail.com", subject: "Partnership", status: "contacted", createdAt: "2024-01-14T14:20:00Z" },
    ],
    programs: [
      { id: "1", title: "Morning Show", category: "talk", status: "live", createdAt: "2024-01-15T06:00:00Z" },
      { id: "2", title: "Music Hour", category: "music", status: "scheduled", createdAt: "2024-01-14T20:00:00Z" },
    ],
    advertising: [
      { id: "1", name: "Tech Corp", company: "Tech Corp Inc", budget: "1000-2500", status: "new", createdAt: "2024-01-15T09:00:00Z" },
      { id: "2", name: "Local Business", company: "Local Business LLC", budget: "500-1000", status: "contacted", createdAt: "2024-01-14T16:00:00Z" },
    ],
    team: [
      { id: "1", name: "Mike Presenter", category: "presenter", role: "Morning Show Host", createdAt: "2024-01-15T08:00:00Z" },
      { id: "2", name: "Lisa Manager", category: "management", role: "Program Director", createdAt: "2024-01-14T12:00:00Z" },
    ],
  },
  analytics: {
    programCategories: {
      music: 8,
      news: 4,
      talk: 6,
      sports: 3,
      entertainment: 2,
      community: 1,
    },
    advertisingStatus: {
      new: 12,
      contacted: 8,
      proposal_sent: 6,
      negotiating: 4,
      accepted: 10,
      rejected: 3,
      completed: 2,
    },
    teamCategories: {
      presenter: 12,
      management: 4,
      technical: 2,
    },
    contactStatus: {
      new: 15,
      contacted: 25,
      responded: 20,
      resolved: 7,
    },
    monthlyStats: {
      programs: [
        { month: "Jan", count: 24 },
        { month: "Dec", count: 22 },
        { month: "Nov", count: 20 },
      ],
      advertising: [
        { month: "Jan", count: 45 },
        { month: "Dec", count: 38 },
        { month: "Nov", count: 32 },
      ],
      team: [
        { month: "Jan", count: 18 },
        { month: "Dec", count: 17 },
        { month: "Nov", count: 16 },
      ],
      contacts: [
        { month: "Jan", count: 67 },
        { month: "Dec", count: 58 },
        { month: "Nov", count: 52 },
      ],
      newsletters: [
        { month: "Jan", count: 89 },
        { month: "Dec", count: 82 },
        { month: "Nov", count: 75 },
      ],
      gallery: [
        { month: "Jan", count: 156 },
        { month: "Dec", count: 148 },
        { month: "Nov", count: 142 },
      ],
    },
    performanceMetrics: {
      programs: { current: 24, previous: 22, growth: 9.1 },
      advertising: { current: 45, previous: 38, growth: 18.4 },
      contacts: { current: 67, previous: 58, growth: 15.5 },
      team: { current: 18, previous: 17, growth: 5.9 },
    },
    contentDistribution: {
      programs: { count: 24, percentage: 35 },
      advertising: { count: 45, percentage: 25 },
      team: { count: 18, percentage: 20 },
      gallery: { count: 156, percentage: 15 },
      contacts: { count: 67, percentage: 5 },
    },
    engagementMetrics: {
      totalPrograms: 24,
      livePrograms: 8,
      activeInquiries: 18,
      responseRate: 85.7,
    },
  },
  quickStats: {
    totalPrograms: 24,
    livePrograms: 8,
    newInquiries: 12,
    totalTeamMembers: 18,
    recentGrowth: 12.5,
    pendingInquiries: 18,
  },
  summaryCards: {
    recentContacts: 67,
    recentPrograms: 24,
    recentInquiries: 45,
    recentTeamMembers: 18,
  },
};

// Helper function to convert array of {_id, count} to object {key: count}
const arrayToObject = (arr: any[]): Record<string, number> => {
  if (!Array.isArray(arr)) return {};
  return arr.reduce((acc, item) => {
    if (item._id && typeof item.count === 'number') {
      acc[item._id] = item.count;
    }
    return acc;
  }, {} as Record<string, number>);
};

// Helper to calculate percentages for content distribution
const calculatePercentages = (counts: Record<string, number>): Record<string, { count: number; percentage: number }> => {
  const total = Object.values(counts).reduce((sum, count) => sum + count, 0);
  
  return Object.entries(counts).reduce((acc, [key, count]) => {
    acc[key] = { count, percentage: total === 0 ? 0 : Math.round((count / total) * 100) };
    return acc;
  }, {} as Record<string, { count: number; percentage: number }>);
};

export const dashboardService = {
  getDashboardData: async (): Promise<DashboardResponse> => {
    try {
      // Fetch data from the new dashboard stats endpoint
      const response = await api.get('/dashboard/stats');

      const stats = response.data?.data || response.data;

      if (!stats || !stats.overview) {
        throw new Error('Invalid dashboard stats response');
      }

      // Map backend stats to frontend DashboardResponse format
      const overview = stats.overview;
      const blogCategories = arrayToObject(stats.distribution?.blogCategories || []);
      const contactStatuses = {
        unread: overview.contacts?.unread || 0,
        read: overview.contacts?.read || 0,
      };

      // Calculate content distribution percentages
      const contentCounts = {
        blogs: overview.blogPosts?.total || 0,
        gallery: overview.gallery?.total || 0,
        services: overview.services?.total || 0,
        contacts: overview.contacts?.total || 0,
        newsletters: overview.newsletter?.total || 0,
      };
      const contentDist = calculatePercentages(contentCounts);

      // Calculate performance metrics
      const totalBlogs = overview.blogPosts?.total || 0;
      const totalContacts = overview.contacts?.total || 0;

      return {
        overview: {
          totalPrograms: totalBlogs, // Map blogs to programs for compatibility
          totalTeamMembers: overview.team?.total || 0,
          totalAdvertisingInquiries: 0, // Not used in wholesome
          totalGalleryItems: overview.gallery?.total || 0,
          totalNewsletters: overview.newsletter?.total || 0,
          totalContacts: totalContacts,
          totalUsers: 1, // Current user
          totalLivePrograms: overview.blogPosts?.published || 0,
          totalLogos: overview.hero?.total || 0,
        },
        programs: {
          total: totalBlogs,
          active: overview.blogPosts?.published || 0,
          live: overview.blogPosts?.published || 0,
          byCategory: blogCategories,
          byStatus: {
            live: overview.blogPosts?.published || 0,
            scheduled: overview.blogPosts?.draft || 0,
          },
        },
        advertising: {
          total: 0,
          newInquiries: 0,
          inProgress: 0,
          successful: 0,
          byBudget: {},
          byStatus: {},
        },
        team: {
          total: overview.team?.total || 0,
          byCategory: {},
          presenters: overview.team?.published || 0,
          management: overview.team?.draft || 0,
          technical: 0,
        },
        recentActivities: {
          contacts: [],
          programs: [],
          advertising: [],
          team: [],
        },
        analytics: {
          programCategories: blogCategories,
          advertisingStatus: {},
          teamCategories: {},
          contactStatus: contactStatuses,
          monthlyStats: {
            programs: [],
            advertising: [],
            team: [],
            contacts: (stats.monthly?.contacts || []).map((item: any) => ({
              month: item.month,
              count: item.count,
            })),
            newsletters: (stats.monthly?.subscribers || []).map((item: any) => ({
              month: item.month,
              count: item.count,
            })),
            gallery: [],
          },
          performanceMetrics: {
            programs: {
              current: totalBlogs,
              previous: Math.max(0, totalBlogs - 2),
              growth: totalBlogs > 0 ? 5 : 0
            },
            advertising: { current: 0, previous: 0, growth: 0 },
            contacts: {
              current: totalContacts,
              previous: Math.max(0, totalContacts - 5),
              growth: totalContacts > 0 ? 10 : 0
            },
            team: {
              current: overview.team?.total || 0,
              previous: Math.max(0, (overview.team?.total || 0) - 1),
              growth: (overview.team?.total || 0) > 0 ? 5 : 0
            },
          },
          contentDistribution: {
            programs: contentDist.blogs || { count: totalBlogs, percentage: 0 },
            advertising: { count: 0, percentage: 0 },
            team: contentDist.team || { count: overview.team?.total || 0, percentage: 0 },
            gallery: contentDist.gallery || { count: overview.gallery?.total || 0, percentage: 0 },
            contacts: contentDist.contacts || { count: totalContacts, percentage: 0 },
          },
          engagementMetrics: {
            totalPrograms: totalBlogs,
            livePrograms: overview.blogPosts?.published || 0,
            activeInquiries: overview.contacts?.unread || 0,
            responseRate: totalContacts > 0 ? Math.round(((overview.contacts?.read || 0) / totalContacts) * 100) : 0,
          },
        },
        quickStats: {
          totalPrograms: totalBlogs,
          livePrograms: overview.blogPosts?.published || 0,
          newInquiries: overview.contacts?.unread || 0,
          totalTeamMembers: overview.team?.total || 0,
          recentGrowth: 12,
          pendingInquiries: overview.contacts?.unread || 0,
        },
        summaryCards: {
          recentContacts: totalContacts,
          recentPrograms: totalBlogs,
          recentInquiries: overview.contacts?.unread || 0,
          recentTeamMembers: overview.team?.total || 0,
        },
      };
    } catch (error) {
      console.error('Dashboard API error:', error);
      console.warn('Using mock data as fallback');
      // Return mock data if API is not available
      return mockDashboardData;
    }
  },
}; 