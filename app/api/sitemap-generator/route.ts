import { NextResponse } from "next/server";
import axios from "axios";
import * as cheerio from "cheerio";
import { apiCache } from "@/lib/cache";

async function crawlLinks(baseUrl: string, maxPages = 30): Promise<string[]> {
  const visited = new Set<string>();
  const queue: string[] = [baseUrl];
  const urlObj = new URL(baseUrl);
  const hostname = urlObj.hostname;

  while (queue.length > 0 && visited.size < maxPages) {
    const currentUrl = queue.shift();
    if (!currentUrl || visited.has(currentUrl)) continue;

    visited.add(currentUrl);

    try {
      const response = await axios.get(currentUrl, {
        headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" },
        timeout: 4000,
      });

      const $ = cheerio.load(response.data);
      $("a").each((_, el) => {
        const href = $(el).attr("href");
        if (!href) return;

        try {
          let absoluteUrl = href.trim();
          if (absoluteUrl.startsWith("/") || absoluteUrl.startsWith("./") || absoluteUrl.startsWith("../")) {
            absoluteUrl = new URL(absoluteUrl, currentUrl).toString();
          }

          const parsed = new URL(absoluteUrl);
          // Only add links from the same domain
          if (parsed.hostname === hostname && !visited.has(absoluteUrl) && !queue.includes(absoluteUrl)) {
            // Strip hash/query parameters to keep sitemap clean
            parsed.hash = "";
            const clean = parsed.toString();
            if (!visited.has(clean) && !queue.includes(clean)) {
              queue.push(clean);
            }
          }
        } catch {
          // Ignore invalid URLs
        }
      });
    } catch {
      // Ignore crawl errors for single pages
    }
  }

  return Array.from(visited);
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const targetUrl = searchParams.get("url");

  if (!targetUrl) {
    return NextResponse.json({ error: "URL parameter is required." }, { status: 400 });
  }

  let cleanUrl = targetUrl.trim();
  if (!cleanUrl.startsWith("http://") && !cleanUrl.startsWith("https://")) {
    cleanUrl = `https://${cleanUrl}`;
  }

  const cacheKey = `sitemapgen:${cleanUrl}`;
  const cachedData = apiCache.get<{ urls: string[]; xml: string }>(cacheKey);
  if (cachedData) {
    return NextResponse.json(cachedData);
  }

  try {
    const crawledUrls = await crawlLinks(cleanUrl, 30);
    
    // Generate raw XML string
    const xmlEntries = crawledUrls.map(url => `  <url>
    <loc>${url}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${url === cleanUrl ? "1.0" : "0.8"}</priority>
  </url>`).join("\n");

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${xmlEntries}
</urlset>`;

    const data = {
      urls: crawledUrls,
      xml
    };

    apiCache.set(cacheKey, data);

    return NextResponse.json(data);
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message || "Failed to generate sitemap." }, { status: 500 });
  }
}
