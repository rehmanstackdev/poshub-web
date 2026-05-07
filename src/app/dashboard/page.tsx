"use client";

import { useMemo } from "react";
import {
  useGetDailyReportQuery,
  useGetLowStockProductsQuery,
  useGetTopProductsQuery,
} from "@/store/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PageHeader } from "@/components/page-header";
import { ListCardSkeleton, StatCardSkeleton } from "@/components/skeletons";
import { AlertTriangle, Coins, Package, Receipt } from "lucide-react";

export default function DashboardOverviewPage() {
  const today = useMemo(() => {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setDate(end.getDate() + 1);
    return { from: start.toISOString(), to: end.toISOString() };
  }, []);

  const { data: summary, isLoading: loadingSummary } =
    useGetDailyReportQuery();
  const { data: top, isLoading: loadingTop } = useGetTopProductsQuery({
    from: today.from,
    to: today.to,
    limit: 5,
  });
  const { data: lowStock, isLoading: loadingLow } =
    useGetLowStockProductsQuery();

  return (
    <div>
      <PageHeader
        title="Overview"
        description="Today's performance at a glance."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {loadingSummary || loadingLow ? (
          <>
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </>
        ) : (
          <>
            <StatCard
              icon={<Receipt className="h-5 w-5" />}
              label="Orders today"
              value={summary?.orderCount.toString() ?? "0"}
            />
            <StatCard
              icon={<Coins className="h-5 w-5" />}
              label="Revenue today"
              value={summary ? `$${summary.revenue}` : "$0.00"}
            />
            <StatCard
              icon={<Package className="h-5 w-5" />}
              label="Items sold"
              value={summary?.itemsSold.toString() ?? "0"}
            />
            <StatCard
              icon={<AlertTriangle className="h-5 w-5" />}
              label="Low stock items"
              value={(lowStock?.length ?? 0).toString()}
              tone="warning"
            />
          </>
        )}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        {loadingTop ? (
          <ListCardSkeleton rows={5} />
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Top products today</CardTitle>
              <CardDescription>Best sellers in the last 24h</CardDescription>
            </CardHeader>
            <CardContent>
              {!top || top.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No sales yet today.
                </p>
              ) : (
                <ul className="divide-y divide-border">
                  {top.map((p) => (
                    <li
                      key={p.productId}
                      className="flex items-center justify-between py-2 text-sm"
                    >
                      <span>{p.name}</span>
                      <span className="text-muted-foreground">
                        x{p.quantity} · ${p.revenue}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        )}

        {loadingLow ? (
          <ListCardSkeleton rows={5} />
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Low stock</CardTitle>
              <CardDescription>Restock these soon</CardDescription>
            </CardHeader>
            <CardContent>
              {!lowStock || lowStock.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  All products are well stocked.
                </p>
              ) : (
                <ul className="divide-y divide-border">
                  {lowStock.slice(0, 6).map((p) => (
                    <li
                      key={p.id}
                      className="flex items-center justify-between py-2 text-sm"
                    >
                      <span>
                        {p.name}{" "}
                        <span className="text-xs text-muted-foreground">
                          ({p.sku})
                        </span>
                      </span>
                      <span className="text-destructive">
                        {p.quantity} left
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  tone?: "warning";
}) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 py-5">
        <div
          className={
            tone === "warning"
              ? "rounded-md bg-destructive/15 p-2 text-destructive"
              : "rounded-md bg-primary/15 p-2 text-primary"
          }
        >
          {icon}
        </div>
        <div>
          <p className="text-xs uppercase tracking-wider text-muted-foreground">
            {label}
          </p>
          <p className="text-2xl font-semibold">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}
