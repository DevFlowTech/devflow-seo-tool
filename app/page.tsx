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
      
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-24 pb-20 md:pt-36 md:pb-32 border-b border-card-border/40 bg-radial-[at_50%_0%] from-card/30 via-background to-background">
        {/* Soft glowing ambient backgrounds */}
        <div className="absolute inset-x-0 top-0 h-[600px] bg-gradient-to-b from-primary/5 via-accent/2 to-transparent pointer-events-none filter blur-3xl animate-pulse-glow" />
        <div className="absolute top-1/4 left-1/4 h-[300px] w-[300px] bg-primary/3 rounded-full pointer-events-none filter blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(163,230,53,0.012)_1px,transparent_1px),linear-gradient(to_bottom,rgba(163,230,53,0.012)_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        
        <div className="container mx-auto px-4 md:px-6 relative flex flex-col lg:flex-row items-center gap-16">
          {/* Left Text Column */}
          <div className="flex-1 space-y-6 text-left animate-fadeIn">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4.5 py-1 text-[10px] font-mono uppercase tracking-widest text-primary shadow-[0_0_15px_rgba(163,230,53,0.05)]">
              <Sparkles className="h-3.5 w-3.5" />
              Developer SEO Diagnostics
            </div>
            
            <h1 className="text-5xl font-light tracking-tight sm:text-6xl md:text-7xl text-foreground leading-[1.02]">
              DevFlow <span className="font-extrabold text-primary glowing-text">SEO</span>
            </h1>
            
            <p className="text-base md:text-lg text-muted-foreground max-w-xl leading-relaxed font-light">
              An open-source, high-performance toolkit for real-time search engine diagnostics. Audit key word structure, index status, and link profiles instantly.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-4">
              <Link href="/tools">
                <Button size="md" className="gap-2.5 cursor-pointer rounded-lg font-mono text-xs uppercase tracking-wider px-6 shadow-[0_4px_20px_rgba(163,230,53,0.2)] hover:shadow-[0_4px_30px_rgba(163,230,53,0.35)] transition-all">
                  Launch Console
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
              <Link href="/about">
                <Button size="md" variant="outline" className="cursor-pointer rounded-lg font-mono text-xs uppercase tracking-wider px-6 border-card-border hover:bg-card-border/30 hover:border-primary/20 transition-all">
                  Documentation
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Interface Console Mock */}
          <div className="flex-1 w-full max-w-md lg:max-w-none flex items-center justify-center animate-fadeIn [animation-delay:200ms]">
            <div className="relative w-full aspect-video rounded-xl border border-card-border/80 bg-[#070709]/95 p-6 shadow-[0_20px_50px_rgba(0,0,0,0.6)] overflow-hidden font-mono text-xs text-muted-foreground scanlines">
              {/* Glow Behind Terminal */}
              <div className="absolute -top-20 -left-20 h-40 w-40 rounded-full bg-primary/10 filter blur-3xl pointer-events-none" />
              
              {/* Top Bar */}
              <div className="flex items-center justify-between border-b border-card-border/40 pb-4 mb-5">
                <div className="flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-full bg-destructive/60 hover:bg-destructive transition-colors duration-150" />
                  <div className="h-2.5 w-2.5 rounded-full bg-warning/60 hover:bg-warning transition-colors duration-150" />
                  <div className="h-2.5 w-2.5 rounded-full bg-primary/60 hover:bg-primary transition-colors duration-150" />
                </div>
                <div className="text-[10px] text-muted-foreground/50 select-none flex items-center gap-2 tracking-wide font-semibold uppercase">
                  <Terminal className="h-3.5 w-3.5 text-primary" />
                  Console://audit-system
                </div>
                <div className="w-8" />
              </div>

              {/* Console Body */}
              <div className="space-y-4 font-mono">
                <div className="flex items-center gap-2 text-foreground">
                  <span className="text-primary font-bold animate-pulse">$</span>
                  <span>devflow --analyze https://{consoleSteps[stepIndex].domain}</span>
                  {logIndex === 0 && <span className="w-1.5 h-3.5 bg-primary animate-pulse" />}
                </div>
                
                <div className="text-[11px] text-muted-foreground/80 space-y-2.5 min-h-[90px]">
                  {currentLogs.map((log, i) => (
                    <div key={i} className={cn(
                      "transition-all duration-300",
                      i === currentLogs.length - 1 && "text-primary font-bold glowing-text"
                    )}>
                      &gt; {log}
                    </div>
                  ))}
                  {!isTyping && logIndex < consoleSteps[stepIndex].logs.length && (
                    <div className="flex items-center gap-1.5">
                      <span>&gt;</span>
                      <span className="w-1 h-3.5 bg-muted-foreground/40 animate-pulse" />
                    </div>
                  )}
                </div>

                {/* Score bar */}
                <div className={cn(
                  "border border-card-border/60 rounded-lg p-3 bg-card/60 flex items-center justify-between mt-3 transition-all duration-500 shadow-inner",
                  logIndex === consoleSteps[stepIndex].logs.length ? "opacity-100 translate-y-0 border-primary/20 bg-primary/[0.02]" : "opacity-30 translate-y-1"
                )}>
                  <div className="space-y-0.5 text-left">
                    <div className="text-[10px] uppercase tracking-wider font-bold text-foreground">SEO Health Index</div>
                    <div className="text-[9px] text-muted-foreground/50">Diagnostics check completed</div>
                  </div>
                  <div className="text-xl font-black text-primary glowing-text">
                    {consoleSteps[stepIndex].score}/100
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. STATS BAR */}
      <section className="container mx-auto px-4 md:px-6 relative z-10 -mt-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-6 rounded-2xl border border-card-border bg-[#09090b]/80 backdrop-blur-md shadow-2xl">
          {[
            { label: "18+ Mod Console Apps", desc: "Zero subscriptions, configs, or gates" },
            { label: "Real-time Audits", desc: "Live scraper crawls and page loads" },
            { label: "NPM Companion CLI", desc: "Run scans directly in local terminals" },
            { label: "Privacy Core First", desc: "Strictly client-bound, zero tracking" }
          ].map((stat, i) => (
            <div key={i} className="flex flex-col p-4.5 rounded-xl border border-transparent hover:border-card-border/50 hover:bg-card/30 transition-all duration-300 text-left">
              <span className="text-xs font-mono uppercase tracking-wider text-primary font-extrabold glowing-text">
                {stat.label}
              </span>
              <span className="text-xs text-muted-foreground/75 mt-2 font-light leading-relaxed">{stat.desc}</span>
            </div>
          ))}
        </div>
      </section>
 
      {/* 3. TOOLS GRID SECTION */}
      <section id="tools" className="container mx-auto px-4 md:px-6 space-y-10 relative z-10 pt-6">
        <div className="text-left space-y-3 border-l-3 border-primary pl-5">
          <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            SEO Console Suites
          </h2>
          <p className="text-sm text-muted-foreground/80 font-light max-w-xl leading-relaxed">
            Select a modular tool from our diagnostic categories below to inspect indexing, meta structures, or page performance.
          </p>
        </div>
 
        {/* Tab Switcher */}
        <div className="flex flex-wrap items-center justify-start gap-2.5 border-b border-card-border/30 pb-5">
          <button
            onClick={() => setActiveCategory("all")}
            className={cn(
              "px-5 py-2 rounded-full text-xs font-mono tracking-wider uppercase transition-all cursor-pointer border",
              activeCategory === "all"
                ? "bg-primary text-primary-foreground border-primary font-bold shadow-[0_4px_15px_rgba(163,230,53,0.25)] scale-[1.02]"
                : "border-card-border text-muted-foreground hover:text-foreground hover:bg-card-border/30"
            )}
          >
            All Tools
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={cn(
                "px-5 py-2 rounded-full text-xs font-mono tracking-wider uppercase transition-all cursor-pointer border",
                activeCategory === cat.key
                  ? "bg-primary text-primary-foreground border-primary font-bold shadow-[0_4px_15px_rgba(163,230,53,0.25)] scale-[1.02]"
                  : "border-card-border text-muted-foreground hover:text-foreground hover:bg-card-border/30"
              )}
            >
              {cat.name}
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
      <section className="border-t border-card-border/40 py-20 bg-gradient-to-b from-[#040406] to-background">
        <div className="container mx-auto px-4 md:px-6 space-y-16">
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-extrabold text-foreground tracking-tight sm:text-4xl">System Workflow</h2>
            <p className="text-sm text-muted-foreground/80 max-w-md mx-auto font-light leading-relaxed">
              Get comprehensive search index audits and crawls in three operations.
            </p>
          </div>
 
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
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
                <div key={idx} className="relative flex flex-col items-start text-left p-6.5 rounded-xl glow-card space-y-4">
                  <span className="text-[10px] font-mono text-primary font-bold tracking-widest uppercase bg-primary/5 border border-primary/20 px-2 py-0.5 rounded">
                    Step {step.step}
                  </span>
                  <div className="p-3 rounded-lg bg-card-border/40 text-primary border border-card-border/40">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h4 className="text-base font-bold text-foreground tracking-tight">{step.title}</h4>
                  <p className="text-xs text-muted-foreground/80 leading-relaxed font-light">{step.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
 
      {/* 5. FAQ / Q&A SECTION FOR AEO & GEO OPTIMIZATION */}
      <section className="border-t border-card-border/40 py-24 bg-background">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl space-y-16">
          <div className="text-left space-y-3 border-l-3 border-primary pl-5">
            <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              Frequently Asked Questions
            </h2>
            <p className="text-sm text-muted-foreground/80 font-light max-w-xl leading-relaxed">
              Understand how the DevFlow engine, AEO integrations, and CLI diagnostics work under the hood.
            </p>
          </div>
 
          <div className="space-y-6">
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
                className="p-6.5 rounded-xl border border-card-border/50 bg-card/30 hover:border-primary/30 hover:bg-card/50 transition-all duration-300 space-y-2.5 text-left"
              >
                <h3 className="text-sm font-semibold font-mono text-primary flex items-start gap-2 tracking-tight">
                  <span className="text-primary/50 font-bold select-none">Q:</span> {faq.q}
                </h3>
                <p className="text-xs text-muted-foreground/80 leading-relaxed font-light pl-5">
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
