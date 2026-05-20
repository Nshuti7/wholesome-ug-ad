// hooks/useDestinationFilters.ts
"use client";

import { useState, useMemo } from "react";
import type { Destination } from "@/lib/destinations/types";

export function useDestinationFilters(destinations: Destination[]) {
  const [searchTerm, setSearchTerm] = useState("");
  const [regionFilter, setRegionFilter] = useState("");
  const [destinationTypeFilter, setDestinationTypeFilter] = useState("");

  const filteredItems = useMemo(
    () =>
      destinations.filter(
        (d) =>
          (d.name + d.description)
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) &&
          (regionFilter === "" || d.region === regionFilter) &&
          (destinationTypeFilter === "" || d.destinationType === destinationTypeFilter)
      ),
    [destinations, searchTerm, regionFilter, destinationTypeFilter]
  );

  return {
    searchTerm,
    regionFilter,
    destinationTypeFilter,
    filteredItems,
    setSearchTerm,
    setRegionFilter,
    setDestinationTypeFilter,
  };
}
