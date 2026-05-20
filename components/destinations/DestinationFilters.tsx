"use client";

import React from "react";
import { SearchFilters } from "@/components/ui/search-filters";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { DESTINATION_TYPES } from "@/lib/destinations/schema";

interface Props {
  searchTerm: string;
  regionFilter: string;
  destinationTypeFilter: string;
  onSearchChange: (v: string) => void;
  onRegionChange: (v: string) => void;
  onDestinationTypeChange: (v: string) => void;
  regions: string[];
}

export const DestinationFilters: React.FC<Props> = ({
  searchTerm,
  regionFilter,
  destinationTypeFilter,
  onSearchChange,
  onRegionChange,
  onDestinationTypeChange,
  regions,
}) => {
  const handleRegionChange = (value: string) => {
    // Convert __all__ back to empty string for filter logic
    onRegionChange(value === "__all__" ? "" : value);
  };

  const handleDestinationTypeChange = (value: string) => {
    // Convert __all__ back to empty string for filter logic
    onDestinationTypeChange(value === "__all__" ? "" : value);
  };

  // Convert empty string to __all__ for display
  const displayRegionFilter = regionFilter === "" ? "__all__" : regionFilter;
  const displayDestinationTypeFilter = destinationTypeFilter === "" ? "__all__" : destinationTypeFilter;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Filters</CardTitle>
      </CardHeader>
      <CardContent>
        <SearchFilters
          searchTerm={searchTerm}
          onSearchChange={onSearchChange}
          placeholder="Search destinations..."
          filters={[
            {
              key: "region",
              label: "Region",
              value: displayRegionFilter,
              options: regions.map((region) => ({ value: region, label: region })),
              onChange: handleRegionChange,
            },
            {
              key: "destinationType",
              label: "Destination Type",
              value: displayDestinationTypeFilter,
              options: DESTINATION_TYPES.map((type) => ({ value: type, label: type })),
              onChange: handleDestinationTypeChange,
            },
          ]}
        />
      </CardContent>
    </Card>
  );
};
