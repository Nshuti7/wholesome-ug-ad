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
  trigger?: React.ReactNode; // Add trigger prop for the button
  fields?: FormField[]; // Make fields optional
  defaultValues?: Partial<T>; // Make optional when using customForm
  validationSchema?: z.ZodTypeAny; // Make validationSchema optional
  onSubmit?: (data: T) => Promise<boolean> | boolean; // Make optional when using customForm
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
  trigger,
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
    if (onSubmit) {
      const success = await onSubmit(data);
      if (success) {
        onOpenChange(false);
      }
    }
  };

  // Enhance fields with extra select options (only if fields exist)
  const enhancedFields = fields ? fields.map((field) => {
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
  }) : [];

  return (
    <>
      {/* Render the trigger button that opens the dialog */}
      {trigger && (
        <div onClick={() => onOpenChange(true)}>
          {trigger}
        </div>
      )}
      
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
          ) : fields && defaultValues && onSubmit ? (
            <ReusableForm
              fields={enhancedFields}
              onSubmit={handleSubmit as any}
              validationSchema={validationSchema}
              defaultValues={defaultValues}
              submitButtonText={submitButtonText}
              isLoading={isLoading}
              resetOnSubmit={resetOnSubmit}
            />
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
} 