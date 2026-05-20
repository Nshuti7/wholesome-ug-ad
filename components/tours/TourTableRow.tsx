// components/tours/TourTableRow.tsx
"use client";
import React from "react";
import { TableRow, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Eye, Edit, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
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
import type { Tour } from "@/lib/tours/types";

interface Props {
  tour: Tour;
  onView: (url: string) => void;
  onEdit: (tour: Tour) => void;
  onDelete: (id: string) => void;
  formatDate: (iso: string) => string;
}

export const TourTableRow: React.FC<Props> = ({
  tour,
  onView,
  onEdit,
  onDelete,
  formatDate,
}) => (
  <TableRow>
    <TableCell className="max-w-[300px]">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-md overflow-hidden flex-shrink-0">
          <img
            src={tour.backgroundImage.url}
            alt={tour.title}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-medium truncate">{tour.title}</p>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {tour.description}
          </p>
        </div>
      </div>
    </TableCell>
    <TableCell className="w-[120px]">
      <Badge variant="secondary">
        {tour.daysCount}d/{tour.nightsCount}n
      </Badge>
    </TableCell>
    <TableCell className="max-w-[200px]">
      <div className="flex flex-wrap gap-1 max-h-16 overflow-hidden">
        {tour.inclusions.slice(0, 3).map((inc) => (
          <Badge key={inc} variant="outline" className="text-xs">
            {inc}
          </Badge>
        ))}
        {tour.inclusions.length > 3 && (
          <Badge variant="outline" className="text-xs">
            +{tour.inclusions.length - 3} more
          </Badge>
        )}
      </div>
    </TableCell>
    <TableCell className="w-[120px] text-sm text-muted-foreground">
      {formatDate(tour.createdAt)}
    </TableCell>
    <TableCell className="w-[80px] text-right">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => onView(tour.backgroundImage.url)}>
            <Eye className="mr-2 h-4 w-4" /> View Image
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onEdit(tour)}>
            <Edit className="mr-2 h-4 w-4" /> Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-destructive"
            onSelect={(e) => e.preventDefault()}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <span>Delete</span>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Tour</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete "{tour.title}"?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-destructive hover:bg-destructive/90"
                    onClick={() => onDelete(tour._id)}
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </TableCell>
  </TableRow>
);
