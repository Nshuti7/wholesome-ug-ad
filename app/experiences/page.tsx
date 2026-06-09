"use client";
import React, { useState } from "react";
import { PageLayout } from "@/components/layouts/page-layout";
import { useCrudOperations } from "@/hooks/useCrudOperations";
import { FormDialog } from "@/components/ui/form-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";

// Keep in sync with backend models/Experience.js EXPERIENCE_CATEGORIES.
const CATEGORIES = [
  "Cultural Experience",
  "Adventure",
  "Nature",
  "Photography",
  "Art & Craft",
  "Workshop",
  "City & Markets",
  "Food & Drink",
  "Music & Performance",
  "Scenic",
  "Community",
  // Legacy safari values — retained so older experiences still validate.
  "Gorilla Trekking",
  "Chimpanzee Tracking",
  "Bird Watching",
  "Boat Safari",
  "Nature Walk",
  "Scenic Drive",
  "Conservation Tour",
];

// Keep in sync with backend models/Experience.js enums.
const CURRENCIES = ["USD", "EUR", "GBP"];
const PRICE_UNITS = ["per person", "per permit", "per group"];
const DIFFICULTIES = ["Easy", "Moderate", "Challenging", "Strenuous"];

interface Experience {
  _id: string;
  title: string;
  description: string;
  category: string;
  duration: string;
  parks: string[];
  highlights: string[];
  coverImage: { url: string; cloudinaryId: string };
  additionalImages: { url: string; cloudinaryId: string }[];
  featured: boolean;
  // Pricing & logistics (optional — older records pre-date these).
  price?: number;
  currency?: string;
  priceUnit?: string;
  difficulty?: string;
  bestTime?: string;
  minAge?: number;
  groupSize?: string;
  included?: string[];
  whatToBring?: string[];
  createdAt: string;
}

interface ExperienceFormData {
  title: string;
  description: string;
  category: string;
  duration: string;
  parks: string[];
  highlights: string[];
  featured: boolean;
  // Numbers are kept as strings while editing; converted in transformFormData.
  price: string;
  currency: string;
  priceUnit: string;
  difficulty: string;
  bestTime: string;
  minAge: string;
  groupSize: string;
  included: string[];
  whatToBring: string[];
  coverImage: File | null;
  additionalImages: File[];
}

const defaultForm: ExperienceFormData = {
  title: "",
  description: "",
  category: "",
  duration: "",
  parks: [],
  highlights: [],
  featured: false,
  price: "",
  currency: "USD",
  priceUnit: "per person",
  difficulty: "",
  bestTime: "",
  minAge: "",
  groupSize: "",
  included: [],
  whatToBring: [],
  coverImage: null,
  additionalImages: [],
};

