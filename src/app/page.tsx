import Link from "next/link";
import {
  BarChart3,
  FileText,
  Globe2,
  LayoutDashboard,
  Package,
  ScanLine,
  ShieldCheck,
  Smartphone,
  Store,
  Users,
  ArrowRight,
  Star,
  Mail,
  Phone,
  Sparkles,
  Check,
  Lock,
} from "lucide-react";
import { HeroSlider } from "./components/HeroSlider";
import { GsapAnimations } from "./components/GsapAnimations";
import { Testimonials } from "./components/Testimonials";

export default function LandingPage() {
  return (
    <div className="dark min-h-screen bg-[#0F1020] text-foreground overflow-x-hidden pt-16 selection:bg-primary/30 selection:text-primary">
      <GsapAnimations />

      {/* ── Navbar ─────────────────────────────────────────────────────── */}
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/[0.06] bg-[#0F1020]/80 backdrop-blur-xl supports-[backdrop-filter]:bg-[#0F1020]/65">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-2.5">
            <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#FFD54F] to-[#FF9800] shadow-lg shadow-primary/40">
              <ScanLine className="h-4 w-4 text-[#1A1A2E]" />
              <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-emerald-400 ring-2 ring-[#1A1A2E]" />
            </div>
            <div className="leading-none">
              <span className="font-mono text-sm font-bold tracking-[0.18em] text-white">
                POSHUB
              </span>
              <span className="ml-1 align-middle text-[10px] font-semibold text-primary/80">
                ®
              </span>
            </div>
          </div>
          <nav className="hidden items-center gap-9 text-sm font-medium text-white/55 md:flex">
            <a href="#features" className="transition-colors hover:text-white">Features</a>
            <a href="#roles" className="transition-colors hover:text-white">Roles</a>
            <a href="#testimonials" className="transition-colors hover:text-white">Customers</a>
          </nav>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="hidden text-sm font-medium text-white/60 transition-colors hover:text-white sm:inline-flex"
            >
              Sign in
            </Link>
            <Link
              href="/login"
              className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-br from-[#FFD54F] to-[#FFC107] px-4 py-2 text-sm font-bold text-[#1A1A2E] shadow-lg shadow-primary/30 ring-1 ring-primary/30 transition-all hover:shadow-primary/50"
            >
              Get started
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero ───────────────────────────────────────────────────────── */}
      <section className="relative isolate overflow-hidden bg-[#0F1020] px-6 pb-12 pt-10">
        {/* Aurora + grain + grid */}
        <div className="aurora" />
        <div className="grain" />
        <div className="absolute inset-0 bg-dot-grid opacity-40" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

        <div className="relative mx-auto max-w-7xl">
          <div className="grid items-center gap-16 lg:grid-cols-[1.05fr_1fr]">

            {/* ── LEFT ── */}
            <div className="flex flex-col gap-8">
              {/* Eyebrow */}
              <div className="hero-badge inline-flex w-fit items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary">
                <Sparkles className="h-3.5 w-3.5" />
                Multi-tenant POS Platform
              </div>

              {/* Headline */}
              <h1 className="hero-title text-[2.75rem] font-extrabold leading-[1.02] tracking-tight text-white sm:text-6xl lg:text-[4.25rem]">
                <span className="text-gradient-light">Run every shop</span>
                <br />
                <span className="text-gradient-gold">from one platform.</span>
              </h1>

              {/* Description */}
              <p className="hero-desc max-w-xl text-lg leading-relaxed text-white/55">
                POSHub gives super admins a cinematic dashboard to oversee every store, while each shop’s team runs inventory and sales from a mobile-first app — with rock-solid data isolation between tenants.
              </p>

              {/* Feature pills */}
              <div className="flex flex-wrap gap-2.5">
                {[
                  { icon: Store, label: "Multi-shop" },
                  { icon: ShieldCheck, label: "Role-based" },
                  { icon: BarChart3, label: "Real-time reports" },
                  { icon: Smartphone, label: "Mobile + Web" },
                ].map(({ icon: Icon, label }) => (
                  <div
                    key={label}
                    className="hero-pill flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-medium text-white/70 backdrop-blur transition-colors hover:border-primary/30 hover:text-white"
                  >
                    <Icon className="h-3.5 w-3.5 text-primary" />
                    {label}
                  </div>
                ))}
              </div>

              {/* CTAs */}
              <div className="hero-ctas flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/login"
                  className="shimmer group inline-flex h-13 items-center justify-center gap-2 rounded-2xl bg-gradient-to-br from-[#FFE082] via-[#FFC107] to-[#FF9800] px-8 py-3.5 text-base font-bold text-[#1A1A2E] shadow-xl shadow-primary/30 ring-1 ring-primary/40 transition-all hover:scale-[1.02] hover:shadow-primary/50"
                >
                  <LayoutDashboard className="h-5 w-5" />
                  Open Dashboard
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
                <a
                  href="#flow"
                  className="inline-flex h-13 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-8 py-3.5 text-base font-semibold text-white/75 backdrop-blur transition-colors hover:bg-white/[0.08]"
                >
                  See how it works
                </a>
              </div>

              {/* Social proof strip */}
              <div className="hero-founder flex flex-col gap-5 rounded-2xl border border-white/8 bg-gradient-to-br from-white/[0.06] to-white/[0.02] px-6 py-5 backdrop-blur-md sm:flex-row sm:items-center">
                {/* Avatar group */}
                <div className="flex items-center -space-x-3">
                  {[
                    { l: "R", g: "from-[#FFD54F] to-[#FF9800]" },
                    { l: "A", g: "from-[#90CAF9] to-[#1976D2]" },
                    { l: "D", g: "from-[#A5D6A7] to-[#2E7D32]" },
                    { l: "S", g: "from-[#F48FB1] to-[#C2185B]" },
                  ].map(({ l, g }, i) => (
                    <div
                      key={i}
                      className={`flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br ${g} text-sm font-bold text-[#1A1A2E] ring-2 ring-[#0F1020]`}
                    >
                      {l}
                    </div>
                  ))}
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-[11px] font-bold text-white ring-2 ring-[#0F1020]">
                    +500
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-primary text-primary" />
                    ))}
                    <span className="ml-1 text-sm font-bold text-white">4.9</span>
                  </div>
                  <p className="mt-1 text-xs text-white/55">
                    Trusted by <span className="font-bold text-white">500+ shop owners</span> across 14 cities
                  </p>
                </div>
                <div className="hidden h-10 w-px bg-white/10 sm:block" />
                <div className="text-right">
                  <p className="text-2xl font-extrabold text-gradient-gold">99.99%</p>
                  <p className="text-[10px] uppercase tracking-widest text-white/40">Uptime</p>
                </div>
              </div>
            </div>

            {/* ── RIGHT slider ── */}
            <div className="hero-slider flex justify-center lg:justify-end">
              <HeroSlider />
            </div>
          </div>
        </div>
      </section>

      {/* ── Marquee strip ──────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-y border-white/8 bg-[#0F1020] py-4">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-32 bg-gradient-to-r from-[#0F1020] to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-32 bg-gradient-to-l from-[#0F1020] to-transparent" />
        <div className="flex">
          <div className="marquee-track flex shrink-0 items-center gap-16 whitespace-nowrap pr-16 text-sm font-semibold uppercase tracking-[0.3em] text-white/30">
            {[
              "Aroma Cafe",
              "UrbanMart",
              "Bloom & Co.",
              "Nova Retail",
              "Tribe Coffee",
              "GreenLeaf Grocers",
              "Pulse Pharmacy",
              "Saffron Kitchen",
              "Aroma Cafe",
              "UrbanMart",
              "Bloom & Co.",
              "Nova Retail",
              "Tribe Coffee",
              "GreenLeaf Grocers",
              "Pulse Pharmacy",
              "Saffron Kitchen",
            ].map((name, i) => (
              <span key={i} className="flex items-center gap-3">
                <Store className="h-4 w-4 text-primary/60" />
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ───────────────────────────────────────────────────── */}
      <section id="features" className="relative bg-[#0F1020] px-6 py-28">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 flex flex-col items-center text-center">
            <p className="anim-section-title mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-primary">
              Features
            </p>
            <h2 className="anim-section-title text-4xl font-extrabold tracking-tight lg:text-5xl">
              Everything you need.{" "}
              <span className="text-gradient-gold">Nothing you don&apos;t.</span>
            </h2>
            <p className="anim-section-title mx-auto mt-5 max-w-xl text-base text-muted-foreground">
              A curated set of operator-grade tools — designed by shop owners, for shop owners.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: Store, eyebrow: "Tenancy",   tone: "gold", title: "Multi-shop management", desc: "Unlimited shops under one super admin account — fully isolated tenancies, zero cross-contamination." },
              { icon: ShieldCheck, eyebrow: "Access", tone: "teal", title: "Role-based control", desc: "Super admin, admin, staff — precisely scoped permissions enforced server-side at the API layer." },
              { icon: ScanLine, eyebrow: "Checkout", tone: "gold", title: "Lightning POS", desc: "Search, quantity, discount, payment — finish a sale in under four taps. Built for peak-hour speed." },
              { icon: BarChart3, eyebrow: "Insights", tone: "teal", title: "Real-time reports", desc: "Daily, weekly, monthly breakdowns with top products and period-over-period comparisons." },
              { icon: Package, eyebrow: "Inventory", tone: "gold", title: "Smart stock", desc: "Live stock levels, low-stock alerts, and audited adjustment logs scoped to every shop." },
              { icon: FileText, eyebrow: "Billing", tone: "teal", title: "Auto-invoicing", desc: "Every sale generates a structured invoice automatically — filter, share, export in one tap." },
              { icon: Smartphone, eyebrow: "Mobile", tone: "gold", title: "Mobile-first ops", desc: "The full operational workflow on iOS & Android. The web dashboard is for oversight and config." },
              { icon: Globe2, eyebrow: "Security", tone: "teal", title: "Data tenancy", desc: "Shop isolation enforced via JWT — admins never see, never query, another shop&apos;s data." },
              { icon: Users, eyebrow: "Team", tone: "gold", title: "Staff management", desc: "Admins invite staff from mobile. Super admins manage every user across every shop from the web." },
            ].map(({ icon: Icon, eyebrow, tone, title, desc }) => {
              const isGold = tone === "gold";
              return (
                <div
                  key={title}
                  className="feature-card group relative flex flex-col rounded-2xl border border-white/[0.06] bg-[#13142A]/40 p-8 transition-all duration-500 hover:border-white/[0.12] hover:bg-[#13142A]/70"
                >
                  {/* Hover glow */}
                  <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                    <div
                      className={`absolute -top-px left-8 right-8 h-px bg-gradient-to-r from-transparent ${
                        isGold ? "via-primary/50" : "via-teal-400/50"
                      } to-transparent`}
                    />
                    <div
                      className={`absolute inset-x-12 -top-20 h-40 rounded-full blur-3xl ${
                        isGold ? "bg-primary/20" : "bg-teal-400/15"
                      }`}
                    />
                  </div>

                  {/* Icon with radial glow */}
                  <div className="relative mb-7 h-12 w-12">
                    <div
                      className={`absolute inset-0 rounded-2xl blur-xl transition-opacity duration-500 ${
                        isGold ? "bg-primary/40" : "bg-teal-400/30"
                      } opacity-50 group-hover:opacity-90`}
                    />
                    <div
                      className={`relative flex h-12 w-12 items-center justify-center rounded-2xl border ${
                        isGold
                          ? "border-primary/30 bg-primary/[0.08]"
                          : "border-teal-400/30 bg-teal-400/[0.08]"
                      }`}
                    >
                      <Icon
                        className={`h-5 w-5 ${
                          isGold ? "text-primary" : "text-teal-300"
                        }`}
                        strokeWidth={1.5}
                      />
                    </div>
                  </div>

                  {/* Eyebrow */}
                  <p
                    className={`mb-2.5 text-[11px] font-bold uppercase tracking-[0.22em] ${
                      isGold ? "text-primary" : "text-teal-300"
                    }`}
                  >
                    {eyebrow}
                  </p>

                  {/* Title */}
                  <h3 className="mb-3 text-xl font-bold tracking-tight text-white">
                    {title}
                  </h3>

                  {/* Desc */}
                  <p className="text-sm leading-relaxed text-white/45">
                    {desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Roles ──────────────────────────────────────────────────────── */}
      <section id="roles" className="bg-[#0F1020] px-6 py-28">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <p className="anim-section-title mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-primary">Who uses it</p>
            <h2 className="anim-section-title text-4xl font-extrabold tracking-tight lg:text-5xl">
              Three roles. <span className="text-gradient-gold">One system.</span>
            </h2>
            <p className="anim-section-title mx-auto mt-5 max-w-xl text-muted-foreground">
              Each role gets exactly the access they need — nothing more, nothing less.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                role: "Super Admin",
                badge: "bg-violet-500/10 text-violet-600 border-violet-500/30",
                dot: "bg-violet-500",
                platform: "Web only",
                summary: "Full visibility and control across all shops. Creates shops, assigns admins, monitors every data point.",
                access: ["Create & manage all shops", "Assign admins to shops", "View all users system-wide", "Cross-shop reports & invoices", "Blocked from mobile app login"],
                ring: "ring-violet-500/10",
              },
              {
                role: "Admin",
                badge: "bg-primary/10 text-primary border-primary/30",
                dot: "bg-primary",
                platform: "Mobile app",
                summary: "Manages a single shop. Handles products, categories, staff, and monitors shop performance.",
                access: ["Add and edit products & categories", "Create and manage staff accounts", "View shop-scoped reports", "Adjust stock levels", "View shop invoices"],
                ring: "ring-primary/15",
                featured: true,
              },
              {
                role: "Staff",
                badge: "bg-emerald-500/10 text-emerald-600 border-emerald-500/30",
                dot: "bg-emerald-500",
                platform: "Mobile app",
                summary: "Day-to-day sales operator. Processes checkouts and runs the POS flow for their shop.",
                access: ["Browse & search products", "Process sales & checkout", "Apply discounts", "Select payment method", "View own invoices"],
                ring: "ring-emerald-500/10",
              },
            ].map(({ role, badge, dot, platform, summary, access, ring, featured }) => (
              <div
                key={role}
                className={`role-card card-glow shimmer relative flex flex-col overflow-hidden rounded-3xl border bg-card p-8 shadow-sm ring-1 ${ring} ${
                  featured ? "lg:scale-[1.03] lg:shadow-xl" : ""
                }`}
              >
                {featured && (
                  <div className="absolute right-5 top-5 inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-[#FFD54F] to-[#FF9800] px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-[#1A1A2E] shadow-md shadow-primary/30">
                    <Sparkles className="h-3 w-3" />
                    Most used
                  </div>
                )}
                <div className="mb-5 flex items-center justify-between">
                  <h3 className="text-2xl font-bold">{role}</h3>
                  <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${badge}`}>{platform}</span>
                </div>
                <p className="mb-6 text-sm leading-relaxed text-muted-foreground">{summary}</p>
                <ul className="mt-auto space-y-3">
                  {access.map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${dot}`} />
                      <span className="text-sm text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ───────────────────────────────────────────────── */}
      <section id="testimonials" className="relative bg-[#0F1020] px-6 py-28">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <p className="anim-section-title mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-primary">Loved by operators</p>
            <h2 className="anim-section-title text-4xl font-extrabold tracking-tight lg:text-5xl">
              Real shops. <span className="text-gradient-gold">Real numbers.</span>
            </h2>
            <p className="anim-section-title mx-auto mt-5 max-w-xl text-muted-foreground">
              Hear from owners who replaced 3-tool stacks with one POSHub workspace.
            </p>
          </div>
          <Testimonials />
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────────────────────── */}
      <section className="relative isolate overflow-hidden bg-[#0F1020] px-6 py-32">
        <div className="aurora" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,193,7,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,193,7,0.04)_1px,transparent_1px)] bg-[size:60px_60px]" />
        <div className="pointer-events-none absolute left-1/2 top-0 h-px w-full -translate-x-1/2 bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

        <div className="relative mx-auto max-w-4xl text-center">
          <div className="cta-icon mx-auto mb-7 inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-[#FFE082] to-[#FF9800] shadow-2xl shadow-primary/30 ring-1 ring-primary/40">
            <ScanLine className="h-9 w-9 text-[#1A1A2E]" />
          </div>

          <h2 className="cta-heading mb-6 text-4xl font-extrabold tracking-tight text-white lg:text-6xl">
            <span className="text-gradient-light">Ready to run your shops</span>
            <br />
            <span className="text-gradient-gold">smarter?</span>
          </h2>
          <p className="cta-sub mx-auto mb-12 max-w-xl text-lg text-white/55 leading-relaxed">
            Sign in as Super Admin on the web to configure shops, or grab the mobile app as Admin or Staff to start selling today — no credit card required.
          </p>

          <div className="cta-btns flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/login"
              className="shimmer group inline-flex h-14 items-center gap-2.5 rounded-2xl bg-gradient-to-br from-[#FFE082] via-[#FFC107] to-[#FF9800] px-10 py-3.5 text-base font-bold text-[#1A1A2E] shadow-2xl shadow-primary/40 ring-1 ring-primary/40 transition-all hover:scale-[1.03] hover:shadow-primary/60"
            >
              <LayoutDashboard className="h-5 w-5" />
              Open Dashboard
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <a
              href="#features"
              className="inline-flex h-14 items-center gap-2.5 rounded-2xl border border-white/10 bg-white/[0.04] px-10 py-3.5 text-base font-semibold text-white/75 backdrop-blur transition-colors hover:bg-white/[0.08]"
            >
              Explore Features
            </a>
          </div>

          <div className="mt-16 flex flex-wrap items-center justify-center gap-x-10 gap-y-4 border-t border-white/8 pt-10">
            {[
              { icon: ShieldCheck, label: "Secure & Isolated" },
              { icon: Smartphone, label: "iOS & Android" },
              { icon: BarChart3, label: "Real-time Analytics" },
              { icon: Lock, label: "TLS 1.3 Encrypted" },
              { icon: Check, label: "No credit card" },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="cta-trust flex items-center gap-2.5 text-white/50">
                <Icon className="h-4 w-4 text-primary/80" />
                <span className="text-sm font-medium">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Contact ─────────────────────────────────────────────────────── */}
      <section id="contact" className="bg-[#0F1020] px-6 py-28">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <p className="anim-section-title mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-primary">Let&apos;s Talk</p>
            <h2 className="anim-section-title text-4xl font-extrabold tracking-tight lg:text-5xl">
              Get in <span className="text-gradient-gold">touch.</span>
            </h2>
            <p className="anim-section-title mx-auto mt-5 max-w-lg text-muted-foreground">
              Question about POSHub, want a live demo, or ready to roll out across your shops? We&apos;re here.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            {/* Left */}
            <div className="flex flex-col gap-6">
              <div className="contact-card card-glow rounded-3xl border bg-card p-8 shadow-sm">
                <div className="flex items-center gap-5">
                  <div className="relative shrink-0">
                    <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-[#FFD54F] to-[#FF9800] text-3xl font-extrabold text-[#1A1A2E] shadow-lg shadow-primary/30">
                      R
                    </div>
                    <div className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 ring-2 ring-background">
                      <div className="h-2 w-2 rounded-full bg-white" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-extrabold text-foreground">Rehman Naveed</h3>
                    <p className="text-sm text-muted-foreground">Founder, POSHub</p>
                    <div className="mt-2 flex gap-1">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Star key={i} className="h-3.5 w-3.5 fill-primary text-primary" />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
                  Founder of POSHub — a multi-tenant POS &amp; inventory platform built for modern retail businesses. Passionate about simple, beautiful products that respect operators&apos; time.
                </p>
              </div>

              <div className="flex flex-col gap-3">
                {[
                  { icon: Mail, label: "Email", value: "rehman@poshub.app" },
                  { icon: Phone, label: "Phone", value: "+92 300 0000000" },
                ].map(({ icon: Icon, label, value }) => (
                  <div
                    key={label}
                    className="card-glow flex items-center gap-4 rounded-2xl border bg-card px-5 py-4 shadow-sm transition-shadow hover:shadow-md"
                  >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{label}</p>
                      <p className="mt-0.5 text-sm font-semibold text-foreground">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="contact-card rounded-3xl border bg-card p-8 shadow-sm">
              <h3 className="mb-1 text-xl font-bold text-foreground">Send a message</h3>
              <p className="mb-7 text-sm text-muted-foreground">I typically respond within 24 hours.</p>
              <form className="flex flex-col gap-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Name</label>
                    <input
                      type="text"
                      placeholder="Your name"
                      className="h-12 rounded-xl border border-border bg-background px-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Email</label>
                    <input
                      type="email"
                      placeholder="your@email.com"
                      className="h-12 rounded-xl border border-border bg-background px-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Subject</label>
                  <input
                    type="text"
                    placeholder="Demo request / Partnership / Other"
                    className="h-12 rounded-xl border border-border bg-background px-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Message</label>
                  <textarea
                    rows={5}
                    placeholder="Tell me what you need…"
                    className="resize-none rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>
                <button
                  type="submit"
                  className="shimmer group h-13 rounded-xl bg-gradient-to-br from-[#1A1A2E] to-[#2A2A4E] px-6 py-3.5 text-sm font-bold text-primary shadow-lg shadow-black/30 transition-all hover:scale-[1.02] hover:shadow-black/40 active:scale-[0.98]"
                >
                  Send Message →
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────────────── */}
      <footer className="relative overflow-hidden border-t border-white/8 bg-[#0F1020] px-6 py-14">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 md:grid-cols-4">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#FFD54F] to-[#FF9800] shadow-lg shadow-primary/30">
                  <ScanLine className="h-4 w-4 text-[#1A1A2E]" />
                </div>
                <span className="font-mono text-sm font-bold tracking-[0.18em] text-white">POSHUB</span>
                <span className="text-[10px] font-semibold text-primary/80">®</span>
              </div>
              <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/45">
                A multi-tenant POS &amp; inventory platform for modern retail — built mobile-first, isolated by default, premium by design.
              </p>
              <div className="mt-6 flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                ))}
                <span className="ml-2 text-xs font-medium text-white/45">4.9 · 500+ shops</span>
              </div>
            </div>

            {/* Links */}
            <div>
              <p className="mb-4 text-xs font-bold uppercase tracking-widest text-white/40">Product</p>
              <ul className="space-y-2.5 text-sm text-white/60">
                <li><a href="#features" className="transition-colors hover:text-white">Features</a></li>
                <li><a href="#roles" className="transition-colors hover:text-white">Roles</a></li>
                <li><a href="#testimonials" className="transition-colors hover:text-white">Customers</a></li>
              </ul>
            </div>

            <div>
              <p className="mb-4 text-xs font-bold uppercase tracking-widest text-white/40">Company</p>
              <ul className="space-y-2.5 text-sm text-white/60">
                <li><a href="#contact" className="transition-colors hover:text-white">Contact</a></li>
                <li><a href="mailto:rehman@poshub.app" className="transition-colors hover:text-white">Email us</a></li>
                <li><Link href="/login" className="transition-colors hover:text-white">Sign in</Link></li>
              </ul>
            </div>
          </div>

          <div className="divider-glow my-10" />

          <div className="flex flex-col items-center justify-between gap-4 text-sm sm:flex-row">
            <p className="text-white/35">Sales &amp; Inventory Management Platform · v2.0</p>
            <p className="text-white/30 text-xs">
              Built by <span className="font-semibold text-primary">Rehman Naveed</span> · © 2024 POSHub
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
