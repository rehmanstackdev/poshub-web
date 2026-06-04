"use client";

import { useEffect, useRef, useState } from "react";

type Stat = { value: number; suffix?: string; label: string; prefix?: string };

const STATS: Stat[] = [
  { value: 500, suffix: "+", label: "Shops onboarded" },
  { value: 1.2, suffix: "M+", label: "Orders processed", prefix: "" },
  { value: 99.99, suffix: "%", label: "Platform uptime" },
  { value: 4.9, suffix: "/5", label: "Avg. shop rating" },
];

function formatValue(s: Stat, n: number) {
  const isFloat = !Number.isInteger(s.value);
  const display = isFloat ? n.toFixed(s.value < 10 ? 2 : 1) : Math.floor(n).toLocaleString();
  return `${s.prefix ?? ""}${display}${s.suffix ?? ""}`;
}

export function StatsCounter() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setVisible(true),
      { threshold: 0.3 },
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-white/8 bg-white/[0.03] backdrop-blur md:grid-cols-4"
    >
      {STATS.map((s, i) => (
        <Counter key={i} stat={s} active={visible} />
      ))}
    </div>
  );
}

function Counter({ stat, active }: { stat: Stat; active: boolean }) {
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!active) return;
    const duration = 1400;
    const start = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(stat.value * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, stat.value]);

  return (
    <div className="group relative bg-[#1A1A2E] px-6 py-8 text-center transition-colors hover:bg-[#1A1A2E]/85">
      <p className="text-4xl font-extrabold tracking-tight text-gradient-gold tabular-nums lg:text-5xl">
        {formatValue(stat, n)}
      </p>
      <p className="mt-2 text-xs font-semibold uppercase tracking-widest text-white/40">
        {stat.label}
      </p>
    </div>
  );
}
