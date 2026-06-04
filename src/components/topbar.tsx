"use client";

import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { clearCredentials } from "@/store/auth-slice";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "@/components/theme-toggle";
import { MobileSidebar } from "@/components/mobile-sidebar";
import { LogOut, Store } from "lucide-react";
import { useGetShopsQuery } from "@/store/api";
import type { Role } from "@/lib/types";

const ROLE_LABELS: Record<string, string> = {
  super_admin: "Super Admin",
  admin: "Admin",
  staff: "Staff",
};

export function Topbar({ role }: { role: Role }) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);
  const { data: shops = [] } = useGetShopsQuery(undefined, {
    skip: role !== "super_admin",
  });
  if (!user) return null;

  const shopName = user.shopId
    ? shops.find((s) => s.id === user.shopId)?.name
    : role === "super_admin"
    ? "All Shops"
    : undefined;

  const initials = user.name
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  function logout() {
    dispatch(clearCredentials());
    router.push("/login");
  }

  return (
    <header className="flex h-14 items-center justify-between gap-2 border-b border-border bg-card/40 px-3 sm:px-6 backdrop-blur">
      <div className="flex min-w-0 items-center gap-2">
        <MobileSidebar role={role} />
        <div className="min-w-0 truncate text-sm text-muted-foreground">
          <span className="hidden sm:inline">Logged in as </span>
          <span className="font-medium text-foreground">{user.name}</span>
          <span className="ml-2 hidden rounded-full border border-primary/40 bg-primary/10 px-2 py-0.5 text-xs uppercase tracking-wider text-primary sm:inline">
            {ROLE_LABELS[user.role] ?? user.role}
          </span>
          {shopName && (
            <span className="ml-2 hidden items-center gap-1 text-xs text-muted-foreground sm:inline-flex">
              <Store className="h-3 w-3" />
              {shopName}
            </span>
          )}
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-1">
        <ThemeToggle />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-9 gap-2 px-2">
              <Avatar className="h-7 w-7">
                <AvatarFallback className="bg-primary/15 text-primary text-xs">
                  {initials || "U"}
                </AvatarFallback>
              </Avatar>
              <span className="hidden max-w-[160px] truncate text-sm md:inline">
                {user.email}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>{user.name}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout}>
              <LogOut className="mr-2 h-4 w-4" /> Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
