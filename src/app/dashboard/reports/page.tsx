"use client";

import { useMemo, useState } from "react";
import {
  useGetDailyReportQuery,
  useGetMonthlyReportQuery,
  useGetSummaryReportQuery,
  useGetTopProductsQuery,
  useGetWeeklyReportQuery,
} from "@/store/api";
import type { SalesSummary } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/page-header";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatCardSkeleton, TableRowSkeleton } from "@/components/skeletons";

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
          limit: 10,
        }
      : { from: "", to: "", limit: 10 },
    { skip: !summary },
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

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Top products</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead className="text-right">Quantity</TableHead>
                <TableHead className="text-right">Revenue</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topQ.isLoading || topQ.isFetching ? (
                <TableRowSkeleton columns={3} rows={4} />
              ) : !topQ.data || topQ.data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-muted-foreground">
                    No sales in this range.
                  </TableCell>
                </TableRow>
              ) : (
                topQ.data.map((p) => (
                  <TableRow key={p.productId}>
                    <TableCell>{p.name}</TableCell>
                    <TableCell className="text-right">{p.quantity}</TableCell>
                    <TableCell className="text-right">${p.revenue}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
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
