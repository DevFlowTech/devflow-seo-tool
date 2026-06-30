"use client";

import React, { useState } from "react";
import { Link2, Sparkles, CheckCircle2, XCircle, AlertTriangle, ListChecks } from "lucide-react";
import toast from "react-hot-toast";
import { ToolLayout } from "@/components/tools/ToolLayout";
import { LoadingSkeleton } from "@/components/tools/LoadingSkeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { cn, isValidUrl } from "@/lib/utils";

const guideSteps = [
  {
    title: "Specify URL for Audit",
    description: "Enter your target webpage URL (e.g. 'https://devflow.co.in/docs') to run the automated SEO audit."
  },
  {
    title: "Run Automatic Scan",
    description: "Click 'Run Auto Audit' to test meta tags, crawlability, and indexing status all at once."
  },
  {
    title: "Implement Suggestions",
    description: "Review the actionable suggestions provided and apply them to improve your website's SEO."
  }
];

export default function AutomaticAuditPage() {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [data, setData] = useState<{
    score: number;
    checks: { title: string; status: "success" | "fail" | "warning"; description: string }[];
    recommendations: string[];
  } | null>(null);

  const handleTest = async (e: React.FormEvent) => {
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
    setHasSearched(true);

    try {
      const res = await fetch(`/api/scrape?mode=auto-audit&url=${encodeURIComponent(url)}`);
      const resData = await res.json();

      if (!res.ok) {
        throw new Error(resData.error || "Failed to scan audit metrics");
      }

      setData(resData);
      toast.success("Automatic SEO audit completed successfully!");
    } catch (err: any) {
      toast.error(err.message || "An error occurred during automatic audit.");
      setData(null);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status: "success" | "fail" | "warning") => {
    switch (status) {
      case "success":
        return <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />;
      case "fail":
        return <XCircle className="h-5 w-5 text-rose-500 shrink-0 mt-0.5" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />;
    }
  };

  const getScoreColor = (score: number) => {
    if (score > 80) return "text-primary";
    if (score > 55) return "text-amber-500";
    return "text-rose-500";
  };

  return (
    <ToolLayout toolId="automatic-audit" guideSteps={guideSteps}>
      {/* Input Form */}
      <Card className="border-card-border/60 bg-card/40 shadow-md">
        <CardContent className="p-6">
          <form onSubmit={handleTest} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            
            {/* URL input */}
            <div className="md:col-span-3 space-y-1.5">
              <label htmlFor="url" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Webpage URL to Test
              </label>
              <div className="relative">
                <Link2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="url"
                  placeholder="https://example.com/target-page"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            {/* Submit */}
            <div className="md:col-span-1 mt-2">
              <Button type="submit" className="w-full flex gap-2 items-center justify-center" isLoading={isLoading}>
                <Sparkles className="h-4 w-4" />
                Run Auto Audit
              </Button>
            </div>

          </form>
        </CardContent>
      </Card>

      {/* Loading */}
      {isLoading && <LoadingSkeleton type="generic" />}

      {/* Results Workspace */}
      {!isLoading && hasSearched && data && (
        <div className="space-y-8 animate-fadeIn">
          
          {/* Header Row: Score & Recommendation list */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Score circle */}
            <Card className="bg-card/30 border-card-border/60 p-6 flex flex-col justify-center items-center text-center gap-4">
              <span className="text-xs font-bold uppercase text-muted-foreground">SEO Health Score</span>
              
              <div className="relative flex items-center justify-center h-28 w-28">
                <svg className="h-full w-full transform -rotate-90">
                  <circle cx="56" cy="56" r="48" fill="transparent" stroke="var(--border)" strokeWidth="8" />
                  <circle
                    cx="56"
                    cy="56"
                    r="48"
                    fill="transparent"
                    stroke={data.score > 80 ? "#a3e635" : data.score > 55 ? "#f59e0b" : "#ef4444"}
                    strokeWidth="8"
                    strokeDasharray={2 * Math.PI * 48}
                    strokeDashoffset={2 * Math.PI * 48 * (1 - data.score / 100)}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className={cn("text-3xl font-black", getScoreColor(data.score))}>{data.score}</span>
                  <span className="text-[10px] text-muted-foreground uppercase font-bold">/ 100</span>
                </div>
              </div>

              <span className={cn("text-xs font-semibold uppercase tracking-wider", getScoreColor(data.score))}>
                {data.score > 80 ? "Excellent" : data.score > 55 ? "Needs Improvement" : "Critical Issues"}
              </span>
            </Card>

            {/* Recommendations checklist */}
            <Card className="bg-card/30 border-card-border/60 p-6 col-span-1 md:col-span-2 space-y-4">
              <h4 className="font-bold text-base text-foreground flex items-center gap-1.5 border-b border-card-border/20 pb-2">
                <ListChecks className="h-4 w-4 text-primary" />
                Actionable Fix Suggestions
              </h4>
              
              <ul className="space-y-3 max-h-48 overflow-y-auto pr-1">
                {data.recommendations.map((rec, i) => (
                  <li key={i} className="flex gap-2 items-start bg-card-border/10 p-2.5 rounded border border-card-border/10 text-xs font-semibold text-foreground">
                    <span className="flex h-4.5 w-4.5 items-center justify-center rounded bg-primary/20 text-primary font-bold shrink-0">{i+1}</span>
                    <span className="leading-relaxed">{rec}</span>
                  </li>
                ))}
              </ul>
            </Card>

          </div>

          {/* Checklist grid list */}
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-foreground">Detailed Audit Checks</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.checks.map((chk, i) => (
                <div key={i} className="flex gap-3 items-start bg-card/10 border border-card-border/60 p-3.5 rounded">
                  {getStatusIcon(chk.status)}
                  <div className="space-y-0.5">
                    <h5 className="text-sm font-bold text-foreground">{chk.title}</h5>
                    <p className="text-xs text-muted-foreground leading-relaxed">{chk.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </ToolLayout>
  );
}
