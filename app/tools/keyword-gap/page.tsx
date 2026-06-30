"use client";

import React, { useState } from "react";
import { Play, Sparkles, RefreshCw, BarChart3, TrendingUp } from "lucide-react";
import toast from "react-hot-toast";
import { ToolLayout } from "@/components/tools/ToolLayout";
import { LoadingSkeleton } from "@/components/tools/LoadingSkeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { isValidUrl } from "@/lib/utils";

const guideSteps = [
  {
    title: "Define Target & Competitor",
    description: "Enter your target URL (Site 1) and your competitor's URL (Site 2) in the inputs."
  },
  {
    title: "Extract Keyword Matrices",
    description: "The crawler extracts the text content and processes the n-grams (1-2 word keywords) on both sites."
  },
  {
    title: "Analyze Keyword Gaps",
    description: "Review keywords that the competitor uses frequently but are missing on your website."
  }
];

export default function KeywordGapPage() {
  const [url1, setUrl1] = useState("");
  const [url2, setUrl2] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<{
    targetUrl: string;
    competitorUrl: string;
    gaps: { keyword: string; url1Count: number; url2Count: number; gap: number }[];
    competitorKeywords?: { keyword: string; count: number }[];
    summary: {
      totalUniqueKeywords1: number;
      totalUniqueKeywords2: number;
    };
  } | null>(null);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!url1.trim() || !url2.trim()) {
      toast.error("Please fill in both URL fields.");
      return;
    }
    if (!isValidUrl(url1) || !isValidUrl(url2)) {
      toast.error("Please enter valid URLs starting with http:// or https://");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch(`/api/keyword-gap?url1=${encodeURIComponent(url1)}&url2=${encodeURIComponent(url2)}`);
      const resData = await res.json();

      if (!res.ok) {
        throw new Error(resData.error || "Failed to compare keyword profiles");
      }

      setData(resData);
      toast.success("Keyword gap analysis completed!");
    } catch (err: any) {
      toast.error(err.message || "An error occurred during comparison.");
      setData(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ToolLayout toolId="keyword-gap" guideSteps={guideSteps}>
      {/* Form */}
      <Card className="border-card-border/60 bg-card/40 shadow-md mb-8">
        <CardContent className="p-6">
          <form onSubmit={handleAnalyze} className="flex flex-col md:flex-row items-center gap-4">
            <div className="w-full relative">
              <label className="font-mono text-[9px] text-muted-foreground uppercase absolute left-3 top-1 select-none">Target URL (Your Site)</label>
              <Input
                type="text"
                placeholder="e.g. https://devflow.co.in"
                value={url1}
                onChange={(e) => setUrl1(e.target.value)}
                className="bg-[#09090b]/85 border-card-border pr-8 text-xs h-12 pt-5 rounded-none focus-visible:ring-primary"
              />
            </div>
            
            <div className="w-full relative">
              <label className="font-mono text-[9px] text-muted-foreground uppercase absolute left-3 top-1 select-none">Competitor URL</label>
              <Input
                type="text"
                placeholder="e.g. https://ahrefs.com"
                value={url2}
                onChange={(e) => setUrl2(e.target.value)}
                className="bg-[#09090b]/85 border-card-border pr-8 text-xs h-12 pt-5 rounded-none focus-visible:ring-primary"
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full md:w-auto h-12 px-6 bg-foreground text-background hover:bg-foreground/90 font-mono text-[10px] tracking-wider rounded-none shrink-0"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="h-3 w-3 mr-2 animate-spin" />
                  ANALYZING...
                </>
              ) : (
                <>
                  <Play className="h-3 w-3 mr-2 fill-current" />
                  ANALYZE GAP
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Loading */}
      {isLoading && <LoadingSkeleton />}

      {/* Results */}
      {data && !isLoading && (
        <div className="space-y-8 animate-fadeIn text-left">
          
          {/* Overview summary */}
          <Card className="border-card-border/60 bg-card/40 backdrop-blur-xl p-6">
            <div className="flex flex-col md:flex-row items-center justify-around gap-6">
              <div className="text-center space-y-1">
                <span className="font-mono text-[9px] text-muted-foreground uppercase flex items-center justify-center gap-1.5">
                  <TrendingUp className="h-3.5 w-3.5" />
                  Target Unique Keywords
                </span>
                <p className="text-2xl font-bold font-mono text-[#a3e635]">{data.summary.totalUniqueKeywords1}</p>
              </div>
              <div className="text-center space-y-1">
                <span className="font-mono text-[9px] text-muted-foreground uppercase flex items-center justify-center gap-1.5">
                  <TrendingUp className="h-3.5 w-3.5 animate-pulse" />
                  Competitor Unique Keywords
                </span>
                <p className="text-2xl font-bold font-mono text-amber-500">{data.summary.totalUniqueKeywords2}</p>
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Keyword Gaps Table */}
            <Card className="border-card-border/60 bg-card/40 backdrop-blur-xl p-6 space-y-4">
              <h3 className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <BarChart3 className="h-4 w-4 text-accent" />
                Keyword Differences Matrix (Competitor vs Target)
              </h3>

              <div className="overflow-x-auto border border-card-border rounded">
                <table className="w-full text-xs font-light select-text">
                  <thead className="bg-[#09090b] font-mono text-[9px] uppercase tracking-wider text-muted-foreground border-b border-card-border">
                    <tr>
                      <th className="p-3 text-left">#</th>
                      <th className="p-3 text-left">Keyword / Phrase</th>
                      <th className="p-3 text-right">Target</th>
                      <th className="p-3 text-right">Comp</th>
                      <th className="p-3 text-right">Gap</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-card-border/50">
                    {data.gaps.length > 0 ? (
                      data.gaps.map((item, idx) => (
                        <tr key={idx} className="hover:bg-white/5 transition-colors">
                          <td className="p-3 text-muted-foreground font-mono">{idx + 1}</td>
                          <td className="p-3 font-semibold text-foreground truncate max-w-[120px]" title={item.keyword}>{item.keyword}</td>
                          <td className="p-3 text-right text-rose-400 font-mono">{item.url1Count}</td>
                          <td className="p-3 text-right text-[#a3e635] font-mono">{item.url2Count}</td>
                          <td className="p-3 text-right text-amber-400 font-mono font-bold">+{item.gap}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="p-6 text-center text-muted-foreground">
                          No keyword gaps identified. Both websites have similar keyword densities!
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Card>

            {/* Competitor's Top Keywords Table */}
            <Card className="border-card-border/60 bg-card/40 backdrop-blur-xl p-6 space-y-4">
              <h3 className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <BarChart3 className="h-4 w-4 text-accent" />
                Competitor's Top Keywords (By Frequency)
              </h3>

              <div className="overflow-x-auto border border-card-border rounded">
                <table className="w-full text-xs font-light select-text">
                  <thead className="bg-[#09090b] font-mono text-[9px] uppercase tracking-wider text-muted-foreground border-b border-card-border">
                    <tr>
                      <th className="p-3 text-left">#</th>
                      <th className="p-3 text-left">Keyword / Phrase</th>
                      <th className="p-3 text-right">Frequency</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-card-border/50">
                    {data.competitorKeywords && data.competitorKeywords.length > 0 ? (
                      data.competitorKeywords.map((item, idx) => (
                        <tr key={idx} className="hover:bg-white/5 transition-colors">
                          <td className="p-3 text-muted-foreground font-mono">{idx + 1}</td>
                          <td className="p-3 font-semibold text-foreground truncate max-w-[150px]" title={item.keyword}>{item.keyword}</td>
                          <td className="p-3 text-right text-[#a3e635] font-mono font-bold">{item.count}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={3} className="p-6 text-center text-muted-foreground">
                          No competitor keywords parsed.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>

        </div>
      )}

    </ToolLayout>
  );
}
