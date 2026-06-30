import type { Metadata } from "next";
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import { Toaster } from "react-hot-toast";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "DevFlow SEO Tool - The Ultimate Free SEO Tools for Developers & Marketers",
  description:
    "Looking for a powerful, 100% free SEO tool? Analyze websites, optimize content, and dominate search rankings with DevFlow's professional SEO tools. No signup required.",
  keywords: [
    "free SEO tool",
    "best free SEO tools",
    "SEO analyzer",
    "website SEO checker",
    "technical SEO tools",
    "free keyword research tool",
    "DevFlow SEO",
    "SEO diagnostics",
    "Generative Engine Optimization",
    "search engine optimization tools",
    "site audits",
    "index checker",
    "JSON-LD schema generator"
  ],
  icons: {
    icon: "/favicon.svg",
  },
  alternates: {
    canonical: "https://seo.devflow.co.in",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "DevFlow SEO Tool - The Ultimate Free SEO Tools for Developers",
    description: "Looking for a powerful, 100% free SEO tool? Analyze websites, optimize content, and dominate search rankings with DevFlow's professional SEO tools. No signup required.",
    url: "https://seo.devflow.co.in",
    siteName: "DevFlow SEO Tool",
    images: [
      {
        url: "https://seo.devflow.co.in/favicon.svg",
        width: 800,
        height: 600,
        alt: "DevFlow SEO Tool Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "DevFlow SEO Tool - The Ultimate Free SEO Tools",
    description: "Looking for a powerful, 100% free SEO tool? Analyze websites and optimize content with DevFlow's professional SEO tools.",
    images: ["https://seo.devflow.co.in/favicon.svg"],
  },
};

const webApplicationSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "DevFlow SEO Tool",
  "url": "https://seo.devflow.co.in",
  "description": "A premium, minimalist developer-first SEO diagnostic suite and API workspace. Features 18 real-time diagnostic tools and a companion NPM CLI.",
  "applicationCategory": "BusinessApplication",
  "operatingSystem": "All",
  "browserRequirements": "Requires HTML5. Requires JavaScript.",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "author": {
    "@type": "Organization",
    "name": "DevFlow Technology",
    "url": "https://seo.devflow.co.in"
  }
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is DevFlow SEO Tool?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "DevFlow SEO Tool is a free, high-performance, developer-first search engine diagnostics suite. It contains 18 modular tools (including redirect chain tracers, DNS record inspectors, and HTML scrapers) to audit indexing, meta tag configurations, link equity, and competitor SEO metrics instantly."
      }
    },
    {
      "@type": "Question",
      "name": "How is DevFlow SEO Tool different from traditional SaaS platforms like Ahrefs or Semrush?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Unlike bloated commercial tools, DevFlow requires zero user registration, stores no user crawl histories, uses no tracking cookies, and runs live server-side checkups for 100% transparent results. Additionally, it offers a companion NPM Command Line Interface (CLI) to trigger diagnostic checks directly from terminal interfaces or automated CI/CD pipelines."
      }
    },
    {
      "@type": "Question",
      "name": "Does DevFlow SEO Tool store search histories or cookies?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "No, DevFlow does not store cookies or index query database history records. All domain audits and redirects scans are executed dynamically in memory and returned straight to the user. Optional session-based logging is saved locally inside the user's browser storage (localStorage) and is never uploaded to any remote servers."
      }
    },
    {
      "@type": "Question",
      "name": "How do I use the DevFlow SEO Tool CLI?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "You can run the command 'npx devflow-seo-tool analyze <domain>' to audit page HTML metadata tags and trace redirection hops, or run 'npx devflow-seo-tool dns <domain>' to query authoritative nameservers, MX records, and WHOIS information directly from your terminal."
      }
    }
  ]
};

const webSiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "DevFlow SEO Tool",
  "url": "https://seo.devflow.co.in",
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://seo.devflow.co.in/tools?q={search_term_string}"
    },
    "query-input": "required name=search_term_string"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} min-h-screen flex flex-col bg-background text-foreground antialiased transition-colors duration-300 relative overflow-x-hidden`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webApplicationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
        <div className="grid-overlay" />
        <div className="ambient-glow" />
        <Navbar />
        <main className="flex-grow flex flex-col relative z-10">{children}</main>
        <Footer />
        
        {/* React Hot Toast Configured with Sleek Custom Theme */}
        <Toaster
          position="bottom-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: "#09090b",
              color: "#fafafa",
              border: "1px solid #1c1c1f",
              borderRadius: "4px",
              fontSize: "14px",
            },
            success: {
              iconTheme: {
                primary: "#a3e635",
                secondary: "#000000",
              },
            },
            error: {
              iconTheme: {
                primary: "#ef4444",
                secondary: "#ffffff",
              },
            },
          }}
        />
      </body>
    </html>
  );
}

