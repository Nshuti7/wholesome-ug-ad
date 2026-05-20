"use client";
import React from "react";
import { TableRow, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Eye, Trash2, CheckCircle, XCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Star } from "lucide-react";
import type { Review } from "@/lib/reviews/types";

interface Props {
  review: Review;
  onStatusUpdate: (id: string, status: 'pending' | 'approved' | 'rejected') => void;
  onDelete: (id: string) => void;
  onView: (review: Review) => void;
  formatDate: (iso: string) => string;
}

export function ReviewTableRow({
  review,
  onStatusUpdate,
  onDelete,
  onView,
  formatDate,
}: Props) {
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
        className={`h-3 w-3 ${
          i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
        }`}
      />
    ));
  };

  return (
    <TableRow>
      <TableCell className="font-medium">
        <div className="flex flex-col">
          <span className="font-semibold">{review.name}</span>
          <span className="text-sm text-muted-foreground">{review.email}</span>
        </div>
      </TableCell>
      
      <TableCell>
        <div className="flex items-center gap-1">
          {renderStars(review.rating)}
          <span className="text-sm text-muted-foreground ml-1">
            ({review.rating}/5)
          </span>
        </div>
      </TableCell>
      
      <TableCell>
        <div className="max-w-xs">
          <p className="text-sm line-clamp-2">{review.comment}</p>
        </div>
      </TableCell>
      
      <TableCell>
        <Badge variant="outline" className="capitalize">
          {review.reviewType}
        </Badge>
      </TableCell>
      
      <TableCell>
        {getStatusBadge(review.status)}
      </TableCell>
      
      <TableCell>
        <div className="flex flex-col text-sm">
          <span>{formatDate(review.createdAt)}</span>
          {review.helpfulCount > 0 && (
            <span className="text-muted-foreground">
              {review.helpfulCount} helpful
            </span>
          )}
        </div>
      </TableCell>
      
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onView(review)}>
              <Eye className="mr-2 h-4 w-4" />
              View details
            </DropdownMenuItem>
            
            <DropdownMenuSeparator />
            
            {review.status === "pending" && (
              <>
                <DropdownMenuItem 
                  onClick={() => onStatusUpdate(review._id, "approved")}
                  className="text-green-600"
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Approve
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => onStatusUpdate(review._id, "rejected")}
                  className="text-red-600"
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  Reject
                </DropdownMenuItem>
              </>
            )}
            
            {review.status === "approved" && (
              <DropdownMenuItem 
                onClick={() => onStatusUpdate(review._id, "rejected")}
                className="text-red-600"
              >
                <XCircle className="mr-2 h-4 w-4" />
                Reject
              </DropdownMenuItem>
            )}
            
            {review.status === "rejected" && (
              <DropdownMenuItem 
                onClick={() => onStatusUpdate(review._id, "approved")}
                className="text-green-600"
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Approve
              </DropdownMenuItem>
            )}
            
            <DropdownMenuSeparator />
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <DropdownMenuItem 
                  className="text-red-600"
                  onSelect={(e) => e.preventDefault()}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Review</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete this review? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => onDelete(review._id)}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
} 