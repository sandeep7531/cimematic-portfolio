"use client";

import { useEffect, useState } from "react";
import {
  EATEN_DURATION,
  REGEN_MS,
  getEatenAt,
  useEatenVersion,
} from "@/components/stack/pacmanStore";
import PacmanCanvas from "@/components/PacmanCanvas";
import { PERIODIC_GRID_ITEMS, type PeriodicGridItem } from "@/data/skills";

const GLITCH_CHAR = "·"; // eaten cards show glitch dots (· · ·)

/**
 * Source-visible literal maps of grid positions. Tailwind v4 generates
 * utilities (grid-cols-18, col-start-13, row-start-5, ...) from strings it
 * finds in source files — dynamically interpolated class names would never
 * be scanned, so every slot class is spelled out here.
 */
const COL_START: Record<number, string> = {
  1: "col-start-1",
  2: "col-start-2",
  3: "col-start-3",
  4: "col-start-4",
  5: "col-start-5",
  6: "col-start-6",
  7: "col-start-7",
  8: "col-start-8",
  9: "col-start-9",
  10: "col-start-10",
  11: "col-start-11",
  12: "col-start-12",
  13: "col-start-13",
  14: "col-start-14",
  15: "col-start-15",
  16: "col-start-16",
  17: "col-start-17",
  18: "col-start-18",
};

const ROW_START: Record<number, string> = {
  1: "row-start-1",
  2: "row-start-2",
  3: "row-start-3",
  4: "row-start-4",
  5: "row-start-5",
};

/** Typed-regeneration: letters return left-to-right over REGEN_MS. */
function regenText(name: string, elapsed: number): string {
  const progress = (elapsed - (EATEN_DURATION - REGEN_MS)) / REGEN_MS;
  const visible = Math.ceil(progress * name.length);
  return (
    name.slice(0, visible) +
    GLITCH_CHAR.repeat(Math.max(0, name.length - visible))
  );
}

/**
 * Clock snapshot that only ticks while at least one element is eaten or
 * regenerating. Date.now() is read inside the interval callback (never
 * during render) to keep renders pure.
 */
function useEatenClock(): number {
  const version = useEatenVersion();
  const [now, setNow] = useState(0);

  useEffect(() => {
    const hasActive = PERIODIC_GRID_ITEMS.some(
      (el) => Date.now() - getEatenAt(el.name) < EATEN_DURATION
    );
    if (!hasActive) return;
    const id = window.setInterval(() => setNow(Date.now()), 60);
    return () => window.clearInterval(id);
  }, [version]);

  return now;
}

/**
 * One periodic-table cell at its exact grid slot. Pac-Man eats it via its
 * data-skill attribute.
 */
function ElementCard({ el }: { el: PeriodicGridItem }) {
  const now = useEatenClock();
  const eatenAt = getEatenAt(el.name);
  const elapsed = eatenAt ? now - eatenAt : Infinity;

  let state: "normal" | "eaten" | "regen" = "normal";
  if (eatenAt && (elapsed < 0 || elapsed < EATEN_DURATION - REGEN_MS)) {
    state = "eaten";
  } else if (eatenAt && elapsed < EATEN_DURATION) {
    state = "regen";
  }

  // Symbol glitches whole-token while eaten; name types back in.
  const symbolText =
    state === "eaten" ? GLITCH_CHAR.repeat(el.symbol.length) : el.symbol;
  const nameText =
    state === "eaten"
      ? GLITCH_CHAR.repeat(el.name.length)
      : state === "regen"
        ? regenText(el.name, elapsed)
        : el.name;

  return (
    <div
      className={`element-card relative z-10 col-span-1 flex flex-col justify-between rounded-md border border-emerald-500/20 bg-transparent p-2 transition-all hover:border-emerald-500/80 ${COL_START[el.col]} ${ROW_START[el.row]}${
        state !== "normal" ? " element-card--eaten" : ""
      }`}
      role="listitem"
      data-skill={el.name}
      aria-label={el.name}
    >
      <span className="self-start font-mono text-[9px] text-emerald-500/60">
        {el.num}
      </span>
      <div className="text-center">
        <div className="element-symbol font-mono text-lg font-bold text-emerald-400 md:text-xl">
          {symbolText}
        </div>
        <div className="element-name truncate font-mono text-[10px] text-neutral-300">
          {nameText}
        </div>
      </div>
      <span className="self-end font-mono text-[8px] uppercase text-emerald-500/40">
        {el.category}
      </span>
    </div>
  );
}

/**
 * Authentic Periodic Table: asymmetric 18-column grid with the iconic empty
 * gaps (top middle, row 4) inside the bounded Pac-Man game frame. On small
 * screens the frame scrolls horizontally so the 18-column structure and all
 * slots are preserved.
 */
export default function Stack() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 md:px-8">
      <div className="relative overflow-hidden rounded-2xl border border-neutral-800/80 bg-neutral-950/90">
        <PacmanCanvas />
        <div className="relative z-10 overflow-x-auto">
          <div
            className="grid min-w-[900px] grid-cols-18 auto-rows-fr gap-1 p-4 md:gap-2"
            role="list"
            aria-label="Periodic table of technologies"
          >
            {PERIODIC_GRID_ITEMS.map((el) => (
              <ElementCard key={el.num} el={el} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
