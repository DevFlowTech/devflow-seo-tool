import { NextResponse } from "next/server";
import axios from "axios";
import * as cheerio from "cheerio";
import { apiCache } from "@/lib/cache";

const STOPWORDS = new Set([
  "the", "a", "an", "and", "or", "but", "if", "then", "else", "when", "at", "by", "for", "with", "about", 
  "against", "between", "into", "through", "during", "before", "after", "above", "below", "to", "from", 
  "up", "down", "in", "out", "on", "off", "over", "under", "again", "further", "then", "once", "here", 
  "there", "all", "any", "both", "each", "few", "more", "most", "other", "some", "such", "no", "nor", 
  "not", "only", "own", "same", "so", "than", "too", "very", "s", "t", "can", "will", "just", "don", 
  "should", "now", "is", "was", "are", "were", "be", "been", "being", "have", "has", "had", "having", 
  "do", "does", "did", "doing", "this", "that", "these", "those", "i", "me", "my", "myself", "we", "our", 
  "ours", "ourselves", "you", "your", "yours", "yourself", "yourselves", "he", "him", "his", "himself", 
  "she", "her", "hers", "herself", "it", "its", "itself", "they", "them", "their", "theirs", "themselves"
]);

function tokenizeAndCount(text: string): Record<string, number> {
  const counts: Record<string, number> = {};
  const words = text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "") // remove punctuation
    .split(/\s+/);

  for (const word of words) {
    if (word.length > 2 && !STOPWORDS.has(word) && !/^\d+$/.test(word)) {
      counts[word] = (counts[word] || 0) + 1;
    }
  }

  // Extract 2-word phrases (bigrams) as well for better keywords
  for (let i = 0; i < words.length - 1; i++) {
    const w1 = words[i];
    const w2 = words[i + 1];
    if (
      w1.length > 2 && w2.length > 2 &&
      !STOPWORDS.has(w1) && !STOPWORDS.has(w2) &&
      !/^\d+$/.test(w1) && !/^\d+$/.test(w2)
    ) {
      const phrase = `${w1} ${w2}`;
      counts[phrase] = (counts[phrase] || 0) + 1;
    }
  }

  return counts;
}

async function fetchPageTextWithBrowser(browser: any, url: string): Promise<string> {
  try {
    const page = await browser.newPage();
    await page.setRequestInterception(true);
    page.on('request', (req: any) => {
      const resourceType = req.resourceType();
      if (['image', 'stylesheet', 'font', 'media'].includes(resourceType)) {
        req.abort();
      } else {
        req.continue();
      }
    });

    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 15000 });
    const text = await page.evaluate(() => {
      const scripts = document.querySelectorAll('script, style, iframe, noscript, header, footer, nav');
      scripts.forEach(s => s.remove());
      return document.body.textContent || "";
    });
    await page.close();
    return text.replace(/\s+/g, " ").trim();
  } catch (err) {
    console.error(`Error scraping ${url}:`, err);
    return "";
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url1 = searchParams.get("url1"); // Target
  const url2 = searchParams.get("url2"); // Competitor

  if (!url1 || !url2) {
    return NextResponse.json({ error: "Both url1 and url2 parameters are required." }, { status: 400 });
  }

  let cleanUrl1 = url1.trim();
  if (!cleanUrl1.startsWith("http://") && !cleanUrl1.startsWith("https://")) {
    cleanUrl1 = `https://${cleanUrl1}`;
  }

  let cleanUrl2 = url2.trim();
  if (!cleanUrl2.startsWith("http://") && !cleanUrl2.startsWith("https://")) {
    cleanUrl2 = `https://${cleanUrl2}`;
  }

  const cacheKey = `keywordgap:${cleanUrl1}:${cleanUrl2}`;
  const cachedData = apiCache.get(cacheKey);
  if (cachedData) {
    return NextResponse.json(cachedData);
  }

  let browser;
  try {
    const puppeteer = (await import('puppeteer')).default;
    browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox', 
        '--disable-setuid-sandbox', 
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--no-zygote',
        '--single-process'
      ]
    });

    const [text1, text2] = await Promise.all([
      fetchPageTextWithBrowser(browser, cleanUrl1),
      fetchPageTextWithBrowser(browser, cleanUrl2)
    ]);

    if (!text1 && !text2) {
      await browser.close();
      return NextResponse.json({ error: "Failed to scrape both target and competitor URLs." }, { status: 500 });
    }

    const counts1 = tokenizeAndCount(text1);
    const counts2 = tokenizeAndCount(text2);

    const allKeywords = Array.from(new Set([...Object.keys(counts1), ...Object.keys(counts2)]));

    const comparisons = allKeywords.map(keyword => {
      const count1 = counts1[keyword] || 0;
      const count2 = counts2[keyword] || 0;
      return {
        keyword,
        url1Count: count1,
        url2Count: count2,
        gap: Math.max(0, count2 - count1)
      };
    });

    // Filter to keywords that competitor has more frequency of, and sort by descending gap
    const gapKeywords = comparisons
      .filter(item => item.url2Count > item.url1Count && item.url2Count >= 2)
      .sort((a, b) => b.gap - a.gap)
      .slice(0, 50); // top 50 keyword gaps

    const competitorTopKeywords = Object.entries(counts2)
      .map(([keyword, count]) => ({ keyword, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 30); // Top 30 keywords competitor is using

    const data = {
      targetUrl: cleanUrl1,
      competitorUrl: cleanUrl2,
      gaps: gapKeywords,
      competitorKeywords: competitorTopKeywords,
      summary: {
        totalUniqueKeywords1: Object.keys(counts1).length,
        totalUniqueKeywords2: Object.keys(counts2).length,
      }
    };

    apiCache.set(cacheKey, data);

    await browser.close();
    return NextResponse.json(data);
  } catch (err: any) {
    if (browser) {
      try { await browser.close(); } catch {}
    }
    console.error(err);
    return NextResponse.json({ error: err.message || "Failed to compare keyword profiles." }, { status: 500 });
  }
}
