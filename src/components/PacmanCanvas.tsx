"use client";

import { useEffect, useRef } from "react";
import { eat, EATEN_DURATION } from "@/components/stack/pacmanStore";

/**
 * Pac-Man overlay for the Periodic Tech Stack — two stacked canvases:
 *  - background (z-0): maze grid aligned to the 18-column card matrix and
 *    dot pellets in the gaps / behind text — drawn UNDER the transparent
 *    cards so the maze shows through every cell
 *  - foreground (z-20): green/yellow byte particles, neon ghosts and
 *    Pac-Man — drawn ABOVE the cards so sprites always pop
 * Eats are communicated out-of-band via pacmanStore (no React re-renders
 * per frame). Arrow keys / WASD steer manually; idle => autonomous roam
 * toward the nearest uneaten card.
 */

const PAC_COLOR = "#facc15";
const GRID_LINE = "rgba(34, 197, 94, 0.22)";
const PELLET_GREEN = "rgba(34, 197, 94, 0.6)";
const PELLET_YELLOW = "rgba(250, 204, 21, 0.55)";
const GHOST_COLORS = ["#ff2d55", "#22d3ee", "#f472b6"];
const SPRITE_GLOW = 12; // == shadow-[0_0_12px_#facc15]

const PAC_SPEED = 3.2;
const GHOST_SPEED = 1.4;
const EAT_RADIUS = 14;
const SYNC_EVERY = 15; // re-measure DOM cards every N frames (scroll-safe)

type Vec = { x: number; y: number };

type LabelBox = {
  name: string;
  x: number;
  y: number;
  w: number;
  h: number;
  eatenUntil: number;
};

type Particle = Vec & {
  vx: number;
  vy: number;
  life: number;
  max: number;
  color: string;
};

type Dot = { x: number; y: number; alive: boolean; color: string };

