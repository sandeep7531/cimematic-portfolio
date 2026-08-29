"use client";

import dynamic from "next/dynamic";

const HeroScene = dynamic(() => import("@/components/three/HeroScene"), {
  ssr: false,
  loading: () => null,
});

const AINodes = dynamic(() => import("@/components/three/AINodes"), {
  ssr: false,
  loading: () => null,
});

const AnimationController = dynamic(
  () => import("@/components/animation/AnimationController"),
  { ssr: false }
);

const CrtPixelBackground = dynamic(
  () => import("@/components/three/CrtPixelBackground"),
  { ssr: false, loading: () => null }
);

const Stack = dynamic(() => import("@/components/Stack"), { ssr: false });

export function HeroSceneWrapper() {
  return <HeroScene />;
}

export function AINodesWrapper() {
  return <AINodes />;
}

export function AnimationControllerWrapper() {
  return <AnimationController />;
}

export function CrtPixelBackgroundWrapper(props: {
  contained?: boolean;
}) {
  return <CrtPixelBackground {...props} />;
}

/**
 * Periodic Tech Stack section. The bounded game frame (canvas + element
 * grid) lives inside Stack.tsx so canvas and cards share one container.
 */
export function StackSectionWrapper() {
  return <Stack />;
}
