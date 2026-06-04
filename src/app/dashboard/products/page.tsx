"use client";

import { useMemo, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import {
  useAdjustStockMutation,
  useCreateProductMutation,
  useDeleteProductMutation,
  useGetCategoriesQuery,
  useGetProductsQuery,
  useUpdateProductMutation,
} from "@/store/api";
import type { Category, Product } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { DataTable } from "@/components/data-table";
import { PageHeader } from "@/components/page-header";
import { toast } from "sonner";
import { Minus, Pencil, Plus, Trash2 } from "lucide-react";

interface ProductFormState {
  name: string;
  sku: string;
  categoryId: string;
  price: string;
  cost: string;
  quantity: string;
  lowStockLimit: string;
}

const blankForm: ProductFormState = {
  name: "",
  sku: "",
  categoryId: "",
  price: "0",
  cost: "0",
  quantity: "0",
  lowStockLimit: "5",
};

function getErrorMessage(err: unknown, fallback: string) {
  const m = (err as { data?: { message?: string | string[] } })?.data?.message;
  if (Array.isArray(m)) return m.join(", ");
  return m ?? fallback;
}

export default function ProductsPage() {
  const { data: items = [], isLoading } = useGetProductsQuery();
  const { data: cats = [] } = useGetCategoriesQuery();
  const [createProduct] = useCreateProductMutation();
  const [updateProduct] = useUpdateProductMutation();
  const [adjustStockMutate] = useAdjustStockMutation();
  const [deleteProduct] = useDeleteProductMutation();

  const [editing, setEditing] = useState<Product | null>(null);
  const [open, setOpen] = useState(false);

  async function handleSave(form: ProductFormState) {
    const payload = {
      name: form.name,
      sku: form.sku,
      categoryId: form.categoryId,
      price: Number(form.price),
      cost: Number(form.cost),
      quantity: Number(form.quantity),
      lowStockLimit: Number(form.lowStockLimit),
    };
    try {
      if (editing) {
        await updateProduct({ id: editing.id, ...payload }).unwrap();
        toast.success("Product updated");
      } else {
        await createProduct(payload).unwrap();
        toast.success("Product created");
      }
      setOpen(false);
      setEditing(null);
    } catch (err) {
      toast.error(getErrorMessage(err, "Save failed"));
    }
  }

  async function adjustStock(id: string, delta: number) {
    try {
      await adjustStockMutate({ id, delta }).unwrap();
      toast.success(delta > 0 ? "Stock added" : "Stock removed");
    } catch (err) {
      toast.error(getErrorMessage(err, "Stock adjust failed"));
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteProduct(id).unwrap();
      toast.success("Product deleted");
    } catch (err) {
      toast.error(getErrorMessage(err, "Delete failed"));
    }
  }

  const columns = useMemo<ColumnDef<Product>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => (
          <span className="font-medium">{row.original.name}</span>
        ),
      },
      {
        accessorKey: "sku",
        header: "SKU",
        cell: ({ row }) => (
          <span className="font-mono text-xs">{row.original.sku}</span>
        ),
      },
      {
        id: "category",
        header: "Category",
        accessorFn: (row) => row.category?.name ?? "",
        cell: ({ row }) => (
          <span className="text-muted-foreground">
            {row.original.category?.name ?? "—"}
          </span>
        ),
      },
      {
        accessorKey: "price",
        header: "Price",
        sortingFn: (a, b) => Number(a.original.price) - Number(b.original.price),
        cell: ({ row }) => (
          <span className="text-right block">${row.original.price}</span>
        ),
      },
      {
        accessorKey: "quantity",
        header: "Stock",
        cell: ({ row }) => {
          const p = row.original;
          const low = p.quantity <= p.lowStockLimit;
          return (
            <Badge
              variant={low ? "destructive" : "secondary"}
              className={low ? "" : "bg-primary/15 text-primary"}
            >
              {p.quantity}
            </Badge>
          );
        },
      },
      {
        id: "actions",
        header: () => <span className="sr-only">Actions</span>,
        enableSorting: false,
        size: 180,
        cell: ({ row }) => {
          const p = row.original;
          return (
            <div className="flex justify-end">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => adjustStock(p.id, 1)}
                title="Add 1 to stock"
              >
                <Plus className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => adjustStock(p.id, -1)}
                title="Remove 1 from stock"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setEditing(p);
                  setOpen(true);
                }}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <ConfirmDialog
                trigger={
                  <Button variant="ghost" size="icon" title="Delete product">
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                }
                title="Delete product"
                description={
                  <>
                    This will permanently delete{" "}
                    <span className="font-medium text-foreground">{p.name}</span>
                    . This action cannot be undone.
                  </>
                }
                confirmLabel="Delete"
                onConfirm={() => handleDelete(p.id)}
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
        title="Products"
        description="Inventory and pricing."
        actions={
          <Dialog
            open={open}
            onOpenChange={(v) => {
              setOpen(v);
              if (!v) setEditing(null);
            }}
          >
            <DialogTrigger asChild>
              <Button disabled={cats.length === 0}>
                <Plus className="mr-2 h-4 w-4" /> New product
              </Button>
            </DialogTrigger>
            <ProductForm
              key={editing?.id ?? "new"}
              initial={editing}
              categories={cats}
              onSubmit={handleSave}
            />
          </Dialog>
        }
      />

      {cats.length === 0 && !isLoading && (
        <p className="mb-4 text-sm text-muted-foreground">
          Create a category first.
        </p>
      )}

      <DataTable
        columns={columns}
        data={items}
        isLoading={isLoading}
        searchPlaceholder="Search products by name, SKU, category..."
        emptyMessage="No products yet."
      />
    </div>
  );
}

