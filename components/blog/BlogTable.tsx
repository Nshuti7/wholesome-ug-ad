// components/blog/BlogTable.tsx
"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FileText } from "lucide-react";
import Loader from "@/components/ui/Loader";
import { BlogTableRow } from "./BlogTableRow";

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

interface BlogTableProps {
  blogs: Blog[];
  loading: boolean;
  searchTerm: string;
  categoryFilter: string;
  onEdit: (blog: Blog) => void;
  onDelete: (id: string) => void;
  formatDate: (date: string) => string;
}

export const BlogTable: React.FC<BlogTableProps> = ({
  blogs,
  loading,
  searchTerm,
  categoryFilter,
  onEdit,
  onDelete,
  formatDate,
}) => {
  const EmptyState = () => (
    <div className="text-center py-12">
      <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
      <h3 className="mt-4 text-lg font-medium">No blog posts found</h3>
      <p className="mt-2 text-muted-foreground">
        {searchTerm || categoryFilter !== "all"
          ? "Try adjusting your filters"
          : "Create your first blog post!"}
      </p>
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" /> Posts ({blogs.length})
        </CardTitle>
        <CardDescription>Manage published posts</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader />
          </div>
        ) : blogs.length === 0 ? (
          <EmptyState />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40%]">Title</TableHead>
                <TableHead className="w-[15%]">Category</TableHead>
                <TableHead className="w-[15%]">Date</TableHead>
                <TableHead className="w-[10%]">Read Time</TableHead>
                <TableHead className="w-[15%]">Created</TableHead>
                <TableHead className="w-[5%] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {blogs.map((blog) => (
                <BlogTableRow
                  key={blog._id}
                  blog={blog}
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
