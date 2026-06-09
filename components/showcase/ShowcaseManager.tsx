"use client";
import React, { useState } from "react";
import { PageLayout } from "@/components/layouts/page-layout";
import { useCrudOperations } from "@/hooks/useCrudOperations";
import { FormDialog } from "@/components/ui/form-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";

// Shared CRUD manager for the two creative-arm galleries (Art, Storytelling).
// Both arms share one backend model (/showcase, distinguished by `kind`), so
// this component is parameterised by `kind` and the page picks a kind.

export type ShowcaseKind = "art" | "story";

interface ShowcaseItem {
  _id: string;
  kind: string;
  title: string;
  medium: string;
  image: { url: string; cloudinaryId: string };
  tall: boolean;
  featured: boolean;
  order: number;
  createdAt: string;
}

interface ShowcaseFormData {
  title: string;
  medium: string;
  tall: boolean;
  featured: boolean;
  order: string; // kept as string while editing; coerced server-side
  image: File | null;
}

const defaultForm: ShowcaseFormData = {
  title: "",
  medium: "",
  tall: false,
  featured: false,
  order: "0",
  image: null,
};

function ShowcaseForm({
  defaultValues,
  onSubmit,
  isLoading,
  submitButtonText = "Submit",
}: {
  defaultValues: ShowcaseFormData;
  onSubmit: (data: ShowcaseFormData) => Promise<boolean>;
  isLoading: boolean;
  submitButtonText?: string;
}) {
  const [form, setForm] = useState<ShowcaseFormData>(defaultValues);

  React.useEffect(() => {
    setForm(defaultValues);
  }, [defaultValues]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title) {
      toast.error("Title is required");
      return;
    }
    await onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <Label>Title *</Label>
        <Input
          value={form.title}
          onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
          required
        />
      </div>

      <div className="space-y-2">
        <Label>Medium</Label>
        <Input
          placeholder="e.g. Carved wood · beadwork"
          value={form.medium}
          onChange={(e) => setForm((p) => ({ ...p, medium: e.target.value }))}
        />
      </div>

      <div className="space-y-2">
        <Label>Order</Label>
        <Input
          type="number"
          placeholder="0"
          value={form.order}
          onChange={(e) => setForm((p) => ({ ...p, order: e.target.value }))}
        />
        <p className="text-xs text-muted-foreground">Lower numbers appear first.</p>
      </div>

      <div className="space-y-2">
        <Label>
          Image {!defaultValues.image ? "*" : "(leave empty to keep existing)"}
        </Label>
        <Input
          type="file"
          accept="image/*"
          onChange={(e) =>
            setForm((p) => ({ ...p, image: e.target.files?.[0] || null }))
          }
          required={!defaultValues.image}
        />
      </div>

      <div className="flex items-center gap-2">
        <Switch
          checked={form.tall}
          onCheckedChange={(v) => setForm((p) => ({ ...p, tall: v }))}
        />
        <Label>Tall tile (spans more rows in the gallery)</Label>
      </div>

      <div className="flex items-center gap-2">
        <Switch
          checked={form.featured}
          onCheckedChange={(v) => setForm((p) => ({ ...p, featured: v }))}
        />
        <Label>Featured</Label>
      </div>

      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
        {submitButtonText}
      </Button>
    </form>
  );
}

export default function ShowcaseManager({
  kind,
  pageTitle,
  entityName,
  addButtonText,
}: {
  kind: ShowcaseKind;
  pageTitle: string;
  entityName: string;
  addButtonText: string;
}) {
  const { items, loading, formLoading, createItem, updateItem, deleteItem } =
    useCrudOperations<ShowcaseItem, ShowcaseFormData>({
      // Hook builds `${endpoint}/${id}` for PUT/DELETE, so keep the endpoint
      // path clean (no query string) and filter by kind below.
      endpoint: "/showcase",
      entityName,
      transformFormData: (data) => {
        const fd = new FormData();
        fd.append("kind", kind);
        fd.append("title", data.title);
        fd.append("medium", data.medium);
        fd.append("tall", String(data.tall));
        fd.append("featured", String(data.featured));
        fd.append("order", data.order || "0");
        if (data.image) fd.append("image", data.image);
        return fd;
      },
    });

  const rows = items
    .filter((i) => i.kind === kind)
    .sort((a, b) => a.order - b.order);

  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState<ShowcaseItem | null>(null);

  const handleCreate = async (data: ShowcaseFormData) => {
    if (!data.image) {
      toast.error("Image is required");
      return false;
    }
    const ok = await createItem(data);
    if (ok) setCreateOpen(false);
    return ok;
  };

  const handleUpdate = async (data: ShowcaseFormData) => {
    if (!editing) return false;
    const ok = await updateItem(editing._id, data);
    if (ok) {
      setEditOpen(false);
      setEditing(null);
    }
    return ok;
  };

  const openEdit = (item: ShowcaseItem) => {
    setEditing(item);
    setEditOpen(true);
  };

  return (
    <PageLayout pageTitle={pageTitle}>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">{pageTitle}</h1>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="h-4 w-4 mr-2" /> {addButtonText}
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-20">Image</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Medium</TableHead>
              <TableHead>Order</TableHead>
              <TableHead>Featured</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                  Nothing here yet.
                </TableCell>
              </TableRow>
            ) : (
              rows.map((item) => (
                <TableRow key={item._id}>
                  <TableCell>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.image?.url}
                      alt={item.title}
                      className="h-12 w-12 rounded object-cover"
                    />
                  </TableCell>
                  <TableCell className="font-medium">{item.title}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {item.medium || "—"}
                  </TableCell>
                  <TableCell>{item.order}</TableCell>
                  <TableCell>{item.featured ? <Badge>Featured</Badge> : "—"}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button size="sm" variant="outline" onClick={() => openEdit(item)}>
                        <Pencil className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => deleteItem(item._id)}
                      >
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
        title={addButtonText}
        description="Upload an image and fill in the details."
        fields={[]}
        defaultValues={{}}
        validationSchema={{} as any}
        onSubmit={handleCreate}
        isLoading={formLoading}
        submitButtonText="Create"
        customForm={
          <ShowcaseForm
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
          title={`Edit ${entityName}`}
          description="Update the details."
          fields={[]}
          defaultValues={{}}
          validationSchema={{} as any}
          onSubmit={handleUpdate}
          isLoading={formLoading}
          submitButtonText="Update"
          customForm={
            <ShowcaseForm
              defaultValues={{
                title: editing.title,
                medium: editing.medium || "",
                tall: editing.tall,
                featured: editing.featured,
                order: editing.order?.toString() ?? "0",
                image: null,
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
