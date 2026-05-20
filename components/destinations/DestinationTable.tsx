// components/destinations/DestinationTable.tsx
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
import { FileText } from "lucide-react";
import Loader from "@/components/ui/Loader";
import type { Destination } from "@/lib/destinations/types";
import { DestinationTableRow } from "./DestinationTableRow";

interface Props {
  items: Destination[];
  loading: boolean;
  onEdit: (d: Destination) => void;
  onDelete: (id: string) => void;
  formatDate: (d: string) => string;
}

export const DestinationTable: React.FC<Props> = ({
  items,
  loading,
  onEdit,
  onDelete,
  formatDate,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" /> Destinations ({items.length})
        </CardTitle>
        <CardDescription>Manage all destinations</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader />
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-medium">No destinations</h3>
            <p className="mt-2 text-muted-foreground">Try creating one above</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Region</TableHead>
                <TableHead>Coordinates</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((d) => (
                <DestinationTableRow
                  key={d._id}
                  dest={d}
                  onEdit={onEdit}
                  onDelete={onDelete}
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
