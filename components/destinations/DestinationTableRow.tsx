// components/destinations/DestinationTableRow.tsx
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
import { Calendar, Edit, Eye, MoreHorizontal, Trash2 } from "lucide-react";
import type { Destination } from "@/lib/destinations/types";
import { Separator } from "../ui/separator";

interface Props {
  dest: Destination;
  onEdit: (d: Destination) => void;
  onDelete: (id: string) => void;
  formatDate: (d: string) => string;
}

export const DestinationTableRow: React.FC<Props> = ({
  dest,
  onEdit,
  onDelete,
  formatDate,
}) => (
  <TableRow key={dest._id}>
    <TableCell>
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 overflow-hidden rounded">
          <img
            src={dest.backgroundImage.url}
            alt={dest.name}
            className="object-cover w-full h-full"
          />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-medium truncate">{dest.name}</p>
          <p className="text-sm text-muted-foreground truncate">
            {dest.location}
          </p>
        </div>
      </div>
    </TableCell>
    <TableCell>
      <Badge variant="secondary">{dest.region}</Badge>
    </TableCell>
    <TableCell>
      {dest.latitude && dest.longitude ? (
        <div className="text-sm">
          <div className="font-mono">
            {dest.latitude.toFixed(4)}, {dest.longitude.toFixed(4)}
          </div>
          <div className="text-xs text-muted-foreground">
            Lat, Long
          </div>
        </div>
      ) : (
        <span className="text-sm text-muted-foreground">Not set</span>
      )}
    </TableCell>
    <TableCell>
      <div className="flex items-center gap-1 text-sm">
        <Calendar className="h-4 w-4" /> {formatDate(dest.createdAt)}
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
          <DropdownMenuItem onClick={() => onEdit(dest)}>
            <Edit className="mr-2 h-4 w-4" /> Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => window.open(dest.backgroundImage.url, "_blank")}
          >
            <Eye className="mr-2 h-4 w-4" /> View Background
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => window.open(dest.googleMapsLink, "_blank")}
          >
            <Eye className="mr-2 h-4 w-4" /> View Map
          </DropdownMenuItem>
          {dest.latitude && dest.longitude && (
            <DropdownMenuItem
              onClick={() => 
                window.open(
                  `https://www.google.com/maps?q=${dest.latitude},${dest.longitude}`,
                  "_blank"
                )
              }
            >
              <Eye className="mr-2 h-4 w-4" /> View Coordinates
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
                <AlertDialogTitle>Delete Destination</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete “{dest.name}”? This cannot be
                  undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-destructive hover:bg-destructive/90"
                  onClick={() => onDelete(dest._id)}
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
