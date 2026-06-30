import { Metadata } from "next";

export const metadata: Metadata = {
  title: "XML Sitemap Builder | DevFlow SEO Tool",
  description: "Crawl domains up to 30 pages to dynamically generate optimized sitemap files.",
  openGraph: {
    title: "XML Sitemap Builder | DevFlow SEO Tool",
    description: "Crawl domains up to 30 pages to dynamically generate optimized sitemap files.",
    url: "https://seo.devflow.co.in/tools/sitemap-generator",
  },
  alternates: {
    canonical: "https://seo.devflow.co.in/tools/sitemap-generator",
  },
};

export default function SitemapGeneratorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
