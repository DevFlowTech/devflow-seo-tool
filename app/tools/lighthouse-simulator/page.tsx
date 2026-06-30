"use client";

import React, { useState } from "react";
import { Play, Sparkles, Cpu, Clock, HardDrive, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";
import { ToolLayout } from "@/components/tools/ToolLayout";
import { LoadingSkeleton } from "@/components/tools/LoadingSkeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { isValidUrl } from "@/lib/utils";

const guideSteps = [
  {
    title: "Specify URL for Simulation",
    description: "Enter the target website URL you wish to run the performance speed test on."
  },
  {
    title: "Select Network Profile",
    description: "Choose Slow 3G, Fast 3G, or standard WiFi throttling to emulate different networks."
  },
  {
    title: "Simulate & Analyze Logs",
    description: "Trigger the audit to extract legitimate TTFB, FCP, and actual Cache-Control header states."
  }
];

export default function LighthouseSimulatorPage() {
  const [url, setUrl] = useState("");
  const [throttling, setThrottling] = useState("wifi");
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<{
    ttfb: number;
    fcp: number;
    lcp: number;
    loadTime: number;
    cacheControl: string;
    cacheStatus: string;
    score: number;
  } | null>(null);

  const handleSimulate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!url.trim()) {
      toast.error("Please enter a URL.");
      return;
    }
    if (!isValidUrl(url)) {
      toast.error("Please enter a valid URL starting with http:// or https://");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch(`/api/lighthouse-simulator?url=${encodeURIComponent(url)}&throttling=${throttling}`);
      const resData = await res.json();

      if (!res.ok) {
        throw new Error(resData.error || "Failed to simulate performance parameters");
      }

      setData(resData);
      toast.success("Performance load simulation completed!");
    } catch (err: any) {
      toast.error(err.message || "An error occurred during simulation.");
      setData(null);
    } finally {
      setIsLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-primary border-primary";
    if (score >= 50) return "text-amber-500 border-amber-500";
    return "text-rose-500 border-rose-500";
  };

  return (
    <ToolLayout toolId="lighthouse-simulator" guideSteps={guideSteps}>
      {/* Form */}
      <Card className="border-card-border/60 bg-card/40 shadow-md mb-8">
        <CardContent className="p-6">
          <form onSubmit={handleSimulate} className="flex flex-col md:flex-row items-center gap-4">
            <div className="flex-1 w-full relative">
              <Input
                type="text"
                placeholder="e.g. https://nextjs.org"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="bg-[#09090b]/85 border-card-border pr-8 text-xs h-10 rounded-none focus-visible:ring-primary"
              />
            </div>
            
            {/* Throttling options */}
            <div className="w-full md:w-auto">
              <select
                value={throttling}
                onChange={(e) => setThrottling(e.target.value)}
                className="w-full bg-[#09090b] border border-card-border focus:outline-none focus:ring-1 focus:ring-primary rounded-none h-10 px-3 text-xs text-foreground font-mono"
              >
                <option value="wifi">No Throttling (WiFi)</option>
                <option value="fast3g">Fast 3G (150ms Latency)</option>
                <option value="slow3g">Slow 3G (400ms Latency)</option>
              </select>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full md:w-auto h-10 px-6 bg-foreground text-background hover:bg-foreground/90 font-mono text-[10px] tracking-wider rounded-none shrink-0"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="h-3 w-3 mr-2 animate-spin" />
                  SIMULATING...
                </>
              ) : (
                <>
                  <Play className="h-3 w-3 mr-2 fill-current" />
                  SIMULATE LOAD AUDIT
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Loading State */}
      {isLoading && <LoadingSkeleton />}

      {/* Results */}
      {data && !isLoading && (
        <div className="space-y-8 animate-fadeIn text-left">
          
          {/* Main overview card */}
          <Card className="border-card-border/60 bg-card/40 backdrop-blur-xl p-6">
            <div className="flex flex-col md:flex-row items-center justify-around gap-8">
              
              {/* Score dial */}
              <div className="flex flex-col items-center gap-2">
                <div className={`w-32 h-32 rounded-full border-4 flex items-center justify-center ${getScoreColor(data.score)}`}>
                  <span className="text-3xl font-mono font-bold">{data.score}</span>
                </div>
                <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Performance Score</span>
              </div>

              {/* Stats overview */}
              <div className="grid grid-cols-2 gap-6 w-full max-w-md">
                <div className="p-4 bg-[#09090b]/50 border border-card-border/50 rounded space-y-1">
                  <span className="font-mono text-[9px] text-muted-foreground flex items-center gap-1.5">
                    <Cpu className="h-3.5 w-3.5" />
                    TIME TO FIRST BYTE
                  </span>
                  <p className="text-xl font-bold font-mono text-foreground">{data.ttfb} ms</p>
                </div>
                <div className="p-4 bg-[#09090b]/50 border border-card-border/50 rounded space-y-1">
                  <span className="font-mono text-[9px] text-muted-foreground flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5" />
                    FIRST CONTENTFUL PAINT
                  </span>
                  <p className="text-xl font-bold font-mono text-foreground">{data.fcp} ms</p>
                </div>
                <div className="p-4 bg-[#09090b]/50 border border-card-border/50 rounded space-y-1">
                  <span className="font-mono text-[9px] text-muted-foreground flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5" />
                    LARGEST CONTENTFUL PAINT
                  </span>
                  <p className="text-xl font-bold font-mono text-foreground">{data.lcp} ms</p>
                </div>
                <div className="p-4 bg-[#09090b]/50 border border-card-border/50 rounded space-y-1">
                  <span className="font-mono text-[9px] text-muted-foreground flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" />
                    FULL PAGE LOAD TIME
                  </span>
                  <p className="text-xl font-bold font-mono text-foreground">{(data.loadTime / 1000).toFixed(2)} s</p>
                </div>
              </div>

            </div>
          </Card>

          {/* Cache details card */}
          <Card className="border-card-border/60 bg-card/40 backdrop-blur-xl p-6 space-y-4">
            <h3 className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <HardDrive className="h-4 w-4 text-accent" />
              Caching Audit Details
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <span className="text-[10px] text-muted-foreground">Cache Status</span>
                <p className={`text-sm font-semibold ${data.cacheStatus === "Uncached" ? "text-rose-400" : "text-[#a3e635]"}`}>
                  {data.cacheStatus}
                </p>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] text-muted-foreground">Cache-Control Header</span>
                <p className="text-xs font-mono bg-[#09090b] border border-card-border p-2.5 overflow-x-auto text-[#a3e635]">
                  {data.cacheControl}
                </p>
              </div>
            </div>
          </Card>

        </div>
      )}
    </ToolLayout>
  );
}
