import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Keyword Gap Analyzer | DevFlow SEO Tool",
  description: "Compare two domains side-by-side to identify missing keyword opportunities.",
  openGraph: {
    title: "Keyword Gap Analyzer | DevFlow SEO Tool",
    description: "Compare two domains side-by-side to identify missing keyword opportunities.",
    url: "https://seo.devflow.co.in/tools/keyword-gap",
  },
  alternates: {
    canonical: "https://seo.devflow.co.in/tools/keyword-gap",
  },
};

export default function KeywordGapLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
