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
  Image as ImageIcon,
  Calendar,
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
import { useGalleryOperations, type GalleryFormData } from "@/hooks/useGalleryOperations";
import type { GalleryItem } from "@/lib/gallery/types";
import { galleryFormFields, editSchema, GALLERY_CATEGORIES } from "@/lib/gallery/schema";
import { ReusableForm } from "@/components/ui/reusable-form";
import { format } from "date-fns";
import Image from "next/image";

export default function GalleryPage() {
  const {
    galleryItems,
    loading,
    formLoading,
    handleCreate,
    handleUpdate,
    handleDelete,
  } = useGalleryOperations();

  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

  // Filter gallery items
  const filteredItems = galleryItems.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      categoryFilter === "all" || item.category === categoryFilter;

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "published" && item.published) ||
      (statusFilter === "draft" && !item.published);

    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Get unique categories for filter
  const categories = Array.from(
    new Set(galleryItems.map((item) => item.category))
  ).sort();

  // Table columns
  const columns = [
    {
      key: "image",
      label: "Image",
      render: (item: GalleryItem) => (
        <div className="w-16 h-16 relative rounded-md overflow-hidden border">
          {item.image ? (
            <Image
              src={item.image}
              alt={item.title}
              fill
              className="object-cover"
              sizes="64px"
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <ImageIcon className="h-6 w-6 text-muted-foreground" />
            </div>
          )}
        </div>
      ),
      className: "w-20",
    },
    {
      key: "title",
      label: "Title",
      render: (item: GalleryItem) => (
        <div>
          <p className="font-medium">{item.title}</p>
          {item.description && (
            <p className="text-sm text-muted-foreground line-clamp-1">
              {item.description}
            </p>
          )}
        </div>
      ),
      className: "min-w-[200px]",
    },
    {
      key: "category",
      label: "Category",
      render: (item: GalleryItem) => (
        <Badge variant="outline" className="capitalize">{item.category}</Badge>
      ),
    },
    {
      key: "order",
      label: "Order",
      render: (item: GalleryItem) => (
        <span className="text-sm">{item.order ?? "-"}</span>
      ),
    },
    {
      key: "published",
      label: "Status",
      render: (item: GalleryItem) => (
        <Badge
          variant={item.published ? "default" : "secondary"}
          className="flex items-center gap-1"
        >
          {item.published ? (
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
    {
      key: "createdAt",
      label: "Created",
      render: (item: GalleryItem) => (
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span>
            {format(new Date(item.createdAt), "MMM dd, yyyy")}
          </span>
        </div>
      ),
    },
  ];

  const handleCreateSubmit = async (data: any) => {
    const formData: GalleryFormData = {
      ...data,
      published: data.published ?? true,
      order: data.order ? Number(data.order) : undefined,
    };

    const success = await handleCreate(formData);
    if (success) {
      setIsCreateDialogOpen(false);
    }
  };

  const handleEditSubmit = async (data: any) => {
    if (!selectedItem) return;

    const formData: GalleryFormData = {
      ...data,
      published: data.published ?? selectedItem.published ?? true,
      order: data.order ? Number(data.order) : selectedItem.order,
      image: data.image instanceof File ? data.image : data.image || null,
    };

    const success = await handleUpdate(formData, selectedItem._id);
    if (success) {
      setIsEditDialogOpen(false);
      setSelectedItem(null);
    }
  };

  const handleEdit = (item: GalleryItem) => {
    setSelectedItem(item);
    setIsEditDialogOpen(true);
  };

  const handleView = (item: GalleryItem) => {
    setSelectedItem(item);
    setIsViewDialogOpen(true);
  };

  const onDelete = async (id: string) => {
    await handleDelete(id);
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <SiteHeader pageTitle="Gallery" />
        <div className="flex flex-1 flex-col gap-4 p-4 md:p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Gallery</h1>
              <p className="text-muted-foreground">
                Manage your gallery items and images
              </p>
            </div>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Gallery Item
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
                      placeholder="Search by title, description, or category..."
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

          {/* Gallery Table */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Gallery Items ({filteredItems.length})</CardTitle>
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
                data={filteredItems}
                columns={columns}
                loading={loading}
                onEdit={handleEdit}
                onDelete={onDelete}
                onView={handleView}
                emptyMessage="No gallery items found. Create your first gallery item!"
              />
            </CardContent>
          </Card>
        </div>
      </SidebarInset>

      {/* Create Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Gallery Item</DialogTitle>
          </DialogHeader>
          <ReusableForm
            fields={galleryFormFields}
            onSubmit={handleCreateSubmit}
            validationSchema={editSchema}
            defaultValues={{
              published: true,
              order: 0,
            }}
            submitButtonText="Create Gallery Item"
            isLoading={formLoading}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Gallery Item</DialogTitle>
          </DialogHeader>
          {selectedItem && (
            <ReusableForm
              fields={galleryFormFields.map((field) => ({
                ...field,
                required: field.name === "image" ? false : field.required,
              }))}
              onSubmit={handleEditSubmit}
              validationSchema={editSchema}
              defaultValues={{
                title: selectedItem.title,
                category: selectedItem.category,
                description: selectedItem.description || "",
                order: selectedItem.order ?? 0,
                published: selectedItem.published ?? true,
                image: selectedItem.image, // Existing image URL
              }}
              submitButtonText="Update Gallery Item"
              isLoading={formLoading}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>View Gallery Item</DialogTitle>
          </DialogHeader>
          {selectedItem && (
            <div className="space-y-4">
              {selectedItem.image && (
                <div className="relative w-full h-96 rounded-lg overflow-hidden border">
                  <Image
                    src={selectedItem.image}
                    alt={selectedItem.title}
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 100vw, 1200px"
                  />
                </div>
              )}
              <div>
                <h2 className="text-2xl font-bold">{selectedItem.title}</h2>
                <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                  <Badge variant="outline" className="capitalize">
                    {selectedItem.category}
                  </Badge>
                  <Badge
                    variant={selectedItem.published ? "default" : "secondary"}
                  >
                    {selectedItem.published ? "Published" : "Draft"}
                  </Badge>
                  {selectedItem.order !== undefined && (
                    <span>Order: {selectedItem.order}</span>
                  )}
                </div>
              </div>
              {selectedItem.description && (
                <>
                  <Separator />
                  <div>
                    <h3 className="font-semibold mb-2">Description</h3>
                    <p className="text-muted-foreground">{selectedItem.description}</p>
                  </div>
                </>
              )}
              <Separator />
              <div className="text-sm text-muted-foreground">
                <p>
                  <strong>Created:</strong>{" "}
                  {format(
                    new Date(selectedItem.createdAt),
                    "MMM dd, yyyy 'at' h:mm a"
                  )}
                </p>
                <p>
                  <strong>Updated:</strong>{" "}
                  {format(
                    new Date(selectedItem.updatedAt),
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

