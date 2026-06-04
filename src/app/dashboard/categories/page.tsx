"use client";

import { useMemo, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import {
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
  useGetCategoriesQuery,
  useUpdateCategoryMutation,
} from "@/store/api";
import type { Category } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { DataTable } from "@/components/data-table";
import { PageHeader } from "@/components/page-header";
import { toast } from "sonner";
import { Pencil, Plus, Trash2 } from "lucide-react";

function getErrorMessage(err: unknown, fallback: string) {
  const m = (err as { data?: { message?: string | string[] } })?.data?.message;
  if (Array.isArray(m)) return m.join(", ");
  return m ?? fallback;
}

export default function CategoriesPage() {
  const { data: items = [], isLoading } = useGetCategoriesQuery();
  const [createCategory] = useCreateCategoryMutation();
  const [updateCategory] = useUpdateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();

  const [editing, setEditing] = useState<Category | null>(null);
  const [open, setOpen] = useState(false);

  async function handleSave(form: { name: string; description: string }) {
    try {
      if (editing) {
        await updateCategory({ id: editing.id, ...form }).unwrap();
        toast.success("Category updated");
      } else {
        await createCategory(form).unwrap();
        toast.success("Category created");
      }
      setOpen(false);
      setEditing(null);
    } catch (err) {
      toast.error(getErrorMessage(err, "Save failed"));
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteCategory(id).unwrap();
      toast.success("Category deleted");
    } catch (err) {
      toast.error(getErrorMessage(err, "Delete failed"));
    }
  }

  const columns = useMemo<ColumnDef<Category>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => (
          <span className="font-medium">{row.original.name}</span>
        ),
      },
      {
        accessorKey: "description",
        header: "Description",
        cell: ({ row }) => (
          <span className="text-muted-foreground">
            {row.original.description || "—"}
          </span>
        ),
        enableSorting: false,
      },
      {
        accessorKey: "createdAt",
        header: "Created",
        cell: ({ row }) => (
          <span className="text-muted-foreground">
            {new Date(row.original.createdAt).toLocaleDateString()}
          </span>
        ),
      },
      {
        id: "actions",
        header: () => <span className="sr-only">Actions</span>,
        enableSorting: false,
        size: 120,
        cell: ({ row }) => {
          const c = row.original;
          return (
            <div className="flex justify-end">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setEditing(c);
                  setOpen(true);
                }}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <ConfirmDialog
                trigger={
                  <Button variant="ghost" size="icon" title="Delete category">
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                }
                title="Delete category"
                description={
                  <>
                    This will permanently delete{" "}
                    <span className="font-medium text-foreground">{c.name}</span>
                    . Products in this category may also be affected.
                  </>
                }
                confirmLabel="Delete"
                onConfirm={() => handleDelete(c.id)}
              />
            </div>
          );
        },
      },
    ],
    [],
  );

  return (
    <div>
      <PageHeader
        title="Categories"
        description="Group your products."
        actions={
          <Dialog
            open={open}
            onOpenChange={(v) => {
              setOpen(v);
              if (!v) setEditing(null);
            }}
          >
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> New category
              </Button>
            </DialogTrigger>
            <CategoryForm
              key={editing?.id ?? "new"}
              initial={editing}
              onSubmit={handleSave}
            />
          </Dialog>
        }
      />

      <DataTable
        columns={columns}
        data={items}
        isLoading={isLoading}
        searchPlaceholder="Search categories..."
        emptyMessage="No categories yet."
      />
    </div>
  );
}

function CategoryForm({
  initial,
  onSubmit,
}: {
  initial: Category | null;
  onSubmit: (data: { name: string; description: string }) => void;
}) {
  const [name, setName] = useState(initial?.name ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{initial ? "Edit category" : "New category"}</DialogTitle>
      </DialogHeader>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit({ name, description });
        }}
        className="space-y-4"
      >
        <div className="space-y-2">
          <Label htmlFor="cat-name">Name</Label>
          <Input
            id="cat-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="cat-desc">Description</Label>
          <Textarea
            id="cat-desc"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <Button type="submit">Save</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
