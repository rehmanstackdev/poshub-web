"use client";

import { useEffect, useState } from "react";
import {
  BarChart3,
  LayoutDashboard,
  Package,
  ScanLine,
  Store,
  TrendingUp,
  Users,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

// ── Slide 1: Mobile Home / Dashboard ─────────────────────────────────────────
function MobileHomeScreen() {
  return (
    <div className="bg-[#F7F8FA] h-full flex flex-col overflow-hidden">
      {/* Hero bar */}
      <div className="bg-[#FFC107] px-4 pt-8 pb-4 relative overflow-hidden shrink-0">
        <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full bg-white/15" />
        <div className="absolute -bottom-4 -left-4 w-14 h-14 rounded-full bg-black/06" />
        <div className="flex items-center justify-between relative">
          <div>
            <p className="text-[8px] font-semibold text-black/40 tracking-wide uppercase">Good morning</p>
            <p className="text-[13px] font-extrabold text-[#1A1A2E]">Rehman Naveed</p>
            <p className="text-[8px] text-black/50 font-medium">Admin · My Shop</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-[#1A1A2E] flex items-center justify-center shadow-md">
            <span className="text-[11px] font-extrabold text-[#FFC107]">RN</span>
          </div>
        </div>
        <div className="flex gap-2 mt-3 relative">
          {[{ l: "Sales", v: "$840" }, { l: "Orders", v: "24" }, { l: "Stock", v: "142" }].map(({ l, v }) => (
            <div key={l} className="flex-1 bg-black/10 rounded-xl px-2 py-1.5 text-center">
              <p className="text-[9px] font-extrabold text-[#1A1A2E]">{v}</p>
              <p className="text-[7px] text-black/50 font-medium">{l}</p>
            </div>
          ))}
        </div>
      </div>
      {/* Quick actions */}
      <div className="px-3 pt-3 pb-1 shrink-0">
        <p className="text-[8px] font-bold text-gray-400 uppercase tracking-wider mb-2">Quick Actions</p>
        <div className="grid grid-cols-4 gap-1.5">
          {[{ e: "🛒", l: "POS" }, { e: "📦", l: "Products" }, { e: "📄", l: "Invoices" }, { e: "📊", l: "Reports" }].map(({ e, l }) => (
            <div key={l} className="flex flex-col items-center gap-1 bg-white rounded-xl py-2 shadow-sm border border-gray-100">
              <span className="text-base">{e}</span>
              <span className="text-[7px] font-semibold text-gray-500">{l}</span>
            </div>
          ))}
        </div>
      </div>
      {/* Recent sales */}
      <div className="px-3 pt-2 flex-1 overflow-hidden">
        <p className="text-[8px] font-bold text-gray-400 uppercase tracking-wider mb-2">Recent Sales</p>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {[
            { name: "Latte × 2", price: "$8.00", time: "2m ago", color: "bg-amber-400" },
            { name: "Sandwich × 1", price: "$5.50", time: "14m ago", color: "bg-emerald-400" },
            { name: "Water × 3", price: "$4.50", time: "32m ago", color: "bg-blue-400" },
          ].map(({ name, price, time, color }, i) => (
            <div key={name}>
              {i > 0 && <div className="h-px bg-gray-50 ml-9" />}
              <div className="flex items-center gap-2.5 px-3 py-2">
                <div className={`w-2 h-2 rounded-full ${color} shrink-0`} />
                <div className="flex-1">
                  <p className="text-[9px] font-semibold text-gray-700">{name}</p>
                  <p className="text-[7px] text-gray-400">{time}</p>
                </div>
                <p className="text-[9px] font-bold text-[#1A1A2E]">{price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Bottom tab */}
      <BottomTab active="POS" />
    </div>
  );
}

// ── Slide 2: POS / Checkout screen ───────────────────────────────────────────
function POSScreen() {
  return (
    <div className="bg-[#F7F8FA] h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-[#FFC107] px-4 pt-8 pb-5 relative overflow-hidden shrink-0">
        <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full bg-white/15" />
        <p className="text-[8px] font-semibold text-black/40 tracking-wide uppercase relative">Point of Sale</p>
        <p className="text-[15px] font-extrabold text-[#1A1A2E] relative">New Sale</p>
        {/* Search bar */}
        <div className="mt-3 bg-white/40 rounded-xl px-3 py-2 flex items-center gap-2 relative">
          <span className="text-[10px]">🔍</span>
          <p className="text-[9px] text-black/40 font-medium">Search or scan product…</p>
        </div>
      </div>
      {/* Cart items */}
      <div className="px-3 pt-3 flex-1 overflow-hidden">
        <p className="text-[8px] font-bold text-gray-400 uppercase tracking-wider mb-2">Cart (3 items)</p>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {[
            { name: "Espresso", qty: "×2", price: "$6.00" },
            { name: "Blueberry Muffin", qty: "×1", price: "$4.50" },
            { name: "Orange Juice", qty: "×1", price: "$3.50" },
          ].map(({ name, qty, price }, i) => (
            <div key={name}>
              {i > 0 && <div className="h-px bg-gray-50 ml-9" />}
              <div className="flex items-center gap-2.5 px-3 py-2.5">
                <div className="w-7 h-7 rounded-lg bg-[#FFC107]/20 flex items-center justify-center">
                  <span className="text-[10px]">☕</span>
                </div>
                <div className="flex-1">
                  <p className="text-[9px] font-semibold text-gray-700">{name}</p>
                  <p className="text-[7px] text-gray-400">{qty}</p>
                </div>
                <p className="text-[9px] font-bold text-[#1A1A2E]">{price}</p>
              </div>
            </div>
          ))}
        </div>
        {/* Total */}
        <div className="mt-3 bg-[#1A1A2E] rounded-2xl px-4 py-3 flex items-center justify-between">
          <div>
            <p className="text-[7px] text-white/40 uppercase tracking-wide">Total</p>
            <p className="text-[15px] font-extrabold text-[#FFC107]">$14.00</p>
          </div>
          <div className="bg-[#FFC107] rounded-xl px-4 py-2">
            <p className="text-[9px] font-extrabold text-[#1A1A2E]">Pay Now →</p>
          </div>
        </div>
      </div>
      <BottomTab active="POS" />
    </div>
  );
}

// ── Slide 3: Products screen ──────────────────────────────────────────────────
function ProductsScreen() {
  return (
    <div className="bg-[#F7F8FA] h-full flex flex-col overflow-hidden">
      <div className="bg-[#FFC107] px-4 pt-8 pb-5 relative overflow-hidden shrink-0">
        <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full bg-white/15" />
        <p className="text-[8px] font-semibold text-black/40 tracking-wide uppercase relative">Inventory</p>
        <p className="text-[15px] font-extrabold text-[#1A1A2E] relative">Products</p>
        <div className="mt-3 bg-white/40 rounded-xl px-3 py-2 flex items-center gap-2 relative">
          <span className="text-[10px]">🔍</span>
          <p className="text-[9px] text-black/40 font-medium">Search products…</p>
        </div>
      </div>
      <div className="px-3 pt-3 flex-1 overflow-hidden">
        <div className="flex items-center justify-between mb-2">
          <p className="text-[8px] font-bold text-gray-400 uppercase tracking-wider">All Products (12)</p>
          <div className="bg-[#FFC107] rounded-lg px-2 py-1">
            <p className="text-[7px] font-extrabold text-[#1A1A2E]">+ Add</p>
          </div>
        </div>
        <div className="space-y-1.5">
          {[
            { name: "Espresso", stock: 80, price: "$3.00", low: false },
            { name: "Latte", stock: 45, price: "$4.50", low: false },
            { name: "Blueberry Muffin", stock: 8, price: "$4.50", low: true },
            { name: "Orange Juice", stock: 22, price: "$3.50", low: false },
          ].map(({ name, stock, price, low }) => (
            <div key={name} className="bg-white rounded-xl px-3 py-2.5 shadow-sm border border-gray-100 flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-[#FFC107]/15 flex items-center justify-center shrink-0">
                <span className="text-[10px]">📦</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[9px] font-semibold text-gray-700 truncate">{name}</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <div className={`h-1 rounded-full ${low ? "bg-red-400" : "bg-emerald-400"}`} style={{ width: Math.min(stock, 60) }} />
                  <p className={`text-[7px] font-medium ${low ? "text-red-400" : "text-gray-400"}`}>{stock} left {low && "⚠️"}</p>
                </div>
              </div>
              <p className="text-[9px] font-bold text-[#1A1A2E] shrink-0">{price}</p>
            </div>
          ))}
        </div>
      </div>
      <BottomTab active="Products" />
    </div>
  );
}

// ── Slide 4: Reports screen ───────────────────────────────────────────────────
function ReportsScreen() {
  return (
    <div className="bg-[#F7F8FA] h-full flex flex-col overflow-hidden">
      <div className="bg-[#FFC107] px-4 pt-8 pb-5 relative overflow-hidden shrink-0">
        <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full bg-white/15" />
        <p className="text-[8px] font-semibold text-black/40 tracking-wide uppercase relative">Analytics</p>
        <p className="text-[15px] font-extrabold text-[#1A1A2E] relative">Reports</p>
        {/* Period tabs */}
        <div className="flex gap-1.5 mt-3 relative">
          {["Day", "Week", "Month"].map((t, i) => (
            <div key={t} className={`px-3 py-1 rounded-lg text-[8px] font-bold ${i === 1 ? "bg-[#1A1A2E] text-[#FFC107]" : "bg-black/10 text-black/50"}`}>{t}</div>
          ))}
        </div>
      </div>
      <div className="px-3 pt-3 flex-1 overflow-hidden space-y-2">
        {/* Revenue card */}
        <div className="bg-[#1A1A2E] rounded-2xl px-4 py-3">
          <p className="text-[7px] text-white/40 uppercase tracking-wide">Total Revenue</p>
          <p className="text-[18px] font-extrabold text-[#FFC107]">$5,840</p>
          <div className="flex items-center gap-1 mt-0.5">
            <TrendingUp className="h-2.5 w-2.5 text-emerald-400" />
            <p className="text-[8px] text-emerald-400 font-semibold">+18% vs last week</p>
          </div>
        </div>
        {/* Bar chart */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-3">
          <p className="text-[8px] font-bold text-gray-400 uppercase tracking-wider mb-2">Daily sales</p>
          <div className="flex items-end gap-1 h-12">
            {[35, 55, 40, 70, 50, 90, 65].map((h, i) => (
              <div key={i} className="flex-1 rounded-sm transition-all" style={{ height: `${h}%`, backgroundColor: i === 5 ? "#FFC107" : "#E5E7EB" }} />
            ))}
          </div>
          <div className="flex justify-between mt-1">
            {["M","T","W","T","F","S","S"].map((d, i) => (
              <span key={i} className={`flex-1 text-center text-[6px] font-medium ${i === 5 ? "text-[#FFC107]" : "text-gray-300"}`}>{d}</span>
            ))}
          </div>
        </div>
        {/* Top products */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-3">
          <p className="text-[8px] font-bold text-gray-400 uppercase tracking-wider mb-2">Top Products</p>
          {[{ n: "Latte", v: 72 }, { n: "Espresso", v: 55 }, { n: "Muffin", v: 34 }].map(({ n, v }) => (
            <div key={n} className="flex items-center gap-2 mb-1.5">
              <p className="text-[8px] text-gray-500 w-12 shrink-0">{n}</p>
              <div className="flex-1 bg-gray-100 rounded-full h-2">
                <div className="bg-[#FFC107] h-2 rounded-full" style={{ width: `${v}%` }} />
              </div>
              <p className="text-[8px] font-bold text-[#1A1A2E] w-6 text-right">{v}%</p>
            </div>
          ))}
        </div>
      </div>
      <BottomTab active="Reports" />
    </div>
  );
}

// ── Slide 5: Web Dashboard ────────────────────────────────────────────────────
function WebDashboardScreen() {
  return (
    <div className="bg-[#0f1118] h-full flex flex-col overflow-hidden">
      {/* Browser title bar */}
      <div className="flex items-center gap-2 border-b border-white/8 bg-white/5 px-3 py-2 shrink-0">
        <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
        <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/80" />
        <span className="h-2.5 w-2.5 rounded-full bg-green-500/80" />
        <div className="mx-auto flex h-5 w-36 items-center gap-1.5 rounded bg-white/8 px-2">
          <div className="h-1.5 w-1.5 rounded-full bg-[#FFC107]/60" />
          <span className="text-[8px] text-white/30 font-mono">poshub.app/dashboard</span>
        </div>
      </div>
      {/* App layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="flex w-10 flex-col items-center gap-3 border-r border-white/6 bg-white/3 py-3 shrink-0">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-[#FFC107]">
            <ScanLine className="h-3 w-3 text-black" />
          </div>
          {[LayoutDashboard, Store, Package, BarChart3, Users].map((Icon, i) => (
            <div key={i} className={`flex h-6 w-6 items-center justify-center rounded-md ${i === 0 ? "bg-[#FFC107]/20 text-[#FFC107]" : "text-white/25"}`}>
              <Icon className="h-3 w-3" />
            </div>
          ))}
        </div>
        {/* Content */}
        <div className="flex-1 p-3 space-y-2.5 overflow-hidden">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-1.5">
            {[{ l: "Revenue", v: "$12.8k", u: true }, { l: "Orders", v: "348", u: true }, { l: "Shops", v: "6", u: false }].map(({ l, v, u }) => (
              <div key={l} className="rounded-xl bg-white/5 p-2.5 border border-white/6">
                <p className="text-[7px] text-white/40 uppercase tracking-wide">{l}</p>
                <p className="mt-0.5 text-[11px] font-bold text-white">{v}</p>
                <div className={`mt-0.5 flex items-center gap-0.5 text-[7px] font-semibold ${u ? "text-emerald-400" : "text-[#FFC107]"}`}>
                  <TrendingUp className="h-2 w-2" />
                  {u ? "+12%" : "active"}
                </div>
              </div>
            ))}
          </div>
          {/* Chart */}
          <div className="rounded-xl bg-white/5 border border-white/6 p-2.5">
            <p className="mb-1.5 text-[7px] text-white/40 uppercase tracking-wide">Sales this week</p>
            <div className="flex items-end gap-1 h-10">
              {[40, 65, 45, 80, 60, 90, 55].map((h, i) => (
                <div key={i} className="flex-1 rounded-sm" style={{ height: `${h}%`, backgroundColor: i === 5 ? "#FFC107" : "rgba(255,255,255,0.12)" }} />
              ))}
            </div>
            <div className="mt-1 flex justify-between">
              {["M","T","W","T","F","S","S"].map((d, i) => (
                <span key={i} className={`flex-1 text-center text-[6px] ${i === 5 ? "text-[#FFC107]" : "text-white/20"}`}>{d}</span>
              ))}
            </div>
          </div>
          {/* Shops table */}
          <div className="rounded-xl bg-white/5 border border-white/6 p-2.5">
            <p className="mb-1.5 text-[7px] text-white/40 uppercase tracking-wide">Recent Shops</p>
            {[{ n: "Downtown Store", v: "$3,200" }, { n: "Mall Branch", v: "$1,840" }, { n: "Airport Kiosk", v: "$960" }].map(({ n, v }) => (
              <div key={n} className="flex items-center justify-between py-1 border-b border-white/4 last:border-0">
                <div className="flex items-center gap-1.5">
                  <div className="h-3.5 w-3.5 rounded bg-[#FFC107]/20 flex items-center justify-center">
                    <Store className="h-2 w-2 text-[#FFC107]" />
                  </div>
                  <span className="text-[8px] text-white/50">{n}</span>
                </div>
                <span className="text-[8px] font-bold text-[#FFC107]">{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Bottom tab bar (shared) ───────────────────────────────────────────────────
function BottomTab({ active }: { active: string }) {
  const tabs = [
    { emoji: "🛒", label: "POS" },
    { emoji: "📦", label: "Products" },
    { emoji: "📄", label: "Invoices" },
    { emoji: "📊", label: "Reports" },
    { emoji: "👤", label: "Profile" },
  ];
  return (
    <div className="bg-white border-t border-gray-100 flex items-center justify-around px-2 py-2 shadow-lg shrink-0">
      {tabs.map(({ emoji, label }) => {
        const isActive = label === active;
        return (
          <div key={label} className="flex flex-col items-center gap-0.5">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center ${isActive ? "bg-[#FFC107]" : ""}`}>
              <span className="text-[12px]">{emoji}</span>
            </div>
            <span className={`text-[6px] font-semibold ${isActive ? "text-[#1A1A2E]" : "text-gray-400"}`}>{label}</span>
          </div>
        );
      })}
    </div>
  );
}

// ── Slide config ──────────────────────────────────────────────────────────────
const slides = [
  { label: "Home", type: "phone", component: MobileHomeScreen },
  { label: "POS", type: "phone", component: POSScreen },
  { label: "Products", type: "phone", component: ProductsScreen },
  { label: "Reports", type: "phone", component: ReportsScreen },
  { label: "Web Dashboard", type: "web", component: WebDashboardScreen },
];

// ── Hero Slider ───────────────────────────────────────────────────────────────
export function HeroSlider() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setCurrent((c) => (c + 1) % slides.length), 3500);
    return () => clearInterval(t);
  }, []);

  const prev = () => setCurrent((c) => (c - 1 + slides.length) % slides.length);
  const next = () => setCurrent((c) => (c + 1) % slides.length);

  const slide = slides[current];
  const isWeb = slide.type === "web";
  const Screen = slide.component;

  return (
    <div className="relative flex flex-col items-center gap-5 select-none">
      {/* Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[480px] rounded-full bg-primary/20 blur-3xl -z-10" />

      {/* Device frame */}
      {isWeb ? (
        /* Browser frame */
        <div className="w-[480px] overflow-hidden rounded-2xl border border-white/10 shadow-2xl shadow-black/50" style={{ height: 520 }}>
          <Screen />
        </div>
      ) : (
        /* Phone frame */
        <div className="relative w-[300px] rounded-[48px] border-[7px] border-white/10 bg-[#1A1A2E] shadow-2xl shadow-black/60 overflow-hidden">
          {/* Notch */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 z-10 w-28 h-7 bg-[#1A1A2E] rounded-b-2xl flex items-center justify-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
            <div className="w-10 h-1.5 rounded-full bg-white/10" />
          </div>
          <div style={{ height: 580 }} className="overflow-hidden">
            <div className="pt-7 h-full">
              <Screen />
            </div>
          </div>
          {/* Home indicator */}
          <div className="bg-[#F7F8FA] flex justify-center py-2">
            <div className="w-20 h-1 rounded-full bg-[#1A1A2E]/20" />
          </div>
        </div>
      )}

      {/* Prev / Next */}
      <button
        onClick={prev}
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 backdrop-blur border border-white/15 text-white hover:bg-white/20 transition-colors"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      <button
        onClick={next}
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 backdrop-blur border border-white/15 text-white hover:bg-white/20 transition-colors"
      >
        <ChevronRight className="h-4 w-4" />
      </button>

      {/* Dots */}
      <div className="flex items-center gap-2">
        {slides.map((s, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`transition-all rounded-full ${
              i === current
                ? "w-6 h-2 bg-primary"
                : "w-2 h-2 bg-white/25 hover:bg-white/50"
            }`}
          />
        ))}
      </div>

      {/* Label */}
      <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5">
        <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
        <span className="text-[11px] font-semibold text-white/60">{slide.label}</span>
      </div>
    </div>
  );
}
