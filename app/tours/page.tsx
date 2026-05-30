// app/tours/page.tsx
"use client";
import React, { useState } from "react";
import { PageLayout } from "@/components/layouts/page-layout";
import { useCrudOperations } from "@/hooks/useCrudOperations";
import { useTourFilters } from "@/hooks/useTourFilters";
import { FormDialog } from "@/components/ui/form-dialog";
import { ReusableForm } from "@/components/ui/reusable-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useForm, useWatch } from "react-hook-form";

import { Plus, Minus, X } from "lucide-react";
import { toast } from "sonner";

import type { TourFormData, Tour, TourDay, DestinationRef } from "@/lib/tours/types";
import { formatDate, tourFormFields, createTourSchema, editTourSchema, ITINERARY_INCLUSIONS } from "@/lib/tours/schema";

import { TourPageHeader } from "@/components/tours/TourPageHeader";
import { TourFilters } from "@/components/tours/TourFilters";
import { TourTable } from "@/components/tours/TourTable";

// Custom hook to watch form values
const useFormWatcher = (defaultValues: Partial<TourFormData>) => {
  const form = useForm<TourFormData>({
    defaultValues: defaultValues as any,
  });
  
  const watchedDaysCount = useWatch({
    control: form.control,
    name: "daysCount",
    defaultValue: defaultValues.daysCount || 0,
  });

  return { form, watchedDaysCount };
};

