// components/destinations/DestinationFormDialog.tsx
"use client";

import React from "react";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ReusableForm, FormField } from "@/components/ui/reusable-form";
import type { DestinationFormData } from "@/lib/destinations/types";
import type { ZodSchema } from "zod";

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  title: string;
  description: string;
  fields: FormField[];
  defaultValues: Partial<DestinationFormData>;
  schema: ZodSchema<DestinationFormData>;
  extraSelectOptions?: {
    region?: string[];
    attractions?: string[];
    wildlife?: string[];
  };
  onSubmit: (data: DestinationFormData) => Promise<void>;
  isLoading: boolean;
  resetOnSubmit?: boolean;
}

export const DestinationFormDialog: React.FC<Props> = ({
  open,
  onOpenChange,
  title,
  description,
  fields,
  defaultValues,
  schema,
  extraSelectOptions,
  onSubmit,
  isLoading,
  resetOnSubmit = false,
}) => {
  // If you need to inject extraSelectOptions into fields you can map them here
  const finalFields = React.useMemo(() => {
    if (!extraSelectOptions) return fields;
    return fields.map((f) => {
      if (f.name === "region" && extraSelectOptions.region) {
        return {
          ...f,
          options: extraSelectOptions.region.map((r) => ({
            value: r,
            label: r,
          })),
        };
      }
      if (f.name === "attractions" && extraSelectOptions.attractions) {
        return {
          ...f,
          options: extraSelectOptions.attractions.map((a) => ({
            value: a,
            label: a,
          })),
        };
      }
      if (f.name === "wildlife" && extraSelectOptions.wildlife) {
        return {
          ...f,
          options: extraSelectOptions.wildlife.map((w) => ({
            value: w,
            label: w,
          })),
        };
      }
      return f;
    });
  }, [fields, extraSelectOptions]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {isLoading && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
            <div className="flex items-center text-blue-700">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              <span className="text-sm font-medium">
                {title.startsWith("Create") ? "Creating destination and uploading images..." : "Updating destination..."}
              </span>
            </div>
            <p className="text-xs text-blue-600 mt-1">
              This may take a moment depending on image sizes and internet connection.
            </p>
          </div>
        )}
        
        {!isLoading && title.startsWith("Create") && (
          <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-md">
            <div className="flex items-center text-amber-700">
              <span className="text-sm font-medium">💡 Upload Tips:</span>
            </div>
            <ul className="text-xs text-amber-600 mt-1 space-y-1">
              <li>• Use images smaller than 5MB each for faster uploads</li>
              <li>• Recommended formats: JPG, PNG, WebP</li>
              <li>• Ensure stable internet connection</li>
            </ul>
          </div>
        )}
        <ReusableForm<DestinationFormData>
          fields={finalFields}
          defaultValues={defaultValues}
          validationSchema={schema}
          onSubmit={onSubmit}
          isLoading={isLoading}
          resetOnSubmit={resetOnSubmit}
          submitButtonText={title.startsWith("Create") ? "Create Destination" : "Update Destination"}
        />
      </DialogContent>
    </Dialog>
  );
};
