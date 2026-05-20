"use client";
import React from "react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
} from "@/components/ui/table";
import { ReviewTableRow } from "./ReviewTableRow";
import Loader from "@/components/ui/Loader";
import type { Review } from "@/lib/reviews/types";

interface Props {
  reviews: Review[];
  loading: boolean;
  onStatusUpdate: (id: string, status: 'pending' | 'approved' | 'rejected') => void;
  onDelete: (id: string) => void;
  onView: (review: Review) => void;
  formatDate: (iso: string) => string;
}

export function ReviewTable({
  reviews,
  loading,
  onStatusUpdate,
  onDelete,
  onView,
  formatDate,
}: Props) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader />
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No reviews found.</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Reviewer</TableHead>
            <TableHead>Rating</TableHead>
            <TableHead>Comment</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="w-[50px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reviews.map((review) => (
            <ReviewTableRow
              key={review._id}
              review={review}
              onStatusUpdate={onStatusUpdate}
              onDelete={onDelete}
              onView={onView}
              formatDate={formatDate}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
} 