// Custom form component for tours with dynamic day fields and flexible destinations
const TourForm = ({ 
  defaultValues, 
  onSubmit, 
  isLoading, 
  submitButtonText = "Submit" 
}: {
  defaultValues: Partial<TourFormData>;
  onSubmit: (data: TourFormData) => Promise<boolean>;
  isLoading: boolean;
  submitButtonText?: string;
}) => {
  const [formData, setFormData] = useState<Partial<TourFormData>>(defaultValues);
  const [daysCount, setDaysCount] = useState(defaultValues.daysCount || 0);
  const [destinations, setDestinations] = useState<DestinationRef[]>(defaultValues.destinations || []);
  const [newDestination, setNewDestination] = useState({ name: "", duration: "" });
  
  // Use ref to track current days data to avoid circular dependencies
  const currentDaysRef = React.useRef<TourDay[]>(defaultValues.days || []);

  // Update days array when daysCount changes
  React.useEffect(() => {
    const currentDays = currentDaysRef.current;
    const newDays: TourDay[] = [];
    
    for (let i = 1; i <= daysCount; i++) {
      const existingDay = currentDays.find(day => day.dayNumber === i);
      newDays.push({
        dayNumber: i,
        activity: existingDay?.activity || "",
        description: existingDay?.description || ""
      });
    }
    
    // Update both the ref and the state
    currentDaysRef.current = newDays;
    setFormData(prev => ({ ...prev, days: newDays }));
  }, [daysCount]);

  // Sync destinations with formData
  React.useEffect(() => {
    setFormData(prev => ({ ...prev, destinations }));
  }, [destinations]);

  // Listen for form value changes from ReusableForm
  const handleFormChange = (values: Partial<TourFormData>) => {
    if (typeof values.daysCount === 'number' && values.daysCount !== daysCount) {
      setDaysCount(values.daysCount);
    }
    // Only update formData if values are actually different
    setFormData(prev => {
      const hasChanges = Object.keys(values).some(key => 
        JSON.stringify(prev[key as keyof TourFormData]) !== JSON.stringify(values[key as keyof TourFormData])
      );
      return hasChanges ? { ...prev, ...values } : prev;
    });
  };

  // Calculate discount preview
  const calculateDiscountPreview = () => {
    const currentPrice = formData.price || 0;
    const oldPrice = formData.oldPrice || 0;
    
    if (oldPrice > 0 && currentPrice > 0 && oldPrice > currentPrice) {
      const discountAmount = oldPrice - currentPrice;
      const discountPercentage = Math.round((discountAmount / oldPrice) * 100);
      return {
        valid: true,
        discountAmount,
        discountPercentage,
        savings: discountAmount
      };
    }
    
    return {
      valid: false,
      discountAmount: 0,
      discountPercentage: 0,
      savings: 0
    };
  };

  const updateDay = (dayNumber: number, field: keyof TourDay, value: string) => {
    const updatedDays = currentDaysRef.current.map(day => 
      day.dayNumber === dayNumber 
        ? { ...day, [field]: value }
        : day
    );
    
    // Update both the ref and the state
    currentDaysRef.current = updatedDays;
    setFormData(prev => ({
      ...prev,
      days: updatedDays
    }));
  };

  const addDestination = () => {
    if (newDestination.name.trim() && newDestination.duration.trim()) {
      setDestinations(prev => [...prev, { ...newDestination }]);
      setNewDestination({ name: "", duration: "" });
    }
  };

  const removeDestination = (index: number) => {
    setDestinations(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (data: any) => {
    // Ensure all form data is properly combined
    const submitData = {
      ...formData, // Include all form data from ReusableForm
      ...data, // Include any additional data passed from ReusableForm
      days: formData.days || [],
      destinations: destinations || []
    } as TourFormData;
    
    await onSubmit(submitData);
  };

  // Fields for the reusable form (excluding days and destinations)
  const reusableFormFields = tourFormFields.filter(field => 
    !['days', 'destinations'].includes(field.name || '')
  );

  const discountPreview = calculateDiscountPreview();

  return (
    <div className="space-y-6">
      {/* Reusable form for standard fields including image uploads */}
      <ReusableForm
        fields={reusableFormFields}
        defaultValues={formData}
        onSubmit={handleSubmit}
        isLoading={isLoading}
        submitButtonText={submitButtonText}
        resetOnSubmit={false}
        onFormChange={handleFormChange}
      >
        {/* Discount Preview */}
        {(formData.price || 0) > 0 && (formData.oldPrice || 0) > 0 && (
          <Card className="mt-4">
            <CardContent className="pt-6">
              <div className="space-y-2">
                <h4 className="font-medium">Discount Preview</h4>
                {discountPreview.valid ? (
                  <div className="text-sm text-green-600 space-y-1">
                    <p>✓ Valid discount configuration</p>
                    <p>Discount: ${discountPreview.discountAmount.toFixed(2)} ({discountPreview.discountPercentage}% off)</p>
                    <p>Customers save: ${discountPreview.savings.toFixed(2)}</p>
                  </div>
                ) : (
                  <div className="text-sm text-red-600">
                    <p>⚠️ Invalid: Old price must be higher than current price</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
        {/* Custom fields after the reusable form */}
        <div className="space-y-6">
          {/* Dynamic day fields */}
          {daysCount > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Daily Itinerary ({daysCount} {daysCount === 1 ? 'day' : 'days'})</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Array.from({ length: daysCount }, (_, index) => {
                  const dayNumber = index + 1;
                  const day = formData.days?.find(d => d.dayNumber === dayNumber) || { dayNumber, activity: "", description: "" };
                  
                  return (
                    <div key={dayNumber} className="space-y-3 p-4 border rounded-lg">
                      <div className="flex items-center gap-2">
                        <Plus className="h-4 w-4" />
                        <h4 className="font-medium">Day {dayNumber}</h4>
                      </div>
                      
                      <div className="grid grid-cols-1 gap-3">
                        <div>
                          <Label htmlFor={`activity-${dayNumber}`}>Activity *</Label>
                          <Input
                            id={`activity-${dayNumber}`}
                            value={day.activity}
                            onChange={(e) => updateDay(dayNumber, 'activity', e.target.value)}
                            placeholder="What will happen on this day?"
                            required
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor={`description-${dayNumber}`}>Description *</Label>
                          <Textarea
                            id={`description-${dayNumber}`}
                            value={day.description}
                            onChange={(e) => updateDay(dayNumber, 'description', e.target.value)}
                            placeholder="Detailed description of the day's activities"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          )}

          <Separator />

          {/* Destinations - Flexible UI */}
          <Card>
            <CardHeader>
              <CardTitle>Destinations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Add new destination */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <Label htmlFor="destName">Destination Name</Label>
                  <Input
                    id="destName"
                    value={newDestination.name}
                    onChange={(e) => setNewDestination(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Kigali"
                  />
                </div>
                <div>
                  <Label htmlFor="destDuration">Duration</Label>
                  <Input
                    id="destDuration"
                    value={newDestination.duration}
                    onChange={(e) => setNewDestination(prev => ({ ...prev, duration: e.target.value }))}
                    placeholder="e.g., 2 days"
                  />
                </div>
                <div className="flex items-end">
                  <Button
                    type="button"
                    onClick={addDestination}
                    disabled={!newDestination.name.trim() || !newDestination.duration.trim()}
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Destination
                  </Button>
                </div>
              </div>

              {/* List of destinations */}
              {destinations.length > 0 && (
                <div className="space-y-2">
                  <Label>Added Destinations</Label>
                  {destinations.map((dest, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <span className="font-medium">{dest.name}</span>
                        <span className="text-gray-500 ml-2">- {dest.duration}</span>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeDestination(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </ReusableForm>
    </div>
  );
};

export default function ToursPage() {
  const { items: tours, loading, formLoading, createItem, updateItem, deleteItem } = useCrudOperations<Tour, TourFormData>({
    endpoint: "/itineraries",
    entityName: "Tour",
    transformFormData: (data: TourFormData) => {
      const formData = new FormData();
      
      // Basic fields
      formData.append('title', data.title);
      formData.append('description', data.description);
      formData.append('daysCount', data.daysCount.toString());
      formData.append('nightsCount', data.nightsCount.toString());
      
      // Pricing fields
      formData.append('price', data.price.toString());
      if (data.oldPrice) {
        formData.append('oldPrice', data.oldPrice.toString());
      }
      formData.append('currency', data.currency || 'USD');
      formData.append('featured', data.featured.toString());
      formData.append('discount', data.discount.toString());
      
      // Arrays
      if (data.highlights) {
        data.highlights.forEach(highlight => formData.append('highlights', highlight));
      }
      
      if (data.inclusions) {
        data.inclusions.forEach(inclusion => formData.append('inclusions', inclusion));
      }
      
      if (data.activityTypes) {
        data.activityTypes.forEach(activityType => formData.append('activityTypes', activityType));
      }
      
      // Files
      if (data.backgroundImage) {
        formData.append('backgroundImage', data.backgroundImage);
      }
      
      if (data.additionalImages) {
        data.additionalImages.forEach(image => formData.append('additionalImages', image));
      }
      
      // Complex objects - send as JSON strings
      if (data.days && data.days.length > 0) {
        data.days.forEach(day => {
          formData.append('days', JSON.stringify(day));
        });
      }
      
      if (data.destinations && data.destinations.length > 0) {
        data.destinations.forEach(dest => {
          formData.append('destinations', JSON.stringify(dest));
        });
      }
      
      return formData;
    }
  });

  const {
    searchTerm,
    inclusionFilter,
    activityTypeFilter,
    filteredTours,
    setSearchTerm,
    setInclusionFilter,
    setActivityTypeFilter,
  } = useTourFilters(tours);

  // dialogs state
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editingTour, setEditingTour] = useState<Tour | null>(null);

  // wrap create to close dialog
  const handleCreate = async (data: TourFormData) => {
    try {
      // Check required fields
      if (!data.title || !data.description) {
        toast.error("Title and description are required");
        return false;
      }
      
      if (!data.price || data.price <= 0) {
        toast.error("Price must be greater than 0");
        return false;
      }
      
      if (data.oldPrice && data.oldPrice > 0 && data.oldPrice < data.price) {
        toast.error("Old price must be greater than or equal to current price");
        return false;
      }
      
      if (!data.backgroundImage) {
        toast.error("Background image is required");
        return false;
      }
      
      if (!data.additionalImages || data.additionalImages.length < 4) {
        toast.error("At least 4 additional images are required");
        return false;
      }
      
      const success = await createItem(data);
      if (success) {
        setCreateOpen(false);
      }
      return success;
    } catch (error) {
      console.error("Error in handleCreate:", error);
      toast.error("Failed to create tour");
      return false;
    }
  };

  const handleUpdate = async (data: TourFormData) => {
    if (!editingTour) return false;
    const success = await updateItem(editingTour._id, data);
    if (success) {
    setEditOpen(false);
      setEditingTour(null);
    }
    return success;
  };

  const openEdit = (tour: Tour) => {
    setEditingTour(tour);
    setEditOpen(true);
  };

  // Proper default values for create form
  const createDefaultValues: Partial<TourFormData> = {
    title: "",
    description: "",
    daysCount: 1,
    nightsCount: 0,
    price: 100, // Set a default price > 0
    oldPrice: undefined,
    currency: "USD",
    featured: false,
    discount: 0,
    activityTypes: [],
    highlights: [],
    inclusions: [],
    backgroundImage: null,
    additionalImages: [],
    days: [{ dayNumber: 1, activity: "", description: "" }],
    destinations: [],
  };

  return (
    <PageLayout pageTitle="Tours">
          <TourPageHeader onCreateClick={() => setCreateOpen(true)} />

          <TourFilters
            searchTerm={searchTerm}
            inclusionFilter={
              Array.isArray(inclusionFilter)
                ? inclusionFilter[0] ?? ""
                : inclusionFilter
            }
            activityTypeFilter={activityTypeFilter}
            onSearchChange={setSearchTerm}
            onInclusionChange={(v) => setInclusionFilter(v)}
            onActivityTypeChange={(v) => setActivityTypeFilter(v)}
          />

          <TourTable
            tours={filteredTours}
            loading={loading}
            onView={(url) => window.open(url, "_blank")}
            onEdit={openEdit}
            onDelete={deleteItem}
            formatDate={formatDate}
          />

      {/* Create Dialog */}
      <FormDialog
            open={createOpen}
            onOpenChange={setCreateOpen}
        title="Create New Tour"
        description="Fill in the tour details below."
        fields={[]} // We'll use custom form instead
        defaultValues={{}}
        validationSchema={{} as any}
        onSubmit={handleCreate}
        isLoading={formLoading}
        submitButtonText="Create"
        resetOnSubmit
        customForm={
          <TourForm
            defaultValues={createDefaultValues}
            onSubmit={handleCreate}
            isLoading={formLoading}
            submitButtonText="Create"
          />
        }
          />

      {/* Edit Dialog */}
          {editingTour && (
        <FormDialog
              open={editOpen}
              onOpenChange={setEditOpen}
          title="Edit Tour"
          description="Update the tour details below."
          fields={[]} // We'll use custom form instead
          defaultValues={{}}
          validationSchema={{} as any}
              onSubmit={handleUpdate}
              isLoading={formLoading}
          submitButtonText="Update"
          customForm={
            <TourForm
              defaultValues={{
                title: editingTour.title,
                description: editingTour.description,
                daysCount: editingTour.daysCount,
                nightsCount: editingTour.nightsCount,
                price: editingTour.price,
                oldPrice: editingTour.oldPrice,
                currency: editingTour.currency,
                featured: editingTour.featured,
                discount: editingTour.discount,
                activityTypes: editingTour.activityTypes || [],
                highlights: editingTour.highlights || [],
                inclusions: editingTour.inclusions,
                backgroundImage: null,
                additionalImages: [],
                days: editingTour.days || [],
                destinations: editingTour.destinations || [],
              }}
              onSubmit={handleUpdate}
              isLoading={formLoading}
              submitButtonText="Update"
            />
          }
            />
          )}
    </PageLayout>
  );
}
