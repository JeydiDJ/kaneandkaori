"use client";

import { useEffect, useMemo, useState } from "react";

const REEL_INTERVAL_MS = 6000;

const foundationItems = [
  {
    title: "Ikigai (生き甲斐)",
    subtitle: "Reason for being",
    body: "A guiding purpose that helps each fragrance resonate with memory, identity, and emotional meaning.",
  },
  {
    title: "Kaizen (改善)",
    subtitle: "Continuous refinement",
    body: "A commitment to improve formulas, craft, and details over time, one thoughtful step at a time.",
  },
  {
    title: "Harmony",
    subtitle: "Purpose and growth",
    body: "Balance between intention and evolution, where every scent remains heartfelt and forward-moving.",
  },
  {
    title: "Ritual",
    subtitle: "Everyday becoming",
    body: "Fragrances designed to mark moments of clarity, comfort, and quiet transformation in daily life.",
  },
] as const;

export function FoundationReel() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % foundationItems.length);
    }, REEL_INTERVAL_MS);

    return () => window.clearInterval(timer);
  }, []);

  const activeItem = useMemo(() => foundationItems[activeIndex], [activeIndex]);

  return (
    <div className="kk-foundation kk-foundation-card">
      <p className="text-xs uppercase tracking-[0.35em] text-[var(--muted)]">Foundations</p>

      <div className="kk-foundation-stage mt-4" key={activeItem.title}>
        <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted)]">{activeItem.subtitle}</p>
        <h3 className="display-font mt-2 text-3xl leading-tight sm:text-4xl">{activeItem.title}</h3>
        <p className="mt-4 max-w-md text-sm leading-7 text-[var(--muted)] sm:text-base sm:leading-8">{activeItem.body}</p>
      </div>

      <div className="mt-6 grid grid-cols-4 gap-2" aria-hidden>
        {foundationItems.map((item, index) => (
          <span key={item.title} className="kk-foundation-track">
            <span
              className={`kk-foundation-fill ${index === activeIndex ? "is-active" : ""}`}
              style={{ animationDuration: `${REEL_INTERVAL_MS}ms` }}
            />
          </span>
        ))}
      </div>
    </div>
  );
}


