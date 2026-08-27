"use client";

import { useEffect, useRef } from "react";

interface Node {
  x: number;
  y: number;
  label: string;
  sub: string;
  radius: number;
  vx: number;
  vy: number;
  color: string;
  pulse: number;
  pulseSpeed: number;
  connections: number[];
}

/** Convert a 6-digit hex color (#rrggbb) to an rgba() string. */
function hexToRgba(hex: string, alpha: number): string {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

export default function AINodes() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let destroyed = false;

    const resize = () => {
      canvas.width = canvas.offsetWidth * Math.min(window.devicePixelRatio, 2);
      canvas.height = canvas.offsetHeight * Math.min(window.devicePixelRatio, 2);
      ctx.scale(Math.min(window.devicePixelRatio, 2), Math.min(window.devicePixelRatio, 2));
    };

    resize();
    window.addEventListener("resize", resize, { passive: true });

    const isMobile = window.innerWidth < 768;
    const W = () => canvas.offsetWidth;
    const H = () => canvas.offsetHeight;

    // Nodes representing the AI pipeline
    const nodeData: Omit<Node, "vx" | "vy" | "pulse" | "pulseSpeed">[] = [
      { x: 0.5, y: 0.15, label: "USER", sub: "Input / Intent", radius: 28, color: "#f5f5f5", connections: [1] },
      { x: 0.5, y: 0.35, label: "AI AGENT", sub: "Claude / GPT / Groq", radius: 38, color: "#4a9eff", connections: [2, 3, 4] },
      { x: 0.25, y: 0.6, label: "TOOLS", sub: "Functions & APIs", radius: 24, color: "#8888ff", connections: [5] },
      { x: 0.5, y: 0.6, label: "n8n", sub: "Automation Pipeline", radius: 24, color: "#6fb3a8", connections: [5] },
      { x: 0.75, y: 0.6, label: "DATA", sub: "Vector Store / DB", radius: 24, color: "#a0a0a0", connections: [5] },
      { x: 0.5, y: 0.82, label: "RESULT", sub: "Structured Output", radius: 28, color: "#4ade80", connections: [] },
    ];

    const nodes: Node[] = nodeData.map((n) => ({
      ...n,
      vx: (Math.random() - 0.5) * 0.2,
      vy: (Math.random() - 0.5) * 0.2,
      pulse: Math.random() * Math.PI * 2,
      pulseSpeed: 0.02 + Math.random() * 0.02,
    }));

    // Animated packets along connections
    const packets: Array<{
      from: number;
      to: number;
      t: number;
      speed: number;
      alpha: number;
    }> = [];

    let time = 0;
    let packetTimer = 0;

    const spawnPacket = () => {
      // Pick a random connection
      const srcNode = nodes[Math.floor(Math.random() * 5)];
      const srcIdx = nodes.indexOf(srcNode);
      if (srcNode.connections.length === 0) return;
      const toIdx = srcNode.connections[Math.floor(Math.random() * srcNode.connections.length)];
      packets.push({ from: srcIdx, to: toIdx, t: 0, speed: 0.008 + Math.random() * 0.006, alpha: 1 });
    };

    const draw = () => {
      if (destroyed) return;
      animRef.current = requestAnimationFrame(draw);

      const w = W();
      const h = H();

      ctx.clearRect(0, 0, w, h);

      time += 0.012;
      packetTimer += 0.012;

      if (packetTimer > 0.6) {
        spawnPacket();
        packetTimer = 0;
      }

      // Draw connections
      nodes.forEach((node, i) => {
        node.connections.forEach((j) => {
          const nx = node.x * w;
          const ny = node.y * h;
          const tx = nodes[j].x * w;
          const ty = nodes[j].y * h;

          const grad = ctx.createLinearGradient(nx, ny, tx, ty);
          grad.addColorStop(0, "rgba(74,158,255,0.08)");
          grad.addColorStop(0.5, "rgba(74,158,255,0.15)");
          grad.addColorStop(1, "rgba(74,158,255,0.08)");

          ctx.beginPath();
          ctx.moveTo(nx, ny);
          ctx.lineTo(tx, ty);
          ctx.strokeStyle = grad;
          ctx.lineWidth = 1;
          ctx.setLineDash([4, 8]);
          ctx.lineDashOffset = -time * 10;
          ctx.stroke();
          ctx.setLineDash([]);
        });
      });

      // Draw packets
      for (let pi = packets.length - 1; pi >= 0; pi--) {
        const p = packets[pi];
        p.t += p.speed;
        if (p.t > 1) {
          packets.splice(pi, 1);
          continue;
        }

        const fx = nodes[p.from].x * w;
        const fy = nodes[p.from].y * h;
        const tx = nodes[p.to].x * w;
        const ty = nodes[p.to].y * h;

        const px = fx + (tx - fx) * p.t;
        const py = fy + (ty - fy) * p.t;

        const fadeIn = Math.min(p.t * 5, 1);
        const fadeOut = Math.min((1 - p.t) * 5, 1);
        const alpha = fadeIn * fadeOut;

        ctx.beginPath();
        ctx.arc(px, py, 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(74,158,255,${alpha * 0.9})`;
        ctx.fill();

        // Trail
        const trailLen = 0.08;
        const t0 = Math.max(0, p.t - trailLen);
        const t0x = fx + (tx - fx) * t0;
        const t0y = fy + (ty - fy) * t0;
        const trailGrad = ctx.createLinearGradient(t0x, t0y, px, py);
        trailGrad.addColorStop(0, "rgba(74,158,255,0)");
        trailGrad.addColorStop(1, `rgba(74,158,255,${alpha * 0.4})`);
        ctx.beginPath();
        ctx.moveTo(t0x, t0y);
        ctx.lineTo(px, py);
        ctx.strokeStyle = trailGrad;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      // Draw nodes
      nodes.forEach((node) => {
        node.pulse += node.pulseSpeed;
        const pulseFactor = 0.85 + Math.sin(node.pulse) * 0.15;
        const nx = node.x * w;
        const ny = node.y * h;
        const r = node.radius;

        // Outer glow ring
        const glowR = r * (1.6 + Math.sin(node.pulse) * 0.2);
        const glow = ctx.createRadialGradient(nx, ny, r * 0.5, nx, ny, glowR);
        const glowAlpha = node.color === "#4a9eff" ? 0.12 : 0.06;
        glow.addColorStop(0, hexToRgba(node.color, glowAlpha));
        glow.addColorStop(1, "rgba(0,0,0,0)");

        // Simple glow using arc
        ctx.beginPath();
        ctx.arc(nx, ny, glowR, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(74,158,255,${glowAlpha * pulseFactor})`;
        ctx.fill();

        // Node background
        ctx.beginPath();
        ctx.arc(nx, ny, r, 0, Math.PI * 2);
        ctx.fillStyle = "#0b0b0b";
        ctx.fill();
        ctx.strokeStyle = node.color + "40";
        ctx.lineWidth = 1;
        ctx.stroke();

        // Node inner fill
        ctx.beginPath();
        ctx.arc(nx, ny, r * 0.7, 0, Math.PI * 2);
        ctx.fillStyle = node.color + "15";
        ctx.fill();

        // Label
        ctx.fillStyle = node.color;
        ctx.font = `600 ${isMobile ? 7 : 8}px Inter, system-ui, sans-serif`;
        ctx.letterSpacing = "0.08em";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(node.label, nx, ny - 5);

        ctx.fillStyle = "rgba(160,160,160,0.6)";
        ctx.font = `400 ${isMobile ? 6 : 7}px Inter, system-ui, sans-serif`;
        ctx.fillText(node.sub, nx, ny + 8);
      });
    };

    draw();

    return () => {
      destroyed = true;
      if (animRef.current) cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      id="ai-canvas"
      style={{ width: "100%", height: "100%" }}
      aria-hidden="true"
    />
  );
}