function ExperienceForm({
  defaultValues,
  onSubmit,
  isLoading,
  submitButtonText = "Submit",
}: {
  defaultValues: ExperienceFormData;
  onSubmit: (data: ExperienceFormData) => Promise<boolean>;
  isLoading: boolean;
  submitButtonText?: string;
}) {
  const [form, setForm] = useState<ExperienceFormData>(defaultValues);
  const [parkInput, setParkInput] = useState("");
  const [highlightInput, setHighlightInput] = useState("");
  const [includedInput, setIncludedInput] = useState("");
  const [bringInput, setBringInput] = useState("");

  React.useEffect(() => {
    setForm(defaultValues);
    setParkInput("");
    setHighlightInput("");
    setIncludedInput("");
    setBringInput("");
  }, [defaultValues]);

  // Generic add/remove for the string-array tag fields.
  type TagField = "parks" | "highlights" | "included" | "whatToBring";
  const addTag = (field: TagField, value: string, reset: () => void) => {
    const val = value.trim();
    if (val && !form[field].includes(val)) {
      setForm((prev) => ({ ...prev, [field]: [...prev[field], val] }));
      reset();
    }
  };
  const removeTag = (field: TagField, value: string) => {
    setForm((prev) => ({ ...prev, [field]: prev[field].filter((x) => x !== value) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.description || !form.category) {
      toast.error("Title, description, and category are required");
      return;
    }
    await onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <Label>Title *</Label>
        <Input value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} required />
      </div>

      <div className="space-y-2">
        <Label>Description *</Label>
        <Textarea value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} rows={3} required />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Category *</Label>
          <Select value={form.category} onValueChange={(v) => setForm((p) => ({ ...p, category: v }))}>
            <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Duration</Label>
          <Input placeholder="e.g. Half day, Full day" value={form.duration} onChange={(e) => setForm((p) => ({ ...p, duration: e.target.value }))} />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Regions / places</Label>
        <div className="flex gap-2">
          <Input
            value={parkInput}
            onChange={(e) => setParkInput(e.target.value)}
            placeholder="Add a region or place"
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag("parks", parkInput, () => setParkInput("")); } }}
          />
          <Button type="button" variant="outline" onClick={() => addTag("parks", parkInput, () => setParkInput(""))}>Add</Button>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {form.parks.map((p) => (
            <Badge key={p} variant="secondary" className="gap-1">
              {p}
              <span className="cursor-pointer text-xs" onClick={() => removeTag("parks", p)}>×</span>
            </Badge>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Highlights</Label>
        <div className="flex gap-2">
          <Input
            value={highlightInput}
            onChange={(e) => setHighlightInput(e.target.value)}
            placeholder="Add a highlight"
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag("highlights", highlightInput, () => setHighlightInput("")); } }}
          />
          <Button type="button" variant="outline" onClick={() => addTag("highlights", highlightInput, () => setHighlightInput(""))}>Add</Button>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {form.highlights.map((h) => (
            <Badge key={h} variant="secondary" className="gap-1">
              {h}
              <span className="cursor-pointer text-xs" onClick={() => removeTag("highlights", h)}>×</span>
            </Badge>
          ))}
        </div>
      </div>

      {/* Pricing */}
      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>Price</Label>
          <Input
            type="number"
            min={0}
            placeholder="e.g. 700"
            value={form.price}
            onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))}
          />
        </div>
        <div className="space-y-2">
          <Label>Currency</Label>
          <Select value={form.currency} onValueChange={(v) => setForm((p) => ({ ...p, currency: v }))}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {CURRENCIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Price unit</Label>
          <Select value={form.priceUnit} onValueChange={(v) => setForm((p) => ({ ...p, priceUnit: v }))}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {PRICE_UNITS.map((u) => <SelectItem key={u} value={u}>{u}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Logistics */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Difficulty</Label>
          <Select value={form.difficulty} onValueChange={(v) => setForm((p) => ({ ...p, difficulty: v }))}>
            <SelectTrigger><SelectValue placeholder="Select difficulty" /></SelectTrigger>
            <SelectContent>
              {DIFFICULTIES.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Best time</Label>
          <Input placeholder="e.g. Jun–Sep, year-round" value={form.bestTime} onChange={(e) => setForm((p) => ({ ...p, bestTime: e.target.value }))} />
        </div>
        <div className="space-y-2">
          <Label>Minimum age</Label>
          <Input type="number" min={0} placeholder="e.g. 15" value={form.minAge} onChange={(e) => setForm((p) => ({ ...p, minAge: e.target.value }))} />
        </div>
        <div className="space-y-2">
          <Label>Group size</Label>
          <Input placeholder="e.g. Max 8 people" value={form.groupSize} onChange={(e) => setForm((p) => ({ ...p, groupSize: e.target.value }))} />
        </div>
      </div>

      {/* What's included */}
      <div className="space-y-2">
        <Label>What's included</Label>
        <div className="flex gap-2">
          <Input
            value={includedInput}
            onChange={(e) => setIncludedInput(e.target.value)}
            placeholder="Add an included item"
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag("included", includedInput, () => setIncludedInput("")); } }}
          />
          <Button type="button" variant="outline" onClick={() => addTag("included", includedInput, () => setIncludedInput(""))}>Add</Button>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {form.included.map((h) => (
            <Badge key={h} variant="secondary" className="gap-1">
              {h}
              <span className="cursor-pointer text-xs" onClick={() => removeTag("included", h)}>×</span>
            </Badge>
          ))}
        </div>
      </div>

      {/* What to bring */}
      <div className="space-y-2">
        <Label>What to bring</Label>
        <div className="flex gap-2">
          <Input
            value={bringInput}
            onChange={(e) => setBringInput(e.target.value)}
            placeholder="Add an item to bring"
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag("whatToBring", bringInput, () => setBringInput("")); } }}
          />
          <Button type="button" variant="outline" onClick={() => addTag("whatToBring", bringInput, () => setBringInput(""))}>Add</Button>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {form.whatToBring.map((h) => (
            <Badge key={h} variant="secondary" className="gap-1">
              {h}
              <span className="cursor-pointer text-xs" onClick={() => removeTag("whatToBring", h)}>×</span>
            </Badge>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Cover Image {!defaultValues.coverImage ? "*" : "(leave empty to keep existing)"}</Label>
        <Input
          type="file"
          accept="image/*"
          onChange={(e) => setForm((p) => ({ ...p, coverImage: e.target.files?.[0] || null }))}
          required={!defaultValues.coverImage}
        />
      </div>

      <div className="space-y-2">
        <Label>Additional Images</Label>
        <Input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => setForm((p) => ({ ...p, additionalImages: Array.from(e.target.files || []) }))}
        />
      </div>

      <div className="flex items-center gap-2">
        <Switch checked={form.featured} onCheckedChange={(v) => setForm((p) => ({ ...p, featured: v }))} />
        <Label>Featured</Label>
      </div>

      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
        {submitButtonText}
      </Button>
    </form>
  );
}

