"use client";

import { useMemo, useRef, useState } from "react";
import {
  useCheckoutMutation,
  useGetProductsQuery,
} from "@/store/api";
import { downloadInvoicePdf } from "@/lib/api";
import type { PaymentMethod, Product, Sale } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageHeader } from "@/components/page-header";
import { ProductGridSkeleton } from "@/components/skeletons";
import { toast } from "sonner";
import {
  Minus,
  Plus,
  Printer,
  ScanLine,
  ShoppingCart,
  Trash2,
} from "lucide-react";

interface CartLine {
  productId: string;
  name: string;
  sku: string;
  unitPrice: number;
  quantity: number;
  available: number;
}

function getErrorMessage(err: unknown, fallback: string) {
  const m = (err as { data?: { message?: string | string[] } })?.data?.message;
  if (Array.isArray(m)) return m.join(", ");
  return m ?? fallback;
}

export default function PosPage() {
  const { data: products = [], isLoading } = useGetProductsQuery();
  const [checkoutMutate, { isLoading: submitting }] = useCheckoutMutation();

  const [search, setSearch] = useState("");
  const [cart, setCart] = useState<CartLine[]>([]);
  const [discount, setDiscount] = useState("0");
  const [tax, setTax] = useState("0");
  const [customer, setCustomer] = useState("");
  const [payment, setPayment] = useState<PaymentMethod>("cash");
  const [lastSale, setLastSale] = useState<Sale | null>(null);
  const skuInputRef = useRef<HTMLInputElement>(null);

  const filtered = useMemo(() => {
    if (!search.trim()) return products.slice(0, 24);
    const q = search.toLowerCase();
    return products
      .filter(
        (p) =>
          p.sku.toLowerCase().includes(q) || p.name.toLowerCase().includes(q),
      )
      .slice(0, 24);
  }, [products, search]);

  function addToCart(product: Product, qty = 1) {
    setCart((c) => {
      const idx = c.findIndex((l) => l.productId === product.id);
      if (idx >= 0) {
        const next = [...c];
        const nextQty = Math.min(next[idx].quantity + qty, next[idx].available);
        next[idx] = { ...next[idx], quantity: nextQty };
        return next;
      }
      return [
        ...c,
        {
          productId: product.id,
          name: product.name,
          sku: product.sku,
          unitPrice: Number(product.price),
          quantity: Math.min(qty, product.quantity),
          available: product.quantity,
        },
      ];
    });
  }

  function setLineQty(productId: string, qty: number) {
    setCart((c) =>
      c
        .map((l) =>
          l.productId === productId
            ? { ...l, quantity: Math.max(0, Math.min(qty, l.available)) }
            : l,
        )
        .filter((l) => l.quantity > 0),
    );
  }

  function removeLine(productId: string) {
    setCart((c) => c.filter((l) => l.productId !== productId));
  }

  function handleScan(e: React.FormEvent) {
    e.preventDefault();
    const sku = search.trim();
    if (!sku) return;
    const found = products.find(
      (p) => p.sku.toLowerCase() === sku.toLowerCase(),
    );
    if (found) {
      if (found.quantity <= 0) {
        toast.error(`${found.name} is out of stock`);
      } else {
        addToCart(found);
        setSearch("");
        skuInputRef.current?.focus();
      }
    }
  }

  const subtotal = cart.reduce((s, l) => s + l.unitPrice * l.quantity, 0);
  const discountNum = Number(discount) || 0;
  const taxNum = Number(tax) || 0;
  const total = Math.max(0, subtotal - discountNum + taxNum);

  async function checkout() {
    if (cart.length === 0) return;
    try {
      const sale = await checkoutMutate({
        items: cart.map((l) => ({
          productId: l.productId,
          quantity: l.quantity,
        })),
        paymentMethod: payment,
        customerName: customer || undefined,
        discount: discountNum,
        tax: taxNum,
      }).unwrap();
      toast.success(`Sale completed: ${sale.invoice?.invoiceNo}`);
      setLastSale(sale);
      setCart([]);
      setDiscount("0");
      setTax("0");
      setCustomer("");
    } catch (err) {
      toast.error(getErrorMessage(err, "Checkout failed"));
    }
  }

  async function downloadPdf(invoiceId: string, invoiceNo: string) {
    try {
      await downloadInvoicePdf(invoiceId, invoiceNo);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Download failed");
    }
  }

  return (
    <div>
      <PageHeader title="Point of Sale" description="Scan, add, and check out." />

      <div className="grid gap-4 lg:grid-cols-[1fr_400px]">
        <div className="space-y-4">
          <form onSubmit={handleScan} className="flex gap-2">
            <div className="relative flex-1">
              <ScanLine className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                ref={skuInputRef}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Scan barcode or search by name / SKU"
                className="pl-9"
                autoFocus
              />
            </div>
            <Button type="submit" variant="secondary">
              Add
            </Button>
          </form>

          {isLoading ? (
            <ProductGridSkeleton />
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((p) => {
                const out = p.quantity <= 0;
                return (
                  <button
                    key={p.id}
                    onClick={() => !out && addToCart(p)}
                    disabled={out}
                    className="group cursor-pointer rounded-lg border border-border bg-card/60 p-4 text-left transition hover:border-primary/60 hover:bg-card hover:ring-2 hover:ring-ring/30 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:ring-0"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium">{p.name}</p>
                        <p className="font-mono text-xs text-muted-foreground">
                          {p.sku}
                        </p>
                      </div>
                      <Badge
                        variant={out ? "destructive" : "secondary"}
                        className={out ? "" : "bg-primary/15 text-primary"}
                      >
                        {p.quantity}
                      </Badge>
                    </div>
                    <p className="mt-3 text-lg font-semibold">${p.price}</p>
                  </button>
                );
              })}
              {filtered.length === 0 && (
                <p className="text-sm text-muted-foreground">No matches.</p>
              )}
            </div>
          )}
        </div>

        <Card className="h-fit">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" /> Cart ({cart.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {cart.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Cart is empty. Scan or click a product to add.
              </p>
            ) : (
              <ul className="space-y-2">
                {cart.map((l) => (
                  <li
                    key={l.productId}
                    className="flex items-center justify-between gap-2 rounded-md border border-border/60 bg-background/60 p-2 text-sm"
                  >
                    <div className="min-w-0">
                      <p className="truncate">{l.name}</p>
                      <p className="text-xs text-muted-foreground">
                        ${l.unitPrice.toFixed(2)} ea · {l.available} left
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => setLineQty(l.productId, l.quantity - 1)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-6 text-center">{l.quantity}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => setLineQty(l.productId, l.quantity + 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => removeLine(l.productId)}
                      >
                        <Trash2 className="h-3 w-3 text-destructive" />
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="space-y-1">
                <Label className="text-xs">Discount</Label>
                <Input
                  type="number"
                  step="0.01"
                  min={0}
                  value={discount}
                  onChange={(e) => setDiscount(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Tax</Label>
                <Input
                  type="number"
                  step="0.01"
                  min={0}
                  value={tax}
                  onChange={(e) => setTax(e.target.value)}
                />
              </div>
              <div className="col-span-2 space-y-1">
                <Label className="text-xs">Customer (optional)</Label>
                <Input
                  value={customer}
                  onChange={(e) => setCustomer(e.target.value)}
                  placeholder="Walk-in"
                />
              </div>
              <div className="col-span-2 space-y-1">
                <Label className="text-xs">Payment</Label>
                <Select
                  value={payment}
                  onValueChange={(v) => setPayment(v as PaymentMethod)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="card">Card</SelectItem>
                    <SelectItem value="mobile">Mobile</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1 border-t border-border pt-3 text-sm">
              <Row label="Subtotal" value={`$${subtotal.toFixed(2)}`} />
              <Row label="Discount" value={`-$${discountNum.toFixed(2)}`} />
              <Row label="Tax" value={`+$${taxNum.toFixed(2)}`} />
              <Row label="Total" value={`$${total.toFixed(2)}`} emphasis />
            </div>

            <Button
              className="w-full"
              size="lg"
              onClick={checkout}
              disabled={cart.length === 0 || submitting}
            >
              {submitting ? "Processing..." : `Charge $${total.toFixed(2)}`}
            </Button>

            {lastSale?.invoice && (
              <Button
                variant="outline"
                className="w-full"
                onClick={() =>
                  downloadPdf(
                    lastSale.invoice!.id,
                    lastSale.invoice!.invoiceNo,
                  )
                }
              >
                <Printer className="mr-2 h-4 w-4" /> Receipt {lastSale.invoice.invoiceNo}
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  emphasis,
}: {
  label: string;
  value: string;
  emphasis?: boolean;
}) {
  return (
    <div
      className={
        emphasis
          ? "flex items-center justify-between text-base font-semibold"
          : "flex items-center justify-between text-muted-foreground"
      }
    >
      <span>{label}</span>
      <span className={emphasis ? "text-primary" : ""}>{value}</span>
    </div>
  );
}
