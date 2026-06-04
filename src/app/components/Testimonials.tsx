"use client";

import { useEffect, useState } from "react";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";

type QuoteT = {
  name: string;
  role: string;
  company: string;
  initial: string;
  quote: string;
  rating: number;
  metric?: { value: string; label: string };
};

const QUOTES: QuoteT[] = [
  {
    name: "Aisha Khan",
    role: "Owner",
    company: "Aroma Cafe · 3 branches",
    initial: "A",
    quote:
      "Switched all three of our cafes to POSHub last quarter. Sunday reports that used to take a full afternoon now load in two seconds. The shop isolation alone was worth the move.",
    rating: 5,
    metric: { value: "62%", label: "less admin time" },
  },
  {
    name: "Daniyal Ahmed",
    role: "Store Manager",
    company: "UrbanMart",
    initial: "D",
    quote:
      "The mobile-first POS is what sold us. Staff onboarded in 15 minutes — they treat it like Instagram. No more counter dust from old terminals.",
    rating: 5,
    metric: { value: "15 min", label: "staff onboarding" },
  },
  {
    name: "Sara Iqbal",
    role: "Co-founder",
    company: "Bloom & Co.",
    initial: "S",
    quote:
      "I needed visibility across four shops without micro-managing each one. POSHub gave us role-based clarity and clean cross-shop dashboards. Premium feel end-to-end.",
    rating: 5,
    metric: { value: "4 shops", label: "single dashboard" },
  },
  {
    name: "Hamza Riaz",
    role: "Director",
    company: "Nova Retail Group",
    initial: "H",
    quote:
      "We evaluated five POS platforms. POSHub was the only one where data isolation wasn't an afterthought — it was the foundation. Procurement approved on first review.",
    rating: 5,
    metric: { value: "5 → 1", label: "platforms consolidated" },
  },
  {
    name: "Mariam Tariq",
    role: "Owner",
    company: "Tribe Coffee",
    initial: "M",
    quote:
      "Mobile checkout is buttery fast. Peak-hour queue dropped by half, and the live revenue chart on the web dashboard is genuinely addictive — in the best way.",
    rating: 5,
    metric: { value: "50%", label: "shorter queues" },
  },
  {
    name: "Omar Sheikh",
    role: "CEO",
    company: "Pulse Pharmacy Network",
    initial: "O",
    quote:
      "We needed an audit-grade trail across 11 stores. POSHub gave us role-scoped logs, real-time stock visibility, and compliance-ready invoicing out of the box.",
    rating: 5,
    metric: { value: "11 stores", label: "fully synced" },
  },
];

const PAIRS = Math.ceil(QUOTES.length / 2);

export function Testimonials() {
  const [page, setPage] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setPage((p) => (p + 1) % PAIRS), 6000);
    return () => clearInterval(t);
  }, [paused]);

  const prev = () => setPage((p) => (p - 1 + PAIRS) % PAIRS);
  const next = () => setPage((p) => (p + 1) % PAIRS);

  return (
    <div
      className="testimonial-card relative mx-auto max-w-6xl"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Slide viewport */}
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{ transform: `translateX(-${page * 100}%)` }}
        >
          {Array.from({ length: PAIRS }).map((_, p) => (
            <div key={p} className="flex w-full shrink-0 gap-6 px-1 md:gap-7">
              {[QUOTES[p * 2], QUOTES[p * 2 + 1]].filter(Boolean).map((t, i) => (
                <Card key={i} t={t} />
              ))}
              {/* keep symmetry on odd tail */}
              {!QUOTES[p * 2 + 1] && <div className="hidden md:block md:flex-1" />}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom controls bar */}
      <div className="mt-10 flex flex-col items-center justify-between gap-6 sm:flex-row">
        {/* Dots / pagination */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-muted-foreground tabular-nums">
            <span className="text-foreground">
              {String(page + 1).padStart(2, "0")}
            </span>
            <span className="mx-1.5 text-muted-foreground/40">/</span>
            {String(PAIRS).padStart(2, "0")}
          </span>
          <span className="h-px w-12 bg-gradient-to-r from-primary/60 to-transparent" />
          <div className="flex items-center gap-2">
            {Array.from({ length: PAIRS }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i)}
                aria-label={`Go to page ${i + 1}`}
                className={`rounded-full transition-all ${
                  i === page
                    ? "h-1.5 w-8 bg-gradient-to-r from-[#FFD54F] to-[#FF9800]"
                    : "h-1.5 w-1.5 bg-foreground/15 hover:bg-foreground/30"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Prev / Next */}
        <div className="flex items-center gap-3">
          <button
            onClick={prev}
            aria-label="Previous"
            className="group flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card text-foreground/70 transition-all hover:border-primary/40 hover:text-primary"
          >
            <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
          </button>
          <button
            onClick={next}
            aria-label="Next"
            className="group flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-[#FFD54F] to-[#FF9800] text-[#1A1A2E] shadow-lg shadow-primary/30 transition-all hover:scale-105 hover:shadow-primary/50"
          >
            <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

function Card({ t }: { t: QuoteT }) {
  return (
    <figure className="card-glow group relative flex w-full flex-1 flex-col overflow-hidden rounded-3xl border border-border bg-card p-8 shadow-lg shadow-black/20">
      {/* Top gradient hairline */}
      <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
      {/* Decorative quote */}
      <Quote className="pointer-events-none absolute -right-3 -top-3 h-24 w-24 text-primary/[0.06] transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110" />

      <div className="relative flex h-full flex-col">
        {/* Stars */}
        <div className="mb-5 flex items-center justify-between">
          <div className="flex gap-1">
            {Array.from({ length: t.rating }).map((_, i) => (
              <Star key={i} className="h-4 w-4 fill-primary text-primary" />
            ))}
          </div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70">
            Verified
          </span>
        </div>

        {/* Quote */}
        <blockquote className="text-[15px] leading-relaxed text-foreground/85">
          &ldquo;{t.quote}&rdquo;
        </blockquote>

        {/* Metric pill */}
        {t.metric && (
          <div className="mt-5 inline-flex w-fit items-center gap-2 rounded-full border border-primary/20 bg-primary/[0.06] px-3 py-1.5">
            <span className="text-sm font-extrabold text-gradient-gold tabular-nums">
              {t.metric.value}
            </span>
            <span className="text-[11px] font-medium text-muted-foreground">
              {t.metric.label}
            </span>
          </div>
        )}

        {/* Author */}
        <figcaption className="mt-6 flex items-center gap-3 border-t border-border pt-5">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#FFD54F] to-[#FF9800] text-base font-extrabold text-[#1A1A2E] shadow-md shadow-primary/20 ring-2 ring-card">
            {t.initial}
          </div>
          <div className="min-w-0 leading-tight">
            <p className="truncate text-sm font-bold text-foreground">{t.name}</p>
            <p className="mt-0.5 truncate text-xs text-muted-foreground">
              <span className="font-medium text-foreground/70">{t.role}</span>
              <span className="mx-1.5 text-muted-foreground/40">·</span>
              {t.company}
            </p>
          </div>
        </figcaption>
      </div>
    </figure>
  );
}
