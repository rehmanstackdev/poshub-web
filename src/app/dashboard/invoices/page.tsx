"use client";

import { useGetInvoicesQuery } from "@/store/api";
import { downloadInvoicePdf } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PageHeader } from "@/components/page-header";
import { TableRowSkeleton } from "@/components/skeletons";
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

  return (
    <div>
      <PageHeader title="Invoices" description="All issued receipts." />
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice #</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead className="w-32 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRowSkeleton columns={6} />
            ) : items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-muted-foreground">
                  No invoices yet.
                </TableCell>
              </TableRow>
            ) : (
              items.map((inv) => (
                <TableRow key={inv.id}>
                  <TableCell className="font-mono text-xs">
                    {inv.invoiceNo}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(inv.issuedAt).toLocaleString()}
                  </TableCell>
                  <TableCell>{inv.sale?.customerName || "Walk-in"}</TableCell>
                  <TableCell className="capitalize">
                    {inv.sale?.paymentMethod}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    ${inv.sale?.total ?? "—"}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => downloadPdf(inv.id, inv.invoiceNo)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
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