export default function ExperiencesPage() {
  const { items: experiences, loading, formLoading, createItem, updateItem, deleteItem } =
    useCrudOperations<Experience, ExperienceFormData>({
      endpoint: "/experiences",
      entityName: "Experience",
      transformFormData: (data) => {
        const fd = new FormData();
        fd.append("title", data.title);
        fd.append("description", data.description);
        fd.append("category", data.category);
        fd.append("duration", data.duration);
        fd.append("featured", String(data.featured));
        data.parks.forEach((p) => fd.append("parks", p));
        data.highlights.forEach((h) => fd.append("highlights", h));
        // Pricing & logistics. Backend coerces "" → undefined for numbers;
        // difficulty is an enum with no default, so only send it when set.
        fd.append("price", data.price);
        fd.append("currency", data.currency);
        fd.append("priceUnit", data.priceUnit);
        if (data.difficulty) fd.append("difficulty", data.difficulty);
        fd.append("bestTime", data.bestTime);
        fd.append("minAge", data.minAge);
        fd.append("groupSize", data.groupSize);
        data.included.forEach((i) => fd.append("included", i));
        data.whatToBring.forEach((i) => fd.append("whatToBring", i));
        if (data.coverImage) fd.append("coverImage", data.coverImage);
        data.additionalImages.forEach((img) => fd.append("additionalImages", img));
        return fd;
      },
    });

  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState<Experience | null>(null);

  const handleCreate = async (data: ExperienceFormData) => {
    if (!data.coverImage) { toast.error("Cover image is required"); return false; }
    const ok = await createItem(data);
    if (ok) setCreateOpen(false);
    return ok;
  };

  const handleUpdate = async (data: ExperienceFormData) => {
    if (!editing) return false;
    const ok = await updateItem(editing._id, data);
    if (ok) { setEditOpen(false); setEditing(null); }
    return ok;
  };

  const openEdit = (exp: Experience) => {
    setEditing(exp);
    setEditOpen(true);
  };

  return (
    <PageLayout pageTitle="Experiences">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Experiences</h1>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="h-4 w-4 mr-2" /> Add Experience
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin" /></div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Featured</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {experiences.length === 0 ? (
              <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-8">No experiences yet.</TableCell></TableRow>
            ) : (
              experiences.map((exp) => (
                <TableRow key={exp._id}>
                  <TableCell className="font-medium">{exp.title}</TableCell>
                  <TableCell><Badge variant="outline">{exp.category}</Badge></TableCell>
                  <TableCell>{exp.duration || "—"}</TableCell>
                  <TableCell>{exp.featured ? <Badge>Featured</Badge> : "—"}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button size="sm" variant="outline" onClick={() => openEdit(exp)}>
                        <Pencil className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => deleteItem(exp._id)}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      )}

      <FormDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        title="Add Experience"
        description="Fill in the experience details."
        fields={[]}
        defaultValues={{}}
        validationSchema={{} as any}
        onSubmit={handleCreate}
        isLoading={formLoading}
        submitButtonText="Create"
        customForm={
          <ExperienceForm
            defaultValues={defaultForm}
            onSubmit={handleCreate}
            isLoading={formLoading}
            submitButtonText="Create"
          />
        }
      />

      {editing && (
        <FormDialog
          open={editOpen}
          onOpenChange={setEditOpen}
          title="Edit Experience"
          description="Update the experience details."
          fields={[]}
          defaultValues={{}}
          validationSchema={{} as any}
          onSubmit={handleUpdate}
          isLoading={formLoading}
          submitButtonText="Update"
          customForm={
            <ExperienceForm
              defaultValues={{
                title: editing.title,
                description: editing.description,
                category: editing.category,
                duration: editing.duration || "",
                parks: editing.parks || [],
                highlights: editing.highlights || [],
                featured: editing.featured,
                price: editing.price?.toString() ?? "",
                currency: editing.currency || "USD",
                priceUnit: editing.priceUnit || "per person",
                difficulty: editing.difficulty || "",
                bestTime: editing.bestTime || "",
                minAge: editing.minAge?.toString() ?? "",
                groupSize: editing.groupSize || "",
                included: editing.included || [],
                whatToBring: editing.whatToBring || [],
                coverImage: null,
                additionalImages: [],
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
