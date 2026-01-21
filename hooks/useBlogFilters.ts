// hooks/useBlogFilters.ts
"use client";

import { useState, useMemo } from "react";
import type { Blog } from "@/lib/blogs/types";

export const useBlogFilters = (blogs: Blog[]) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  const filteredBlogs = useMemo(
    () =>
      blogs.filter(
        (b) =>
          (b.title + b.excerpt)
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) &&
          (categoryFilter === "" || b.category === categoryFilter)
      ),
    [blogs, searchTerm, categoryFilter]
  );

  return {
    searchTerm,
    categoryFilter,
    filteredBlogs,
    setSearchTerm,
    setCategoryFilter,
  };
};
