export interface Review {
  _id: string;
  name: string;
  email: string;
  rating: number;
  title: string;
  comment: string;
  reviewType: 'company' | 'itinerary';
  subjectId: string;
  subjectModel: 'Itinerary' | 'Company';
  status: 'pending' | 'approved' | 'rejected';
  isVerified: boolean;
  helpfulCount: number;
  reportedCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewStats {
  totalReviews: number;
  averageRating: number;
  pendingReviews: number;
  approvedReviews: number;
  rejectedReviews: number;
  ratingDistribution: {
    [key: number]: number;
  };
}

export interface ReviewPagination {
  currentPage: number;
  totalPages: number;
  totalReviews: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface ReviewResponse {
  success: boolean;
  data: Review[];
  pagination: ReviewPagination;
}

export interface ReviewStatsResponse {
  success: boolean;
  data: ReviewStats;
}

export interface SingleReviewResponse {
  success: boolean;
  data: Review;
}

export interface ReviewFilters {
  status?: 'pending' | 'approved' | 'rejected' | '';
  reviewType?: 'company' | 'itinerary' | '';
  page?: number;
  limit?: number;
  sort?: string;
}

export interface UpdateReviewStatusRequest {
  status: 'pending' | 'approved' | 'rejected';
} 