"use client";

import React from "react";
import { TourFormDialog } from "./TourFormDialog";
import { editTourSchema, ITINERARY_INCLUSIONS } from "@/lib/tours/schema";
import type { TourFormData } from "@/lib/tours/types";
import { FormField } from "@/components/ui/reusable-form";

// same fields array, but you can tweak itemField.required if you like
const TOUR_FORM_FIELDS: FormField[] = [
  { name: "title", label: "Title", type: "text", required: true },
  {
    name: "description",
    label: "Description",
    type: "textarea",
    required: true,
  },
  { name: "daysCount", label: "Days", type: "number", required: true },
  { name: "nightsCount", label: "Nights", type: "number", required: true },
  { name: "highlights", label: "Highlights", type: "textarea" },
  {
    name: "backgroundImage",
    label: "Background Image",
    type: "image",
    accept: "image/*",
    showPreview: true,
  },
  {
    name: "additionalImages",
    label: "Additional Images",
    type: "multiimage",
    accept: "image/*",
    showPreview: true,
  },
  {
    name: "inclusions",
    label: "Inclusions",
    type: "multiselect",
    options: ITINERARY_INCLUSIONS.map((i) => ({ value: i, label: i })),
  },
  {
    name: "days",
    label: "Itinerary Days",
    type: "array",
    addButtonText: "Add Day",
    itemField: {
      name: "day",
      label: "Day",
      type: "object",
      fields: [
        { name: "dayNumber", label: "Day #", type: "number", required: true },
        { name: "activity", label: "Activity", type: "text", required: true },
        {
          name: "description",
          label: "Details",
          type: "textarea",
          required: true,
        },
      ],
    },
  },
];

interface EditTourDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: TourFormData) => void | Promise<void>;
  isLoading: boolean;
  defaultValues: Partial<TourFormData>;
}

export const EditTourDialog: React.FC<EditTourDialogProps> = ({
  open,
  onOpenChange,
  onSubmit,
  isLoading,
  defaultValues,
}) => (
  <TourFormDialog
    open={open}
    onOpenChange={onOpenChange}
    fields={TOUR_FORM_FIELDS}
    defaultValues={defaultValues}
    validationSchema={editTourSchema}
    onSubmit={onSubmit}
    submitText="Update"
    isLoading={isLoading}
  />
);
