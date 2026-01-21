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
import { useServicesOperations, type ServiceFormData } from "@/hooks/useServicesOperations";
import type { Service } from "@/lib/services/types";
import { serviceFormFields, editSchema } from "@/lib/services/schema";
import { ReusableForm } from "@/components/ui/reusable-form";
import { format } from "date-fns";
import Image from "next/image";

export default function ServicesPage() {
  const {
    services,
    loading,
    formLoading,
    handleCreate,
    handleUpdate,
    handleDelete,
  } = useServicesOperations();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  // Filter services
  const filteredServices = services.filter((service) => {
    const matchesSearch =
      service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (service.longDescription && service.longDescription.toLowerCase().includes(searchQuery.toLowerCase())) ||
      service.icon.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (service.features && service.features.some((f) => f.toLowerCase().includes(searchQuery.toLowerCase())));

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "published" && service.published) ||
      (statusFilter === "draft" && !service.published);

    return matchesSearch && matchesStatus;
  });

  // Table columns
  const columns = [
    {
      key: "image",
      label: "Image",
      render: (service: Service) => (
        <div className="w-16 h-16 relative rounded-md overflow-hidden border">
          {service.image ? (
            <Image
              src={service.image}
              alt={service.title}
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
      render: (service: Service) => (
        <div>
          <div className="flex items-center gap-2">
            <p className="font-medium">{service.title}</p>
            <Badge variant="outline" className="text-xs">
              {service.icon}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-1">
            {service.description}
          </p>
        </div>
      ),
      className: "min-w-[200px]",
    },
    {
      key: "features",
      label: "Features",
      render: (service: Service) => (
        <div className="flex flex-wrap gap-1">
          {service.features && service.features.length > 0 ? (
            service.features.slice(0, 2).map((feature, idx) => (
              <Badge key={idx} variant="secondary" className="text-xs">
                {feature}
              </Badge>
            ))
          ) : (
            <span className="text-sm text-muted-foreground">-</span>
          )}
          {service.features && service.features.length > 2 && (
            <Badge variant="secondary" className="text-xs">
              +{service.features.length - 2}
            </Badge>
          )}
        </div>
      ),
    },
    {
      key: "order",
      label: "Order",
      render: (service: Service) => (
        <span className="text-sm">{service.order ?? "-"}</span>
      ),
    },
    {
      key: "published",
      label: "Status",
      render: (service: Service) => (
        <Badge
          variant={service.published ? "default" : "secondary"}
          className="flex items-center gap-1"
        >
          {service.published ? (
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
      render: (service: Service) => (
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span>
            {format(new Date(service.createdAt), "MMM dd, yyyy")}
          </span>
        </div>
      ),
    },
  ];

  const handleCreateSubmit = async (data: any) => {
    const formData: ServiceFormData = {
      ...data,
      published: data.published ?? true,
      order: data.order ? Number(data.order) : undefined,
      features: data.features && Array.isArray(data.features) ? data.features : [],
    };

    const success = await handleCreate(formData);
    if (success) {
      setIsCreateDialogOpen(false);
    }
  };

  const handleEditSubmit = async (data: any) => {
    if (!selectedService) return;

    const formData: ServiceFormData = {
      ...data,
      published: data.published ?? selectedService.published ?? true,
      order: data.order ? Number(data.order) : selectedService.order,
      image: data.image instanceof File ? data.image : data.image || null,
      features: data.features && Array.isArray(data.features) ? data.features : selectedService.features || [],
    };

    const success = await handleUpdate(formData, selectedService._id);
    if (success) {
      setIsEditDialogOpen(false);
      setSelectedService(null);
    }
  };

  const handleEdit = (service: Service) => {
    setSelectedService(service);
    setIsEditDialogOpen(true);
  };

  const handleView = (service: Service) => {
    setSelectedService(service);
    setIsViewDialogOpen(true);
  };

  const onDelete = async (id: string) => {
    await handleDelete(id);
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <SiteHeader pageTitle="Services" />
        <div className="flex flex-1 flex-col gap-4 p-4 md:p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Services</h1>
              <p className="text-muted-foreground">
                Manage your services and offerings
              </p>
            </div>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Service
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
                      placeholder="Search by title, description, icon, or features..."
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

          {/* Services Table */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Services ({filteredServices.length})</CardTitle>
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
                data={filteredServices}
                columns={columns}
                loading={loading}
                onEdit={handleEdit}
                onDelete={onDelete}
                onView={handleView}
                emptyMessage="No services found. Create your first service!"
              />
            </CardContent>
          </Card>
        </div>
      </SidebarInset>

      {/* Create Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Service</DialogTitle>
          </DialogHeader>
          <ReusableForm
            fields={serviceFormFields}
            onSubmit={handleCreateSubmit}
            validationSchema={editSchema}
            defaultValues={{
              published: true,
              order: 0,
              features: [],
            }}
            submitButtonText="Create Service"
            isLoading={formLoading}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Service</DialogTitle>
          </DialogHeader>
          {selectedService && (
            <ReusableForm
              fields={serviceFormFields.map((field) => ({
                ...field,
                required: field.name === "image" ? false : field.required,
              }))}
              onSubmit={handleEditSubmit}
              validationSchema={editSchema}
              defaultValues={{
                title: selectedService.title,
                description: selectedService.description,
                icon: selectedService.icon,
                longDescription: selectedService.longDescription || "",
                order: selectedService.order ?? 0,
                published: selectedService.published ?? true,
                image: selectedService.image, // Existing image URL
                features: selectedService.features || [],
              }}
              submitButtonText="Update Service"
              isLoading={formLoading}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>View Service</DialogTitle>
          </DialogHeader>
          {selectedService && (
            <div className="space-y-4">
              {selectedService.image && (
                <div className="relative w-full h-64 rounded-lg overflow-hidden border">
                  <Image
                    src={selectedService.image}
                    alt={selectedService.title}
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 100vw, 1200px"
                  />
                </div>
              )}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h2 className="text-2xl font-bold">{selectedService.title}</h2>
                  <Badge variant="outline">{selectedService.icon}</Badge>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <Badge
                    variant={selectedService.published ? "default" : "secondary"}
                  >
                    {selectedService.published ? "Published" : "Draft"}
                  </Badge>
                  {selectedService.order !== undefined && (
                    <span>Order: {selectedService.order}</span>
                  )}
                </div>
              </div>
              <Separator />
              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-muted-foreground">{selectedService.description}</p>
              </div>
              {selectedService.longDescription && (
                <>
                  <Separator />
                  <div>
                    <h3 className="font-semibold mb-2">Long Description</h3>
                    <p className="text-muted-foreground whitespace-pre-wrap">
                      {selectedService.longDescription}
                    </p>
                  </div>
                </>
              )}
              {selectedService.features && selectedService.features.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <h3 className="font-semibold mb-2">Features</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedService.features.map((feature, idx) => (
                        <Badge key={idx} variant="secondary">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </>
              )}
              <Separator />
              <div className="text-sm text-muted-foreground">
                <p>
                  <strong>Created:</strong>{" "}
                  {format(
                    new Date(selectedService.createdAt),
                    "MMM dd, yyyy 'at' h:mm a"
                  )}
                </p>
                <p>
                  <strong>Updated:</strong>{" "}
                  {format(
                    new Date(selectedService.updatedAt),
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

