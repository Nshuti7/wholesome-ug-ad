"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ReusableForm, FormField } from "@/components/ui/reusable-form";
import type { TourFormData } from "@/lib/tours/types";
import * as z from "zod";

interface TourFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fields: FormField[];
  defaultValues: Partial<TourFormData>;
  validationSchema: z.ZodSchema<any>;
  onSubmit: (data: TourFormData) => void | Promise<void>;
  submitText: string;
  isLoading?: boolean;
  resetOnSubmit?: boolean;
}

export const TourFormDialog: React.FC<TourFormDialogProps> = ({
  open,
  onOpenChange,
  fields,
  defaultValues,
  validationSchema,
  onSubmit,
  submitText,
  isLoading = false,
  resetOnSubmit = false,
}) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>{submitText} Tour</DialogTitle>
        <DialogDescription>Fill in the details below.</DialogDescription>
      </DialogHeader>
      <ReusableForm<TourFormData>
        fields={fields}
        defaultValues={defaultValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
        submitButtonText={submitText}
        isLoading={isLoading}
        resetOnSubmit={resetOnSubmit}
      />
    </DialogContent>
  </Dialog>
);
