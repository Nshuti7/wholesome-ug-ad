"use client";

import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
} from "@/components/ui/table";
import { Calendar, Users } from "lucide-react";
import Loader from "@/components/ui/Loader";
import type { Booking } from "@/lib/bookings/types";
import { BookingTableRow } from "./BookingTableRow";

interface Props {
  items: Booking[];
  loading: boolean;
  onEdit: (b: Booking) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: string) => void;
  formatDate: (d: string) => string;
}

export const BookingTable: React.FC<Props> = ({
  items,
  loading,
  onEdit,
  onDelete,
  onStatusChange,
  formatDate,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" /> Bookings ({items.length})
        </CardTitle>
        <CardDescription>Manage all tour bookings</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader />
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-medium">No bookings</h3>
            <p className="mt-2 text-muted-foreground">
              No bookings match your current filters
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Tour</TableHead>
                <TableHead>Travel Date</TableHead>
                <TableHead>People</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((booking) => (
                <BookingTableRow
                  key={booking._id}
                  booking={booking}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onStatusChange={onStatusChange}
                  formatDate={formatDate}
                />
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}; 