function ProductForm({
  initial,
  categories,
  onSubmit,
}: {
  initial: Product | null;
  categories: Category[];
  onSubmit: (data: ProductFormState) => void;
}) {
  const [form, setForm] = useState<ProductFormState>(
    initial
      ? {
          name: initial.name,
          sku: initial.sku,
          categoryId: initial.categoryId,
          price: initial.price,
          cost: initial.cost,
          quantity: String(initial.quantity),
          lowStockLimit: String(initial.lowStockLimit),
        }
      : { ...blankForm, categoryId: categories[0]?.id ?? "" },
  );

  function update<K extends keyof ProductFormState>(
    key: K,
    value: ProductFormState[K],
  ) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  return (
    <DialogContent className="max-w-lg">
      <DialogHeader>
        <DialogTitle>{initial ? "Edit product" : "New product"}</DialogTitle>
      </DialogHeader>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit(form);
        }}
        className="space-y-4"
      >
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2 space-y-2">
            <Label htmlFor="p-name">Name</Label>
            <Input
              id="p-name"
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="p-sku">SKU</Label>
            <Input
              id="p-sku"
              value={form.sku}
              onChange={(e) => update("sku", e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="p-cat">Category</Label>
            <Select
              value={form.categoryId}
              onValueChange={(v) => update("categoryId", v)}
            >
              <SelectTrigger id="p-cat">
                <SelectValue placeholder="Pick a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="p-price">Price</Label>
            <Input
              id="p-price"
              type="number"
              step="0.01"
              min={0}
              value={form.price}
              onChange={(e) => update("price", e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="p-cost">Cost</Label>
            <Input
              id="p-cost"
              type="number"
              step="0.01"
              min={0}
              value={form.cost}
              onChange={(e) => update("cost", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="p-qty">Quantity</Label>
            <Input
              id="p-qty"
              type="number"
              min={0}
              value={form.quantity}
              onChange={(e) => update("quantity", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="p-low">Low stock limit</Label>
            <Input
              id="p-low"
              type="number"
              min={0}
              value={form.lowStockLimit}
              onChange={(e) => update("lowStockLimit", e.target.value)}
            />
          </div>
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
