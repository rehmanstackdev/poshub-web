"use client";

import { useState } from "react";
import {
  useCreateUserMutation,
  useDisableUserMutation,
  useGetUsersQuery,
  useUpdateUserMutation,
} from "@/store/api";
import { useAppSelector } from "@/store/hooks";
import type { Role, User } from "@/lib/types";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/page-header";
import { TableRowSkeleton } from "@/components/skeletons";
import { toast } from "sonner";
import { Pencil, Plus, UserX } from "lucide-react";

interface UserFormState {
  name: string;
  email: string;
  password: string;
  role: Role;
}

function getErrorMessage(err: unknown, fallback: string) {
  const m = (err as { data?: { message?: string | string[] } })?.data?.message;
  if (Array.isArray(m)) return m.join(", ");
  return m ?? fallback;
}

export default function UsersPage() {
  const me = useAppSelector((s) => s.auth.user);
  const { data: items = [], isLoading } = useGetUsersQuery(undefined, {
    skip: me?.role !== "super_admin",
  });
  const [createUser] = useCreateUserMutation();
  const [updateUser] = useUpdateUserMutation();
  const [disableUserMutate] = useDisableUserMutation();

  const [editing, setEditing] = useState<User | null>(null);
  const [open, setOpen] = useState(false);

  if (me?.role !== "super_admin") {
    return (
      <p className="text-muted-foreground">
        Only Super Admins can manage users.
      </p>
    );
  }

  async function handleSave(form: UserFormState) {
    try {
      if (editing) {
        const payload: Partial<UserFormState> & { id: string } = {
          id: editing.id,
          name: form.name,
          email: form.email,
          role: form.role,
        };
        if (form.password) payload.password = form.password;
        await updateUser(payload).unwrap();
        toast.success("User updated");
      } else {
        await createUser(form).unwrap();
        toast.success("User created");
      }
      setOpen(false);
      setEditing(null);
    } catch (err) {
      toast.error(getErrorMessage(err, "Save failed"));
    }
  }

  async function disable(id: string) {
    if (!confirm("Disable this user?")) return;
    try {
      await disableUserMutate(id).unwrap();
      toast.success("User disabled");
    } catch (err) {
      toast.error(getErrorMessage(err, "Disable failed"));
    }
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
              onSubmit={handleSave}
            />
          </Dialog>
        }
      />

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-32 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRowSkeleton columns={5} />
            ) : items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-muted-foreground">
                  No users yet.
                </TableCell>
              </TableRow>
            ) : (
              items.map((u) => (
                <TableRow key={u.id}>
                  <TableCell className="font-medium">{u.name}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {u.email}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className="bg-primary/15 text-primary capitalize"
                    >
                      {u.role.replace("_", " ")}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={u.status === "active" ? "secondary" : "destructive"}
                      className={
                        u.status === "active" ? "bg-chart-3/20 text-chart-3" : ""
                      }
                    >
                      {u.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
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
                    {u.status === "active" && u.id !== me?.id && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => disable(u.id)}
                      >
                        <UserX className="h-4 w-4 text-destructive" />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}

function UserForm({
  initial,
  onSubmit,
}: {
  initial: User | null;
  onSubmit: (data: UserFormState) => void;
}) {
  const [form, setForm] = useState<UserFormState>({
    name: initial?.name ?? "",
    email: initial?.email ?? "",
    password: "",
    role: initial?.role ?? "staff",
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
            <SelectTrigger id="u-role">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="super_admin">Super Admin</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="staff">Staff</SelectItem>
            </SelectContent>
          </Select>
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
