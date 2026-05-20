// hooks/useTourFilters.ts
import { useState, useMemo } from "react";
import type { Tour } from "@/lib/tours/types";

export function useTourFilters(tours: Tour[]) {
  const [searchTerm, setSearchTerm] = useState("");
  const [inclusionFilter, setInclusionFilter] = useState("");
  const [activityTypeFilter, setActivityTypeFilter] = useState("");

  const filteredTours = useMemo(() => {
    return tours.filter((t) => {
      const matchesSearch =
        t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesInclusion =
        inclusionFilter === "" || t.inclusions.includes(inclusionFilter);

      const matchesActivityType =
        activityTypeFilter === "" || (t.activityTypes && t.activityTypes.includes(activityTypeFilter));

      return matchesSearch && matchesInclusion && matchesActivityType;
    });
  }, [tours, searchTerm, inclusionFilter, activityTypeFilter]);

  return {
    searchTerm,
    inclusionFilter,
    activityTypeFilter,
    filteredTours,
    setSearchTerm,
    setInclusionFilter,
    setActivityTypeFilter,
  };
}
