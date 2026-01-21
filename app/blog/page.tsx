"use client";

import React, { useState } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Search,
  RefreshCw,
  Plus,
  Filter,
  X,
  FileText,
  Calendar,
  User,
  Eye,
  CheckCircle,
  XCircle,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { DataTable } from "@/components/ui/data-table";
import { useBlogOperations } from "@/hooks/useBlogOperations";
import type { Blog, BlogFormData } from "@/lib/blogs/types";
import { blogFormFields, generateSlug, editSchema } from "@/lib/blogs/schema";
import { ReusableForm } from "@/components/ui/reusable-form";
import { format } from "date-fns";
import Image from "next/image";

export default function BlogPage() {
  const {
    blogs,
    loading,
    formLoading,
    handleCreate,
    handleUpdate,
    handleDelete,
  } = useBlogOperations();

  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);

  // Filter blogs
  const filteredBlogs = blogs.filter((blog) => {
    const matchesSearch =
      blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.author.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      categoryFilter === "all" || blog.category === categoryFilter;

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "published" && blog.published) ||
      (statusFilter === "draft" && !blog.published);

    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Get unique categories for filter
  const categories = Array.from(
    new Set(blogs.map((blog) => blog.category))
  ).sort();

  // Table columns
  const columns = [
    {
      key: "image",
      label: "Image",
      render: (blog: Blog) => (
        <div className="w-16 h-16 relative rounded-md overflow-hidden border">
          {blog.image ? (
            <Image
              src={blog.image}
              alt={blog.title}
              fill
              className="object-cover"
              sizes="64px"
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <FileText className="h-6 w-6 text-muted-foreground" />
            </div>
          )}
        </div>
      ),
      className: "w-20",
    },
    {
      key: "title",
      label: "Title",
      render: (blog: Blog) => (
        <div>
          <p className="font-medium">{blog.title}</p>
          <p className="text-sm text-muted-foreground line-clamp-1">
            {blog.excerpt}
          </p>
        </div>
      ),
      className: "min-w-[300px]",
    },
    {
      key: "author",
      label: "Author",
      render: (blog: Blog) => (
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-muted-foreground" />
          <span>{blog.author}</span>
        </div>
      ),
    },
    {
      key: "category",
      label: "Category",
      render: (blog: Blog) => (
        <Badge variant="outline">{blog.category}</Badge>
      ),
    },
    {
      key: "date",
      label: "Date",
      render: (blog: Blog) => (
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span>
            {format(new Date(blog.date), "MMM dd, yyyy")}
          </span>
        </div>
      ),
    },
    {
      key: "published",
      label: "Status",
      render: (blog: Blog) => (
        <Badge
          variant={blog.published ? "default" : "secondary"}
          className="flex items-center gap-1"
        >
          {blog.published ? (
            <>
              <CheckCircle className="h-3 w-3" />
              Published
            </>
          ) : (
            <>
              <XCircle className="h-3 w-3" />
              Draft
            </>
          )}
        </Badge>
      ),
    },
  ];

  const handleCreateSubmit = async (data: any) => {
    // Generate slug from title if not provided
    // Ensure date is in YYYY-MM-DD format
    const dateValue = data.date instanceof Date
      ? format(data.date, "yyyy-MM-dd")
      : data.date || format(new Date(), "yyyy-MM-dd");
    
    const formData: BlogFormData = {
      ...data,
      slug: data.slug || generateSlug(data.title),
      date: dateValue,
      published: data.published ?? true,
    };

    const success = await handleCreate(formData);
    if (success) {
      setIsCreateDialogOpen(false);
    }
    // Don't close dialog on error - form data is preserved
  };

  const handleEditSubmit = async (data: any) => {
    if (!selectedBlog) return;

    // Ensure date is in YYYY-MM-DD format
    const dateValue = data.date instanceof Date
      ? format(data.date, "yyyy-MM-dd")
      : data.date || format(new Date(selectedBlog.date), "yyyy-MM-dd");

    const formData: BlogFormData = {
      ...data,
      slug: data.slug || selectedBlog.slug,
      date: dateValue,
      published: data.published ?? selectedBlog.published ?? true,
      // If image is a string (existing URL), don't include it in FormData
      image: data.image instanceof File ? data.image : data.image || null,
    };

    const success = await handleUpdate(formData, selectedBlog._id);
    if (success) {
      setIsEditDialogOpen(false);
      setSelectedBlog(null);
    }
    // Don't close dialog on error - form data is preserved
  };

  const handleEdit = (blog: Blog) => {
    setSelectedBlog(blog);
    setIsEditDialogOpen(true);
  };

  const handleView = (blog: Blog) => {
    setSelectedBlog(blog);
    setIsViewDialogOpen(true);
  };

  const onDelete = async (id: string) => {
    await handleDelete(id);
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <SiteHeader pageTitle="Blog" />
        <div className="flex flex-1 flex-col gap-4 p-4 md:p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Blog Posts</h1>
              <p className="text-muted-foreground">
                Manage your blog posts and content
              </p>
            </div>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create Blog Post
            </Button>
          </div>

          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filters
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                <div className="flex-1 min-w-[200px]">
                  <Label htmlFor="search">Search</Label>
                  <div className="relative mt-1">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="search"
                      placeholder="Search by title, excerpt, or author..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-8"
                    />
                    {searchQuery && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute right-1 top-1 h-7 w-7 p-0"
                        onClick={() => setSearchQuery("")}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>

                <div className="w-[180px]">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={categoryFilter}
                    onValueChange={setCategoryFilter}
                  >
                    <SelectTrigger id="category" className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="w-[180px]">
                  <Label htmlFor="status">Status</Label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger id="status" className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Blog Table */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Blog Posts ({filteredBlogs.length})</CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.location.reload()}
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Refresh
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <DataTable
                data={filteredBlogs}
                columns={columns}
                loading={loading}
                onEdit={handleEdit}
                onDelete={onDelete}
                onView={handleView}
                emptyMessage="No blog posts found. Create your first blog post!"
              />
            </CardContent>
          </Card>
        </div>
      </SidebarInset>

      {/* Create Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Blog Post</DialogTitle>
          </DialogHeader>
          <ReusableForm
            fields={blogFormFields}
            onSubmit={handleCreateSubmit}
            validationSchema={editSchema}
            defaultValues={{
              published: true,
              tags: [],
            }}
            submitButtonText="Create Blog Post"
            isLoading={formLoading}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Blog Post</DialogTitle>
          </DialogHeader>
          {selectedBlog && (
            <ReusableForm
              fields={blogFormFields.map((field) => ({
                ...field,
                required: field.name === "image" ? false : field.required,
              }))}
              onSubmit={handleEditSubmit}
              validationSchema={editSchema}
              defaultValues={{
                title: selectedBlog.title,
                slug: selectedBlog.slug,
                author: selectedBlog.author,
                category: selectedBlog.category,
                date: format(new Date(selectedBlog.date), "yyyy-MM-dd"),
                readTime: selectedBlog.readTime,
                excerpt: selectedBlog.excerpt,
                content: selectedBlog.content,
                published: selectedBlog.published ?? true,
                image: selectedBlog.image, // Existing image URL
                tags: selectedBlog.tags || [],
              }}
              submitButtonText="Update Blog Post"
              isLoading={formLoading}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>View Blog Post</DialogTitle>
          </DialogHeader>
          {selectedBlog && (
            <div className="space-y-4">
              {selectedBlog.image && (
                <div className="relative w-full h-64 rounded-lg overflow-hidden border">
                  <Image
                    src={selectedBlog.image}
                    alt={selectedBlog.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 800px"
                  />
                </div>
              )}
              <div>
                <h2 className="text-2xl font-bold">{selectedBlog.title}</h2>
                <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    {selectedBlog.author}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {format(new Date(selectedBlog.date), "MMM dd, yyyy")}
                  </span>
                  <Badge variant="outline">{selectedBlog.category}</Badge>
                  <Badge
                    variant={selectedBlog.published ? "default" : "secondary"}
                  >
                    {selectedBlog.published ? "Published" : "Draft"}
                  </Badge>
                </div>
              </div>
              <Separator />
              <div>
                <h3 className="font-semibold mb-2">Excerpt</h3>
                <p className="text-muted-foreground">{selectedBlog.excerpt}</p>
              </div>
              <Separator />
              <div>
                <h3 className="font-semibold mb-2">Content</h3>
                <div
                  className="prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: selectedBlog.content }}
                />
              </div>
              <Separator />
              <div className="text-sm text-muted-foreground">
                <p>
                  <strong>Slug:</strong> {selectedBlog.slug}
                </p>
                <p>
                  <strong>Read Time:</strong> {selectedBlog.readTime}
                </p>
                {selectedBlog.tags && selectedBlog.tags.length > 0 && (
                  <div className="mt-2">
                    <strong>Tags:</strong>{" "}
                    <div className="flex flex-wrap gap-1 mt-1">
                      {selectedBlog.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                <p>
                  <strong>Created:</strong>{" "}
                  {format(
                    new Date(selectedBlog.createdAt),
                    "MMM dd, yyyy 'at' h:mm a"
                  )}
                </p>
                <p>
                  <strong>Updated:</strong>{" "}
                  {format(
                    new Date(selectedBlog.updatedAt),
                    "MMM dd, yyyy 'at' h:mm a"
                  )}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
}

