import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Robots.txt Builder & Tester | DevFlow SEO Tool",
  description: "Create standard robots.txt files and validate crawler directives against URLs.",
  openGraph: {
    title: "Robots.txt Builder & Tester | DevFlow SEO Tool",
    description: "Create standard robots.txt files and validate crawler directives against URLs.",
    url: "https://seo.devflow.co.in/tools/robots-generator",
  },
  alternates: {
    canonical: "https://seo.devflow.co.in/tools/robots-generator",
  },
};

export default function RobotsGeneratorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
