"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";

const ITEMS = [
  {
    q: "How does multi-tenant isolation work?",
    a: "Every shop is sealed behind a JWT-bound shopId. Admins and staff only see data for their own shop; even a misrouted API call gets rejected at the API layer. Super admins are the only role with cross-shop visibility, and they are blocked from the mobile app entirely.",
  },
  {
    q: "Do I need to install anything on my devices?",
    a: "Super admins use the web dashboard — no install. Shop teams use the React Native mobile app on iOS or Android. Inventory, POS, invoices and reports are fully usable offline-friendly with sync when back online.",
  },
  {
    q: "Can I run unlimited shops on a single account?",
    a: "Yes. A single super admin account supports an unlimited number of shops, each with its own admin, staff, products, invoices and analytics. There’s no per-shop license.",
  },
  {
    q: "What payment methods are supported at checkout?",
    a: "Cash, card and split-tender are built in. Each sale generates a structured invoice automatically and is reflected in reports in real time.",
  },
  {
    q: "Is my data secure?",
    a: "All data is encrypted in transit (TLS 1.3) and at rest. Role-based permissions are enforced server-side, not just hidden in the UI, so no client can request data outside its scope.",
  },
  {
    q: "How fast can I get my first shop live?",
    a: "Under five minutes. Sign in as super admin, create a shop, assign an admin, and they’re ready to add products and start selling from the mobile app immediately.",
  },
];

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="mx-auto max-w-3xl">
      <div className="space-y-3">
        {ITEMS.map((item, i) => {
          const isOpen = open === i;
          return (
            <div
              key={i}
              className={`faq-item overflow-hidden rounded-2xl border transition-all ${
                isOpen
                  ? "border-primary/40 bg-primary/[0.04] shadow-lg shadow-primary/5"
                  : "border-border bg-card hover:border-primary/20"
              }`}
            >
              <button
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex w-full items-center justify-between gap-6 px-6 py-5 text-left"
              >
                <span
                  className={`text-base font-semibold transition-colors ${
                    isOpen ? "text-foreground" : "text-foreground/80"
                  }`}
                >
                  {item.q}
                </span>
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all ${
                    isOpen
                      ? "rotate-180 bg-primary text-[#1A1A2E]"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {isOpen ? (
                    <Minus className="h-4 w-4" />
                  ) : (
                    <Plus className="h-4 w-4" />
                  )}
                </span>
              </button>
              <div
                className={`grid transition-all duration-300 ease-out ${
                  isOpen
                    ? "grid-rows-[1fr] opacity-100"
                    : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="overflow-hidden">
                  <p className="px-6 pb-6 text-sm leading-relaxed text-muted-foreground">
                    {item.a}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
