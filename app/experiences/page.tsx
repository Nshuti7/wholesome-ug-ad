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

const CATEGORIES = [
  "Gorilla Trekking",
  "Chimpanzee Tracking",
  "Bird Watching",
  "Boat Safari",
  "Nature Walk",
  "Cultural Experience",
  "Adventure",
  "Photography",
  "Scenic Drive",
  "Conservation Tour",
];

const PARKS = [
  "Bwindi Impenetrable",
  "Queen Elizabeth",
  "Murchison Falls",
  "Kidepo Valley",
  "Lake Mburo",
  "Mount Elgon",
  "Kibale",
  "Semuliki",
  "Rwenzori",
];

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
  const [highlightInput, setHighlightInput] = useState("");

  React.useEffect(() => {
    setForm(defaultValues);
    setHighlightInput("");
  }, [defaultValues]);

  const togglePark = (park: string) => {
    setForm((prev) => ({
      ...prev,
      parks: prev.parks.includes(park)
        ? prev.parks.filter((p) => p !== park)
        : [...prev.parks, park],
    }));
  };

  const addHighlight = () => {
    const val = highlightInput.trim();
    if (val && !form.highlights.includes(val)) {
      setForm((prev) => ({ ...prev, highlights: [...prev.highlights, val] }));
      setHighlightInput("");
    }
  };

  const removeHighlight = (h: string) => {
    setForm((prev) => ({ ...prev, highlights: prev.highlights.filter((x) => x !== h) }));
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
        <Label>Parks</Label>
        <div className="flex flex-wrap gap-2">
          {PARKS.map((park) => (
            <Badge
              key={park}
              variant={form.parks.includes(park) ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => togglePark(park)}
            >
              {park}
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
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addHighlight(); } }}
          />
          <Button type="button" variant="outline" onClick={addHighlight}>Add</Button>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {form.highlights.map((h) => (
            <Badge key={h} variant="secondary" className="gap-1">
              {h}
              <span className="cursor-pointer text-xs" onClick={() => removeHighlight(h)}>×</span>
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
