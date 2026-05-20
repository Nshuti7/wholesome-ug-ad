// components/blog/BlogTableRow.tsx
"use client";

import React from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Calendar,
  Clock,
  Edit,
  Eye,
  MoreHorizontal,
  Trash2,
} from "lucide-react";

interface Blog {
  _id: string;
  title: string;
  date: string;
  category: string;
  excerpt: string;
  image: string;
  readTime: string;
  content: string;
  cloudinaryId: string;
  createdAt: string;
  updatedAt: string;
}

interface BlogTableRowProps {
  blog: Blog;
  onEdit: (blog: Blog) => void;
  onDelete: (id: string) => void;
  formatDate: (date: string) => string;
}

export const BlogTableRow: React.FC<BlogTableRowProps> = ({
  blog,
  onEdit,
  onDelete,
  formatDate,
}) => {
  return (
    <TableRow>
      <TableCell className="max-w-0">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-md overflow-hidden flex-shrink-0">
            <img
              src={blog.image}
              alt={blog.title}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-medium truncate">{blog.title}</p>
            <p className="text-sm text-muted-foreground truncate">
              {blog.excerpt}
            </p>
          </div>
        </div>
      </TableCell>
      <TableCell className="max-w-0">
        <Badge variant="secondary" className="truncate max-w-full">
          {blog.category}
        </Badge>
      </TableCell>
      <TableCell className="max-w-0">
        <div className="flex items-center gap-1 text-sm">
          <Calendar className="h-3 w-3 flex-shrink-0" /> 
          <span className="truncate">{formatDate(blog.date)}</span>
        </div>
      </TableCell>
      <TableCell className="max-w-0">
        <div className="flex items-center gap-1 text-sm">
          <Clock className="h-3 w-3 flex-shrink-0" /> 
          <span className="truncate">{blog.readTime}</span>
        </div>
      </TableCell>
      <TableCell className="max-w-0 text-sm text-muted-foreground">
        <span className="truncate block">{formatDate(blog.createdAt)}</span>
      </TableCell>
      <TableCell className="text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(blog)}>
              <Edit className="mr-2 h-4 w-4" /> Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => window.open(blog.image, "_blank")}>
              <Eye className="mr-2 h-4 w-4" /> View Image
            </DropdownMenuItem>
            <Separator className="my-1" />
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
                  <AlertDialogTitle>Delete Blog Post</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete "{blog.title}"? This cannot
                    be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-destructive hover:bg-destructive/90"
                    onClick={() => onDelete(blog._id)}
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
