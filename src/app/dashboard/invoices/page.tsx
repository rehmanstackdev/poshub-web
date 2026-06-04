"use client";

import { useMemo } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { useGetInvoicesQuery } from "@/store/api";
import { downloadInvoicePdf } from "@/lib/api";
import type { Invoice } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/data-table";
import { PageHeader } from "@/components/page-header";
import { toast } from "sonner";
import { Download } from "lucide-react";

export default function InvoicesPage() {
  const { data: items = [], isLoading } = useGetInvoicesQuery();

  async function downloadPdf(id: string, invoiceNo: string) {
    try {
      await downloadInvoicePdf(id, invoiceNo);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Download failed");
    }
  }

  const columns = useMemo<ColumnDef<Invoice>[]>(
    () => [
      {
        accessorKey: "invoiceNo",
        header: "Invoice #",
        cell: ({ row }) => (
          <span className="font-mono text-xs">{row.original.invoiceNo}</span>
        ),
      },
      {
        accessorKey: "issuedAt",
        header: "Date",
        cell: ({ row }) => (
          <span className="text-muted-foreground">
            {new Date(row.original.issuedAt).toLocaleString()}
          </span>
        ),
      },
      {
        id: "customer",
        header: "Customer",
        accessorFn: (row) => row.sale?.customerName ?? "Walk-in",
        cell: ({ row }) => row.original.sale?.customerName || "Walk-in",
      },
      {
        id: "payment",
        header: "Payment",
        accessorFn: (row) => row.sale?.paymentMethod ?? "",
        cell: ({ row }) => (
          <span className="capitalize">{row.original.sale?.paymentMethod}</span>
        ),
      },
      {
        id: "total",
        header: "Total",
        accessorFn: (row) => Number(row.sale?.total ?? 0),
        cell: ({ row }) => (
          <span className="font-medium">
            ${row.original.sale?.total ?? "—"}
          </span>
        ),
      },
      {
        id: "actions",
        header: () => <span className="sr-only">Actions</span>,
        enableSorting: false,
        size: 100,
        cell: ({ row }) => (
          <div className="flex justify-end">
            <Button
              variant="ghost"
              size="icon"
              onClick={() =>
                downloadPdf(row.original.id, row.original.invoiceNo)
              }
              title="Download PDF"
            >
              <Download className="h-4 w-4" />
            </Button>
          </div>
        ),
      },
    ],
    [],
  );

  return (
    <div>
      <PageHeader title="Invoices" description="All issued receipts." />
      <DataTable
        columns={columns}
        data={items}
        isLoading={isLoading}
        searchPlaceholder="Search by invoice #, customer..."
        emptyMessage="No invoices yet."
      />
    </div>
  );
}
