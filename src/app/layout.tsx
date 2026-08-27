import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sandeep Rai — Senior Frontend Engineer",
  description:
    "Senior Frontend Engineer specializing in React.js, Next.js, TypeScript, frontend architecture, performance optimization, scalable web applications, micro-frontends, and AI-driven applications.",
  keywords: [
    "Sandeep Rai",
    "Senior Frontend Engineer",
    "React.js",
    "Next.js",
    "TypeScript",
    "Frontend Architecture",
    "Performance Optimization",
    "Micro-frontends",
    "AI Applications",
    "New Delhi",
  ],
  authors: [{ name: "Sandeep Rai" }],
  creator: "Sandeep Rai",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://sandeeprai.dev",
    title: "Sandeep Rai — Senior Frontend Engineer",
    description:
      "Senior Frontend Engineer specializing in React.js, Next.js, TypeScript, and AI-driven web experiences. Based in New Delhi, India.",
    siteName: "Sandeep Rai Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sandeep Rai — Senior Frontend Engineer",
    description:
      "Senior Frontend Engineer specializing in React.js, Next.js, TypeScript, and AI-driven web experiences.",
    creator: "@sandeeprai",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      name: "Sandeep Rai",
      jobTitle: "Senior Frontend Engineer",
      url: "https://sandeeprai.dev",
      sameAs: [
        "https://github.com/sandeeprai",
        "https://linkedin.com/in/sandeeprai",
      ],
      address: {
        "@type": "PostalAddress",
        addressLocality: "New Delhi",
        addressCountry: "India",
      },
      knowsAbout: [
        "React.js",
        "Next.js",
        "TypeScript",
        "Frontend Architecture",
        "Performance Optimization",
        "Micro-frontends",
        "Generative AI",
      ],
    },
    {
      "@type": "WebSite",
      url: "https://sandeeprai.dev",
      name: "Sandeep Rai — Senior Frontend Engineer",
    },
  ],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
