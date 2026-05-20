// lib/destinations/schema.ts
import * as z from "zod";
import type { FormField } from "@/components/ui/reusable-form";

// --- Constants for selects ---
export const DESTINATIONS_REGIONS = [
  "North",
  "South",
  "East",
  "West",
  "Central",
];

export const DESTINATION_TYPES = [
  "National Park",
  "Wildlife Reserve",
  "Cultural Site",
  "Historical Site",
  "Adventure Park",
  "Nature Reserve",
  "Conservation Area",
  "Scenic Viewpoint",
  "Crater Lake",
  "Forest Reserve",
  "Mountain Range",
  "Waterfall",
  "Hot Springs",
  "Cultural Village",
  "Archaeological Site",
  "Botanical Garden",
];

export const ATTRACTIONS = [
  "Canopy Walk way",
  "Gorilla trekking",
  "Chimpanzee tracking",
  "Safari drive",
  "Bird watching",
  "Nature walk",
  "Canopy walk",
  "Conservation tour",
  "Forest bathing",
  "Crater lake hike",
  "Scenic photo stop",
  "Sunset viewing",
  "Panoramic lookout",
  "Drone-friendly area",
  "Hidden gem discovery",
  "Nature photography",
];

export const WILDLIFE = [
  "African Elephant",
  "African Buffalo",
  "Lion",
  "Leopard",
  "Cheetah",
  "Hippopotamus",
  "Nile Crocodile",
  "Spotted Hyena",
  "African Wild Dog",
  "Warthog",
  "Giraffe",
  "Plains Zebra",
  "Thomson's Gazelle",
  "Impala",
  "Olive Baboon",
  "Vervet Monkey",
  "Black-and-white Colobus",
  "Common Chimpanzee",
  "Mountain Gorilla",
];

// --- Zod schemas ---
export const createDestinationSchema = z.object({
  name: z.string().nonempty("Name is required"),
  location: z.string().nonempty("Location is required"),
  region: z.string().nonempty("Region is required"),
  bestTimeToVisit: z.string().nonempty("Best time is required"),
  climate: z.string().nonempty("Climate is required"),
  description: z.string().nonempty("Description is required"),
  history: z.string().nonempty("History is required"),
  googleMapsLink: z.string().url("Must be a valid URL"),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  destinationType: z.string().nonempty("Destination type is required"),
  featured: z.boolean().default(false),
  attractions: z.array(z.string()),
  wildlife: z.array(z.string()),
  facts: z.array(z.string()).nonempty("Facts is required"),
  backgroundImage: z.instanceof(File, { message: "Image is required" }),
  additionalImages: z.array(z.instanceof(File))
    .min(4, "At least 4 additional images are required")
    .nullable(),
});

export const editDestinationSchema = createDestinationSchema.extend({
  backgroundImage: z.instanceof(File).nullable(),
  additionalImages: z.array(z.instanceof(File)).nullable(),
});

// --- FormField config ---
export const destinationFormFields: FormField[] = [
  { name: "name", label: "Name", type: "text", required: true },
  { name: "location", label: "Location", type: "text", required: true },
  {
    name: "region",
    label: "Region",
    type: "select",
    options: DESTINATIONS_REGIONS.map((r) => ({ value: r, label: r })),
    required: true,
  },
  {
    name: "destinationType",
    label: "Destination Type",
    type: "select",
    options: DESTINATION_TYPES.map((type) => ({ value: type, label: type })),
    required: true,
  },
  { name: "featured", label: "Featured Destination", type: "checkbox" },
  {
    name: "bestTimeToVisit",
    label: "Best Time to Visit",
    type: "text",
    required: true,
  },
  { name: "climate", label: "Climate", type: "text", required: true },
  {
    name: "description",
    label: "Description",
    type: "textarea",
    required: true,
  },
  { name: "history", label: "History", type: "textarea", required: true },
  {
    name: "googleMapsLink",
    label: "Google Maps Link",
    type: "text",
    required: true,
  },
  {
    name: "latitude",
    label: "Latitude",
    type: "number",
    placeholder: "e.g., 0.3476",
    step: 0.0001,
  },
  {
    name: "longitude",
    label: "Longitude",
    type: "number",
    placeholder: "e.g., 32.5825",
    step: 0.0001,
  },
  {
    name: "attractions",
    label: "Attractions",
    type: "multiselect",
    options: ATTRACTIONS.map((a) => ({ value: a, label: a })),
  },
  {
    name: "wildlife",
    label: "Wildlife",
    type: "multiselect",
    options: WILDLIFE.map((w) => ({ value: w, label: w })),
  },
  { name: "facts", label: "Facts", type: "tags", required: true },
  {
    name: "backgroundImage",
    label: "Background Image",
    type: "image",
    accept: "image/*",
    required: true,
    showPreview: true,
  },
  {
    name: "additionalImages",
    label: "Additional Images (min. 4)",
    type: "multiimage",
    accept: "image/*",
    maxFiles: 5,
    minFiles: 4,
    showPreview: true,
    required: true,
    description: "Upload at least 4 additional images for the destination",
  },
];

// --- Utility ---
export const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
