"use client";

import { useEffect, useRef } from "react";

/**
 * CrtPixelBackground — full-viewport CRT pixel grid on a 2D canvas.
 * Dim green static with slow phosphor flicker; pixels near the cursor
 * ignite terminal-green with falloff + decay. Fixed, z-index -1,
 * pointer-events none. Reduced-motion: static frame, no loop.
 * Touch devices: no mouse tracking. Single rAF loop, no re-renders.
 */

const CELL = 10; // pixel size (CSS px) — fine CRT lattice
const RADIUS = 120; // mouse influence radius (CSS px)
const FLICKER_MS = 1400; // how often base pixels re-seed

type Props = {
  /**
   * contained — size to the parent element (absolute, section background)
   * instead of the full viewport (fixed, page background).
   */
  contained?: boolean;
};

export default function CrtPixelBackground({ contained = false }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarsePointer = window.matchMedia("(pointer: coarse)").matches;

    let raf = 0;
    let cols = 0;
    let rows = 0;
    let base = new Float32Array(0); // per-pixel base brightness 0..1
    let heat = new Float32Array(0); // mouse heat 0..1, decays
    let dpr = 1;
    let w = 0; // canvas size in CSS px
    let h = 0;
    let lastFlicker = 0;
    let mgx = -1; // mouse in grid coords (-1 = off grid)
    let mgy = -1;
    const gr = Math.ceil(RADIUS / CELL);

    const seed = () => {
      const n = cols * rows;
      if (base.length !== n) {
        base = new Float32Array(n);
        heat = new Float32Array(n);
      }
      for (let i = 0; i < n; i++) {
        // mostly near-invisible pixels, a few slightly brighter
        base[i] = Math.random() < 0.12 ? 0.08 + Math.random() * 0.08 : Math.random() * 0.04;
      }
    };

    const resize = () => {
      const rect = contained
        ? (canvas.parentElement?.getBoundingClientRect() ??
          canvas.getBoundingClientRect())
        : { width: window.innerWidth, height: window.innerHeight };
      w = rect.width;
      h = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      cols = Math.ceil(w / CELL) + 1;
      rows = Math.ceil(h / CELL) + 1;
      seed();
      draw();
    };

    const draw = () => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const i = y * cols + x;
          const b = base[i];
          const h = heat[i];
          if (b < 0.01 && h < 0.01) continue;
          // 1px inset so each pixel reads as a square with a gap (CRT lattice)
          const px = x * CELL + 1;
          const py = y * CELL + 1;
          const s = CELL - 2;

          if (h > 0.01) {
            // ignited pixel: terminal green with intensity falloff
            const a = Math.min(1, h);
            ctx.fillStyle = `rgba(0, 255, 102, ${0.06 + a * 0.5})`;
            ctx.fillRect(px, py, s, s);
            if (a > 0.35) {
              // phosphor glow on the hottest pixels
              ctx.shadowColor = "rgba(0, 255, 102, 0.8)";
              ctx.shadowBlur = 12 * a;
              ctx.fillRect(px, py, s, s);
              ctx.shadowBlur = 0;
            }
          } else {
            // dormant pixel: very dim green static
            ctx.fillStyle = `rgba(0, 255, 102, ${b})`;
            ctx.fillRect(px, py, s, s);
          }
        }
      }
    };

    const tick = (t: number) => {
      // slow flicker: re-seed a small subset of base pixels
      if (t - lastFlicker > FLICKER_MS) {
        lastFlicker = t;
        const n = base.length;
        const flips = Math.floor(n * 0.04);
        for (let k = 0; k < flips; k++) {
          const i = (Math.random() * n) | 0;
          base[i] = Math.random() < 0.12 ? 0.08 + Math.random() * 0.08 : Math.random() * 0.04;
        }
      }

      // decay heat + inject heat around the mouse
      for (let i = 0; i < heat.length; i++) {
        if (heat[i] > 0) heat[i] = Math.max(0, heat[i] - 0.03);
      }
      if (mgx >= 0) {
        for (let dy = -gr; dy <= gr; dy++) {
          const y = mgy + dy;
          if (y < 0 || y >= rows) continue;
          for (let dx = -gr; dx <= gr; dx++) {
            const x = mgx + dx;
            if (x < 0 || x >= cols) continue;
            const d = Math.hypot(dx, dy) / gr;
            if (d > 1) continue;
            const v = Math.pow(1 - d, 2);
            const i = y * cols + x;
            if (v > heat[i]) heat[i] = v;
          }
        }
      }

      draw();
      raf = requestAnimationFrame(tick);
    };

    const onMouse = (e: MouseEvent) => {
      if (contained) {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        if (x < 0 || y < 0 || x >= rect.width || y >= rect.height) {
          mgx = -1;
          mgy = -1;
          return;
        }
        mgx = Math.floor(x / CELL);
        mgy = Math.floor(y / CELL);
      } else {
        mgx = Math.floor(e.clientX / CELL);
        mgy = Math.floor(e.clientY / CELL);
      }
    };
    const onLeave = () => {
      mgx = -1;
      mgy = -1;
    };
    const onVisibility = () => {
      cancelAnimationFrame(raf);
      if (!document.hidden && !reducedMotion) raf = requestAnimationFrame(tick);
    };

    resize();
    window.addEventListener("resize", resize);
    let ro: ResizeObserver | null = null;
    if (contained && typeof ResizeObserver !== "undefined" && canvas.parentElement) {
      // section height changes (content, breakpoints) resize the canvas
      ro = new ResizeObserver(resize);
      ro.observe(canvas.parentElement);
    }

    if (reducedMotion) {
      // static dormant grid, no loop, no mouse tracking
      draw();
      return () => window.removeEventListener("resize", resize);
    }

    if (!coarsePointer) {
      window.addEventListener("mousemove", onMouse, { passive: true });
      document.documentElement.addEventListener("mouseleave", onLeave);
    }
    document.addEventListener("visibilitychange", onVisibility);
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      ro?.disconnect();
      window.removeEventListener("mousemove", onMouse);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={contained ? "crt-pixel-bg crt-pixel-bg--contained" : "crt-pixel-bg"}
      aria-hidden="true"
    />
  );
}
