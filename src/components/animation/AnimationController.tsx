"use client";

import { useEffect } from "react";

export default function AnimationController() {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const runAnimations = async () => {
      const gsapModule = await import("gsap");
      const gsap = gsapModule.gsap ?? gsapModule.default;
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      // ============================================================
      // LOADER ANIMATION
      // ============================================================
      const loader = document.getElementById("loader");
      if (loader) {
        const nameSpans = loader.querySelectorAll<HTMLElement>(".loader-name span");
        const loaderSub = loader.querySelector<HTMLElement>(".loader-sub");
        const loaderLine = loader.querySelector<HTMLElement>(".loader-line");

        const afterLoad = () => {
          gsap.to(loader, {
            opacity: 0,
            duration: 0.6,
            ease: "power2.inOut",
            delay: 0.2,
            onComplete: () => {
              loader.style.display = "none";
              runHeroAnimation(gsap, ScrollTrigger);
            },
          });
        };

        if (prefersReducedMotion) {
          nameSpans.forEach((s) => { s.style.transform = "none"; });
          if (loaderSub) loaderSub.style.opacity = "1";
          if (loaderLine) loaderLine.style.width = "100%";
          setTimeout(afterLoad, 200);
        } else {
          const tl = gsap.timeline({ onComplete: afterLoad });
          tl.to(nameSpans, { y: 0, duration: 0.9, ease: "power4.out", stagger: 0.12 })
            .to(loaderSub, { opacity: 1, duration: 0.5, ease: "power2.out" }, "-=0.4")
            .to(loaderLine, { width: "100%", duration: 0.8, ease: "power2.inOut" }, "-=0.3");

          setTimeout(() => tl.play(), 1200);
        }
      } else {
        runHeroAnimation(gsap, ScrollTrigger);
      }
    };

    const runHeroAnimation = (
      gsap: typeof import("gsap").gsap,
      ScrollTrigger: typeof import("gsap/ScrollTrigger").ScrollTrigger
    ) => {
      // ============================================================
      // HERO ENTRANCE
      // ============================================================
      const heroMeta = document.querySelector<HTMLElement>(".hero-meta");
      const heroNameLines = document.querySelectorAll<HTMLElement>(".hero-name-line span");
      const heroTitleLines = document.querySelectorAll<HTMLElement>(".hero-title-line span");
      const heroSubtitle = document.querySelector<HTMLElement>(".hero-subtitle");
      const heroBottom = document.querySelector<HTMLElement>(".hero-bottom");

      if (prefersReducedMotion) {
        if (heroMeta) heroMeta.style.opacity = "1";
        heroNameLines.forEach((el) => { el.style.transform = "none"; });
        heroTitleLines.forEach((el) => { el.style.transform = "none"; });
        if (heroSubtitle) heroSubtitle.style.opacity = "1";
        if (heroBottom) heroBottom.style.opacity = "1";
      } else {
        const heroTl = gsap.timeline({ delay: 0.1 });
        heroTl
          .to(heroMeta, { opacity: 1, duration: 0.6, ease: "power2.out" })
          .to(heroNameLines, { y: 0, duration: 1.1, ease: "power4.out", stagger: 0.08 }, "-=0.2")
          .to(heroTitleLines, { y: 0, duration: 0.8, ease: "power3.out", stagger: 0.06 }, "-=0.7")
          .to(heroSubtitle, { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" }, "-=0.4")
          .to(heroBottom, { opacity: 1, duration: 0.6, ease: "power2.out" }, "-=0.3");
      }

      // ============================================================
      // SCROLL TRIGGERS
      // ============================================================
      // Reveal-up
      document.querySelectorAll<HTMLElement>(".reveal-up").forEach((el) => {
        ScrollTrigger.create({
          trigger: el,
          start: "top 88%",
          onEnter: () => {
            gsap.to(el, { opacity: 1, y: 0, duration: 0.9, ease: "power3.out" });
          },
          once: true,
        });
      });

      // Reveal-fade
      document.querySelectorAll<HTMLElement>(".reveal-fade").forEach((el) => {
        ScrollTrigger.create({
          trigger: el,
          start: "top 90%",
          onEnter: () => {
            gsap.to(el, { opacity: 1, duration: 0.8, ease: "power2.out" });
          },
          once: true,
        });
      });

      // Metric counters
      document.querySelectorAll<HTMLElement>("[data-metric]").forEach((el) => {
        const target = parseFloat(el.dataset.metric ?? "0");
        const suffix = el.dataset.suffix ?? "";
        const prefix = el.dataset.prefix ?? "";
        const isDecimal = el.dataset.decimal === "true";
        const container = el.parentElement;

        ScrollTrigger.create({
          trigger: el,
          start: "top 85%",
          onEnter: () => {
            const obj = { val: 0 };
            gsap.to(obj, {
              val: target,
              duration: 1.8,
              ease: "power2.out",
              onUpdate: () => {
                el.textContent =
                  prefix +
                  (isDecimal ? obj.val.toFixed(1) : Math.round(obj.val).toString()) +
                  suffix;
              },
            });
            if (container) {
              gsap.fromTo(container, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" });
            }
          },
          once: true,
        });
      });

      // Experience items
      document.querySelectorAll<HTMLElement>(".exp-item").forEach((el, i) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 30 },
          {
            opacity: 1, y: 0, duration: 0.9, ease: "power3.out",
            delay: i * 0.08,
            scrollTrigger: { trigger: el, start: "top 88%", once: true },
          }
        );
      });

      // Project cards
      document.querySelectorAll<HTMLElement>(".project-card").forEach((el, i) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 40 },
          {
            opacity: 1, y: 0, duration: 1, ease: "power3.out",
            delay: (i % 2) * 0.12,
            scrollTrigger: { trigger: el, start: "top 90%", once: true },
          }
        );
      });

      // Periodic element cards
      document.querySelectorAll<HTMLElement>(".element-card").forEach((el, i) => {
        gsap.fromTo(
          el,
          { opacity: 0 },
          {
            opacity: 1, duration: 0.4, ease: "power2.out",
            delay: (i % 10) * 0.04,
            scrollTrigger: { trigger: el, start: "top 95%", once: true },
          }
        );
      });

      // About headline
      const aboutHeadline = document.querySelector<HTMLElement>(".about-headline");
      if (aboutHeadline) {
        gsap.fromTo(
          aboutHeadline,
          { opacity: 0, y: 50 },
          {
            opacity: 1, y: 0, duration: 1.2, ease: "power3.out",
            scrollTrigger: { trigger: aboutHeadline, start: "top 85%", once: true },
          }
        );
      }

      // AI capabilities
      document.querySelectorAll<HTMLElement>(".ai-cap").forEach((el, i) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 20 },
          {
            opacity: 1, y: 0, duration: 0.7, ease: "power3.out",
            delay: i * 0.1,
            scrollTrigger: { trigger: el, start: "top 90%", once: true },
          }
        );
      });

      // Section labels
      document.querySelectorAll<HTMLElement>(".section-label").forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, x: -20 },
          {
            opacity: 1, x: 0, duration: 0.7, ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 90%", once: true },
          }
        );
      });

      // Contact headline
      const contactHeadline = document.querySelector<HTMLElement>(".contact-headline");
      if (contactHeadline) {
        gsap.fromTo(
          contactHeadline,
          { opacity: 0, y: 60 },
          {
            opacity: 1, y: 0, duration: 1.4, ease: "power4.out",
            scrollTrigger: { trigger: contactHeadline, start: "top 85%", once: true },
          }
        );
      }

      // About body reveals
      document.querySelectorAll<HTMLElement>(".about-body, .about-detail-row").forEach((el, i) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 16 },
          {
            opacity: 1, y: 0, duration: 0.7, ease: "power2.out",
            delay: i * 0.06,
            scrollTrigger: { trigger: el, start: "top 90%", once: true },
          }
        );
      });

      // Ghost word drift — giant background watermarks (WORK / METRICS /
      // STACK) scrub horizontally as their section passes the viewport.
      if (!prefersReducedMotion) {
        document
          .querySelectorAll<HTMLElement>("#experience, #metrics, #stack")
          .forEach((section) => {
            gsap.fromTo(
              section,
              { "--gw-x": "70px", "--gw-y": "24px" },
              {
                "--gw-x": "-70px",
                "--gw-y": "-24px",
                ease: "none",
                scrollTrigger: {
                  trigger: section,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: true,
                },
              }
            );
          });
      }
    };

    // ============================================================
    // NAVIGATION SCROLL
    // ============================================================
    const nav = document.querySelector<HTMLElement>(".nav-root");
    let navTicking = false;
    const handleNavScroll = () => {
      if (!navTicking) {
        requestAnimationFrame(() => {
          if (nav) {
            nav.classList.toggle("scrolled", window.scrollY > 60);
          }
          // Scroll progress (drives .nav-progress scaleX via --sp)
          const max =
            document.documentElement.scrollHeight - window.innerHeight;
          document.documentElement.style.setProperty(
            "--sp",
            String(max > 0 ? Math.min(window.scrollY / max, 1) : 0)
          );
          navTicking = false;
        });
        navTicking = true;
      }
    };
    window.addEventListener("scroll", handleNavScroll, { passive: true });

    // ============================================================
    // PROJECT MOCKUP TILT (mouse-reactive, fine pointer only)
    // ============================================================
    const setupProjectTilt = () => {
      if (!window.matchMedia("(pointer: fine)").matches) return;
      document.querySelectorAll<HTMLElement>(".project-card").forEach((card) => {
        const visual = card.querySelector<HTMLElement>(".project-visual-inner");
        if (!visual) return;
        const onMove = (e: MouseEvent) => {
          const r = card.getBoundingClientRect();
          const px = (e.clientX - r.left) / r.width - 0.5;
          const py = (e.clientY - r.top) / r.height - 0.5;
          visual.style.setProperty("--tilt-x", `${(-py * 3).toFixed(2)}deg`);
          visual.style.setProperty("--tilt-y", `${(px * 3).toFixed(2)}deg`);
        };
        const onLeave = () => {
          visual.style.setProperty("--tilt-x", "0deg");
          visual.style.setProperty("--tilt-y", "0deg");
        };
        card.addEventListener("mousemove", onMove);
        card.addEventListener("mouseleave", onLeave);
      });
    };

    // ============================================================
    // CUSTOM CURSOR
    // ============================================================
    const setupCursor = () => {
      if (window.matchMedia("(pointer: coarse)").matches) return;
      const dot = document.querySelector<HTMLElement>(".cursor-dot");
      const ring = document.querySelector<HTMLElement>(".cursor-ring");
      if (!dot || !ring) return;

      let mx = 0, my = 0, rx = 0, ry = 0;

      const onMove = (e: MouseEvent) => {
        mx = e.clientX;
        my = e.clientY;
        dot.style.left = mx + "px";
        dot.style.top = my + "px";
      };
      document.addEventListener("mousemove", onMove, { passive: true });

      const followRing = () => {
        rx += (mx - rx) * 0.12;
        ry += (my - ry) * 0.12;
        ring.style.left = rx + "px";
        ring.style.top = ry + "px";
        requestAnimationFrame(followRing);
      };
      followRing();

      document.querySelectorAll("a, button, .element-card, .nav-link, .ai-cap").forEach((el) => {
        el.addEventListener("mouseenter", () => ring.classList.add("hovering"));
        el.addEventListener("mouseleave", () => ring.classList.remove("hovering"));
      });

      document.querySelectorAll(".project-card").forEach((el) => {
        el.addEventListener("mouseenter", () => {
          ring.classList.add("project-hover");
          ring.classList.remove("hovering");
        });
        el.addEventListener("mouseleave", () => ring.classList.remove("project-hover"));
      });
    };
    setupCursor();
    setupProjectTilt();

    // ============================================================
    // MOBILE MENU
    // ============================================================
    const btn = document.querySelector<HTMLElement>(".nav-mobile-btn");
    const menu = document.querySelector<HTMLElement>(".mobile-menu");
    const mobileLinks = document.querySelectorAll(".mobile-menu-link");
    let isOpen = false;

    const toggleMenu = () => {
      isOpen = !isOpen;
      if (menu) menu.classList.toggle("open", isOpen);
      document.body.style.overflow = isOpen ? "hidden" : "";
      const bars = btn?.querySelectorAll<HTMLElement>("span");
      if (bars) {
        if (isOpen) {
          bars[0].style.transform = "rotate(45deg) translate(4px, 4px)";
          bars[1].style.opacity = "0";
          bars[2].style.transform = "rotate(-45deg) translate(4px, -4px)";
        } else {
          bars.forEach((b) => { b.style.transform = ""; b.style.opacity = ""; });
        }
      }
    };

    btn?.addEventListener("click", toggleMenu);
    mobileLinks.forEach((link) => link.addEventListener("click", () => { if (isOpen) toggleMenu(); }));

    runAnimations();

    return () => {
      window.removeEventListener("scroll", handleNavScroll);
    };
  }, []);

  return null;
}
