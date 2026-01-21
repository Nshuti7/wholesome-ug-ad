"use client";

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Edit, Trash2, Eye } from "lucide-react";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

interface Column<T> {
  key: string;
  label: string;
  render?: (item: T) => React.ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  onEdit?: (item: T) => void;
  onDelete?: (id: string) => void;
  onView?: (item: T) => void;
  idField?: keyof T;
  showActions?: boolean;
  emptyMessage?: string;
}

export function DataTable<T>({
  data,
  columns,
  loading = false,
  onEdit,
  onDelete,
  onView,
  idField = "_id" as keyof T,
  showActions = true,
  emptyMessage = "No data available",
}: DataTableProps<T>) {
  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center space-x-4">
            {columns.map((_, j) => (
              <Skeleton key={j} className="h-4 w-[100px]" />
            ))}
          </div>
        ))}
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {columns.map((column) => (
            <TableHead key={column.key} className={column.className}>
              {column.label}
            </TableHead>
          ))}
          {showActions && (onEdit || onDelete || onView) && (
            <TableHead className="w-[100px]">Actions</TableHead>
          )}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((item, index) => (
          <TableRow key={String(item[idField]) || index}>
            {columns.map((column) => (
              <TableCell key={column.key} className={column.className}>
                {column.render
                  ? column.render(item)
                  : (item as any)[column.key] || ""}
              </TableCell>
            ))}
            {showActions && (onEdit || onDelete || onView) && (
              <TableCell>
                <div className="flex items-center gap-2">
                  {onView && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onView(item)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  )}
                  {onEdit && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(item)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  )}
                  {onDelete && (
                    <ConfirmDialog
                      trigger={
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      }
                      title="Delete Item"
                      description="Are you sure you want to delete this item? This action cannot be undone."
                      confirmText="Delete"
                      onConfirm={() => onDelete(String(item[idField]))}
                      isDestructive
                    />
                  )}
                </div>
              </TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
} 