"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ReusableForm, FormField } from "@/components/ui/reusable-form";
import * as z from "zod";

interface FormDialogProps<T> {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  fields: FormField[];
  defaultValues: Partial<T>;
  validationSchema: z.ZodTypeAny;
  onSubmit: (data: T) => Promise<boolean> | boolean;
  isLoading?: boolean;
  submitButtonText?: string;
  resetOnSubmit?: boolean;
  extraSelectOptions?: Record<string, Array<{ value: string; label: string }>>;
  customForm?: React.ReactNode;
}

export function FormDialog<T>({
  open,
  onOpenChange,
  title,
  description,
  fields,
  defaultValues,
  validationSchema,
  onSubmit,
  isLoading = false,
  submitButtonText = "Submit",
  resetOnSubmit = false,
  extraSelectOptions,
  customForm,
}: FormDialogProps<T>) {
  const handleSubmit = async (data: T) => {
    const success = await onSubmit(data);
    if (success) {
      onOpenChange(false);
    }
  };

  // Enhance fields with extra select options
  const enhancedFields = fields.map((field) => {
    if (field.type === "select" && extraSelectOptions?.[field.name]) {
      return {
        ...field,
        options: extraSelectOptions[field.name],
      };
    }
    if (field.type === "multiselect" && extraSelectOptions?.[field.name]) {
      return {
        ...field,
        options: extraSelectOptions[field.name],
      };
    }
    return field;
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {customForm ? (
          <div className="mt-4">
            {customForm}
          </div>
        ) : (
          <ReusableForm
            fields={enhancedFields}
            onSubmit={handleSubmit as any}
            validationSchema={validationSchema}
            defaultValues={defaultValues}
            submitButtonText={submitButtonText}
            isLoading={isLoading}
            resetOnSubmit={resetOnSubmit}
          />
        )}
      </DialogContent>
    </Dialog>
  );
} 