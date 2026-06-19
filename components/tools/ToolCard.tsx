"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ToolMetadata, getToolIcon } from "@/lib/tools-config";
import { cn } from "@/lib/utils";

interface ToolCardProps {
  tool: ToolMetadata;
}

export function ToolCard({ tool }: ToolCardProps) {
  const IconComponent = getToolIcon(tool.iconName);

  // Map category slugs to readable badges
  const categoryNames: Record<string, { label: string }> = {
    content: { label: "Content & Research" },
    technical: { label: "Technical SEO" },
    links: { label: "Link Analysis" },
    serp: { label: "SERP & Rankings" }
  };

  const badge = categoryNames[tool.category] || { label: tool.category };

  // Map category to styles for vibrant card accents
  const accentColors: Record<string, { text: string; bg: string; border: string }> = {
    content: { text: "text-blue-400", bg: "bg-blue-950/30", border: "group-hover:border-blue-500/30" },
    technical: { text: "text-emerald-400", bg: "bg-emerald-950/30", border: "group-hover:border-emerald-500/30" },
    links: { text: "text-violet-400", bg: "bg-violet-950/30", border: "group-hover:border-violet-500/30" },
    serp: { text: "text-amber-400", bg: "bg-amber-950/30", border: "group-hover:border-amber-500/30" }
  };

  const colors = accentColors[tool.category] || { text: "text-primary", bg: "bg-primary/10", border: "group-hover:border-primary/30" };

  return (
    <Link
      href={`/tools/${tool.slug}`}
      className="group relative block rounded-xl p-5 cursor-pointer overflow-hidden text-left glow-card transition-all duration-300"
    >
      {/* Background radial accent glow that reveals on hover */}
      <div className={cn(
        "absolute -right-10 -top-10 h-24 w-24 rounded-full opacity-0 group-hover:opacity-10 transition-opacity duration-500 blur-xl",
        tool.category === "content" && "bg-blue-500",
        tool.category === "technical" && "bg-emerald-500",
        tool.category === "links" && "bg-violet-500",
        tool.category === "serp" && "bg-amber-500"
      )} />

      <div className="flex flex-col h-full justify-between gap-6 relative z-10">
        <div className="space-y-4">
          {/* Top Line: Icon & Badge */}
          <div className="flex items-center justify-between gap-2">
            <div className={cn("p-2.5 rounded-lg transition-all duration-300", colors.bg, colors.text, "group-hover:scale-110")}>
              <IconComponent className="h-5 w-5" />
            </div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground/80 group-hover:text-foreground transition-colors">
              {badge.label}
            </span>
          </div>

          {/* Tool Details */}
          <div className="space-y-1.5">
            <h3 className="font-bold text-base text-foreground group-hover:text-primary transition-colors tracking-tight">
              {tool.name}
            </h3>
            <p className="text-xs text-muted-foreground/85 line-clamp-2 leading-relaxed font-light">
              {tool.description}
            </p>
          </div>
        </div>

        {/* Action Button Link */}
        <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-primary group-hover:text-accent transition-colors pt-2">
          <span className="font-semibold">Run diagnostics</span>
          <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform duration-300" />
        </div>
      </div>
    </Link>
  );
}
export default ToolCard;
