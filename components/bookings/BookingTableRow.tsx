"use client";

import React from "react";
import { TableRow, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { 
  Calendar, 
  Edit, 
  Eye, 
  MoreHorizontal, 
  Trash2, 
  Mail, 
  Phone,
  MapPin,
  Users,
  DollarSign,
  Globe,
  Smartphone,
  FileText,
  Check
} from "lucide-react";
import type { Booking } from "@/lib/bookings/types";
import { Separator } from "../ui/separator";
import { getStatusColor, getSourceIcon, formatDate, BOOKING_STATUSES } from "@/lib/bookings/schema";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Props {
  booking: Booking;
  onEdit: (b: Booking) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: string) => void;
  formatDate: (d: string) => string;
}

// Icon mapping for source types
const SourceIconMap = {
  Globe: Globe,
  Phone: Phone,
  Mail: Mail,
  Smartphone: Smartphone,
  FileText: FileText,
};

export const BookingTableRow: React.FC<Props> = ({
  booking,
  onEdit,
  onDelete,
  onStatusChange,
  formatDate,
}) => {
  const SourceIcon = SourceIconMap[getSourceIcon(booking.source) as keyof typeof SourceIconMap] || FileText;

  return (
    <TableRow key={booking._id}>
      <TableCell>
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-sm font-medium text-primary">
              {booking.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-medium truncate">{booking.name}</p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Mail className="h-3 w-3" />
              <span className="truncate">{booking.email}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Phone className="h-3 w-3" />
              <span>{booking.phoneCountryCode}{booking.phone}</span>
            </div>
          </div>
        </div>
      </TableCell>
      
      <TableCell>
        {booking.preferredTour ? (
          <div className="space-y-1">
            <p className="font-medium text-sm">{booking.preferredTour.title}</p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              <span>Tour · {booking.preferredTour.daysCount}d/{booking.preferredTour.nightsCount}n</span>
            </div>
          </div>
        ) : booking.preferredExperience ? (
          <div className="space-y-1">
            <p className="font-medium text-sm">{booking.preferredExperience.title}</p>
            <span className="text-xs text-muted-foreground">
              Experience{booking.preferredExperience.category ? ` · ${booking.preferredExperience.category}` : ""}
            </span>
          </div>
        ) : booking.preferredDestination ? (
          <div className="space-y-1">
            <p className="font-medium text-sm">{booking.preferredDestination.name}</p>
            <span className="text-xs text-muted-foreground">
              Destination{booking.preferredDestination.region ? ` · ${booking.preferredDestination.region}` : ""}
            </span>
          </div>
        ) : (
          <span className="text-sm text-muted-foreground">No selection</span>
        )}
      </TableCell>
      
      <TableCell>
        <div className="flex items-center gap-1 text-sm">
          <Calendar className="h-4 w-4" />
          {formatDate(booking.travelDate)}
        </div>
      </TableCell>
      
      <TableCell>
        <div className="flex items-center gap-1 text-sm">
          <Users className="h-4 w-4" />
          {booking.numberOfPeople}
        </div>
      </TableCell>
      
      <TableCell>
        <div className="flex items-center gap-2">
          <Select
            value={booking.status}
            onValueChange={(value) => onStatusChange(booking._id, value)}
          >
            <SelectTrigger className="w-32 h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {BOOKING_STATUSES.map((status) => (
                <SelectItem key={status} value={status} className="text-xs">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${getStatusColor(status)}`} />
                    {status.charAt(0).toUpperCase() + status.slice(1).replace(/([A-Z])/g, ' $1')}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </TableCell>
      
      <TableCell>
        <div className="flex items-center gap-1 text-sm">
          <Calendar className="h-4 w-4" />
          {formatDate(booking.createdAt)}
        </div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <SourceIcon className="h-3 w-3" />
          <span>{booking.source.replace('_', ' ')}</span>
        </div>
      </TableCell>
      
      <TableCell className="text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(booking)}>
              <Edit className="mr-2 h-4 w-4" /> Edit Details
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => window.open(`mailto:${booking.email}`, "_blank")}
            >
              <Mail className="mr-2 h-4 w-4" /> Send Email
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => window.open(`tel:${booking.phoneCountryCode}${booking.phone}`, "_blank")}
            >
              <Phone className="mr-2 h-4 w-4" /> Call
            </DropdownMenuItem>
            {booking.preferredTour && booking.preferredTour._id && (
              <DropdownMenuItem
                onClick={() => {
                  if (booking.preferredTour?._id) {
                    window.open(`/tours/${booking.preferredTour._id}`, "_blank");
                  }
                }}
              >
                <Eye className="mr-2 h-4 w-4" /> View Tour
              </DropdownMenuItem>
            )}
            <DropdownMenuItem>
              <Separator className="my-1" />
            </DropdownMenuItem>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <DropdownMenuItem
                  className="text-destructive"
                  onSelect={(e) => e.preventDefault()}
                >
                  <Trash2 className="mr-2 h-4 w-4" /> Delete
                </DropdownMenuItem>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Booking</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete the booking for "{booking.name}"? This cannot be
                    undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-destructive hover:bg-destructive/90"
                    onClick={() => onDelete(booking._id)}
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
}; 