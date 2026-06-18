# DevFlow SEO Tool

A premium, minimalist developer-first SEO diagnostic suite and API workspace, built in high-contrast matte black and lime green. Features 18 real-time diagnostic tools, a fully featured developer workspace, and a companion NPM CLI.

[![DevFlow SEO Tool](https://img.shields.io/badge/Console-seo.devflow.co.in-a3e635?style=flat-square&logo=nextdotjs&logoColor=white)](https://seo.devflow.co.in)
[![npm version](https://img.shields.io/npm/v/devflow-seo-tool?color=a3e635&style=flat-square)](https://www.npmjs.com/package/devflow-seo-tool)
[![GitHub license](https://img.shields.io/github/license/Prince-Gajjar/devflow-seo-tool?color=a3e635&style=flat-square)](LICENSE)

---

## 🎨 Design Aesthetic
DevFlow SEO Tool is modeled after high-end developer terminals:
*   **Color Palette**: True matte black (`#000000`/`#09090b`) backgrounds paired with bright console lime green (`#a3e635`/`#84cc16`) accents. Zero gradient blooms or distracting SaaS emojis.
*   **Typography**: Monospaced console telemetry using **JetBrains Mono** and headers in clean, modern **Space Grotesk**.
*   **Interactive Physics**: Clickable card transitions, hover active borders, and real-time typing simulations.

---

## ⚡ Quick Start (Local Setup)

1.  **Clone the Repository**:
    ```bash
    git clone https://github.com/Prince-Gajjar/devflow-seo-tool.git
    cd devflow-seo-tool
    ```

2.  **Install Dependencies**:
    ```bash
    npm install
    ```

3.  **Run Development Server**:
    ```bash
    npm run dev
    ```
    Open [http://127.0.0.1:3000](http://127.0.0.1:3000) to view the suite.

4.  **Production Build**:
    ```bash
    npm run build
    ```

---

## 🛠️ The 18 Diagnostic Tools

The suite is divided into 4 core functional modules:

### 1. Content & Research Tools
*   **Keyword Research Tool**: Generate real-time keyword suggestions including monthly search volume, CPC estimation, ranking difficulty, and trend tracking.
*   **Keyword Density Checker**: Scan webpage contents or raw input copy to calculate frequency distributions, single/multi-word keyword weights, and readability scores.
*   **Top Search Queries**: Reverse-engineer organic searches by scraping and mapping top traffic-driving keywords for any competitor domain or topic.
*   **CSS Selector Scraper**: Input any web URL and a target CSS query selector (e.g. `h2.title`) to parse and extract matching nodes, inner HTML, and custom attributes.

### 2. Technical SEO Tools
*   **Meta Tags Extractor**: Audit and extract title tags, meta descriptions, robots indexes, Open Graph, and Twitter Card headers with instant mock visual preview panels.
*   **Sitemap Finder**: Auto-discover and parse XML sitemaps and analyze rules inside the target domain's `robots.txt` for crawler compliance.
*   **Index Checker**: Verify URL indexing status in bulk across Google and Bing crawl index databases.
*   **Crawlability Test**: Run spider checks simulating search engine bots to verify response headers, file-size loads, loading speeds, and rendering access.
*   **Redirect Chain Tracer**: Trace deep redirect loops (301, 302, 307, 308 redirects) hop-by-hop, measuring latency spikes and flagging canonical URL targets.
*   **WHOIS & DNS Inspector**: Resolve live host IP addresses and extract complete DNS records (A, NS, MX, TXT) alongside RDAP registration dates, registrar names, and expiration data.

### 3. Link Analysis Tools
*   **Link Analyzer**: Crawl a webpage to extract all hyperlinks, cataloging internal/external counts, dofollow/nofollow attributes, and individual HTTP status validations.
*   **Domain Authority Checker**: Track off-page authority metrics including domain authority score (DA), spam score percentage, and total referring domains.
*   **Page Authority Checker**: Drill down into specific deep pages to check unique page authority (PA), validation tags, and title tags.
*   **Backlink Checker**: Run diagnostic backlinks reports to evaluate incoming referrers, anchor text density, and links status.
*   **Top Referrers Checker**: Trace and list the top authoritative referrers supplying backlink equity to target domains.

### 4. SERP & Rankings Tools
*   **Competitor SEO Checker**: Audit competitor URL speed, backlink velocity, index metadata, and tags side-by-side to highlight keyword gaps.
*   **Google SERP Checker**: Search simulated rankings for any keyword query in custom regions, fetching organic rank lists.
*   **Bing SERP Checker**: Simulate and analyze search rankings on Bing's organic search engines.

---

## 🚀 Developer Workspace & APIs

### Developer Control Console (`/developer-console`)
A centralized platform enabling developers to build automation workflows:
*   **API Tokens**: Issue free developer keys to access live HTTP scrape API endpoints.
*   **Webhook Integrations**: Configure Slack or Discord webhooks to automatically POST detailed SEO logs whenever an audit finishes.
*   **Browser Audit Log**: Monospaced execution history showing status, domains, timestamps, and active links.

### Live API Logs Terminal Widget
Every tool features an interactive, expandable bottom terminal overlay. When audits run, the widget intercepts `window.fetch` to stream raw HTTP requests, endpoints, response sizes, status codes, and network latency timings in a monospaced debug feed.

### Exports
All diagnostics tables can be instantly downloaded as clean:
1.  **CSV**: Raw comma-separated values.
2.  **Markdown (Glow/MD)**: Formatted GitHub-Flavored Markdown tables ready to copy-paste into Jira, Slack, or GitHub issues.

---

## 💻 Companion NPM CLI (`devflow-seo-tool`)

Integrate DevFlow diagnostics straight into your terminal or CI/CD pipelines.

### Installation
```bash
npm install -g devflow-seo-tool
```
Or run directly using `npx`:
```bash
npx devflow-seo-tool --help
```

### CLI Command Reference
*   **Analyze Domain HTML & Redirection Hops**:
    ```bash
    npx devflow-seo-tool analyze seo.devflow.co.in
    ```
*   **Inspect WHOIS & authoritative DNS Records**:
    ```bash
    npx devflow-seo-tool dns google.com
    ```

### Smart Environment Sensing
The CLI includes automatic environment detection:
1.  It checks if a local development server is running on `http://127.0.0.1:3000`.
2.  If active, it queries the local dev server for quick local testing.
3.  If offline, it automatically falls back to querying the production API on `https://seo.devflow.co.in`.

---

## 🔒 License
Distributed under the MIT License. See `LICENSE` for more information.
