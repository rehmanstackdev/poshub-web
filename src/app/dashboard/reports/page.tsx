"use client";

import { useMemo, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import {
  useGetDailyReportQuery,
  useGetMonthlyReportQuery,
  useGetSummaryReportQuery,
  useGetTopProductsQuery,
  useGetWeeklyReportQuery,
} from "@/store/api";
import type { SalesSummary, TopProduct } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DataTable } from "@/components/data-table";
import { PageHeader } from "@/components/page-header";
import { StatCardSkeleton } from "@/components/skeletons";

type Range = "daily" | "weekly" | "monthly" | "custom";

function todayIso() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.toISOString().slice(0, 10);
}

export default function ReportsPage() {
  const [range, setRange] = useState<Range>("daily");
  const [from, setFrom] = useState(todayIso());
  const [to, setTo] = useState(todayIso());
  const [appliedRange, setAppliedRange] = useState<{
    from: string;
    to: string;
  } | null>(null);

  const customRangeArgs = useMemo(() => {
    if (range !== "custom" || !appliedRange) return null;
    const fromDt = new Date(appliedRange.from);
    const toDt = new Date(appliedRange.to);
    toDt.setHours(23, 59, 59, 999);
    return { from: fromDt.toISOString(), to: toDt.toISOString() };
  }, [range, appliedRange]);

  const dailyQ = useGetDailyReportQuery(undefined, { skip: range !== "daily" });
  const weeklyQ = useGetWeeklyReportQuery(undefined, {
    skip: range !== "weekly",
  });
  const monthlyQ = useGetMonthlyReportQuery(undefined, {
    skip: range !== "monthly",
  });
  const customQ = useGetSummaryReportQuery(customRangeArgs ?? { from: "", to: "" }, {
    skip: !customRangeArgs,
  });

  const summaryQ =
    range === "daily"
      ? dailyQ
      : range === "weekly"
        ? weeklyQ
        : range === "monthly"
          ? monthlyQ
          : customQ;
  const summary = summaryQ.data as SalesSummary | undefined;
  const summaryLoading = summaryQ.isLoading || summaryQ.isFetching;

  const topQ = useGetTopProductsQuery(
    summary
      ? {
          from: new Date(summary.from).toISOString(),
          to: new Date(summary.to).toISOString(),
          limit: 100,
        }
      : { from: "", to: "", limit: 100 },
    { skip: !summary },
  );

  const topColumns = useMemo<ColumnDef<TopProduct>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Product",
      },
      {
        accessorKey: "quantity",
        header: "Quantity",
        cell: ({ row }) => (
          <span className="text-right block">{row.original.quantity}</span>
        ),
      },
      {
        id: "revenue",
        header: "Revenue",
        accessorFn: (row) => Number(row.revenue),
        cell: ({ row }) => (
          <span className="text-right block">${row.original.revenue}</span>
        ),
      },
    ],
    [],
  );

  return (
    <div>
      <PageHeader
        title="Reports"
        description="Revenue, profit, and best sellers."
      />

      <div className="mb-4 flex flex-wrap items-end gap-2">
        {(["daily", "weekly", "monthly", "custom"] as Range[]).map((r) => (
          <Button
            key={r}
            variant={range === r ? "default" : "outline"}
            onClick={() => setRange(r)}
            className="capitalize"
          >
            {r}
          </Button>
        ))}
        {range === "custom" && (
          <div className="flex flex-wrap items-end gap-2">
            <div className="space-y-1">
              <Label className="text-xs">From</Label>
              <Input
                type="date"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">To</Label>
              <Input
                type="date"
                value={to}
                onChange={(e) => setTo(e.target.value)}
              />
            </div>
            <Button onClick={() => setAppliedRange({ from, to })}>
              Apply
            </Button>
          </div>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {summaryLoading ? (
          <>
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </>
        ) : (
          <>
            <Stat
              label="Orders"
              value={summary?.orderCount.toString() ?? "—"}
            />
            <Stat
              label="Items sold"
              value={summary?.itemsSold.toString() ?? "—"}
            />
            <Stat
              label="Revenue"
              value={summary ? `$${summary.revenue}` : "—"}
            />
            <Stat
              label="Profit"
              value={summary ? `$${summary.profit}` : "—"}
              highlight
            />
          </>
        )}
      </div>

      <div className="mt-6">
        <h2 className="mb-3 text-lg font-semibold">Top products</h2>
        <DataTable
          columns={topColumns}
          data={topQ.data ?? []}
          isLoading={topQ.isLoading || topQ.isFetching}
          searchPlaceholder="Search products..."
          emptyMessage="No sales in this range."
          initialPageSize={10}
        />
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <Card>
      <CardContent className="py-5">
        <p className="text-xs uppercase tracking-wider text-muted-foreground">
          {label}
        </p>
        <p
          className={
            highlight
              ? "mt-1 text-2xl font-semibold text-primary"
              : "mt-1 text-2xl font-semibold"
          }
        >
          {value}
        </p>
      </CardContent>
    </Card>
  );
}
