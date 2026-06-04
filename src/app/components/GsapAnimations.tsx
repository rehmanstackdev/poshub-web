"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function GsapAnimations() {
  useEffect(() => {
    const ctx = gsap.context(() => {
      // ── Hero entrance timeline ────────────────────────────────────────────
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.from(".hero-badge",   { opacity: 0, y: 24, duration: 0.55 })
        .from(".hero-title",   { opacity: 0, y: 48, duration: 0.8  }, "-=0.3")
        .from(".hero-desc",    { opacity: 0, y: 24, duration: 0.55 }, "-=0.45")
        .from(".hero-pill",    { opacity: 0, y: 18, stagger: 0.08, duration: 0.45 }, "-=0.35")
        .from(".hero-ctas",    { opacity: 0, y: 20, duration: 0.5  }, "-=0.3")
        .from(".hero-founder", { opacity: 0, y: 24, scale: 0.97, duration: 0.55 }, "-=0.3")
        .from(".hero-slider",  { opacity: 0, x: 70, duration: 0.9, ease: "power2.out" }, "-=0.85");

      // ── Section title fade-ups ────────────────────────────────────────────
      gsap.utils.toArray<Element>(".anim-section-title").forEach((el) => {
        gsap.from(el, {
          scrollTrigger: { trigger: el, start: "top 88%" },
          opacity: 0, y: 32, duration: 0.65, ease: "power2.out",
        });
      });

      // ── Feature cards ─────────────────────────────────────────────────────
      gsap.utils.toArray<HTMLElement>(".feature-card").forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out",
            scrollTrigger: {
              trigger: el,
              start: "top 92%",
              toggleActions: "play none none none",
              once: true,
            },
          },
        );
      });

      // ── Role cards ────────────────────────────────────────────────────────
      gsap.from(".role-card", {
        scrollTrigger: { trigger: "#roles", start: "top 78%" },
        opacity: 0, y: 45, stagger: 0.15, duration: 0.65, ease: "power2.out",
      });

      // ── Testimonials ──────────────────────────────────────────────────────
      gsap.from(".testimonial-card", {
        scrollTrigger: { trigger: "#testimonials", start: "top 80%" },
        opacity: 0, y: 40, stagger: 0.12, duration: 0.6, ease: "power2.out",
      });

      // ── FAQ items ─────────────────────────────────────────────────────────
      gsap.from(".faq-item", {
        scrollTrigger: { trigger: "#faq", start: "top 80%" },
        opacity: 0, y: 24, stagger: 0.06, duration: 0.5, ease: "power2.out",
      });

      // ── CTA section ───────────────────────────────────────────────────────
      gsap.from(".cta-icon", {
        scrollTrigger: { trigger: ".cta-icon", start: "top 82%" },
        opacity: 0, scale: 0.6, duration: 0.65, ease: "back.out(1.7)",
      });
      gsap.from(".cta-heading", {
        scrollTrigger: { trigger: ".cta-heading", start: "top 85%" },
        opacity: 0, y: 30, duration: 0.6, ease: "power2.out",
      });
      gsap.from(".cta-sub", {
        scrollTrigger: { trigger: ".cta-sub", start: "top 88%" },
        opacity: 0, y: 20, duration: 0.55, ease: "power2.out",
      });
      gsap.from(".cta-btns", {
        scrollTrigger: { trigger: ".cta-btns", start: "top 88%" },
        opacity: 0, y: 20, duration: 0.55, ease: "power2.out",
      });
      gsap.from(".cta-trust", {
        scrollTrigger: { trigger: ".cta-trust", start: "top 92%" },
        opacity: 0, y: 16, stagger: 0.08, duration: 0.45, ease: "power2.out",
      });

      // ── Contact cards ─────────────────────────────────────────────────────
      gsap.from(".contact-card", {
        scrollTrigger: { trigger: "#contact", start: "top 78%" },
        opacity: 0, y: 40, stagger: 0.18, duration: 0.65, ease: "power2.out",
      });
      // Re-measure once everything has rendered (images, fonts, late layout)
      const refresh = () => ScrollTrigger.refresh();
      requestAnimationFrame(() => requestAnimationFrame(refresh));
      window.addEventListener("load", refresh);
    });

    return () => ctx.revert();
  }, []);

  return null;
}
