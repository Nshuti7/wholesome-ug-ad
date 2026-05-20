import { useState } from "react";
import { toast } from "sonner";
import { reviewService } from "@/lib/reviews/service";
import type { Review, ReviewFilters, ReviewStats } from "@/lib/reviews/types";

export function useReviewOperations() {
  const [loading, setLoading] = useState(false);

  const updateReviewStatus = async (
    id: string,
    status: "pending" | "approved" | "rejected",
  ) => {
    try {
      setLoading(true);
      await reviewService.updateReviewStatus(id, { status });
      toast.success(`Review ${status} successfully`);
      return true;
    } catch (error) {
      console.error("Error updating review status:", error);
      toast.error("Failed to update review status");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteReview = async (id: string) => {
    try {
      setLoading(true);
      await reviewService.deleteReview(id);
      toast.success("Review deleted successfully");
      return true;
    } catch (error) {
      console.error("Error deleting review:", error);
      toast.error("Failed to delete review");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const getReviews = async (filters: ReviewFilters) => {
    try {
      setLoading(true);
      const response = await reviewService.getReviews(filters);
      return response;
    } catch (error) {
      console.error("Error loading reviews:", error);
      toast.error("Failed to load reviews");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getReviewStats = async () => {
    try {
      setLoading(true);
      const response = await reviewService.getReviewStats();
      return response;
    } catch (error) {
      console.error("Error loading review stats:", error);
      toast.error("Failed to load review statistics");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    updateReviewStatus,
    deleteReview,
    getReviews,
    getReviewStats,
  };
} 