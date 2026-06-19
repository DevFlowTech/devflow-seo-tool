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
      className="group relative block border border-border/80 bg-card/20 p-6 transition-all duration-300 hover:border-foreground/40 hover:bg-card/50 cursor-pointer text-left rounded-none"
    >
      <div className="flex flex-col h-full justify-between gap-8 min-h-[140px]">
        
        {/* Top line: index code & minimal category badge */}
        <div className="flex items-center justify-between border-b border-border/40 pb-3">
          <span className="font-mono text-[9px] text-muted-foreground/60 select-none">
            {tool.id.substring(0, 4).toUpperCase()}
          </span>
          <span className="font-mono text-[8px] uppercase tracking-widest text-muted-foreground group-hover:text-accent transition-colors">
            {badge.label}
          </span>
        </div>

        {/* Middle part: title and light description */}
        <div className="space-y-2">
          <h3 className="font-medium text-sm text-foreground group-hover:text-white transition-colors tracking-tight">
            {tool.name}
          </h3>
          <p className="text-xs text-muted-foreground/80 line-clamp-2 leading-relaxed font-light">
            {tool.description}
          </p>
        </div>

        {/* Bottom line: inline arrow trigger */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-wider text-muted-foreground group-hover:text-accent transition-colors">
            <span>Launch Console</span>
            <ArrowRight className="h-2.5 w-2.5 transition-transform duration-300 group-hover:translate-x-1" />
          </div>
          {/* Subtle indicator line */}
          <div className="w-1.5 h-1.5 rounded-full bg-border group-hover:bg-accent transition-colors duration-300" />
        </div>
        
      </div>
    </Link>
  );
}
export default ToolCard;
