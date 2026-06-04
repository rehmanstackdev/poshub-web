"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/store/hooks";
import { Sidebar } from "@/components/sidebar";
import { Topbar } from "@/components/topbar";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, token, hydrated } = useAppSelector((s) => s.auth);

  useEffect(() => {
    if (hydrated && !token) router.replace("/login");
  }, [hydrated, token, router]);

  if (!hydrated) {
    return (
      <div className="flex h-screen flex-1 overflow-hidden">
        <div className="hidden h-full w-60 shrink-0 border-r border-border bg-card/40 p-4 space-y-3 lg:block">
          <Skeleton className="h-6 w-28" />
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-9 w-full" />
          ))}
        </div>
        <div className="flex-1 p-4 sm:p-6 space-y-4">
          <Skeleton className="h-14 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-1 items-center justify-center text-muted-foreground">
        Redirecting to login...
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-1 overflow-hidden">
      <Sidebar role={user.role} className="hidden lg:flex" />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar role={user.role} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
