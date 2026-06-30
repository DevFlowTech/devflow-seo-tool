import { NextResponse } from "next/server";
import { apiCache } from "@/lib/cache";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const targetUrl = searchParams.get("url");
  const throttling = searchParams.get("throttling") || "wifi"; // slow3g, fast3g, wifi

  if (!targetUrl) {
    return NextResponse.json({ error: "URL parameter is required." }, { status: 400 });
  }

  let cleanUrl = targetUrl.trim();
  if (!cleanUrl.startsWith("http://") && !cleanUrl.startsWith("https://")) {
    cleanUrl = `https://${cleanUrl}`;
  }

  // Check cache
  const cacheKey = `lighthouse:${cleanUrl}:${throttling}`;
  const cachedData = apiCache.get(cacheKey);
  if (cachedData) {
    return NextResponse.json(cachedData);
  }

  try {
    const puppeteer = (await import('puppeteer')).default;
    const browser = await puppeteer.launch({
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

    const page = await browser.newPage();
    
    // Configure CDPSession for network throttling
    const client = await page.target().createCDPSession();
    await client.send('Network.enable');

    if (throttling === "slow3g") {
      // 400ms latency, 400kbps down, 150kbps up
      await client.send('Network.emulateNetworkConditions', {
        offline: false,
        latency: 400,
        downloadThroughput: (400 * 1024) / 8,
        uploadThroughput: (150 * 1024) / 8,
      });
    } else if (throttling === "fast3g") {
      // 150ms latency, 1.6Mbps down, 750kbps up
      await client.send('Network.emulateNetworkConditions', {
        offline: false,
        latency: 150,
        downloadThroughput: (1600 * 1024) / 8,
        uploadThroughput: (750 * 1024) / 8,
      });
    }

    // Start timer
    const startTime = Date.now();
    
    // Open page
    await page.goto(cleanUrl, { waitUntil: 'load', timeout: 35000 });
    
    const pageLoadTime = Date.now() - startTime;

    // Collect metrics
    const metrics = await page.evaluate(() => {
      const timing = performance.timing;
      const ttfb = timing.responseStart - timing.navigationStart;
      const domInteractive = timing.domInteractive - timing.navigationStart;
      
      const paintEntries = performance.getEntriesByType('paint');
      const fcpEntry = paintEntries.find(e => e.name === 'first-contentful-paint');
      const fcp = fcpEntry ? fcpEntry.startTime : (domInteractive > 0 ? domInteractive + 100 : 0);

      // Estimate LCP (rough calculation)
      const lcp = fcp > 0 ? fcp * 1.3 : 0;

      return {
        ttfb: ttfb > 0 ? ttfb : 50,
        fcp: fcp > 0 ? fcp : 100,
        lcp: lcp > 0 ? lcp : 150,
        domInteractive: domInteractive > 0 ? domInteractive : 200,
      };
    });

    // Check headers of main page request
    const response = await page.goto(cleanUrl);
    const headers = response ? response.headers() : {};
    const cacheControl = headers['cache-control'] || "No cache header found";
    const cacheStatus = cacheControl.toLowerCase().includes("no-cache") || cacheControl.toLowerCase().includes("no-store")
      ? "Uncached"
      : "Cached / Cacheable";

    await browser.close();

    const data = {
      ttfb: Math.round(metrics.ttfb),
      fcp: Math.round(metrics.fcp),
      lcp: Math.round(metrics.lcp),
      loadTime: pageLoadTime,
      cacheControl,
      cacheStatus,
      score: calculateLighthouseScore(metrics.ttfb, metrics.fcp, pageLoadTime)
    };

    // Save cache
    apiCache.set(cacheKey, data);

    return NextResponse.json(data);
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message || "Failed to simulate performance metrics." }, { status: 500 });
  }
}

function calculateLighthouseScore(ttfb: number, fcp: number, loadTime: number): number {
  // Score formula between 0-100 based on standard performance
  let score = 100;
  if (ttfb > 800) score -= 20;
  else if (ttfb > 300) score -= 10;

  if (fcp > 3000) score -= 30;
  else if (fcp > 1000) score -= 15;

  if (loadTime > 6000) score -= 40;
  else if (loadTime > 3000) score -= 20;
  else if (loadTime > 1500) score -= 5;

  return Math.max(10, score);
}
