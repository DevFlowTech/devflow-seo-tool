import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Schema Markup Generator | DevFlow SEO Tool",
  description: "Generate structured JSON-LD schema markup for Google Rich Snippets.",
  openGraph: {
    title: "Schema Markup Generator | DevFlow SEO Tool",
    description: "Generate structured JSON-LD schema markup for Google Rich Snippets.",
    url: "https://seo.devflow.co.in/tools/schema-generator",
  },
  alternates: {
    canonical: "https://seo.devflow.co.in/tools/schema-generator",
  },
};

export default function SchemaGeneratorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
