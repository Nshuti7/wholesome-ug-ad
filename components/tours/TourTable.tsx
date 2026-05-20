// components/tours/TourTable.tsx
"use client";
import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
} from "@/components/ui/table";
import { FileText } from "lucide-react";
import Loader from "@/components/ui/Loader";
import { TourTableRow } from "./TourTableRow";
import type { Tour } from "@/lib/tours/types";

interface Props {
  tours: Tour[];
  loading: boolean;
  onView: (url: string) => void;
  onEdit: (tour: Tour) => void;
  onDelete: (id: string) => void;
  formatDate: (iso: string) => string;
}

export const TourTable: React.FC<Props> = ({
  tours,
  loading,
  onView,
  onEdit,
  onDelete,
  formatDate,
}) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <FileText className="h-5 w-5" /> Tours ({tours.length})
      </CardTitle>
      <CardDescription>Manage your itineraries</CardDescription>
    </CardHeader>
    <CardContent>
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <Loader />
        </div>
      ) : tours.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-medium">No tours found</h3>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[300px]">Title</TableHead>
                <TableHead className="w-[120px]">Duration</TableHead>
                <TableHead className="min-w-[200px]">Inclusions</TableHead>
                <TableHead className="w-[120px]">Created</TableHead>
                <TableHead className="w-[80px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tours.map((tour) => (
                <TourTableRow
                  key={tour._id}
                  tour={tour}
                  onView={onView}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  formatDate={formatDate}
                />
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </CardContent>
  </Card>
);
