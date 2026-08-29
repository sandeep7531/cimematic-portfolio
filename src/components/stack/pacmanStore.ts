"use client";

import { useSyncExternalStore } from "react";

/**
 * Out-of-React store bridging the Pac-Man canvas (imperative, 60fps) and the
 * Tech Stack text components (React). The canvas calls eat() on collision;
 * React components subscribe and re-render only on discrete eat events,
 * never per animation frame.
 */

export const EATEN_DURATION = 3000; // total time a card stays eaten (ms)
export const REGEN_MS = 750; // final window where text types back in (ms)

const eaten = new Map<string, number>(); // skill name -> eaten timestamp
const listeners = new Set<() => void>();
let version = 0;

export function eat(name: string) {
  eaten.set(name, Date.now());
  version++;
  listeners.forEach((l) => l());
}

export function getEatenAt(name: string): number {
  return eaten.get(name) ?? 0;
}

export function isEatenNow(name: string, now: number): boolean {
  const at = eaten.get(name);
  return at !== undefined && now - at < EATEN_DURATION;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot() {
  return version;
}

/** Re-renders the calling component only when a new eat happens. */
export function useEatenVersion(): number {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
