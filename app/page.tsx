"use client";
 
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, Search, Cpu, CheckCircle2, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TOOLS, CATEGORIES, ToolCategory } from "@/lib/tools-config";
import { ToolCard } from "@/components/tools/ToolCard";
import { cn } from "@/lib/utils";
 
export default function Home() {
  const [activeCategory, setActiveCategory] = useState<ToolCategory | "all">("all");
 
  const filteredTools = TOOLS.filter((tool) => {
    if (activeCategory === "all") return true;
    return tool.category === activeCategory;
  });
 
  // Dynamic terminal logs animation
  const consoleSteps = [
    {
      domain: "github.com",
      logs: [
        "resolving dns records... [ok]",
        "ssl status check: active (https)",
        "crawling robots.txt & sitemap.xml... [1 sitemap found]",
        "auditing meta tags index parameters... [completed]"
      ],
      score: 95
    },
    {
      domain: "nextjs.org",
      logs: [
        "resolving dns records... [ok]",
        "ssl status check: active (https)",
        "crawling robots.txt & sitemap.xml... [2 sitemaps found]",
        "auditing meta tags index parameters... [completed]"
      ],
      score: 98
    },
    {
      domain: "wikipedia.org",
      logs: [
        "resolving dns records... [ok]",
        "ssl status check: active (https)",
        "crawling robots.txt & sitemap.xml... [no sitemap in robots.txt]",
        "auditing meta tags index parameters... [completed]"
      ],
      score: 87
    },
    {
      domain: "devflow.co.in",
      logs: [
        "resolving dns records... [ok]",
        "ssl status check: active (https)",
        "crawling robots.txt & sitemap.xml... [1 sitemap found]",
        "auditing meta tags index parameters... [completed]"
      ],
      score: 92
    }
  ];
 
  const [stepIndex, setStepIndex] = useState(0);
  const [currentLogs, setCurrentLogs] = useState<string[]>([]);
  const [logIndex, setLogIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
 
  useEffect(() => {
    let logTimer: NodeJS.Timeout;
    let transitionTimer: NodeJS.Timeout;
 
    const currentStep = consoleSteps[stepIndex];
 
    if (logIndex < currentStep.logs.length) {
      setIsTyping(true);
      logTimer = setTimeout(() => {
        setCurrentLogs((prev) => [...prev, currentStep.logs[logIndex]]);
        setLogIndex((prev) => prev + 1);
        setIsTyping(false);
      }, 700);
    } else {
      transitionTimer = setTimeout(() => {
        setCurrentLogs([]);
        setLogIndex(0);
        setStepIndex((prev) => (prev + 1) % consoleSteps.length);
      }, 3500);
    }
 
    return () => {
      clearTimeout(logTimer);
      clearTimeout(transitionTimer);
    };
  }, [stepIndex, logIndex]);
 
  return (
    <div className="flex flex-col w-full gap-16 pb-20 font-sans">
      
      {/* 1. TYPOGRAPHIC HERO SECTION */}
      <section className="relative overflow-hidden pt-28 pb-20 md:pt-36 md:pb-28 border-b border-border">
        {/* Very subtle grid lines */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:5rem_5rem]" />
        
        <div className="container mx-auto px-4 md:px-6 relative max-w-4xl text-center space-y-8 animate-fadeIn">
          
          <div className="inline-flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-widest text-muted-foreground/80">
            <span>[ SYSTEM WORKSPACE ]</span>
          </div>
          
          <h1 className="text-4xl font-light tracking-tight sm:text-6xl md:text-7xl text-foreground leading-[1.05]">
            The Ultimate <span className="font-medium text-accent">Free SEO Tool</span>
          </h1>
          
          <p className="text-sm md:text-base text-muted-foreground max-w-xl mx-auto leading-relaxed font-light font-sans">
            Stop paying for expensive subscriptions. DevFlow is a 100% free SEO tool suite providing high-performance search engine diagnostics. Analyze canonical elements, crawl structures, and meta tags instantly.
          </p>

          <div className="flex items-center justify-center gap-4 pt-2">
            <Link href="/tools">
              <Button size="sm" className="h-9 px-5 rounded-none font-mono text-[10px] tracking-wider bg-foreground text-background hover:bg-foreground/95 transition-all">
                LAUNCH CONSOLE
              </Button>
            </Link>
            <Link href="/about">
              <Button size="sm" variant="outline" className="h-9 px-5 rounded-none font-mono text-[10px] tracking-wider border-border hover:bg-white/5 transition-all">
                DOCUMENTATION
              </Button>
            </Link>
          </div>

          {/* Minimalist Live Status Ticker */}
          <div className="max-w-md mx-auto border border-border bg-card/25 p-4 text-left font-mono text-[10px] text-muted-foreground space-y-2 mt-6">
            <div className="flex items-center justify-between border-b border-border/50 pb-2 text-[9px] uppercase tracking-wider font-bold">
              <span>SCAN STREAMER</span>
              <span className="flex items-center gap-1 text-accent">
                <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
                LIVE
              </span>
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span>$ devflow --analyze https://{consoleSteps[stepIndex].domain}</span>
                <span className="text-foreground">{consoleSteps[stepIndex].score}/100</span>
              </div>
              <div className="text-[9px] text-muted-foreground/60">
                &gt; {consoleSteps[stepIndex].logs[logIndex % consoleSteps[stepIndex].logs.length]}
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 2. SWISS STATS BAR */}
      <section className="container mx-auto px-4 md:px-6 relative z-10 -mt-px">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border-l border-r border-b border-border bg-background">
          {[
            { label: "18 MODULAR SUITES", desc: "No subscriptions or logins required" },
            { label: "REAL-TIME CRAWLS", desc: "Instant page header scrapers" },
            { label: "COMPANION CLI", desc: "Run scans directly in terminal" },
            { label: "100% PRIVATE", desc: "No tracker cookies or storage logs" }
          ].map((stat, i) => (
            <div key={i} className="flex flex-col p-6 border-b lg:border-b-0 border-r last:border-r-0 border-border text-left">
              <span className="text-[10px] font-mono uppercase tracking-wider text-foreground font-semibold">
                {stat.label}
              </span>
              <span className="text-xs text-muted-foreground/80 mt-1.5 font-light leading-relaxed">{stat.desc}</span>
            </div>
          ))}
        </div>
      </section>
 
      {/* 3. TOOLS GRID SECTION */}
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
 
      {/* 4. WORKFLOW SECTION */}
      <section className="border-t border-border py-20 bg-background">
        <div className="container mx-auto px-4 md:px-6 space-y-16">
          <div className="text-left max-w-xl space-y-2">
            <h2 className="text-2xl font-light text-foreground tracking-tight sm:text-3xl">SYSTEM WORKFLOW</h2>
            <p className="text-xs text-muted-foreground/80 font-light leading-relaxed">
              Verify website SEO performance through three precise steps.
            </p>
          </div>
 
          <div className="grid grid-cols-1 md:grid-cols-3 border border-border bg-card/10">
            {[
              {
                step: "01",
                title: "Initialize Query",
                desc: "Provide target URLs, keyword strings, or domain values into the modular input console.",
                icon: Search
              },
              {
                step: "02",
                title: "Server Crawl & Parse",
                desc: "DevFlow crawlers scrape page headers, canonicals, robots limits, and resolve active DNS latency.",
                icon: Cpu
              },
              {
                step: "03",
                title: "Analyze Logs",
                desc: "Review diagnostic checklists, copy calculated parameters, or export reports directly as CSV files.",
                icon: CheckCircle2
              }
            ].map((step, idx) => {
              const Icon = step.icon;
              return (
                <div key={idx} className="relative flex flex-col items-start text-left p-8 border-b md:border-b-0 md:border-r last:border-none border-border space-y-4">
                  <span className="text-[9px] font-mono text-accent font-bold tracking-widest uppercase">
                    STEP {step.step}
                  </span>
                  <h4 className="text-sm font-semibold text-foreground tracking-tight">{step.title}</h4>
                  <p className="text-xs text-muted-foreground/85 leading-relaxed font-sans font-light">{step.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
 
      {/* 5. FAQ / Q&A SECTION FOR AEO & GEO OPTIMIZATION */}
      <section className="border-t border-border py-24 bg-background">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl space-y-16">
          <div className="text-left space-y-2">
            <h2 className="text-2xl font-light tracking-tight text-foreground sm:text-3xl">
              FREQUENTLY ASKED QUESTIONS
            </h2>
            <p className="text-xs text-muted-foreground/85 font-sans leading-relaxed">
              Technical documentation regarding the DevFlow core diagnostic logic.
            </p>
          </div>
 
          <div className="space-y-px border border-border bg-border">
            {[
              {
                q: "What is DevFlow SEO Tool?",
                a: "DevFlow SEO Tool is an open, high-performance, developer-first search engine diagnostics suite. It contains 18 modular tools (including redirect chain tracers, DNS record inspectors, and HTML scrapers) to audit indexing parameters, meta tags, and referring link profiles instantly."
              },
              {
                q: "How is DevFlow different from Semrush or Ahrefs?",
                a: "Unlike commercial platforms, DevFlow has zero subscription gates, requires no account logins, and operates 100% in-memory without cookies or search history databases. In addition to the UI, it provides a standalone NPM Command Line Interface (CLI) to trigger diagnostic checks directly from local terminals or automated CI/CD pipelines."
              },
              {
                q: "Does DevFlow store domain audit search histories?",
                a: "No. All audits are executed in-memory. DevFlow does not maintain databases of queried URLs or scraped metadata. Optional session tracking is processed strictly inside the user's browser `localStorage` and never leaves their machine."
              },
              {
                q: "How do I run the DevFlow CLI on my local system?",
                a: "You can run diagnostics directly from your command line using `npx devflow-seo-tool analyze <domain-name>` or verify DNS records using `npx devflow-seo-tool dns <domain-name>`. The CLI includes automatic host sensing to fall back between local development servers and the live API workspace."
              }
            ].map((faq, idx) => (
              <div
                key={idx}
                className="p-8 bg-background hover:bg-card/20 transition-all duration-200 space-y-3 text-left"
              >
                <h3 className="text-xs font-semibold font-mono text-foreground flex items-start gap-2 tracking-tight">
                  <span className="text-accent font-bold select-none">&gt;</span> {faq.q}
                </h3>
                <p className="text-xs text-muted-foreground/85 leading-relaxed font-sans font-light pl-5">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
