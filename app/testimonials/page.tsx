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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Plus, Pencil, Trash2, Loader2, Star } from "lucide-react";
import { toast } from "sonner";

interface Testimonial {
  _id: string;
  name: string;
  location: string;
  trip: string;
  quote: string;
  headline: string;
  rating: number;
  featured: boolean;
  createdAt: string;
}

interface TestimonialFormData {
  name: string;
  location: string;
  trip: string;
  quote: string;
  headline: string;
  rating: number;
  featured: boolean;
}

const defaultForm: TestimonialFormData = {
  name: "",
  location: "",
  trip: "",
  quote: "",
  headline: "",
  rating: 5,
  featured: false,
};

function TestimonialForm({
  defaultValues,
  onSubmit,
  isLoading,
  submitButtonText = "Submit",
}: {
  defaultValues: TestimonialFormData;
  onSubmit: (data: TestimonialFormData) => Promise<boolean>;
  isLoading: boolean;
  submitButtonText?: string;
}) {
  const [form, setForm] = useState<TestimonialFormData>(defaultValues);

  React.useEffect(() => {
    setForm(defaultValues);
  }, [defaultValues]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.quote) {
      toast.error("Name and quote are required");
      return;
    }
    await onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Name *</Label>
          <Input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} required />
        </div>
        <div className="space-y-2">
          <Label>Location</Label>
          <Input placeholder="e.g. London, UK" value={form.location} onChange={(e) => setForm((p) => ({ ...p, location: e.target.value }))} />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Trip / Itinerary</Label>
        <Input placeholder="e.g. 8-Day Bwindi Gorilla Trek" value={form.trip} onChange={(e) => setForm((p) => ({ ...p, trip: e.target.value }))} />
      </div>

      <div className="space-y-2">
        <Label>Headline</Label>
        <Input placeholder="A short pull quote for display" value={form.headline} onChange={(e) => setForm((p) => ({ ...p, headline: e.target.value }))} />
      </div>

      <div className="space-y-2">
        <Label>Quote *</Label>
        <Textarea value={form.quote} onChange={(e) => setForm((p) => ({ ...p, quote: e.target.value }))} rows={4} required />
      </div>

      <div className="space-y-2">
        <Label>Rating (1–5)</Label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <Star
              key={n}
              className={`h-6 w-6 cursor-pointer transition-colors ${n <= form.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
              onClick={() => setForm((p) => ({ ...p, rating: n }))}
            />
          ))}
        </div>
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

export default function TestimonialsPage() {
  const { items: testimonials, loading, formLoading, createItem, updateItem, deleteItem } =
    useCrudOperations<Testimonial, TestimonialFormData>({
      endpoint: "/testimonials",
      entityName: "Testimonial",
    });

  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState<Testimonial | null>(null);

  const handleCreate = async (data: TestimonialFormData) => {
    const ok = await createItem(data);
    if (ok) setCreateOpen(false);
    return ok;
  };

  const handleUpdate = async (data: TestimonialFormData) => {
    if (!editing) return false;
    const ok = await updateItem(editing._id, data);
    if (ok) { setEditOpen(false); setEditing(null); }
    return ok;
  };

  const openEdit = (t: Testimonial) => {
    setEditing(t);
    setEditOpen(true);
  };

  return (
    <PageLayout pageTitle="Testimonials">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Testimonials</h1>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="h-4 w-4 mr-2" /> Add Testimonial
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin" /></div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Trip</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Featured</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {testimonials.length === 0 ? (
              <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">No testimonials yet.</TableCell></TableRow>
            ) : (
              testimonials.map((t) => (
                <TableRow key={t._id}>
                  <TableCell className="font-medium">{t.name}</TableCell>
                  <TableCell>{t.location || "—"}</TableCell>
                  <TableCell>{t.trip || "—"}</TableCell>
                  <TableCell>
                    <div className="flex gap-0.5">
                      {Array.from({ length: t.rating }).map((_, i) => (
                        <Star key={i} className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>{t.featured ? <Badge>Featured</Badge> : "—"}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button size="sm" variant="outline" onClick={() => openEdit(t)}>
                        <Pencil className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => deleteItem(t._id)}>
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
        title="Add Testimonial"
        description="Fill in the testimonial details."
        fields={[]}
        defaultValues={{}}
        validationSchema={{} as any}
        onSubmit={handleCreate}
        isLoading={formLoading}
        submitButtonText="Create"
        customForm={
          <TestimonialForm
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
          title="Edit Testimonial"
          description="Update the testimonial details."
          fields={[]}
          defaultValues={{}}
          validationSchema={{} as any}
          onSubmit={handleUpdate}
          isLoading={formLoading}
          submitButtonText="Update"
          customForm={
            <TestimonialForm
              defaultValues={{
                name: editing.name,
                location: editing.location || "",
                trip: editing.trip || "",
                quote: editing.quote,
                headline: editing.headline || "",
                rating: editing.rating || 5,
                featured: editing.featured,
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
