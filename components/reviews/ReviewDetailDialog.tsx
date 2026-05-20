"use client";
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Star, Calendar, Mail, User, MapPin, Clock } from "lucide-react";
import type { Review } from "@/lib/reviews/types";
import api from "@/utils/api";

interface Itinerary {
  _id: string;
  title: string;
  description: string;
  daysCount: number;
  nightsCount: number;
  backgroundImage: {
    url: string;
    cloudinaryId: string;
  };
}

interface ReviewDetailDialogProps {
  review: Review | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStatusUpdate: (id: string, status: 'pending' | 'approved' | 'rejected') => void;
}

export function ReviewDetailDialog({
  review,
  open,
  onOpenChange,
  onStatusUpdate,
}: ReviewDetailDialogProps) {
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [loadingItinerary, setLoadingItinerary] = useState(false);

  useEffect(() => {
    const fetchItinerary = async () => {
      if (review && review.reviewType === 'itinerary' && review.subjectId) {
        setLoadingItinerary(true);
        try {
          const response = await api.get(`/itineraries/${review.subjectId}`);
          if (response.data.success) {
            setItinerary(response.data.data);
          }
        } catch (error) {
          console.error('Error fetching itinerary:', error);
        } finally {
          setLoadingItinerary(false);
        }
      } else {
        setItinerary(null);
      }
    };

    fetchItinerary();
  }, [review]);

  if (!review) return null;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case "approved":
        return <Badge variant="default" className="bg-green-100 text-green-800">Approved</Badge>;
      case "rejected":
        return <Badge variant="destructive" className="bg-red-100 text-red-800">Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-5 w-5 ${
          i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
        }`}
      />
    ));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Review Details
            {getStatusBadge(review.status)}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Reviewer Information */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <User className="h-4 w-4" />
              Reviewer Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-muted-foreground">Name</label>
                <p className="text-sm">{review.name}</p>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                  <Mail className="h-3 w-3" />
                  Email
                </label>
                <p className="text-sm">{review.email}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Itinerary Information (if review type is itinerary) */}
          {review.reviewType === 'itinerary' && (
            <>
              <div className="space-y-3">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Itinerary Information
                </h3>
                {loadingItinerary ? (
                  <div className="text-sm text-muted-foreground">Loading itinerary details...</div>
                ) : itinerary ? (
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="h-16 w-16 rounded-md overflow-hidden flex-shrink-0">
                        <img
                          src={itinerary.backgroundImage.url}
                          alt={itinerary.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm truncate">{itinerary.title}</h4>
                        <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                          {itinerary.description}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="outline" className="text-xs">
                            <Clock className="h-3 w-3 mr-1" />
                            {itinerary.daysCount}d/{itinerary.nightsCount}n
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
                    Itinerary not found or has been deleted
                  </div>
                )}
              </div>
              <Separator />
            </>
          )}

          {/* Review Details */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Review Details</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Rating</label>
                <div className="flex items-center gap-2">
                  {renderStars(review.rating)}
                  <span className="text-sm text-muted-foreground">
                    ({review.rating} out of 5 stars)
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Review Type</label>
                <Badge variant="outline" className="capitalize">
                  {review.reviewType}
                </Badge>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Title</label>
                <div className="p-3 bg-muted rounded-md">
                  <p className="text-sm font-semibold">{review.title || 'No title provided'}</p>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Comment</label>
                <div className="p-3 bg-muted rounded-md">
                  <p className="text-sm whitespace-pre-wrap">{review.comment}</p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Metadata */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Additional Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  Created
                </label>
                <p className="text-sm">{formatDate(review.createdAt)}</p>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-muted-foreground">Helpful Count</label>
                <p className="text-sm">{review.helpfulCount}</p>
              </div>
              {review.reportedCount > 0 && (
                <div className="space-y-1">
                  <label className="text-sm font-medium text-muted-foreground">Reported Count</label>
                  <p className="text-sm text-red-600">{review.reportedCount}</p>
                </div>
              )}
              <div className="space-y-1">
                <label className="text-sm font-medium text-muted-foreground">Verified</label>
                <p className="text-sm">
                  {review.isVerified ? (
                    <Badge variant="default" className="bg-green-100 text-green-800">Verified</Badge>
                  ) : (
                    <Badge variant="outline">Not Verified</Badge>
                  )}
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Actions */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Actions</h3>
            <div className="flex flex-wrap gap-2">
              {review.status === "pending" && (
                <>
                  <Button
                    onClick={() => onStatusUpdate(review._id, "approved")}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Approve Review
                  </Button>
                  <Button
                    onClick={() => onStatusUpdate(review._id, "rejected")}
                    variant="destructive"
                  >
                    Reject Review
                  </Button>
                </>
              )}
              
              {review.status === "approved" && (
                <Button
                  onClick={() => onStatusUpdate(review._id, "rejected")}
                  variant="destructive"
                >
                  Reject Review
                </Button>
              )}
              
              {review.status === "rejected" && (
                <Button
                  onClick={() => onStatusUpdate(review._id, "approved")}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Approve Review
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 