// components/tours/TourFilters.tsx
"use client";
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { SearchFilters } from "@/components/ui/search-filters";
import { ITINERARY_INCLUSIONS, ACTIVITY_TYPES } from "@/lib/tours/schema";

interface Props {
  searchTerm: string;
  inclusionFilter: string;
  activityTypeFilter: string;
  onSearchChange: (v: string) => void;
  onInclusionChange: (v: string) => void;
  onActivityTypeChange: (v: string) => void;
}

export const TourFilters: React.FC<Props> = ({
  searchTerm,
  inclusionFilter,
  activityTypeFilter,
  onSearchChange,
  onInclusionChange,
  onActivityTypeChange,
}) => {
  const handleInclusionChange = (value: string) => {
    // Convert __all__ back to empty string for filter logic
    onInclusionChange(value === "__all__" ? "" : value);
  };

  const handleActivityTypeChange = (value: string) => {
    // Convert __all__ back to empty string for filter logic
    onActivityTypeChange(value === "__all__" ? "" : value);
  };

  // Convert empty string to __all__ for display
  const displayInclusionFilter = inclusionFilter === "" ? "__all__" : inclusionFilter;
  const displayActivityTypeFilter = activityTypeFilter === "" ? "__all__" : activityTypeFilter;

  return (
  <Card>
    <CardHeader>
      <CardTitle>Filters</CardTitle>
    </CardHeader>
    <CardContent>
        <SearchFilters
          searchTerm={searchTerm}
          onSearchChange={onSearchChange}
          placeholder="Search by title or description..."
          filters={[
            {
              key: "inclusion",
              label: "Inclusion",
              value: displayInclusionFilter,
              options: ITINERARY_INCLUSIONS.map((inclusion) => ({ value: inclusion, label: inclusion })),
              onChange: handleInclusionChange,
            },
            {
              key: "activityType",
              label: "Activity Type",
              value: displayActivityTypeFilter,
              options: ACTIVITY_TYPES.map((activityType) => ({ value: activityType, label: activityType })),
              onChange: handleActivityTypeChange,
            },
          ]}
        />
    </CardContent>
  </Card>
);
};
