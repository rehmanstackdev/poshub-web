"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Box,
  FileText,
  LayoutDashboard,
  ScanLine,
  Store,
  Tag,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Role } from "@/lib/types";

interface NavItem {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
  roles?: Role[];
}

const NAV: NavItem[] = [
  { href: "/dashboard",        label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/shops",  label: "Shops",    icon: Store,    roles: ["super_admin"] },
  { href: "/dashboard/users",  label: "Users",    icon: Users,    roles: ["super_admin", "admin"] },
  { href: "/dashboard/invoices", label: "Invoices", icon: FileText },
  { href: "/dashboard/reports",  label: "Reports",  icon: BarChart3, roles: ["super_admin", "admin"] },
];

interface SidebarProps {
  role: Role;
  onNavigate?: () => void;
  className?: string;
}

const ROLE_LABEL: Record<Role, string> = {
  super_admin: "Super Admin",
  admin:       "Admin",
  staff:       "Staff",
};

export function Sidebar({ role, onNavigate, className }: SidebarProps) {
  const pathname = usePathname();
  const items = NAV.filter((n) => !n.roles || n.roles.includes(role));

  return (
    <aside
      className={cn(
        "sticky top-0 flex h-screen w-60 shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground",
        className,
      )}
    >
      {/* Logo */}
      <div className="flex h-14 items-center gap-2 border-b border-sidebar-border px-5">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary">
          <ScanLine className="h-4 w-4 text-primary-foreground" />
        </div>
        <span className="font-mono font-bold tracking-widest text-sm text-sidebar-foreground">
          POSHUB
        </span>
      </div>

      {/* Role badge */}
      <div className="px-4 pt-4 pb-2">
        <span className="inline-flex items-center rounded-full bg-primary/20 px-2.5 py-0.5 text-xs font-semibold text-primary">
          {ROLE_LABEL[role]}
        </span>
      </div>

      {/* Nav items */}
      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 pb-3">
        {items.map((item) => {
          const active =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <div key={item.href}>
              <Link
                href={item.href}
                onClick={onNavigate}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                  active
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-sidebar-foreground/80 hover:bg-white/10 hover:text-sidebar-foreground",
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span>{item.label}</span>
              </Link>
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-sidebar-border/50 px-4 py-3">
        <p className="text-xs text-sidebar-foreground/40 text-center">
          POSHub v1.0
        </p>
      </div>
    </aside>
  );
}
