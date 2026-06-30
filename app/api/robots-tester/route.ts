import { NextResponse } from "next/server";
import axios from "axios";
import { apiCache } from "@/lib/cache";

interface RobotsRule {
  type: "allow" | "disallow";
  path: string;
}

function parseRobots(content: string, userAgent = "*"): RobotsRule[] {
  const lines = content.split(/\r?\n/);
  const rules: RobotsRule[] = [];
  let inTargetAgent = false;

  for (const line of lines) {
    const cleanLine = line.replace(/#.*/, "").trim(); // strip comments
    if (!cleanLine) continue;

    const parts = cleanLine.split(":");
    if (parts.length < 2) continue;

    const key = parts[0].trim().toLowerCase();
    const value = parts.slice(1).join(":").trim();

    if (key === "user-agent") {
      const agent = value.toLowerCase();
      // Match specific user-agent or wildcard
      if (agent === userAgent.toLowerCase() || agent === "*") {
        inTargetAgent = true;
      } else {
        inTargetAgent = false;
      }
    }

    if (inTargetAgent) {
      if (key === "disallow") {
        rules.push({ type: "disallow", path: value });
      } else if (key === "allow") {
        rules.push({ type: "allow", path: value });
      }
    }
  }

  return rules;
}

function isPathAllowed(rules: RobotsRule[], testPath: string): { allowed: boolean; matchingRule: string } {
  // If no rules, default is allowed
  if (rules.length === 0) {
    return { allowed: true, matchingRule: "No matching rules found (default Allow)" };
  }

  // Sort rules by path length descending (longest match wins in standard robots.txt specification)
  const sortedRules = [...rules].sort((a, b) => b.path.length - a.path.length);

  for (const rule of sortedRules) {
    // Escape regex symbols except '*'
    const escapedRulePath = rule.path
      .replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')
      .replace(/\\\*/g, '.*');

    const regex = new RegExp(`^${escapedRulePath}`);
    if (regex.test(testPath)) {
      return {
        allowed: rule.type === "allow",
        matchingRule: `${rule.type.toUpperCase()}: ${rule.path}`
      };
    }
  }

  return { allowed: true, matchingRule: "Default Allow (no directives match this path)" };
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { url, path, customRobots, userAgent = "*" } = body;

    if (!url && !customRobots) {
      return NextResponse.json({ error: "Either website url or customRobots text is required." }, { status: 400 });
    }

    let robotsContent = "";
    let cleanUrl = "";

    if (url) {
      cleanUrl = url.trim();
      if (!cleanUrl.startsWith("http://") && !cleanUrl.startsWith("https://")) {
        cleanUrl = `https://${cleanUrl}`;
      }
      
      const parsedUrl = new URL(cleanUrl);
      const robotsUrl = `${parsedUrl.origin}/robots.txt`;

      // Fetch with cache
      const cacheKey = `robotstxt:${robotsUrl}`;
      const cachedData = apiCache.get<string>(cacheKey);
      if (cachedData) {
        robotsContent = cachedData;
      } else {
        try {
          const res = await axios.get(robotsUrl, {
            headers: { "User-Agent": "Mozilla/5.0" },
            timeout: 5000,
          });
          robotsContent = res.data;
          apiCache.set(cacheKey, robotsContent);
        } catch {
          robotsContent = "User-agent: *\nDisallow:"; // fallback if no robots.txt exists
        }
      }
    } else {
      robotsContent = customRobots;
    }

    const rules = parseRobots(robotsContent, userAgent);
    const testPath = path ? path.trim() : "/";
    const result = isPathAllowed(rules, testPath);

    return NextResponse.json({
      allowed: result.allowed,
      matchingRule: result.matchingRule,
      robotsContent,
      rulesCount: rules.length
    });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message || "Failed to validate robots.txt directives." }, { status: 500 });
  }
}
