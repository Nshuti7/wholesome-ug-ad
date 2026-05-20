"use client";

import React from "react";
import { TourFormDialog } from "./TourFormDialog";
import { createTourSchema, ITINERARY_INCLUSIONS } from "@/lib/tours/schema";
import type { TourFormData } from "@/lib/tours/types";
import { FormField } from "@/components/ui/reusable-form";

// reuse same fields for create & edit
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
    required: true,
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
  // dynamic days array:
  {
    name: "days",
    label: "Itinerary Days",
    type: "array",
    addButtonText: "Add Day",
    itemField: {
      // <-- make this an object field, not a group
      name: "day", // required
      label: "Day", // required
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

interface CreateTourDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: TourFormData) => void | Promise<void>;
  isLoading: boolean;
}

export const CreateTourDialog: React.FC<CreateTourDialogProps> = ({
  open,
  onOpenChange,
  onSubmit,
  isLoading,
}) => {
  const defaultValues: Partial<TourFormData> = {
    title: "",
    description: "",
    daysCount: 1,
    nightsCount: 0,
    highlights: [],
    backgroundImage: null,
    additionalImages: [],
    inclusions: [],
    days: [{ dayNumber: 1, activity: "", description: "" }],
  };

  return (
    <TourFormDialog
      open={open}
      onOpenChange={onOpenChange}
      fields={TOUR_FORM_FIELDS}
      defaultValues={defaultValues}
      validationSchema={createTourSchema}
      onSubmit={onSubmit}
      submitText="Create"
      isLoading={isLoading}
      resetOnSubmit
    />
  );
};
