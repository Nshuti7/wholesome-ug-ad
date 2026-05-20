// components/destinations/DestinationPageHeader.tsx
"use client";

import React from "react";
import { PageHeader } from "../ui/page-header";

interface Props {
  onCreate: () => void;
}

export const DestinationPageHeader: React.FC<Props> = ({ onCreate }) => (
  <PageHeader
    title="Destinations"
    description="Manage your destinations"
    onCreateClick={onCreate}
    createButtonText="Create Destination"
  />
);
