// components/blog/BlogFilters.tsx
"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SearchFilters } from "@/components/ui/search-filters";

interface BlogFiltersProps {
  searchTerm: string;
  categoryFilter: string;
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  categories: string[];
}

export const BlogFilters: React.FC<BlogFiltersProps> = ({
  searchTerm,
  categoryFilter,
  onSearchChange,
  onCategoryChange,
  categories,
}) => {
  const handleCategoryChange = (value: string) => {
    // Convert __all__ back to empty string for filter logic
    onCategoryChange(value === "__all__" ? "" : value);
  };

  // Convert empty string to __all__ for display
  const displayCategoryFilter = categoryFilter === "" ? "__all__" : categoryFilter;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Filters</CardTitle>
      </CardHeader>
      <CardContent>
        <SearchFilters
          searchTerm={searchTerm}
          onSearchChange={onSearchChange}
          placeholder="Search by title or excerpt..."
          filters={[
            {
              key: "category",
              label: "Category",
              value: displayCategoryFilter,
              options: categories.map((category) => ({ value: category, label: category })),
              onChange: handleCategoryChange,
            },
          ]}
        />
      </CardContent>
    </Card>
  );
};