export default function PacmanCanvas() {
  const bgRef = useRef<HTMLCanvasElement>(null);
  const fgRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const bg = bgRef.current;
    const fg = fgRef.current;
    const bgCtx = bg?.getContext("2d");
    const fgCtx = fg?.getContext("2d");
    if (!bg || !fg || !bgCtx || !fgCtx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let w = 0;
    let h = 0;
    let dpr = 1;
    let raf = 0;
    let last = performance.now();
    let frame = 0;

    const pac: Vec & { dir: Vec; mouth: number } = {
      x: 80,
      y: 80,
      dir: { x: 1, y: 0 },
      mouth: 0,
    };
    const keys = new Set<string>();
    // Pellets keyed semantically (grid slot / card name) so eaten state
    // survives re-measurement while the grid scrolls.
    const dots = new Map<string, Dot>();
    let labels: LabelBox[] = [];
    let gridX: number[] = [];
    let gridY: number[] = [];
    let particles: Particle[] = [];
    const ghosts = GHOST_COLORS.map((color, i) => ({
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      color,
      phase: i * 2.1,
    }));

    /**
     * Measure the real DOM cards. The maze grid is derived strictly from
     * the card matrix edges (no more clashing second grid), and pellets
     * are seeded at grid intersections + behind each card's text.
     */
    const syncLabels = () => {
      const fgRect = fg.getBoundingClientRect();
      const prev = new Map(labels.map((l) => [l.name, l]));
      labels = Array.from(
        document.querySelectorAll<HTMLElement>("#stack [data-skill]")
      )
        .map((el) => {
          const r = el.getBoundingClientRect();
          const name = el.dataset.skill ?? "";
          return {
            name,
            x: r.left - fgRect.left,
            y: r.top - fgRect.top,
            w: r.width,
            h: r.height,
            eatenUntil: prev.get(name)?.eatenUntil ?? 0,
          };
        })
        .filter((l) => l.name && l.w > 0);

      const xs = new Set<number>();
      const ys = new Set<number>();
      for (const l of labels) {
        xs.add(Math.round(l.x));
        xs.add(Math.round(l.x + l.w));
        ys.add(Math.round(l.y));
        ys.add(Math.round(l.y + l.h));
      }
      gridX = [...xs].sort((a, b) => a - b);
      gridY = [...ys].sort((a, b) => a - b);

      const seen = new Set<string>();
      const upsert = (key: string, x: number, y: number) => {
        seen.add(key);
        const d = dots.get(key);
        if (d) {
          d.x = x;
          d.y = y;
        } else {
          dots.set(key, {
            x,
            y,
            alive: true,
            color: Math.random() < 0.3 ? PELLET_YELLOW : PELLET_GREEN,
          });
        }
      };
      gridX.forEach((x, xi) =>
        gridY.forEach((y, yi) => upsert(`i:${xi}:${yi}`, x, y))
      );
      for (const l of labels)
        upsert(`c:${l.name}`, l.x + l.w / 2, l.y + l.h / 2);
      for (const key of [...dots.keys()]) if (!seen.has(key)) dots.delete(key);
    };

    const resize = () => {
      const rect = fg.parentElement?.getBoundingClientRect();
      w = rect?.width ?? window.innerWidth;
      h = rect?.height ?? window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      for (const c of [bg, fg]) {
        c.width = Math.floor(w * dpr);
        c.height = Math.floor(h * dpr);
      }
      pac.x = Math.min(pac.x, w - 20);
      pac.y = Math.min(pac.y, h - 20);
      ghosts.forEach((g, i) => {
        g.x = ((i + 1) * w) / (ghosts.length + 1);
        g.y = h - 60;
      });
      syncLabels();
    };

    const burst = (x: number, y: number, n = 10, color = "#22c55e") => {
      for (let i = 0; i < n; i++) {
        const a = Math.random() * Math.PI * 2;
        const s = 1 + Math.random() * 2.5;
        particles.push({
          x,
          y,
          vx: Math.cos(a) * s,
          vy: Math.sin(a) * s,
          life: 0,
          max: 400 + Math.random() * 300,
          color,
        });
      }
    };

    const onKeyDown = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (
        ["arrowup", "arrowdown", "arrowleft", "arrowright", "w", "a", "s", "d"].includes(
          k
        )
      ) {
        keys.add(k);
        if (k.startsWith("arrow")) e.preventDefault();
      }
    };
    const onKeyUp = (e: KeyboardEvent) => keys.delete(e.key.toLowerCase());

    const keyDir = (): Vec | null => {
      let x = 0;
      let y = 0;
      if (keys.has("arrowleft") || keys.has("a")) x -= 1;
      if (keys.has("arrowright") || keys.has("d")) x += 1;
      if (keys.has("arrowup") || keys.has("w")) y -= 1;
      if (keys.has("arrowdown") || keys.has("s")) y += 1;
      if (x === 0 && y === 0) return null;
      const len = Math.hypot(x, y);
      return { x: x / len, y: y / len };
    };


    const update = (dt: number) => {
      // --- steering: keyboard wins; else autonomous roam toward the nearest
      // uneaten label (labels prioritized over dots per spec) ---
      const kd = keyDir();
      if (kd) {
        pac.dir = kd;
      } else {
        const now = performance.now();
        let target: LabelBox | null = null;
        let best = Infinity;
        for (const l of labels) {
          if (now < l.eatenUntil) continue;
          const d = Math.hypot(
            l.x + l.w / 2 - pac.x,
            l.y + l.h / 2 - pac.y
          );
          if (d < best) {
            best = d;
            target = l;
          }
        }
        if (target) {
          const tx = target.x + target.w / 2 - pac.x;
          const ty = target.y + target.h / 2 - pac.y;
          const len = Math.hypot(tx, ty) || 1;
          pac.dir = { x: tx / len, y: ty / len };
        } else {
          // all labels eaten: gentle wander
          const t = now / 2000;
          pac.dir = { x: Math.cos(t), y: Math.sin(t * 1.3) };
        }
      }

      pac.x += pac.dir.x * PAC_SPEED * dt;
      pac.y += pac.dir.y * PAC_SPEED * dt;
      pac.x = Math.max(16, Math.min(w - 16, pac.x));
      pac.y = Math.max(16, Math.min(h - 16, pac.y));
      pac.mouth = (pac.mouth + dt * 0.2) % 1;

      // --- eat pellets (grid gaps + behind card text) ---
      for (const d of dots.values()) {
        if (d.alive && Math.hypot(d.x - pac.x, d.y - pac.y) < EAT_RADIUS) {
          d.alive = false;
          burst(d.x, d.y, 4);
        }
      }
      // slowly reseed pellets so the field never empties
      if (Math.random() < 0.02) {
        const dead = [...dots.values()].filter((d) => !d.alive);
        if (dead.length) dead[(Math.random() * dead.length) | 0].alive = true;
      }

      // --- chomp card text: pacmanStore flips symbol/name to glitch dots
      // (· · ·) for 3s; green/yellow byte particles burst from the mouth ---
      const now = performance.now();
      for (const l of labels) {
        if (
          now >= l.eatenUntil &&
          pac.x > l.x - EAT_RADIUS &&
          pac.x < l.x + l.w + EAT_RADIUS &&
          pac.y > l.y - EAT_RADIUS &&
          pac.y < l.y + l.h + EAT_RADIUS
        ) {
          l.eatenUntil = now + EATEN_DURATION;
          eat(l.name);
          const mx = pac.x + pac.dir.x * 12;
          const my = pac.y + pac.dir.y * 12;
          burst(mx, my, 9, "#22c55e");
          burst(mx, my, 9, "#facc15");
        }
      }

      // --- ghosts: neon outlines chasing pac (decorative, non-fatal) ---
      for (const g of ghosts) {
        const dx = pac.x - g.x;
        const dy = pac.y - g.y;
        const len = Math.hypot(dx, dy) || 1;
        g.vx += (dx / len) * 0.05;
        g.vy += (dy / len) * 0.05;
        const sp = Math.hypot(g.vx, g.vy);
        if (sp > GHOST_SPEED) {
          g.vx = (g.vx / sp) * GHOST_SPEED;
          g.vy = (g.vy / sp) * GHOST_SPEED;
        }
        g.x = Math.max(14, Math.min(w - 14, g.x + g.vx * dt));
        g.y = Math.max(14, Math.min(h - 14, g.y + g.vy * dt));
      }

      // --- particles ---
      particles = particles.filter((p) => {
        p.life += dt * 16;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        return p.life < p.max;
      });
    };

    // --- background layer: maze grid + pellets (UNDER the cards) ---
    const drawBg = () => {
      bgCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
      bgCtx.clearRect(0, 0, w, h);

      bgCtx.strokeStyle = GRID_LINE;
      bgCtx.lineWidth = 1;
      bgCtx.beginPath();
      for (const x of gridX) {
        bgCtx.moveTo(x, 0);
        bgCtx.lineTo(x, h);
      }
      for (const y of gridY) {
        bgCtx.moveTo(0, y);
        bgCtx.lineTo(w, y);
      }
      bgCtx.stroke();

      for (const d of dots.values()) {
        if (!d.alive) continue;
        bgCtx.fillStyle = d.color;
        bgCtx.beginPath();
        bgCtx.arc(d.x, d.y, 2.2, 0, Math.PI * 2);
        bgCtx.fill();
      }
    };

    // --- foreground layer: particles + sprites (ABOVE the cards) ---
    const drawFg = () => {
      fgCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
      fgCtx.clearRect(0, 0, w, h);

      for (const p of particles) {
        fgCtx.globalAlpha = 1 - p.life / p.max;
        fgCtx.fillStyle = p.color;
        fgCtx.fillRect(p.x - 1.5, p.y - 1.5, 3, 3);
      }
      fgCtx.globalAlpha = 1;

      for (const g of ghosts) {
        fgCtx.save();
        fgCtx.translate(g.x, g.y);
        fgCtx.shadowColor = g.color;
        fgCtx.shadowBlur = SPRITE_GLOW;
        fgCtx.strokeStyle = g.color;
        fgCtx.lineWidth = 2;
        fgCtx.beginPath();
        fgCtx.arc(0, -2, 9, Math.PI, 0);
        fgCtx.lineTo(9, 8);
        fgCtx.lineTo(4.5, 5);
        fgCtx.lineTo(0, 8);
        fgCtx.lineTo(-4.5, 5);
        fgCtx.lineTo(-9, 8);
        fgCtx.closePath();
        fgCtx.stroke();
        fgCtx.restore();
      }

      const open = 0.1 + Math.abs(Math.sin(pac.mouth * Math.PI)) * 0.32;
      const angle = Math.atan2(pac.dir.y, pac.dir.x);
      fgCtx.save();
      fgCtx.translate(pac.x, pac.y);
      fgCtx.rotate(angle);
      fgCtx.shadowColor = PAC_COLOR;
      fgCtx.shadowBlur = SPRITE_GLOW;
      fgCtx.fillStyle = PAC_COLOR;
      fgCtx.beginPath();
      fgCtx.moveTo(0, 0);
      fgCtx.arc(0, 0, 12, open * Math.PI, (2 - open) * Math.PI);
      fgCtx.closePath();
      fgCtx.fill();
      fgCtx.restore();
    };

    const loop = (t: number) => {
      const dt = Math.min((t - last) / 16.666, 3);
      last = t;
      frame++;
      if (frame % SYNC_EVERY === 0) syncLabels();
      update(dt);
      drawBg();
      drawFg();
      raf = requestAnimationFrame(loop);
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);

    if (reduced) {
      // single static frame: no loop, no input tracking
      drawBg();
      drawFg();
    } else {
      raf = requestAnimationFrame(loop);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, []);

  return (
    <>
      <canvas
        ref={bgRef}
        className="pacman-canvas pacman-canvas--bg"
        aria-hidden="true"
      />
      <canvas
        ref={fgRef}
        className="pacman-canvas pacman-canvas--fg"
        aria-hidden="true"
      />
    </>
  );
}
