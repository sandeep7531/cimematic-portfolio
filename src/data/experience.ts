export interface ExperienceItem {
  index: string;
  company: string;
  role: string;
  period: string;
  location: string;
  highlights: string[];
  tags: string[];
}

export const experience: ExperienceItem[] = [
  {
    index: "01",
    company: "Narith AI",
    role: "Software Engineer",
    period: "2024 — 2026",
    location: "Remote",
    highlights: [
      "Architected 2 embeddable SDK products using NX monorepo and micro-frontend patterns, enabling seamless third-party integration across diverse client environments.",
      "Integrated Razorpay and Plaid payment SDKs, streamlining financial transaction flows for LCF ISO platform users.",
      "Implemented AWS Cognito authentication with WebSockets for real-time data sync, improving system reliability.",
      "Built a reusable React component library shared across multiple products, achieving 40% performance improvement.",
      "Led frontend architecture decisions for AI-driven application features with Generative AI workflow integration.",
    ],
    tags: ["React", "TypeScript", "NX Monorepo", "Micro-frontends", "AWS Cognito", "WebSockets", "GSAP"],
  },
  {
    index: "02",
    company: "Aurum PropTech / WiseX",
    role: "Senior Frontend Developer",
    period: "2022 — 2024",
    location: "New Delhi, India",
    highlights: [
      "Architected the Aurum WiseX platform from inception, establishing the entire frontend architecture and design system.",
      "Engineered high-performance interfaces with React, Material UI, and Redux Saga — significantly improving user engagement metrics.",
      "Optimized critical rendering paths and implemented code-splitting strategies to reduce initial bundle size by 30%.",
      "Collaborated directly with product and design teams, translating complex fintech requirements into intuitive user flows.",
    ],
    tags: ["React", "Material UI", "Redux Saga", "TypeScript", "Performance", "Architecture"],
  },
  {
    index: "03",
    company: "Method and Madness Technology",
    role: "Frontend Developer",
    period: "2021 — 2022",
    location: "New Delhi, India",
    highlights: [
      "Delivered Blox.xyz — a real estate discovery platform — achieving a 50% reduction in loading time through aggressive optimization.",
      "Built cross-platform features using React and React Native, expanding the product's reach to mobile audiences.",
      "Implemented advanced caching strategies and lazy-loading patterns for media-heavy real estate listings.",
    ],
    tags: ["React", "React Native", "Performance", "JavaScript", "Optimization"],
  },
  {
    index: "04",
    company: "Octify Technologies",
    role: "Frontend Developer",
    period: "2019 — 2021",
    location: "New Delhi, India",
    highlights: [
      "Developed Recrugenie — an AI-powered recruitment platform — delivering intuitive candidate-matching interfaces.",
      "Built NIC Government Access Portals serving thousands of daily users with strict accessibility and performance standards.",
      "Established frontend testing practices using Jest and React Testing Library, improving code reliability by 25%.",
    ],
    tags: ["React", "JavaScript", "Jest", "Accessibility", "Government Portals"],
  },
];
