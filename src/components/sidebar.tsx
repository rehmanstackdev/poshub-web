"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Boxes,
  FileText,
  LayoutDashboard,
  ScanLine,
  ShoppingCart,
  Tags,
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
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/pos", label: "POS", icon: ShoppingCart },
  { href: "/dashboard/products", label: "Products", icon: Boxes },
  { href: "/dashboard/categories", label: "Categories", icon: Tags },
  { href: "/dashboard/invoices", label: "Invoices", icon: FileText },
  {
    href: "/dashboard/reports",
    label: "Reports",
    icon: BarChart3,
    roles: ["super_admin", "admin"],
  },
  {
    href: "/dashboard/users",
    label: "Users",
    icon: Users,
    roles: ["super_admin"],
  },
];

export function Sidebar({ role }: { role: Role }) {
  const pathname = usePathname();
  const items = NAV.filter((n) => !n.roles || n.roles.includes(role));

  return (
    <aside className="flex w-60 shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground">
      <div className="flex h-14 items-center gap-2 border-b border-sidebar-border px-5">
        <ScanLine className="h-5 w-5 text-primary" />
        <span className="font-mono tracking-widest text-sm">POSHUB</span>
      </div>
      <nav className="flex-1 space-y-1 p-3">
        {items.map((item) => {
          const active =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition",
                active
                  ? "bg-sidebar-primary/15 text-sidebar-primary shadow-[inset_0_0_0_1px_var(--sidebar-primary)]"
                  : "text-sidebar-foreground/80 hover:bg-sidebar-accent/15 hover:text-sidebar-foreground",
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
