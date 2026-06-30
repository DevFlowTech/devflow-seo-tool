"use client";

import React, { useState } from "react";
import { Copy, Check, CheckCircle2, XCircle, FileCode, Play, Plus, Trash } from "lucide-react";
import toast from "react-hot-toast";
import { ToolLayout } from "@/components/tools/ToolLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const guideSteps = [
  {
    title: "Build or Test Robots",
    description: "Generate a new robots.txt file or switch to the Tester tab to validate existing crawl rules."
  },
  {
    title: "Add Disallow/Allow Rules",
    description: "Configure user-agent blocks and define paths to permit or restrict search spider access."
  },
  {
    title: "Run Crawler Validation",
    description: "Submit a specific path to test if it's currently Allowed or Disallowed by your file directives."
  }
];

export default function RobotsGeneratorPage() {
  const [activeTab, setActiveTab] = useState<"builder" | "tester">("builder");
  const [copied, setCopied] = useState(false);

  // Builder state
  const [rules, setRules] = useState<{ agent: string; type: "disallow" | "allow"; path: string }[]>([
    { agent: "*", type: "disallow", path: "/admin" },
    { agent: "*", type: "allow", path: "/" }
  ]);
  const [sitemapUrl, setSitemapUrl] = useState("");

  // Tester state
  const [testUrl, setTestUrl] = useState("");
  const [testPath, setTestPath] = useState("/");
  const [testAgent, setTestAgent] = useState("*");
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{
    allowed: boolean;
    matchingRule: string;
    robotsContent: string;
  } | null>(null);

  const addRule = () => {
    setRules([...rules, { agent: "*", type: "disallow", path: "" }]);
  };

  const updateRule = (index: number, field: "agent" | "type" | "path", value: string) => {
    const updated = [...rules];
    if (field === "type") {
      updated[index][field] = value as "disallow" | "allow";
    } else {
      updated[index][field] = value;
    }
    setRules(updated);
  };

  const deleteRule = (index: number) => {
    setRules(rules.filter((_, i) => i !== index));
  };

  const generateRobotsText = (): string => {
    // Group rules by agent
    const groups: Record<string, string[]> = {};
    for (const rule of rules) {
      if (!rule.path.trim()) continue;
      const agent = rule.agent.trim() || "*";
      if (!groups[agent]) groups[agent] = [];
      groups[agent].push(`${rule.type === "disallow" ? "Disallow" : "Allow"}: ${rule.path.trim()}`);
    }

    let output = "";
    for (const [agent, directives] of Object.entries(groups)) {
      output += `User-agent: ${agent}\n${directives.join("\n")}\n\n`;
    }

    if (sitemapUrl.trim()) {
      output += `Sitemap: ${sitemapUrl.trim()}\n`;
    }

    return output.trim() || "User-agent: *\nDisallow:";
  };

  const robotsText = generateRobotsText();

  const handleCopy = () => {
    navigator.clipboard.writeText(robotsText);
    setCopied(true);
    toast.success("Robots.txt copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTest = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsTesting(true);

    try {
      const res = await fetch("/api/robots-tester", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: testUrl || undefined,
          path: testPath,
          userAgent: testAgent,
          customRobots: !testUrl ? robotsText : undefined
        })
      });

      const resData = await res.json();
      if (!res.ok) throw new Error(resData.error || "Failed to test robots file");

      setTestResult(resData);
    } catch (err: any) {
      toast.error(err.message || "An error occurred during test.");
      setTestResult(null);
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <ToolLayout toolId="robots-generator" guideSteps={guideSteps}>
      
      {/* Tabs */}
      <div className="flex border-b border-border mb-8">
        <button
          onClick={() => setActiveTab("builder")}
          className={`px-6 py-3 text-[10px] font-mono tracking-widest uppercase border-b-2 -mb-px transition-colors cursor-pointer ${
            activeTab === "builder" ? "border-accent text-accent font-bold" : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          ROBOTS.TXT BUILDER
        </button>
        <button
          onClick={() => setActiveTab("tester")}
          className={`px-6 py-3 text-[10px] font-mono tracking-widest uppercase border-b-2 -mb-px transition-colors cursor-pointer ${
            activeTab === "tester" ? "border-accent text-accent font-bold" : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          ROBOTS.TXT TESTER
        </button>
      </div>

      {activeTab === "builder" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left animate-fadeIn">
          {/* Rules Builder */}
          <div className="lg:col-span-6 space-y-6">
            <Card className="border-card-border/60 bg-card/40 backdrop-blur-xl p-6 space-y-6">
              
              <div className="flex items-center justify-between border-b border-card-border pb-3">
                <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Directives List</span>
                <Button onClick={addRule} variant="outline" size="sm" className="h-7 text-[9px] font-mono tracking-widest rounded-none">
                  <Plus className="h-3 w-3 mr-1" />
                  ADD RULE
                </Button>
              </div>

              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                {rules.map((rule, index) => (
                  <div key={index} className="flex flex-col md:flex-row items-center gap-3 p-3 border border-card-border bg-[#09090b]/50 relative">
                    <div className="w-full md:w-1/4">
                      <label className="font-mono text-[8px] text-muted-foreground uppercase">Agent</label>
                      <input
                        type="text"
                        value={rule.agent}
                        onChange={(e) => updateRule(index, "agent", e.target.value)}
                        className="w-full bg-[#09090b] border border-card-border focus:outline-none focus:ring-1 focus:ring-primary rounded px-2 py-1 text-xs text-foreground font-mono"
                      />
                    </div>
                    <div className="w-full md:w-1/4">
                      <label className="font-mono text-[8px] text-muted-foreground uppercase">Action</label>
                      <select
                        value={rule.type}
                        onChange={(e) => updateRule(index, "type", e.target.value)}
                        className="w-full bg-[#09090b] border border-card-border focus:outline-none focus:ring-1 focus:ring-primary rounded px-2 py-1 text-xs text-foreground font-mono"
                      >
                        <option value="disallow">Disallow</option>
                        <option value="allow">Allow</option>
                      </select>
                    </div>
                    <div className="w-full md:w-2/4">
                      <label className="font-mono text-[8px] text-muted-foreground uppercase">Path</label>
                      <input
                        type="text"
                        placeholder="e.g. /private-folder/"
                        value={rule.path}
                        onChange={(e) => updateRule(index, "path", e.target.value)}
                        className="w-full bg-[#09090b] border border-card-border focus:outline-none focus:ring-1 focus:ring-primary rounded px-2 py-1 text-xs text-foreground"
                      />
                    </div>
                    <button
                      onClick={() => deleteRule(index)}
                      className="text-rose-500 hover:text-rose-400 p-1 self-end cursor-pointer"
                      title="Delete Rule"
                    >
                      <Trash className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Sitemap URL */}
              <div className="space-y-2 border-t border-card-border pt-4">
                <label className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Sitemap URL (Optional)</label>
                <Input
                  type="text"
                  placeholder="e.g. https://devflow.co.in/sitemap.xml"
                  value={sitemapUrl}
                  onChange={(e) => setSitemapUrl(e.target.value)}
                  className="bg-[#09090b]/85 border-card-border text-xs"
                />
              </div>

            </Card>
          </div>

          {/* Generated code panel */}
          <div className="lg:col-span-6 space-y-6">
            <Card className="border-card-border/60 bg-card/40 backdrop-blur-xl p-6 h-full flex flex-col justify-between">
              <div className="flex items-center justify-between border-b border-card-border pb-3 mb-4">
                <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <FileCode className="h-4 w-4 text-accent" />
                  Generated robots.txt
                </span>
                
                <Button onClick={handleCopy} size="sm" className="h-7 text-[9px] font-mono tracking-widest bg-foreground text-background hover:bg-foreground/90 rounded-none">
                  {copied ? <Check className="h-3 w-3 mr-1" /> : <Copy className="h-3 w-3 mr-1" />}
                  COPY ROBOTS
                </Button>
              </div>

              <div className="flex-1 min-h-[300px] relative">
                <pre className="absolute inset-0 bg-[#060608] border border-card-border p-4 overflow-auto rounded font-mono text-[11px] text-[#a3e635] leading-relaxed select-text">
                  {robotsText}
                </pre>
              </div>
            </Card>
          </div>
        </div>
      )}

      {activeTab === "tester" && (
        <div className="space-y-8 text-left animate-fadeIn">
          {/* Test Form */}
          <Card className="border-card-border/60 bg-card/40 backdrop-blur-xl p-6">
            <form onSubmit={handleTest} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <div className="space-y-2">
                <label className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Website (Optional)</label>
                <Input
                  type="text"
                  placeholder="Leave empty to test custom robots.txt"
                  value={testUrl}
                  onChange={(e) => setTestUrl(e.target.value)}
                  className="bg-[#09090b]/85 border-card-border text-xs"
                />
              </div>
              <div className="space-y-2">
                <label className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Path to Test</label>
                <Input
                  type="text"
                  placeholder="e.g. /admin"
                  value={testPath}
                  onChange={(e) => setTestPath(e.target.value)}
                  className="bg-[#09090b]/85 border-card-border text-xs"
                />
              </div>
              <div className="space-y-2">
                <label className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">User-Agent</label>
                <select
                  value={testAgent}
                  onChange={(e) => setTestAgent(e.target.value)}
                  className="w-full bg-[#09090b] border border-card-border focus:outline-none focus:ring-1 focus:ring-primary rounded h-10 px-3 text-xs text-foreground font-mono"
                >
                  <option value="*">All Spiders (*)</option>
                  <option value="Googlebot">Googlebot</option>
                  <option value="Bingbot">Bingbot</option>
                </select>
              </div>
              <Button
                type="submit"
                disabled={isTesting}
                className="h-10 bg-foreground text-background hover:bg-foreground/90 font-mono text-[10px] tracking-wider rounded-none"
              >
                {isTesting ? "VALIDATING..." : "RUN VALIDATION"}
              </Button>
            </form>
          </Card>

          {/* Test results */}
          {testResult && (
            <Card className="border-card-border/60 bg-card/40 backdrop-blur-xl p-6 space-y-6">
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  {testResult.allowed ? (
                    <CheckCircle2 className="h-8 w-8 text-[#a3e635]" />
                  ) : (
                    <XCircle className="h-8 w-8 text-rose-500" />
                  )}
                  <div>
                    <h4 className="font-bold text-sm text-foreground">
                      Status: {testResult.allowed ? "ALLOWED" : "DISALLOWED"}
                    </h4>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Matched directive rule: <span className="font-mono text-accent">{testResult.matchingRule}</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Robots content view */}
              <div className="space-y-2">
                <h5 className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground">Robots.txt Content Checked</h5>
                <pre className="bg-[#060608] border border-card-border p-4 max-h-[250px] overflow-auto rounded font-mono text-[11px] text-muted-foreground select-text">
                  {testResult.robotsContent}
                </pre>
              </div>

            </Card>
          )}

        </div>
      )}

    </ToolLayout>
  );
}
