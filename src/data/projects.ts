export interface Project {
  number: string;
  title: string;
  category: string;
  description: string;
  stack: string[];
  result: string;
  visualClass: string;
}

export const projects: Project[] = [
  {
    number: "01",
    title: "LCF ISO Platform",
    category: "Fintech / Embedded Finance",
    description:
      "ISO-standard financial compliance platform with embedded SDK architecture. Integrated Razorpay and Plaid payment flows with real-time WebSocket data synchronization and AWS Cognito identity management.",
    stack: ["React", "TypeScript", "WebSockets", "AWS Cognito", "Razorpay", "Plaid"],
    result: "40% performance improvement",
    visualClass: "project-visual-lcf",
  },
  {
    number: "02",
    title: "Aurum WiseX",
    category: "PropTech / Investment Platform",
    description:
      "Architected a fractional real estate investment platform from the ground up. Designed the full frontend system architecture, component library, and state management strategy for a high-stakes fintech product.",
    stack: ["React", "Material UI", "Redux Saga", "TypeScript", "REST APIs"],
    result: "Built from inception",
    visualClass: "project-visual-wsx",
  },
  {
    number: "03",
    title: "Blox.xyz",
    category: "Real Estate Discovery",
    description:
      "High-performance real estate discovery platform serving property seekers across India. Implemented aggressive optimization strategies and cross-platform React Native experiences to dramatically reduce load times.",
    stack: ["React", "React Native", "JavaScript", "Performance APIs"],
    result: "50% loading time reduction",
    visualClass: "project-visual-blox",
  },
  {
    number: "04",
    title: "Recrugenie",
    category: "AI / HR Tech",
    description:
      "AI-powered recruitment intelligence platform that matches candidates to roles using machine learning signals. Built intuitive interfaces for a complex multi-sided marketplace connecting recruiters and talent.",
    stack: ["React", "TypeScript", "Node.js", "REST APIs", "AI Integration"],
    result: "25% faster delivery cycles",
    visualClass: "project-visual-rec",
  },
  {
    number: "05",
    title: "TM Profile Tree",
    category: "Social / Identity",
    description:
      "Personal profile aggregator allowing professionals to centralize their digital identity. Built with performance-first architecture and smooth micro-animations for a polished user experience.",
    stack: ["React", "TypeScript", "Tailwind", "Node.js"],
    result: "Seamless link-in-bio experience",
    visualClass: "project-visual-tm",
  },
  {
    number: "06",
    title: "NIC Government Portals",
    category: "Government / Public Infrastructure",
    description:
      "Accessible government information portals for the National Informatics Centre, serving thousands of daily users. Built to strict WCAG standards with multilingual support and robust performance on low-bandwidth connections.",
    stack: ["React", "JavaScript", "Accessibility", "i18n"],
    result: "WCAG 2.1 AA compliant",
    visualClass: "project-visual-lcf",
  },
];
