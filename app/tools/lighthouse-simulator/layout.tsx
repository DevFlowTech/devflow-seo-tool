import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lighthouse Performance Simulator | DevFlow SEO Tool",
  description: "Simulate mobile performance auditing under custom network throttling.",
  openGraph: {
    title: "Lighthouse Performance Simulator | DevFlow SEO Tool",
    description: "Simulate mobile performance auditing under custom network throttling.",
    url: "https://seo.devflow.co.in/tools/lighthouse-simulator",
  },
  alternates: {
    canonical: "https://seo.devflow.co.in/tools/lighthouse-simulator",
  },
};

export default function LighthouseSimulatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
