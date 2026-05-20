// components/tours/TourPageHeader.tsx
"use client";
import React from "react";
import { PageHeader } from "../ui/page-header";

interface Props {
  onCreateClick: () => void;
}

export const TourPageHeader: React.FC<Props> = ({ onCreateClick }) => (
  <PageHeader
    title="Tours"
    description="Manage your itineraries"
    onCreateClick={onCreateClick}
    createButtonText="New Tour"
  />
);
