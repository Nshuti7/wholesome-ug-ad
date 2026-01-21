"use client";

import React, { useState } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Upload,
  RefreshCw,
  X,
  Image as ImageIcon,
  Smartphone,
  Monitor,
  Trash2,
  Eye,
  EyeOff,
  Grid3x3,
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { useHeroOperations } from "@/hooks/useHeroOperations";
import type { HeroImage, HeroFormData } from "@/lib/hero/types";
import { toast } from "sonner";
import Image from "next/image";

// Visual grid positions
const POSITIONS = [
  { id: "mobile", label: "Mobile", icon: Smartphone, color: "bg-blue-100" },
  { id: "desktop-top-left", label: "Desktop Top Left", icon: Monitor, color: "bg-green-100" },
  { id: "desktop-top-right", label: "Desktop Top Right", icon: Monitor, color: "bg-purple-100" },
  { id: "desktop-bottom-left", label: "Desktop Bottom Left", icon: Monitor, color: "bg-yellow-100" },
  { id: "desktop-bottom-right", label: "Desktop Bottom Right", icon: Monitor, color: "bg-pink-100" },
] as const;

export default function HeroPage() {
  const {
    heroImages,
    loading,
    formLoading,
    error,
    handleCreate,
    handleUpdate,
    handleDelete,
    refetch,
  } = useHeroOperations();

  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState<string>("mobile");

  // Group images by position
  const imagesByPosition = POSITIONS.reduce((acc, pos) => {
    acc[pos.id] = heroImages
      .filter((img) => img.displayType === pos.id && img.active)
      .sort((a, b) => a.order - b.order);
    return acc;
  }, {} as Record<string, HeroImage[]>);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setUploadedFiles((prev) => [...prev, ...Array.from(files)]);
    }
    // Reset input so same file can be selected again
    e.target.value = "";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const files = e.dataTransfer.files;
    if (files) {
      const imageFiles = Array.from(files).filter((file) =>
        file.type.startsWith("image/")
      );
      setUploadedFiles((prev) => [...prev, ...imageFiles]);
    }
  };

  const handleBulkUpload = async () => {
    if (uploadedFiles.length === 0) {
      toast.error("Please select at least one image");
      return;
    }

    setUploading(true);
    let successCount = 0;
    let failCount = 0;

    for (let i = 0; i < uploadedFiles.length; i++) {
      const file = uploadedFiles[i];
      try {
        const heroFormData: HeroFormData = {
          title: `Hero Image ${i + 1}`,
          displayType: selectedPosition as 'mobile' | 'desktop-top-left' | 'desktop-top-right' | 'desktop-bottom-left' | 'desktop-bottom-right',
          order: i,
          active: true,
          image: file,
        };
        const success = await handleCreate(heroFormData);

        if (success) {
          successCount++;
        } else {
          failCount++;
        }
      } catch (error) {
        console.error(`Failed to upload ${file.name}:`, error);
        failCount++;
      }
    }

    setUploading(false);
    setUploadedFiles([]);
    setIsBulkUploadOpen(false);

    if (successCount > 0) {
      toast.success(`Successfully uploaded ${successCount} image(s)`);
    }
    if (failCount > 0) {
      toast.error(`Failed to upload ${failCount} image(s)`);
    }

    await refetch();
  };

  const toggleActive = async (image: HeroImage) => {
    await handleUpdate(
      {
        ...image,
        active: !image.active,
      },
      image._id
    );
  };

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <SiteHeader pageTitle="Hero" />
        <div className="flex flex-1 flex-col gap-4 p-4 md:p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Hero Images</h1>
              <p className="text-muted-foreground">
                Upload and manage hero images for your homepage
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => refetch()}
                disabled={loading}
              >
                <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button onClick={() => setIsBulkUploadOpen(true)}>
                <Upload className="mr-2 h-4 w-4" />
                Upload Images
              </Button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <Card className="border-destructive">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 text-destructive">
                  <X className="h-5 w-5" />
                  <p className="font-medium">{error}</p>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Please ensure the backend server is running and accessible.
                </p>
              </CardContent>
            </Card>
          )}

          {/* Loading State */}
          {loading && heroImages.length === 0 && (
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-center py-8">
                  <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
                  <p className="ml-3 text-muted-foreground">Loading hero images...</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Visual Grid Layout */}
          {!loading && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {POSITIONS.map((position) => {
              const images = imagesByPosition[position.id] || [];
              const PositionIcon = position.icon;

              return (
                <Card key={position.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <PositionIcon className="h-5 w-5" />
                        <CardTitle className="text-lg">{position.label}</CardTitle>
                        <Badge variant="secondary">{images.length}</Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {images.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-8 border-2 border-dashed rounded-lg">
                        <ImageIcon className="h-12 w-12 text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground">
                          No images for {position.label}
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {images.map((image) => (
                          <div
                            key={image._id}
                            className="relative group aspect-square rounded-lg overflow-hidden border-2 border-border"
                          >
                            <Image
                              src={image.image}
                              alt={image.alt || image.title}
                              fill
                              className="object-cover"
                              sizes="(max-width: 640px) 50vw, 33vw"
                            />
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                              <Button
                                size="sm"
                                variant="secondary"
                                onClick={() => toggleActive(image)}
                              >
                                {image.active ? (
                                  <EyeOff className="h-4 w-4" />
                                ) : (
                                  <Eye className="h-4 w-4" />
                                )}
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => {
                                  if (confirm("Delete this image?")) {
                                    handleDelete(image._id);
                                  }
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                            {!image.active && (
                              <div className="absolute top-2 right-2">
                                <Badge variant="secondary">Inactive</Badge>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
            </div>
          )}
        </div>
      </SidebarInset>

      {/* Bulk Upload Dialog */}
      <Dialog open={isBulkUploadOpen} onOpenChange={setIsBulkUploadOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Upload Hero Images</DialogTitle>
            <DialogDescription>
              Select multiple images and choose where they should appear
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Position Selector */}
            <div>
              <Label>Display Position</Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
                {POSITIONS.map((pos) => {
                  const Icon = pos.icon;
                  return (
                    <button
                      key={pos.id}
                      type="button"
                      onClick={() => setSelectedPosition(pos.id)}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        selectedPosition === pos.id
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <Icon className="h-5 w-5 mx-auto mb-1" />
                      <p className="text-xs font-medium">{pos.label}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Dropzone */}
            <div>
              <Label>Images</Label>
              <div
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className="mt-2 border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors border-border hover:border-primary/50"
              >
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-sm font-medium mb-1">
                    Drag & drop images here, or click to select
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Supports JPEG, PNG, WebP, SVG (max 5MB each)
                  </p>
                </label>
              </div>
            </div>

            {/* Uploaded Files Preview */}
            {uploadedFiles.length > 0 && (
              <div>
                <Label>Selected Images ({uploadedFiles.length})</Label>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mt-2">
                  {uploadedFiles.map((file, index) => (
                    <div
                      key={index}
                      className="relative aspect-square rounded-lg overflow-hidden border group"
                    >
                      <img
                        src={URL.createObjectURL(file)}
                        alt={file.name}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-4 w-4" />
                      </button>
                      <p className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs p-1 truncate">
                        {file.name}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setIsBulkUploadOpen(false);
                  setUploadedFiles([]);
                }}
                disabled={uploading}
              >
                Cancel
              </Button>
              <Button
                onClick={handleBulkUpload}
                disabled={uploading || uploadedFiles.length === 0}
              >
                {uploading ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload {uploadedFiles.length} Image(s)
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
}
