"use client";

import { useMemo, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import {
  useCreateUserMutation,
  useDeleteUserMutation,
  useGetShopsQuery,
  useGetUsersQuery,
  useUpdateUserMutation,
} from "@/store/api";
import { useAppSelector } from "@/store/hooks";
import type { Role, Shop, User } from "@/lib/types";
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
import { Pencil, Plus, Trash2 } from "lucide-react";

interface UserFormState {
  name: string;
  email: string;
  password: string;
  role: Role;
  shopId: string;
}

function getErrorMessage(err: unknown, fallback: string) {
  const m = (err as { data?: { message?: string | string[] } })?.data?.message;
  if (Array.isArray(m)) return m.join(", ");
  return m ?? fallback;
}

export default function UsersPage() {
  const me = useAppSelector((s) => s.auth.user);
  const canManage = me?.role === "super_admin" || me?.role === "admin";
  const { data: items = [], isLoading } = useGetUsersQuery(undefined, {
    skip: !canManage,
  });
  const { data: shops = [] } = useGetShopsQuery(undefined, {
    skip: me?.role !== "super_admin",
  });
  const [createUser] = useCreateUserMutation();
  const [updateUser] = useUpdateUserMutation();
  const [deleteUserMutate] = useDeleteUserMutation();

  const [editing, setEditing] = useState<User | null>(null);
  const [open, setOpen] = useState(false);

  async function handleSave(form: UserFormState) {
    try {
      if (editing) {
        const payload: Record<string, unknown> & { id: string } = {
          id: editing.id,
          name: form.name,
          email: form.email,
          role: form.role,
          shopId: form.shopId || null,
        };
        if (form.password) payload.password = form.password;
        await updateUser(payload as Parameters<typeof updateUser>[0]).unwrap();
        toast.success("User updated");
      } else {
        await createUser({
          name: form.name,
          email: form.email,
          password: form.password,
          role: form.role,
          shopId: form.shopId || undefined,
        } as Parameters<typeof createUser>[0]).unwrap();
        toast.success("User created");
      }
      setOpen(false);
      setEditing(null);
    } catch (err) {
      toast.error(getErrorMessage(err, "Save failed"));
    }
  }

  async function deleteUser(id: string) {
    try {
      await deleteUserMutate(id).unwrap();
      toast.success("User deleted");
    } catch (err) {
      toast.error(getErrorMessage(err, "Delete failed"));
    }
  }

  const columns = useMemo<ColumnDef<User>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => (
          <span className="font-medium">{row.original.name}</span>
        ),
      },
      {
        accessorKey: "email",
        header: "Email",
        cell: ({ row }) => (
          <span className="text-muted-foreground">{row.original.email}</span>
        ),
      },
      {
        accessorKey: "role",
        header: "Role",
        cell: ({ row }) => (
          <Badge
            variant="secondary"
            className="bg-primary/15 text-primary capitalize"
          >
            {row.original.role.replace("_", " ")}
          </Badge>
        ),
      },
      {
        accessorKey: "shopId",
        header: "Shop",
        cell: ({ row }) => {
          const shopName = shops.find((s) => s.id === row.original.shopId)?.name;
          return (
            <span className="text-muted-foreground text-sm">
              {shopName ?? (row.original.role === "super_admin" ? "All shops" : "—")}
            </span>
          );
        },
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const u = row.original;
          return (
            <Badge
              variant={u.status === "active" ? "secondary" : "destructive"}
              className={
                u.status === "active" ? "bg-chart-3/20 text-chart-3" : ""
              }
            >
              {u.status}
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
          const u = row.original;
          return (
            <div className="flex justify-end">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setEditing(u);
                  setOpen(true);
                }}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              {u.id !== me?.id && (
                <ConfirmDialog
                  trigger={
                    <Button variant="ghost" size="icon" title="Delete user">
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  }
                  title="Delete user"
                  description={
                    <>
                      Permanently delete{" "}
                      <span className="font-medium text-foreground">
                        {u.name}
                      </span>
                      ? This cannot be undone.
                    </>
                  }
                  confirmLabel="Delete"
                  onConfirm={() => deleteUser(u.id)}
                />
              )}
            </div>
          );
        },
      },
    ],
    [me?.id],
  );

  if (!canManage) {
    return (
      <p className="text-muted-foreground">
        Only Admins and Super Admins can manage users.
      </p>
    );
  }

  return (
    <div>
      <PageHeader
        title="Users"
        description="Manage Super Admins, Admins, and Staff."
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
                <Plus className="mr-2 h-4 w-4" /> New user
              </Button>
            </DialogTrigger>
            <UserForm
              key={editing?.id ?? "new"}
              initial={editing}
              shops={shops}
              currentUserShopId={me?.shopId ?? null}
              isSuperAdmin={me?.role === "super_admin"}
              onSubmit={handleSave}
            />
          </Dialog>
        }
      />

      <DataTable
        columns={columns}
        data={items}
        isLoading={isLoading}
        searchPlaceholder="Search by name, email..."
        emptyMessage="No users yet."
      />
    </div>
  );
}

function UserForm({
  initial,
  shops,
  currentUserShopId,
  isSuperAdmin,
  onSubmit,
}: {
  initial: User | null;
  shops: Shop[];
  currentUserShopId: string | null;
  isSuperAdmin: boolean;
  onSubmit: (data: UserFormState) => void;
}) {
  const [form, setForm] = useState<UserFormState>({
    name: initial?.name ?? "",
    email: initial?.email ?? "",
    password: "",
    role: initial?.role ?? "staff",
    shopId: initial?.shopId ?? currentUserShopId ?? "",
  });

  function update<K extends keyof UserFormState>(
    key: K,
    value: UserFormState[K],
  ) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{initial ? "Edit user" : "New user"}</DialogTitle>
      </DialogHeader>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit(form);
        }}
        className="space-y-4"
      >
        <div className="space-y-2">
          <Label htmlFor="u-name">Name</Label>
          <Input
            id="u-name"
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="u-email">Email</Label>
          <Input
            id="u-email"
            type="email"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="u-pass">
            Password{" "}
            {initial && (
              <span className="text-xs text-muted-foreground">
                (leave blank to keep)
              </span>
            )}
          </Label>
          <Input
            id="u-pass"
            type="password"
            value={form.password}
            onChange={(e) => update("password", e.target.value)}
            minLength={initial ? 0 : 6}
            required={!initial}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="u-role">Role</Label>
          <Select
            value={form.role}
            onValueChange={(v) => update("role", v as Role)}
          >
            <SelectTrigger id="u-role" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {isSuperAdmin && (
                <SelectItem value="super_admin">Super Admin</SelectItem>
              )}
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="staff">Staff</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {isSuperAdmin && form.role !== "super_admin" && (
          <div className="space-y-2">
            <Label htmlFor="u-shop">Assign to Shop</Label>
            <Select
              value={form.shopId}
              onValueChange={(v) => update("shopId", v)}
            >
              <SelectTrigger id="u-shop" className="w-full">
                <SelectValue placeholder="Select shop…" />
              </SelectTrigger>
              <SelectContent>
                {shops.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
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
