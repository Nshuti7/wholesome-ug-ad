// components/gallery/gallery-upload-form.tsx
import React from "react";
import {
  ReusableForm,
  FormField,
  createFormSchema,
} from "@/components/ui/reusable-form";
import { UploadFormData } from "@/lib/gallery/types";

interface GalleryUploadFormProps {
  onSubmit: (data: UploadFormData) => Promise<void>;
  isLoading: boolean;
}

export function GalleryUploadForm({
  onSubmit,
  isLoading,
}: GalleryUploadFormProps) {
  const uploadFormFields: FormField[] = [
    {
      name: "images",
      label: "Select Images",
      type: "multiimage",
      required: true,
      accept: "image/*",
      maxFiles: 10,
      maxSize: 5,
      showPreview: true,
      description:
        "Select up to 10 images (max 5MB each). Supported formats: JPG, PNG, GIF, WebP",
    },
    {
      name: "description",
      label: "Description",
      type: "textarea",
      placeholder: "Enter a description for these images (optional)",
      description: "This description will be applied to all uploaded images",
    },
  ];

  const uploadFormSchema = createFormSchema<UploadFormData>(uploadFormFields);

  return (
    <ReusableForm
      fields={uploadFormFields}
      onSubmit={onSubmit}
      validationSchema={uploadFormSchema}
      submitButtonText="Upload Images"
      isLoading={isLoading}
      formClassName="space-y-4"
    />
  );
}
