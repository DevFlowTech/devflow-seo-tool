"use client";

import React, { useState } from "react";
import { TOOLS, CATEGORIES, ToolCategory } from "@/lib/tools-config";
import { ToolCard } from "@/components/tools/ToolCard";
import { cn } from "@/lib/utils";

export function ToolsConsole() {
  const [activeCategory, setActiveCategory] = useState<ToolCategory | "all">("all");

  const filteredTools = TOOLS.filter((tool) => {
    if (activeCategory === "all") return true;
    return tool.category === activeCategory;
  });

  return (
    <section id="tools" className="container mx-auto px-4 md:px-6 space-y-10 pt-16 relative z-10">
      <div className="text-left space-y-2 max-w-2xl">
        <h2 className="text-2xl font-light tracking-tight text-foreground sm:text-3xl">
          SEO CONSOLE <span className="font-semibold text-accent">SUITES</span>
        </h2>
        <p className="text-xs text-muted-foreground/80 font-sans leading-relaxed">
          Choose a specialized tool module from the system index below to audit indexing, metadata configuration, link profiles, or simulated engine rankings.
        </p>
      </div>

      {/* Tab Switcher */}
      <div className="flex flex-wrap items-center justify-start gap-1 border-b border-border pb-px">
        <button
          onClick={() => setActiveCategory("all")}
          className={cn(
            "px-5 py-3 text-[10px] font-mono tracking-widest uppercase transition-all cursor-pointer border-b-2 -mb-px",
            activeCategory === "all"
              ? "border-accent text-accent font-bold"
              : "border-transparent text-muted-foreground hover:text-foreground"
          )}
        >
          ALL
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setActiveCategory(cat.key)}
            className={cn(
              "px-5 py-3 text-[10px] font-mono tracking-widest uppercase transition-all cursor-pointer border-b-2 -mb-px",
              activeCategory === cat.key
                ? "border-accent text-accent font-bold"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            {cat.name.split(" ")[0].toUpperCase()}
          </button>
        ))}
      </div>

      {/* Grid List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredTools.map((tool) => (
          <ToolCard key={tool.slug} tool={tool} />
        ))}
      </div>
    </section>
  );
}

export default ToolsConsole;
