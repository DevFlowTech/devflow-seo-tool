import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Automatic SEO Audit | DevFlow SEO Tool",
  description: "Run a comprehensive automated SEO audit to get actionable improvement suggestions for your website.",
  openGraph: {
    title: "Automatic SEO Audit | DevFlow SEO Tool",
    description: "Run a comprehensive automated SEO audit to get actionable improvement suggestions for your website.",
    url: "https://seo.devflow.co.in/tools/automatic-audit",
  },
  alternates: {
    canonical: "https://seo.devflow.co.in/tools/automatic-audit",
  },
};

export default function AutomaticAuditLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
