"use client";

import React, { useState, useEffect } from "react";

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

export function TerminalTicker() {
  const [stepIndex, setStepIndex] = useState(0);
  const [currentLogs, setCurrentLogs] = useState<string[]>([]);
  const [logIndex, setLogIndex] = useState(0);

  useEffect(() => {
    let logTimer: NodeJS.Timeout;
    let transitionTimer: NodeJS.Timeout;

    const currentStep = consoleSteps[stepIndex];

    if (logIndex < currentStep.logs.length) {
      logTimer = setTimeout(() => {
        setCurrentLogs((prev) => [...prev, currentStep.logs[logIndex]]);
        setLogIndex((prev) => prev + 1);
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
  );
}

export default TerminalTicker;
