import type { Metadata } from "next";
import {
  HeroSceneWrapper,
  AINodesWrapper,
  AnimationControllerWrapper,
} from "@/components/ClientShell";
import { experience } from "@/data/experience";
import { projects } from "@/data/projects";
import { skills } from "@/data/skills";

export const metadata: Metadata = {
  title: "Sandeep Rai — Senior Frontend Engineer",
};

export default function Home() {
  return (
    <>
      {/* Grain overlay */}
      <div className="grain-overlay" aria-hidden="true" />

      {/* Custom cursor */}
      <div className="cursor-dot" aria-hidden="true" />
      <div className="cursor-ring" aria-hidden="true" />

      {/* ============================================================
          LOADER
          ============================================================ */}
      <div id="loader" role="status" aria-label="Loading portfolio">
        <div className="loader-name">
          <span>SANDEEP</span>
        </div>
        <div className="loader-name" style={{ marginTop: "0.2rem" }}>
          <span>RAI.</span>
        </div>
        <div className="loader-sub">
          Senior Frontend Engineer — New Delhi, India
        </div>
        <div className="loader-line" />
      </div>

      {/* ============================================================
          NAVIGATION
          ============================================================ */}
      <header>
        <nav className="nav-root" aria-label="Main navigation">
          <a href="#hero" className="nav-logo" aria-label="Sandeep Rai — Home">
            SR
          </a>
          <ul className="nav-links" role="list">
            <li>
              <a href="#about" className="nav-link">About</a>
            </li>
            <li>
              <a href="#experience" className="nav-link">Work</a>
            </li>
            <li>
              <a href="#projects" className="nav-link">Projects</a>
            </li>
            <li>
              <a href="#stack" className="nav-link">Stack</a>
            </li>
            <li>
              <a href="#contact" className="nav-link">Contact</a>
            </li>
          </ul>
          <div className="nav-availability" aria-label="Available for opportunities">
            <span className="nav-availability-dot" aria-hidden="true" />
            <span>Available for Opportunities</span>
          </div>
          <button
            className="nav-mobile-btn"
            aria-label="Toggle mobile menu"
            aria-expanded="false"
          >
            <span />
            <span />
            <span />
          </button>
          <div className="nav-progress" aria-hidden="true">
            <span />
          </div>
        </nav>
      </header>

      {/* Mobile Menu Overlay */}
      <div className="mobile-menu" role="dialog" aria-label="Mobile navigation">
        <ul className="mobile-menu-links" role="list">
          {["About", "Work", "Projects", "Stack", "Contact"].map((item) => (
            <li key={item}>
              <a
                href={`#${item === "Work" ? "experience" : item.toLowerCase()}`}
                className="mobile-menu-link"
              >
                <span>{item}</span>
              </a>
            </li>
          ))}
        </ul>
        <div
          style={{
            marginTop: "3rem",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              background: "#4ade80",
              borderRadius: "50%",
              display: "inline-block",
            }}
            aria-hidden="true"
          />
          <span
            style={{
              fontSize: "0.6875rem",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "var(--text-muted)",
            }}
          >
            Available for Opportunities
          </span>
        </div>
      </div>

      <main>
        {/* ============================================================
            HERO SECTION
            ============================================================ */}
        <section id="hero" aria-label="Hero">
          <HeroSceneWrapper />

          {/* Vertical accent line */}
          <div className="hero-vline" aria-hidden="true">
            <div className="hero-vline-accent" />
          </div>

          {/* Status ticker */}
          {/* <div className="hero-ticker" aria-hidden="true">
            <div className="hero-ticker-track">
              {[0, 1].map((copy) => (
                <div className="hero-ticker-content" key={copy}>
                  {[
                    "Senior Frontend Engineer",
                    "6.5+ Years Experience",
                    "React / Next.js / TypeScript",
                    "Frontend Architecture",
                    "Performance Optimization",
                    "AI-Driven Interfaces",
                    "New Delhi, India",
                  ].map((token) => (
                    <span className="hero-ticker-item" key={token}>
                      {token}
                      <span className="hero-ticker-dot" />
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div> */}

     

          <div className="hero-content">
            <div className="hero-meta" aria-label="Position info">
              <span className="hero-meta-item">New Delhi, India</span>
              <div className="hero-meta-divider" aria-hidden="true" />
              <span className="hero-meta-item">Senior Frontend Engineer</span>
              <div className="hero-meta-divider" aria-hidden="true" />
              <span className="hero-meta-item">6.5+ Years</span>
            </div>

            <h1 className="hero-name" aria-label="Sandeep Rai">
              <span className="hero-name-line">
                <span>SANDEEP</span>
              </span>
              <span className="hero-name-line">
                <span>RAI.</span>
              </span>
            </h1>

            <div className="hero-title">
              <div className="hero-title-line">
                <span>
                  I build scalable digital products, high-performance interfaces,
                </span>
              </div>
              <div className="hero-title-line">
                <span>and AI-driven web experiences.</span>
              </div>
            </div>

            <p className="hero-subtitle">
              React · Next.js · TypeScript · Frontend Architecture · AI
              Applications
            </p>

            <div className="hero-bottom">
              <a href="#about" className="hero-cta" aria-label="View work">
                <span>View Work</span>
                <span className="hero-cta-arrow" aria-hidden="true" />
              </a>
              <div className="hero-scroll-hint" aria-hidden="true">
                <span className="hero-scroll-text">Scroll</span>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================
            ABOUT SECTION
            ============================================================ */}
        <section id="about" aria-label="About Sandeep Rai">
          <div className="about-section-wrap">
          <div className="about-grid">
            <div className="about-left">
              <div className="section-label">
                <span className="section-label-index">01</span>
                <div className="section-label-line" aria-hidden="true" />
                <span className="section-label-text">About</span>
              </div>

              <h2 className="about-headline">
                Engineering
                <br />
                <em>interfaces</em>
                <br />
                that matter.
              </h2>
            </div>

            <div className="about-right">
              <p className="about-body">
                Senior Frontend Engineer with 6.5+ years building production
                systems that scale. I specialize in React.js, Next.js, and
                TypeScript — crafting frontend architectures that are as
                performant as they are maintainable. From micro-frontend
                ecosystems to AI-native applications, I bring engineering depth
                to every layer of the stack.
              </p>

              <p
                className="about-body"
                style={{ marginTop: "1.5rem", color: "var(--text-muted)" }}
              >
                Currently expanding into Generative AI and Agentic AI
                development — building automation pipelines and AI-driven
                product experiences that push the boundaries of what frontend
                engineering means today.
              </p>

              <div style={{ marginTop: "2.5rem" }}>
                {[
                  { label: "Location", value: "New Delhi, India" },
                  { label: "Experience", value: "6.5+ Years" },
                  {
                    label: "Specialization",
                    value: "React · Next.js · TypeScript · Performance · AI",
                  },
                  {
                    label: "Availability",
                    value: "Open to senior / lead roles",
                  },
                ].map((row) => (
                  <div className="about-detail-row" key={row.label}>
                    <span className="about-detail-label">{row.label}</span>
                    <span className="about-detail-value">{row.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          </div>
        </section>

        {/* ============================================================
            MARQUEE TICKER
            ============================================================ */}
        <div className="marquee-section" aria-hidden="true">
          <div className="marquee-track">
            {/* Doubled content for seamless loop */}
            {[...Array(2)].map((_, di) => (
              <div className="marquee-content" key={di}>
                {[
                  "React.js",
                  "Next.js",
                  "TypeScript",
                  "Frontend Architecture",
                  "Performance Optimization",
                  "Micro-frontends",
                  "WebGL",
                  "Three.js",
                  "Generative AI",
                  "Agentic AI",
                  "AWS",
                  "Node.js",
                  "GraphQL",
                  "WebSockets",
                  "TanStack Query",
                  "Turborepo",
                ].map((item) => (
                  <div className="marquee-item" key={item}>
                    <span className="marquee-text">{item}</span>
                    <span className="marquee-dot" />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* ============================================================
            METRICS SECTION
            ============================================================ */}
        <section id="metrics" aria-label="Key metrics and achievements">
          <div className="section-container">
            <div className="metrics-grid">
              {[
                {
                  value: 6.5,
                  suffix: "+",
                  label: "Years Experience",
                  desc: "Production frontend systems",
                  decimal: true,
                },
                {
                  value: 40,
                  suffix: "%",
                  label: "Performance Improvement",
                  desc: "Load time reduction at Narith AI",
                  decimal: false,
                },
                {
                  value: 50,
                  suffix: "%",
                  label: "Loading Time Reduction",
                  desc: "Achieved at Blox.xyz",
                  decimal: false,
                },
                {
                  value: 2,
                  suffix: "",
                  label: "Embeddable SDKs Built",
                  desc: "NX monorepo, micro-frontend",
                  decimal: false,
                },
                {
                  value: 25,
                  suffix: "%",
                  label: "Faster Delivery",
                  desc: "Testing coverage improvement",
                  decimal: false,
                },
                {
                  value: 30,
                  suffix: "%",
                  label: "Application Speed",
                  desc: "Bundle optimization gains",
                  decimal: false,
                },
              ].map((metric) => (
                <div className="metric-item" key={metric.label}>
                  <div className="metric-number">
                    <span
                      data-metric={metric.value}
                      data-suffix={metric.suffix}
                      data-decimal={metric.decimal}
                    >
                      0{metric.suffix}
                    </span>
                  </div>
                  <div className="metric-label">{metric.label}</div>
                  <div className="metric-desc">{metric.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============================================================
            EXPERIENCE SECTION
            ============================================================ */}
        <section id="experience" aria-label="Work experience">
          <div className="section-container">
            <div className="experience-inner">
              <div className="section-label">
                <span className="section-label-index">02</span>
                <div className="section-label-line" aria-hidden="true" />
                <span className="section-label-text">Experience</span>
              </div>

              <h2
                className="reveal-up"
                style={{
                  fontSize: "clamp(2rem, 4vw, 4rem)",
                  fontWeight: 300,
                  letterSpacing: "-0.03em",
                  lineHeight: 1,
                  marginBottom: "4rem",
                  color: "var(--text-secondary)",
                }}
              >
                Where I&apos;ve built.
              </h2>

              {experience.map((item) => (
                <article className="exp-item" key={item.company}>
                  <div className="exp-index" aria-hidden="true">
                    {item.index}
                  </div>
                  <div className="exp-left">
                    <h3 className="exp-company">{item.company}</h3>
                    <div className="exp-role">{item.role}</div>
                    <div className="exp-period">{item.period}</div>
                  </div>
                  <div className="exp-right">
                    <ul className="exp-highlights" role="list">
                      {item.highlights.map((h, hi) => (
                        <li className="exp-highlight" key={hi}>
                          {h}
                        </li>
                      ))}
                    </ul>
                    <div
                      className="exp-tags"
                      role="list"
                      aria-label="Technologies used"
                    >
                      {item.tags.map((tag) => (
                        <span className="exp-tag" role="listitem" key={tag}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ============================================================
            PROJECTS SECTION
            ============================================================ */}
        <section id="projects" aria-label="Selected projects">
          <div className="section-container projects-inner">
            <div className="section-label">
              <span className="section-label-index">03</span>
              <div className="section-label-line" aria-hidden="true" />
              <span className="section-label-text">Projects</span>
            </div>

            <h2
              className="reveal-up"
              style={{
                fontSize: "clamp(2rem, 4vw, 4rem)",
                fontWeight: 300,
                letterSpacing: "-0.03em",
                lineHeight: 1,
                marginBottom: "4rem",
                color: "var(--text-secondary)",
              }}
            >
              Selected work.
            </h2>

            {Array.from(
              { length: Math.ceil(projects.length / 2) },
              (_, i) => (
                <div className="project-row" key={i}>
                  {projects.slice(i * 2, i * 2 + 2).map((project) => (
                    <article className="project-card" key={project.number}>
                      {/* Project Visual */}
                      <div
                        className={`project-visual ${project.visualClass}`}
                        role="img"
                        aria-label={`${project.title} project visual`}
                      >
                        <div className="project-visual-inner">
                          <div className="pv-grid" aria-hidden="true" />
                          <div className="pv-ui-bar" aria-hidden="true">
                            <div className="pv-dot" />
                            <div className="pv-dot" />
                            <div className="pv-dot" />
                          </div>
                          <ProjectVisualContent
                            visualClass={project.visualClass}
                            title={project.title}
                          />
                        </div>
                      </div>

                      <div className="project-number" aria-hidden="true">
                        {project.number}
                      </div>
                      <h3 className="project-title">{project.title}</h3>
                      <div className="project-category">
                        {project.category}
                      </div>
                      <p className="project-desc">{project.description}</p>
                      <div className="project-meta-row">
                        <div
                          className="project-stack"
                          role="list"
                          aria-label="Technologies"
                        >
                          {project.stack.map((tech) => (
                            <span
                              className="project-tech"
                              role="listitem"
                              key={tech}
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                        <div
                          className="project-result"
                          aria-label={`Result: ${project.result}`}
                        >
                          {project.result}
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )
            )}
          </div>
        </section>

        {/* ============================================================
            STACK SECTION
            ============================================================ */}
        <section id="stack" aria-label="Technology stack">
          <div className="section-container">
            <div className="stack-inner">
              <div className="section-label">
                <span className="section-label-index">04</span>
                <div className="section-label-line" aria-hidden="true" />
                <span className="section-label-text">Stack</span>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "flex-end",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: "1rem",
                }}
              >
                <h2
                  className="reveal-up"
                  style={{
                    fontSize: "clamp(2rem, 4vw, 4rem)",
                    fontWeight: 300,
                    letterSpacing: "-0.03em",
                    lineHeight: 1,
                    color: "var(--text-secondary)",
                  }}
                >
                  Tools I build with.
                </h2>
                <p
                  className="reveal-fade"
                  style={{
                    fontSize: "0.8125rem",
                    color: "var(--text-muted)",
                    maxWidth: "30ch",
                    textAlign: "right",
                    lineHeight: 1.6,
                  }}
                >
                  A carefully chosen set of technologies that enables speed,
                  scale, and quality.
                </p>
              </div>

              <div
                className="stack-grid"
                role="list"
                aria-label="Technology skills"
              >
                {skills.map((skill) => (
                  <div
                    className="stack-item"
                    key={skill.name}
                    role="listitem"
                    title={skill.category}
                  >
                    <div className="stack-item-name">{skill.name}</div>
                    <div className="stack-item-cat">{skill.category}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================
            AI SECTION
            ============================================================ */}
        <section id="ai-section" aria-label="AI and automation capabilities">
          <div className="section-container">
            <div className="ai-inner">
              <div className="section-label">
                <span className="section-label-index">05</span>
                <div className="section-label-line" aria-hidden="true" />
                <span className="section-label-text">AI / Automation</span>
              </div>

              <div className="ai-grid-layout">
                <div>
                  <h2 className="ai-headline reveal-up">
                    From Frontend
                    <br />
                    to AI-Native
                    <br />
                    <span style={{ color: "var(--accent)" }}>
                      Experiences.
                    </span>
                  </h2>
                  <p className="ai-desc reveal-fade">
                    Frontend engineering is no longer just about interfaces.
                    I&apos;m actively building at the intersection of modern UI
                    and agentic AI — creating systems where language models,
                    automation pipelines, and high-performance interfaces
                    converge.
                  </p>
                </div>

                <div
                  className="ai-canvas-wrap"
                  style={{ height: "380px", position: "relative" }}
                  aria-hidden="true"
                >
                  <AINodesWrapper />
                </div>
              </div>

              <div
                className="ai-capabilities"
                style={{ marginTop: "4rem" }}
              >
                {[
                  {
                    title: "Generative AI Integration",
                    desc: "Connecting LLMs (ChatGPT, Claude, Groq) to production frontend applications with streaming UIs, prompt engineering, and context management.",
                  },
                  {
                    title: "Agentic AI Development",
                    desc: "Building multi-step AI agents that reason, plan, and execute tasks autonomously — from API orchestration to document processing pipelines.",
                  },
                  {
                    title: "n8n Automation Pipelines",
                    desc: "Designing and deploying low-code/no-code automation workflows that connect AI models with real-world APIs and databases.",
                  },
                  {
                    title: "AI-Native UI Patterns",
                    desc: "Crafting frontend patterns purpose-built for AI: streaming responses, optimistic updates, uncertainty states, and real-time AI feedback loops.",
                  },
                ].map((cap) => (
                  <div className="ai-cap" key={cap.title}>
                    <h3 className="ai-cap-title">{cap.title}</h3>
                    <p className="ai-cap-desc">{cap.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================
            CONTACT / FOOTER
            ============================================================ */}
        <section id="contact" aria-label="Contact and footer">
          <div className="section-container">
            <div className="contact-inner">
              <h2 className="contact-headline">
                Let&apos;s Build
                <br />
                Something
                <br />
                <em>Worth</em>
                <br />
                Experiencing.
              </h2>

              <a
                href="mailto:sandeep.rai@email.com"
                className="contact-email-large"
                aria-label="Email Sandeep Rai"
              >
                sandeep.rai@email.com
              </a>

              <div className="contact-links-row">
                <a
                  href="mailto:sandeep.rai@email.com"
                  className="contact-link"
                  aria-label="Email Sandeep Rai"
                >
                  <span className="contact-link-arrow" aria-hidden="true" />
                  Email
                </a>
                <a
                  href="https://linkedin.com/in/sandeeprai"
                  className="contact-link"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Sandeep Rai on LinkedIn"
                >
                  <span className="contact-link-arrow" aria-hidden="true" />
                  LinkedIn
                </a>
                <a
                  href="https://github.com/sandeeprai"
                  className="contact-link"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Sandeep Rai on GitHub"
                >
                  <span className="contact-link-arrow" aria-hidden="true" />
                  GitHub
                </a>
              </div>

              <footer className="footer-bottom">
                <span className="footer-copy">
                  © 2026 Sandeep Rai. All rights reserved.
                </span>
                <span className="footer-location">New Delhi, India</span>
              </footer>
            </div>
          </div>
        </section>
      </main>

      {/* Animation Controller */}
      <AnimationControllerWrapper />
    </>
  );
}

// Project visual content component (server-side)
function ProjectVisualContent({
  visualClass,
  title,
}: {
  visualClass: string;
  title: string;
}) {
  const configs: Record<
    string,
    {
      accent: string;
      cards: Array<{
        top: string;
        left: string;
        w: string;
        h: string;
      }>;
    }
  > = {
    "project-visual-lcf": {
      accent: "#4a9eff",
      cards: [
        { top: "40%", left: "8%", w: "35%", h: "22%" },
        { top: "40%", left: "48%", w: "44%", h: "22%" },
        { top: "68%", left: "8%", w: "84%", h: "16%" },
      ],
    },
    "project-visual-wsx": {
      accent: "#4ade80",
      cards: [
        { top: "40%", left: "8%", w: "25%", h: "45%" },
        { top: "40%", left: "38%", w: "54%", h: "20%" },
        { top: "64%", left: "38%", w: "26%", h: "21%" },
        { top: "64%", left: "68%", w: "24%", h: "21%" },
      ],
    },
    "project-visual-blox": {
      accent: "#f97316",
      cards: [
        { top: "40%", left: "8%", w: "56%", h: "50%" },
        { top: "40%", left: "68%", w: "24%", h: "23%" },
        { top: "67%", left: "68%", w: "24%", h: "23%" },
      ],
    },
    "project-visual-rec": {
      accent: "#a78bfa",
      cards: [
        { top: "40%", left: "8%", w: "84%", h: "20%" },
        { top: "64%", left: "8%", w: "26%", h: "22%" },
        { top: "64%", left: "38%", w: "26%", h: "22%" },
        { top: "64%", left: "68%", w: "24%", h: "22%" },
      ],
    },
    "project-visual-tm": {
      accent: "#fb923c",
      cards: [
        { top: "35%", left: "35%", w: "30%", h: "55%" },
        { top: "38%", left: "12%", w: "20%", h: "20%" },
        { top: "38%", left: "68%", w: "20%", h: "20%" },
      ],
    },
  };

  const cfg = configs[visualClass] ?? configs["project-visual-lcf"];

  return (
    <>
      <div
        className="pv-accent-line"
        style={{ top: "38%", left: "8%", width: "15%" }}
        aria-hidden="true"
      />
      {cfg.cards.map((card, i) => (
        <div
          key={i}
          className="pv-card"
          style={{
            top: card.top,
            left: card.left,
            width: card.w,
            height: card.h,
            borderColor: i === 0 ? cfg.accent + "30" : undefined,
          }}
          aria-hidden="true"
        />
      ))}
      <div
        className="pv-label"
        style={{ bottom: "1.5rem", right: "1.5rem" }}
        aria-hidden="true"
      >
        {title}
      </div>
    </>
  );
}
