import type { Metadata } from "next";
import { Geist, Geist_Mono, Newsreader } from "next/font/google";
import { Suspense } from "react";
import { Analytics } from "@/components/analytics";
import { CommandPaletteHost } from "@/components/command-palette-host";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://jishnuteegala.com"),
  title: {
    default: "Jishnu Teegala",
    template: "%s · Jishnu Teegala",
  },
  description: "Data and analytics engineer in London, UK.",
  alternates: {
    canonical: "./",
  },
};

const themeScript = `(function(){try{var t=localStorage.getItem("theme");var d=t==="dark"||(t!=="light"&&matchMedia("(prefers-color-scheme: dark)").matches);document.documentElement.dataset.theme=d?"dark":"light"}catch(e){}})()`;

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": "https://jishnuteegala.com/#person",
      name: "Jishnu Teegala",
      url: "https://jishnuteegala.com",
      jobTitle: "DevOps Platforms Engineer",
      address: { "@type": "PostalAddress", addressLocality: "London", addressCountry: "GB" },
      email: "mailto:hi@jishnuteegala.com",
      sameAs: [
        "https://github.com/jishnuteegala",
        "https://www.linkedin.com/in/jishnu-teegala",
        "https://gitlab.com/jishnuteegala",
        "https://x.com/jishnuteegala",
      ],
    },
    {
      "@type": "WebSite",
      "@id": "https://jishnuteegala.com/#website",
      url: "https://jishnuteegala.com",
      name: "Jishnu Teegala",
      publisher: { "@id": "https://jishnuteegala.com/#person" },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${newsreader.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <link rel="alternate" type="application/rss+xml" title="Jishnu Teegala" href="/rss.xml" />
      </head>
      <body className="min-h-full flex flex-col">
        {children}
        <Suspense fallback={null}>
          <CommandPaletteHost />
        </Suspense>
        <Suspense fallback={null}>
          <Analytics />
        </Suspense>
      </body>
    </html>
  );
}
