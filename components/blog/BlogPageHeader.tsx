"use client";

import React from "react";
import { PageHeader } from "../ui/page-header";

interface Props {
  onCreateClick: () => void;
}

export const BlogPageHeader: React.FC<Props> = ({ onCreateClick }) => (
  <PageHeader
    title="Blogs"
    description="Manage your blog posts"
    onCreateClick={onCreateClick}
    createButtonText="Create Blog"
  />
);
