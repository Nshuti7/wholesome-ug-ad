"use client";
import React, { useState, useEffect } from "react";
import { PageLayout } from "@/components/layouts/page-layout";
import { ReviewPageHeader } from "@/components/reviews/ReviewPageHeader";
import { ReviewFilters } from "@/components/reviews/ReviewFilters";
import { ReviewTable } from "@/components/reviews/ReviewTable";
import { ReviewDetailDialog } from "@/components/reviews/ReviewDetailDialog";
import { FunctionalPagination } from "@/components/ui/pagination";
import { useReviewOperations } from "@/hooks/useReviewOperations";
import type { Review, ReviewFilters as ReviewFiltersType, ReviewStats } from "@/lib/reviews/types";

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<ReviewStats>({
    totalReviews: 0,
    averageRating: 0,
    pendingReviews: 0,
    approvedReviews: 0,
    rejectedReviews: 0,
    ratingDistribution: {}
  });
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalReviews: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });

  const [filters, setFilters] = useState<ReviewFiltersType>({
    page: 1,
    limit: 10,
    sort: "-createdAt",
  });

  const { updateReviewStatus, deleteReview, getReviews, getReviewStats } = useReviewOperations();

  // Load reviews
  const loadReviews = async () => {
    try {
      setLoading(true);
      const response = await getReviews(filters);
      setReviews(response.data);
      setPagination(response.pagination);
    } catch (error) {
      // Error handling is done in the hook
    } finally {
      setLoading(false);
    }
  };

  // Load stats
  const loadStats = async () => {
    try {
      setStatsLoading(true);
      const response = await getReviewStats();
      setStats(response.data);
    } catch (error) {
      // Error handling is done in the hook
    } finally {
      setStatsLoading(false);
    }
  };

  // Load data on mount and when filters change
  useEffect(() => {
    loadReviews();
  }, [filters]);

  useEffect(() => {
    loadStats();
  }, []);

  // Handle status update
  const handleStatusUpdate = async (id: string, status: 'pending' | 'approved' | 'rejected') => {
    const success = await updateReviewStatus(id, status);
    if (success) {
      // Reload data
      loadReviews();
      loadStats();
      
      // Close dialog if open
      if (selectedReview?._id === id) {
        setDetailDialogOpen(false);
        setSelectedReview(null);
      }
    }
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    const success = await deleteReview(id);
    if (success) {
      // Reload data
      loadReviews();
      loadStats();
    }
  };

  // Handle view review
  const handleViewReview = (review: Review) => {
    setSelectedReview(review);
    setDetailDialogOpen(true);
  };

  // Handle filters change
  const handleFiltersChange = (newFilters: ReviewFiltersType) => {
    setFilters(newFilters);
  };

  // Handle clear filters
  const handleClearFilters = () => {
    setFilters({
      page: 1,
      limit: 10,
      sort: "-createdAt",
    });
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

  // Format date
  const formatDate = (iso: string) => {
    return new Date(iso).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <PageLayout pageTitle="Reviews" className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-6">
        <div className="px-4 lg:px-6">
          <ReviewPageHeader stats={stats} loading={statsLoading} />
        </div>

        <div className="px-4 lg:px-6 space-y-6">
          <ReviewFilters
            filters={filters}
            onFiltersChange={handleFiltersChange}
            onClearFilters={handleClearFilters}
            totalReviews={pagination.totalReviews}
          />

          <ReviewTable
            reviews={reviews}
            loading={loading}
            onStatusUpdate={handleStatusUpdate}
            onDelete={handleDelete}
            onView={handleViewReview}
            formatDate={formatDate}
          />

          {pagination.totalPages > 1 && (
            <div className="flex justify-center">
              <FunctionalPagination
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                onPageChange={handlePageChange}
                hasNextPage={pagination.hasNextPage}
                hasPrevPage={pagination.hasPrevPage}
              />
            </div>
          )}
        </div>

        <ReviewDetailDialog
          review={selectedReview}
          open={detailDialogOpen}
          onOpenChange={setDetailDialogOpen}
          onStatusUpdate={handleStatusUpdate}
        />
      </div>
    </PageLayout>
  );
} 