export interface PeriodicGridItem {
  /** Grid column (1-18) on the periodic table. */
  col: number;
  /** Grid row (1-5; row 4 is the empty lanthanide-style gap). */
  row: number;
  /** Atomic number label, e.g. "01". */
  num: string;
  /** Two-letter element symbol, e.g. "Js". */
  symbol: string;
  /** Full technology name, e.g. "JavaScript". */
  name: string;
  /** Micro category tag, e.g. "LANG". */
  category: string;
}

/**
 * Periodic Table of Technologies — authentic asymmetric layout.
 * Rendered by src/components/Stack.tsx on an 18-column grid; each entry
 * sits at its exact col/row slot and is eatable by the Pac-Man overlay
 * (keyed by `name` in pacmanStore).
 */
export const PERIODIC_GRID_ITEMS: PeriodicGridItem[] = [
  // Row 1 — top corners only
  { col: 1, row: 1, num: "01", symbol: "Js", name: "JavaScript", category: "LANG" },
  { col: 18, row: 1, num: "02", symbol: "Rc", name: "React.js", category: "FW" },

  // Row 2 — edges: cols 1-2 and 13-18
  { col: 1, row: 2, num: "03", symbol: "Ts", name: "TypeScript", category: "LANG" },
  { col: 2, row: 2, num: "04", symbol: "Py", name: "Python", category: "LANG" },
  { col: 13, row: 2, num: "05", symbol: "Nx", name: "Next.js", category: "FW" },
  { col: 14, row: 2, num: "06", symbol: "Rn", name: "React Native", category: "MOB" },
  { col: 15, row: 2, num: "07", symbol: "Nd", name: "Node.js", category: "BACK" },
  { col: 16, row: 2, num: "08", symbol: "Ex", name: "Express", category: "BACK" },
  { col: 17, row: 2, num: "09", symbol: "Mg", name: "MongoDB", category: "DB" },
  { col: 18, row: 2, num: "10", symbol: "Sq", name: "MySQL", category: "DB" },

  // Row 3 — main block: cols 1-5 and 14-18
  { col: 1, row: 3, num: "11", symbol: "Ws", name: "WebSocket", category: "RT" },
  { col: 2, row: 3, num: "12", symbol: "Fb", name: "Firebase", category: "BaaS" },
  { col: 3, row: 3, num: "13", symbol: "Ra", name: "REST API", category: "API" },
  { col: 4, row: 3, num: "14", symbol: "Gq", name: "GraphQL", category: "API" },
  { col: 5, row: 3, num: "15", symbol: "Aw", name: "AWS", category: "CLOUD" },
  { col: 14, row: 3, num: "16", symbol: "Gt", name: "Git / GitHub", category: "VC" },
  { col: 15, row: 3, num: "17", symbol: "Ci", name: "CI/CD", category: "DEVOPS" },
  { col: 16, row: 3, num: "18", symbol: "Mf", name: "Micro-Frontends", category: "ARCH" },
  { col: 17, row: 3, num: "19", symbol: "Tb", name: "Turborepo", category: "MONO" },
  { col: 18, row: 3, num: "20", symbol: "Tw", name: "Tailwind", category: "UI" },

  // Row 5 — standalone bottom block (row 4 is the empty gap)
  { col: 5, row: 5, num: "21", symbol: "Sh", name: "shadcn/ui", category: "UI" },
  { col: 6, row: 5, num: "22", symbol: "Tq", name: "TanStack", category: "STATE" },
  { col: 7, row: 5, num: "23", symbol: "Jt", name: "Jest", category: "TEST" },
  { col: 8, row: 5, num: "24", symbol: "Ai", name: "Agentic AI", category: "AI" },
  { col: 9, row: 5, num: "25", symbol: "N8", name: "n8n", category: "AUTO" },
];
