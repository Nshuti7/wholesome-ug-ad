import api from '@/utils/api';
import type { 
  ReviewResponse, 
  ReviewStatsResponse, 
  SingleReviewResponse,
  ReviewFilters,
  UpdateReviewStatusRequest 
} from './types';

const BASE_URL = '/reviews';

export const reviewService = {
  // Get all reviews with filters
  async getReviews(filters: ReviewFilters = {}): Promise<ReviewResponse> {
    const params = new URLSearchParams();
    
    if (filters.status) params.append('status', filters.status);
    if (filters.reviewType) params.append('reviewType', filters.reviewType);
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());
    if (filters.sort) params.append('sort', filters.sort);

    const response = await api.get(`${BASE_URL}?${params.toString()}`);
    return response.data;
  },

  // Get review statistics
  async getReviewStats(reviewType?: 'company' | 'itinerary'): Promise<ReviewStatsResponse> {
    const params = reviewType ? `?reviewType=${reviewType}` : '';
    const response = await api.get(`${BASE_URL}/stats${params}`);
    return response.data;
  },

  // Get single review
  async getReview(id: string): Promise<SingleReviewResponse> {
    const response = await api.get(`${BASE_URL}/${id}`);
    return response.data;
  },

  // Update review status
  async updateReviewStatus(id: string, status: UpdateReviewStatusRequest): Promise<SingleReviewResponse> {
    const response = await api.put(`${BASE_URL}/${id}/status`, status);
    return response.data;
  },

  // Delete review
  async deleteReview(id: string): Promise<{ success: boolean; message: string }> {
    const response = await api.delete(`${BASE_URL}/${id}`);
    return response.data;
  },

  // Get reviews by subject (public)
  async getReviewsBySubject(reviewType: 'company' | 'itinerary', subjectId: string, page = 1, limit = 10): Promise<ReviewResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString()
    });
    
    const response = await api.get(`${BASE_URL}/${reviewType}/${subjectId}?${params.toString()}`);
    return response.data;
  },

  // Mark review as helpful
  async markHelpful(id: string): Promise<SingleReviewResponse> {
    const response = await api.post(`${BASE_URL}/${id}/helpful`);
    return response.data;
  },

  // Report review
  async reportReview(id: string): Promise<SingleReviewResponse> {
    const response = await api.post(`${BASE_URL}/${id}/report`);
    return response.data;
  }
}; 