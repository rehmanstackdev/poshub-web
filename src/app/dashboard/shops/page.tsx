"use client";

import { useMemo, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import {
  useCreateShopMutation,
  useDeleteShopMutation,
  useGetShopsQuery,
  useUpdateShopMutation,
} from "@/store/api";
import { useAppSelector } from "@/store/hooks";
import type { Shop } from "@/lib/types";
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
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { DataTable } from "@/components/data-table";
import { PageHeader } from "@/components/page-header";
import { toast } from "sonner";
import { Pencil, Plus, Store, Trash2 } from "lucide-react";

interface ShopFormState {
  name: string;
  address: string;
  phone: string;
}

function getErrorMessage(err: unknown, fallback: string) {
  const m = (err as { data?: { message?: string | string[] } })?.data?.message;
  if (Array.isArray(m)) return m.join(", ");
  return m ?? fallback;
}

export default function ShopsPage() {
  const me = useAppSelector((s) => s.auth.user);
  const { data: shops = [], isLoading } = useGetShopsQuery(undefined, {
    skip: me?.role !== "super_admin",
  });
  const [createShop] = useCreateShopMutation();
  const [updateShop] = useUpdateShopMutation();
  const [deleteShop] = useDeleteShopMutation();

  const [editing, setEditing] = useState<Shop | null>(null);
  const [open, setOpen] = useState(false);

  async function handleSave(form: ShopFormState) {
    try {
      if (editing) {
        await updateShop({
          id: editing.id,
          name: form.name,
          address: form.address || undefined,
          phone: form.phone || undefined,
        }).unwrap();
        toast.success("Shop updated");
      } else {
        await createShop({
          name: form.name,
          address: form.address || undefined,
          phone: form.phone || undefined,
        }).unwrap();
        toast.success("Shop created");
      }
      setOpen(false);
      setEditing(null);
    } catch (err) {
      toast.error(getErrorMessage(err, "Save failed"));
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteShop(id).unwrap();
      toast.success("Shop deleted");
    } catch (err) {
      toast.error(getErrorMessage(err, "Delete failed"));
    }
  }

  async function handleToggleActive(shop: Shop) {
    try {
      await updateShop({ id: shop.id, isActive: !shop.isActive }).unwrap();
      toast.success(shop.isActive ? "Shop deactivated" : "Shop activated");
    } catch (err) {
      toast.error(getErrorMessage(err, "Update failed"));
    }
  }

  const columns = useMemo<ColumnDef<Shop>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Shop Name",
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
              <Store className="h-4 w-4 text-primary" />
            </div>
            <span className="font-medium">{row.original.name}</span>
          </div>
        ),
      },
      {
        accessorKey: "address",
        header: "Address",
        cell: ({ row }) => (
          <span className="text-muted-foreground text-sm">
            {row.original.address ?? "—"}
          </span>
        ),
      },
      {
        accessorKey: "phone",
        header: "Phone",
        cell: ({ row }) => (
          <span className="text-muted-foreground text-sm">
            {row.original.phone ?? "—"}
          </span>
        ),
      },
      {
        accessorKey: "isActive",
        header: "Status",
        cell: ({ row }) => {
          const s = row.original;
          return (
            <Badge
              variant="secondary"
              className={
                s.isActive
                  ? "cursor-pointer bg-chart-3/20 text-chart-3 hover:bg-chart-3/30"
                  : "cursor-pointer bg-destructive/15 text-destructive hover:bg-destructive/25"
              }
              onClick={() => handleToggleActive(s)}
              title={s.isActive ? "Click to deactivate" : "Click to activate"}
            >
              {s.isActive ? "Active" : "Inactive"}
            </Badge>
          );
        },
      },
      {
        id: "actions",
        header: () => <span className="sr-only">Actions</span>,
        enableSorting: false,
        size: 120,
        cell: ({ row }) => {
          const s = row.original;
          return (
            <div className="flex justify-end gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setEditing(s);
                  setOpen(true);
                }}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <ConfirmDialog
                trigger={
                  <Button variant="ghost" size="icon" title="Delete shop">
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                }
                title="Delete shop"
                description={
                  <>
                    This will permanently delete{" "}
                    <span className="font-medium text-foreground">{s.name}</span>{" "}
                    and all its data. This action cannot be undone.
                  </>
                }
                confirmLabel="Delete"
                onConfirm={() => handleDelete(s.id)}
              />
            </div>
          );
        },
      },
    ],
    [],
  );

  if (me?.role !== "super_admin") {
    return (
      <p className="text-muted-foreground">
        Only Super Admins can manage shops.
      </p>
    );
  }

  return (
    <div>
      <PageHeader
        title="Shops"
        description="Each shop is an isolated tenant. Admins and staff can only see data from their assigned shop."
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
                <Plus className="mr-2 h-4 w-4" /> New shop
              </Button>
            </DialogTrigger>
            <ShopForm
              key={editing?.id ?? "new"}
              initial={editing}
              onSubmit={handleSave}
            />
          </Dialog>
        }
      />

      <DataTable
        columns={columns}
        data={shops}
        isLoading={isLoading}
        searchPlaceholder="Search by name, address..."
        emptyMessage="No shops yet. Create one to get started."
      />
    </div>
  );
}

function ShopForm({
  initial,
  onSubmit,
}: {
  initial: Shop | null;
  onSubmit: (data: ShopFormState) => void;
}) {
  const [form, setForm] = useState<ShopFormState>({
    name: initial?.name ?? "",
    address: initial?.address ?? "",
    phone: initial?.phone ?? "",
  });

  function update<K extends keyof ShopFormState>(
    key: K,
    value: ShopFormState[K],
  ) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{initial ? "Edit shop" : "New shop"}</DialogTitle>
      </DialogHeader>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit(form);
        }}
        className="space-y-4"
      >
        <div className="space-y-2">
          <Label htmlFor="s-name">Shop Name *</Label>
          <Input
            id="s-name"
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            placeholder="e.g. Main Street Store"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="s-address">Address</Label>
          <Input
            id="s-address"
            value={form.address}
            onChange={(e) => update("address", e.target.value)}
            placeholder="e.g. 123 Main Street"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="s-phone">Phone</Label>
          <Input
            id="s-phone"
            value={form.phone}
            onChange={(e) => update("phone", e.target.value)}
            placeholder="e.g. +1-555-0101"
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
