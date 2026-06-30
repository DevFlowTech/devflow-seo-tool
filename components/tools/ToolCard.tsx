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

  return (
    <Link
      href={`/tools/${tool.slug}`}
      className="group relative block p-[1px] rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(0,0,0,0.6)] hover:shadow-accent/20"
    >
      {/* Animated gradient border background */}
      <div className="absolute inset-0 bg-gradient-to-br from-border/50 to-border/10 group-hover:from-accent/50 group-hover:to-accent/10 transition-colors duration-500" />
      
      {/* Card Content Wrapper */}
      <div className="relative flex flex-col h-full justify-between gap-6 p-6 rounded-2xl bg-[#09090b] bg-opacity-90 backdrop-blur-xl transition-all duration-500">
        
        {/* Glow effect positioned at top right */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-accent/10 rounded-full blur-3xl group-hover:bg-accent/25 transition-colors duration-500" />

        {/* Top line: Icon & minimal category badge */}
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/5 border border-white/10 group-hover:border-accent/30 group-hover:bg-accent/10 transition-all duration-300">
            <IconComponent className="w-5 h-5 text-muted-foreground group-hover:text-accent transition-colors duration-300" />
          </div>
          <span className="font-mono text-[9px] px-2.5 py-1 rounded-full border border-border/80 bg-black/60 uppercase tracking-widest text-muted-foreground group-hover:border-accent/40 group-hover:text-accent transition-all duration-300">
            {badge.label}
          </span>
        </div>

        {/* Middle part: title and light description */}
        <div className="space-y-2.5 relative z-10 mt-2">
          <h3 className="font-semibold text-base text-foreground group-hover:text-white transition-colors tracking-tight">
            {tool.name}
          </h3>
          <p className="text-sm text-muted-foreground/70 line-clamp-2 leading-relaxed font-light">
            {tool.description}
          </p>
        </div>

        {/* Bottom line: inline arrow trigger */}
        <div className="flex items-center justify-between pt-4 border-t border-border/40 relative z-10">
          <div className="flex items-center gap-2 font-mono text-[10px] font-medium uppercase tracking-wider text-muted-foreground group-hover:text-accent transition-colors">
            <span>Launch Console</span>
            <ArrowRight className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-1" />
          </div>
        </div>
      </div>
    </Link>
  );
}
export default ToolCard;
