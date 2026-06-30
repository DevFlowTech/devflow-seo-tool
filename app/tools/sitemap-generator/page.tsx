"use client";

import React, { useState } from "react";
import { Play, Sparkles, Copy, Check, Download, FileCode, List } from "lucide-react";
import toast from "react-hot-toast";
import { ToolLayout } from "@/components/tools/ToolLayout";
import { LoadingSkeleton } from "@/components/tools/LoadingSkeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { isValidUrl } from "@/lib/utils";

const guideSteps = [
  {
    title: "Enter Base URL",
    description: "Provide the root domain or starter link (e.g. 'https://devflow.co.in') to initialize crawling."
  },
  {
    title: "Run Link Crawler",
    description: "The system crawls and maps internal page nodes recursively, up to 30 pages."
  },
  {
    title: "Copy or Download XML",
    description: "Export the fully compliant sitemap.xml file directly for Google Search Console submission."
  }
];

export default function SitemapGeneratorPage() {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [data, setData] = useState<{
    urls: string[];
    xml: string;
  } | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
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
      const res = await fetch(`/api/sitemap-generator?url=${encodeURIComponent(url)}`);
      const resData = await res.json();

      if (!res.ok) {
        throw new Error(resData.error || "Failed to generate sitemap");
      }

      setData(resData);
      toast.success(`Successfully mapped ${resData.urls.length} URLs!`);
    } catch (err: any) {
      toast.error(err.message || "An error occurred during sitemap generation.");
      setData(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (!data) return;
    navigator.clipboard.writeText(data.xml);
    setCopied(true);
    toast.success("Sitemap XML copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!data) return;
    const blob = new Blob([data.xml], { type: "application/xml" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "sitemap.xml";
    link.click();
    toast.success("sitemap.xml downloaded!");
  };

  return (
    <ToolLayout toolId="sitemap-generator" guideSteps={guideSteps}>
      {/* Form */}
      <Card className="border-card-border/60 bg-card/40 shadow-md mb-8">
        <CardContent className="p-6">
          <form onSubmit={handleGenerate} className="flex flex-col md:flex-row items-center gap-4">
            <div className="flex-1 w-full relative">
              <Input
                type="text"
                placeholder="e.g. https://devflow.co.in"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="bg-[#09090b]/85 border-card-border pr-8 text-xs h-10 rounded-none focus-visible:ring-primary"
              />
            </div>
            
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full md:w-auto h-10 px-6 bg-foreground text-background hover:bg-foreground/90 font-mono text-[10px] tracking-wider rounded-none shrink-0"
            >
              {isLoading ? "CRAWLING..." : "GENERATE SITEMAP"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Loading */}
      {isLoading && <LoadingSkeleton />}

      {/* Results */}
      {data && !isLoading && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left animate-fadeIn">
          
          {/* Mapped links list */}
          <div className="lg:col-span-5 space-y-4">
            <Card className="border-card-border/60 bg-card/40 backdrop-blur-xl p-6">
              <h3 className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 border-b border-card-border pb-3 mb-4">
                <List className="h-4 w-4 text-accent" />
                Mapped URLs ({data.urls.length})
              </h3>
              
              <div className="max-h-[350px] overflow-y-auto space-y-2 pr-2">
                {data.urls.map((u, i) => (
                  <div key={i} className="p-2 border border-card-border bg-[#09090b] text-[10px] font-mono text-muted-foreground truncate hover:text-foreground">
                    {i + 1}. {u}
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* XML Output Code panel */}
          <div className="lg:col-span-7 space-y-4">
            <Card className="border-card-border/60 bg-card/40 backdrop-blur-xl p-6 h-full flex flex-col justify-between">
              <div className="flex items-center justify-between border-b border-card-border pb-3 mb-4">
                <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <FileCode className="h-4 w-4 text-accent" />
                  sitemap.xml Output
                </span>
                
                <div className="flex items-center gap-2">
                  <Button onClick={handleCopy} variant="outline" size="sm" className="h-7 text-[9px] font-mono tracking-widest rounded-none">
                    {copied ? <Check className="h-3 w-3 mr-1" /> : <Copy className="h-3 w-3 mr-1" />}
                    COPY
                  </Button>
                  <Button onClick={handleDownload} size="sm" className="h-7 text-[9px] font-mono tracking-widest bg-foreground text-background hover:bg-foreground/90 rounded-none">
                    <Download className="h-3 w-3 mr-1" />
                    DOWNLOAD
                  </Button>
                </div>
              </div>

              <div className="flex-1 min-h-[300px] relative">
                <pre className="absolute inset-0 bg-[#060608] border border-card-border p-4 overflow-auto rounded font-mono text-[11px] text-[#a3e635] leading-relaxed select-text">
                  {data.xml}
                </pre>
              </div>
            </Card>
          </div>

        </div>
      )}
    </ToolLayout>
  );
}
