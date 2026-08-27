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

export function HeroSceneWrapper() {
  return <HeroScene />;
}

export function AINodesWrapper() {
  return <AINodes />;
}

export function AnimationControllerWrapper() {
  return <AnimationController />;
}
