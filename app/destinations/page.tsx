// app/destinations/page.tsx
"use client";

import React, { useState } from "react";
import { PageLayout } from "@/components/layouts/page-layout";
import { useCrudOperations } from "@/hooks/useCrudOperations";
import { useDestinationFilters } from "@/hooks/useDestinationFilters";
import { FormDialog } from "@/components/ui/form-dialog";

// Import schemas and types
import {
  destinationFormFields,
  createDestinationSchema,
  editDestinationSchema,
  DESTINATIONS_REGIONS,
  ATTRACTIONS,
  WILDLIFE,
  formatDate,
} from "@/lib/destinations/schema";
import type { Destination, DestinationFormData } from "@/lib/destinations/types";

// Import components
import { DestinationPageHeader } from "@/components/destinations/DestinationPageHeader";
import { DestinationFilters } from "@/components/destinations/DestinationFilters";
import { DestinationTable } from "@/components/destinations/DestinationTable";

export default function DestinationsPage() {
  const {
    items: destinations,
    loading,
    formLoading,
    createItem,
    updateItem,
    deleteItem,
  } = useCrudOperations<Destination, DestinationFormData>({
    endpoint: "/destinations",
    entityName: "Destination",
  });

  const {
    searchTerm,
    regionFilter,
    destinationTypeFilter,
    filteredItems,
    setSearchTerm,
    setRegionFilter,
    setDestinationTypeFilter,
  } = useDestinationFilters(destinations);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editing, setEditing] = useState<Destination | null>(null);

  const handleCreate = async (data: DestinationFormData) => {
    return await createItem(data);
  };

  const handleUpdate = async (data: DestinationFormData) => {
    if (!editing) return false;
    return await updateItem(editing._id, data);
  };

  const openEdit = (dest: Destination) => {
    setEditing(dest);
    setIsEditOpen(true);
  };

  const extraSelectOptions = {
    region: DESTINATIONS_REGIONS.map((r) => ({ value: r, label: r })),
    attractions: ATTRACTIONS.map((a) => ({ value: a, label: a })),
    wildlife: WILDLIFE.map((w) => ({ value: w, label: w })),
  };

  // Proper default values for create form
  const createDefaultValues: Partial<DestinationFormData> = {
    name: "",
    location: "",
    region: "",
    destinationType: "",
    featured: false,
    bestTimeToVisit: "",
    climate: "",
    description: "",
    history: "",
    googleMapsLink: "",
    attractions: [],
    wildlife: [],
    facts: [],
    backgroundImage: null,
    additionalImages: [],
  };

  return (
    <PageLayout pageTitle="Destinations">
          <DestinationPageHeader onCreate={() => setIsCreateOpen(true)} />

          <DestinationFilters
            searchTerm={searchTerm}
            regionFilter={regionFilter}
            destinationTypeFilter={destinationTypeFilter}
            onSearchChange={setSearchTerm}
            onRegionChange={setRegionFilter}
            onDestinationTypeChange={setDestinationTypeFilter}
            regions={DESTINATIONS_REGIONS}
          />

          <DestinationTable
            items={filteredItems}
            loading={loading}
            onEdit={openEdit}
            onDelete={deleteItem}
            formatDate={formatDate}
          />

      {/* Create Dialog */}
      <FormDialog
            open={isCreateOpen}
            onOpenChange={setIsCreateOpen}
            title="Create New Destination"
            description="Fill in the details below."
            fields={destinationFormFields}
        defaultValues={createDefaultValues}
        validationSchema={createDestinationSchema}
            onSubmit={handleCreate}
            isLoading={formLoading}
        submitButtonText="Create"
            resetOnSubmit
        extraSelectOptions={extraSelectOptions}
          />

      {/* Edit Dialog */}
          {editing && (
        <FormDialog
              open={isEditOpen}
              onOpenChange={setIsEditOpen}
              title="Edit Destination"
              description="Update the details below."
              fields={destinationFormFields.map(
            (f) =>
                  f.name === "backgroundImage" || f.name === "additionalImages"
                    ? { ...f, required: false }
                    : f
              )}
              defaultValues={{
                name: editing.name,
                location: editing.location,
                region: editing.region,
                destinationType: editing.destinationType,
                featured: editing.featured,
                bestTimeToVisit: editing.bestTimeToVisit,
                climate: editing.climate,
                description: editing.description,
                history: editing.history,
                googleMapsLink: editing.googleMapsLink,
                attractions: editing.attractions,
                wildlife: editing.wildlife,
                facts: editing.facts,
                backgroundImage: null,
                additionalImages: [],
              }}
          validationSchema={editDestinationSchema}
              onSubmit={handleUpdate}
              isLoading={formLoading}
          submitButtonText="Update"
          extraSelectOptions={extraSelectOptions}
            />
          )}
    </PageLayout>
  );
}
