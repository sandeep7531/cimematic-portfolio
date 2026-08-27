import type { NextConfig } from "next";

// NOTE: Intentionally minimal. Adding `turbopack.root` here breaks CSS
// resolution ("Can't resolve 'tailwindcss'") in this setup. The harmless
// "inferred your workspace root" warning comes from a stray
// ~/package-lock.json outside this project and can be ignored.
const nextConfig: NextConfig = {};

export default nextConfig;
