// components/blog/BlogFormDialog.tsx
"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ReusableForm, FormField } from "@/components/ui/reusable-form";
import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import api from "@/utils/api"; // your axios/ky wrapper
import type { BlogFormData } from "@/lib/blogs/types";

interface BlogFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  fields: FormField[];
  onSubmit: (data: BlogFormData) => Promise<void>;
  validationSchema: any;
  defaultValues: Partial<BlogFormData>;
  submitButtonText: string;
  isLoading: boolean;
  resetOnSubmit?: boolean;
}

export const BlogFormDialog: React.FC<BlogFormDialogProps> = ({
  open,
  onOpenChange,
  title,
  description,
  fields,
  onSubmit,
  validationSchema,
  defaultValues,
  submitButtonText,
  isLoading,
  resetOnSubmit,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        {/* ReusableForm internally does <FormProvider> */}
        <ReusableForm<BlogFormData>
          fields={fields}
          onSubmit={onSubmit}
          validationSchema={validationSchema}
          defaultValues={defaultValues}
          submitButtonText={submitButtonText}
          isLoading={isLoading}
          resetOnSubmit={resetOnSubmit}
        >
          {/* This button now renders *inside* the RHF provider */}
          <GenerateContentButton />
        </ReusableForm>
      </DialogContent>
    </Dialog>
  );
};

// *MUST* live inside the ReusableForm so useFormContext() isn't null
const GenerateContentButton: React.FC = () => {
  const { getValues, setValue } = useFormContext<BlogFormData>();
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    const { title, category, excerpt, readTime } = getValues();

    if (!title || !category || !excerpt) {
      alert("Fill in Title, Category & Excerpt before generating content.");
      return;
    }

    setIsGenerating(true);
    try {
      // call your API helper instead of fetch
      const { data } = await api.post("/blogs/generate-content", {
        title,
        category,
        excerpt,
        readTime,
      });

      if (data.success) {
        setValue("content", data.content, { shouldValidate: true });
      } else {
        alert("Generation failed. Please try again.");
      }
    } catch (err: any) {
      alert("Network/server error. Try again later.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex justify-end mb-2">
      <Button type="button" onClick={handleGenerate} disabled={isGenerating}>
        {isGenerating ? "Generating…" : "Generate Content"}
      </Button>
    </div>
  );
};
