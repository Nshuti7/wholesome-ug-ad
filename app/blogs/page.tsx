"use client";

import React, { useState } from "react";
import { PageLayout } from "@/components/layouts/page-layout";
import { useCrudOperations } from "@/hooks/useCrudOperations";
import { useBlogFilters } from "@/hooks/useBlogFilters";
import { FormDialog } from "@/components/ui/form-dialog";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Wand2, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import api from "@/utils/api";

import type { Blog, BlogFormData } from "@/lib/blogs/types";
import { BLOG_CATEGORIES } from "@/lib/blogs/schema";
import { formatDate } from "@/utils/blogUtils";

import { BlogPageHeader } from "@/components/blog/BlogPageHeader";
import { BlogFilters } from "@/components/blog/BlogFilters";
import { BlogTable } from "@/components/blog/BlogTable";

// Custom form component for blogs with Gemini content generation
const BlogForm = ({ 
  defaultValues, 
  onSubmit, 
  isLoading, 
  submitButtonText = "Submit" 
}: {
  defaultValues: Partial<BlogFormData>;
  onSubmit: (data: BlogFormData) => Promise<boolean>;
  isLoading: boolean;
  submitButtonText?: string;
}) => {
  const [formData, setFormData] = useState<Partial<BlogFormData>>(defaultValues);
  const [generatingContent, setGeneratingContent] = useState(false);

  // Reset form when defaultValues change (when dialog opens/closes)
  React.useEffect(() => {
    setFormData(defaultValues);
    setGeneratingContent(false);
  }, [defaultValues]);

  const generateContent = async () => {
    if (!formData.title || !formData.category || !formData.excerpt) {
      toast.error("Please fill in title, category, and excerpt first");
      return;
    }

    setGeneratingContent(true);
    try {
      const response = await api.post("/blogs/generate-content", {
        title: formData.title,
        category: formData.category,
        excerpt: formData.excerpt,
        readTime: formData.readTime || "3",
      });

      if (response.data.success) {
        setFormData(prev => ({ ...prev, content: response.data.content }));
        toast.success("Content generated successfully!");
      } else {
        toast.error("Failed to generate content");
      }
    } catch (error: any) {
      console.error("Error generating content:", error);
      toast.error(error.response?.data?.message || "Failed to generate content");
    } finally {
      setGeneratingContent(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await onSubmit(formData as BlogFormData);
    if (success) {
      // Reset form to initial state
      setFormData(defaultValues);
      setGeneratingContent(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {isLoading && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
          <div className="flex items-center text-blue-700">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            <span className="text-sm font-medium">
              {submitButtonText === "Create" ? "Creating blog post..." : "Updating blog post..."}
            </span>
          </div>
          <p className="text-xs text-blue-600 mt-1">
            Please wait while we process your request.
          </p>
        </div>
      )}
      
      {/* Basic fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="title">Blog Title *</Label>
          <Input
            id="title"
            value={formData.title || ""}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            placeholder="Enter an engaging blog title"
            required
          />
        </div>
        <div>
          <Label htmlFor="category">Category *</Label>
          <Select
            value={formData.category || ""}
            onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {BLOG_CATEGORIES.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="date">Publication Date *</Label>
          <Input
            id="date"
            type="date"
            value={formData.date || ""}
            onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
            required
          />
        </div>
        <div>
          <Label htmlFor="readTime">Estimated Read Time *</Label>
          <Input
            id="readTime"
            value={formData.readTime || ""}
            onChange={(e) => setFormData(prev => ({ ...prev, readTime: e.target.value }))}
            placeholder="e.g., 5 min read"
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="excerpt">Excerpt *</Label>
        <Textarea
          id="excerpt"
          value={formData.excerpt || ""}
          onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
          placeholder="Write a compelling summary of your blog post…"
          required
        />
      </div>

      {/* Image upload */}
      <div>
        <Label htmlFor="image">Featured Image *</Label>
        <Input
          id="image"
          type="file"
          accept="image/*"
          onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.files?.[0] || null }))}
          required
        />
        {formData.image && (
          <div className="mt-2">
            <Card className="relative p-2">
              <CardContent className="p-2">
                <div className="relative">
                  <img
                    src={URL.createObjectURL(formData.image)}
                    alt={formData.image.name}
                    className="w-full h-32 object-cover rounded"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                    onClick={() => setFormData(prev => ({ ...prev, image: null }))}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {(formData.image.size / 1024 / 1024).toFixed(2)} MB
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      <Separator />

      {/* Content field with AI generation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Blog Content
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={generateContent}
              disabled={generatingContent || !formData.title || !formData.category || !formData.excerpt}
              className="gap-2"
            >
              {generatingContent ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Wand2 className="h-4 w-4" />
              )}
              {generatingContent ? "Generating..." : "Generate with AI"}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="content">Content *</Label>
            <Textarea
              id="content"
              value={formData.content || ""}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
              placeholder="Write your blog content here or use AI to generate it..."
              required
              className="min-h-[200px]"
            />
            <p className="text-sm text-muted-foreground">
              Fill in the title, category, and excerpt above, then click "Generate with AI" to automatically create content.
            </p>
          </div>
        </CardContent>
      </Card>

      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {isLoading ? (submitButtonText === "Create" ? "Creating..." : "Updating...") : submitButtonText}
      </Button>
    </form>
  );
};

export default function BlogsPage() {
  const {
    items: blogs,
    loading,
    formLoading,
    createItem,
    updateItem,
    deleteItem,
  } = useCrudOperations<Blog, BlogFormData>({
    endpoint: "/blogs",
    entityName: "Blog",
    transformFormData: (data: BlogFormData) => {
      const formData = new FormData();
      
      // Basic fields
      formData.append('title', data.title);
      formData.append('category', data.category);
      formData.append('date', data.date);
      formData.append('readTime', data.readTime);
      formData.append('excerpt', data.excerpt);
      formData.append('content', data.content);
      
      // Files
      if (data.image) {
        formData.append('image', data.image);
      }
      
      return formData;
    }
  });

  const {
    searchTerm,
    categoryFilter,
    filteredBlogs,
    setSearchTerm,
    setCategoryFilter,
  } = useBlogFilters(blogs);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);

  const handleCreate = async (data: BlogFormData) => {
    const success = await createItem(data);
    if (success) {
      setIsCreateOpen(false);
    }
    return success;
  };

  const handleUpdate = async (data: BlogFormData) => {
    if (!editingBlog) return false;
    const success = await updateItem(editingBlog._id, data);
    if (success) {
      setIsEditOpen(false);
      setEditingBlog(null);
    }
    return success;
  };

  const handleEdit = (blog: Blog) => {
    setEditingBlog(blog);
    setIsEditOpen(true);
  };

  const createDefaults: Partial<BlogFormData> = {
    title: "",
    category: "",
    date: "",
    readTime: "",
    excerpt: "",
    content: "",
    image: null,
  };

  const editDefaults = (b: Blog): Partial<BlogFormData> => ({
    title: b.title,
    category: b.category,
    date: b.date,
    readTime: b.readTime,
    excerpt: b.excerpt,
    content: b.content,
    image: null,
  });

  return (
    <PageLayout pageTitle="Blog Management">
          <BlogPageHeader onCreateClick={() => setIsCreateOpen(true)} />

          <BlogFilters
            searchTerm={searchTerm}
            categoryFilter={categoryFilter}
            onSearchChange={setSearchTerm}
            onCategoryChange={setCategoryFilter}
            categories={BLOG_CATEGORIES}
          />

          <BlogTable
            blogs={filteredBlogs}
            loading={loading}
            searchTerm={searchTerm}
            categoryFilter={categoryFilter}
            onEdit={handleEdit}
        onDelete={deleteItem}
            formatDate={formatDate}
          />

      {/* Create Dialog */}
      <FormDialog
            open={isCreateOpen}
            onOpenChange={setIsCreateOpen}
            title="Create New Blog Post"
            description="Fill in the details below."
        fields={[]} // We'll use custom form instead
        defaultValues={{}}
        validationSchema={{} as any}
        onSubmit={handleCreate}
        submitButtonText="Create"
        isLoading={formLoading}
        resetOnSubmit
        customForm={
          <BlogForm
            defaultValues={createDefaults}
            onSubmit={handleCreate}
            isLoading={formLoading}
            submitButtonText="Create"
          />
        }
          />

      {/* Edit Dialog */}
          {editingBlog && (
        <FormDialog
              key={`edit-${editingBlog._id}`}
              open={isEditOpen}
              onOpenChange={(open) => {
                setIsEditOpen(open);
                if (!open) {
                  setEditingBlog(null);
                }
              }}
              title="Edit Blog Post"
              description="Update the details below."
          fields={[]} // We'll use custom form instead
          defaultValues={{}}
          validationSchema={{} as any}
          onSubmit={handleUpdate}
          submitButtonText="Update"
          isLoading={formLoading}
          customForm={
            <BlogForm
              defaultValues={editDefaults(editingBlog)}
              onSubmit={handleUpdate}
              isLoading={formLoading}
              submitButtonText="Update"
            />
          }
            />
          )}
    </PageLayout>
  );
}
