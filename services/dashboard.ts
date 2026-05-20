import api from '@/utils/api';
import type { DashboardResponse } from '@/lib/dashboard/types';

export const dashboardService = {
  getDashboardData: async (): Promise<DashboardResponse> => {
    const response = await api.get('/dashboard');
    return response.data;
  },
}; 