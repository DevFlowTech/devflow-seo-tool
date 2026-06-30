import { 
  Search, 
  FileText, 
  Code, 
  Link, 
  Globe, 
  FileSpreadsheet, 
  ExternalLink, 
  Users, 
  Share2, 
  HelpCircle, 
  Network, 
  Compass, 
  CheckSquare, 
  Cpu 
} from "lucide-react";

export type ToolCategory = "content" | "technical" | "links" | "serp";

export interface ToolMetadata {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: ToolCategory;
  iconName: string;
  color: string; // Tailwind class color base e.g. "blue", "emerald", "purple", "amber"
}

export const CATEGORIES: { key: ToolCategory; name: string }[] = [
  { key: "content", name: "Content & Research" },
  { key: "technical", name: "Technical SEO" },
  { key: "links", name: "Link Analysis" },
  { key: "serp", name: "SERP & Rankings" }
];

export const TOOLS: ToolMetadata[] = [
  {
    id: "keyword-research",
    name: "Keyword Research Tool",
    slug: "keyword-research",
    description: "Generate keyword suggestions with search volume, CPC, difficulty, and trends.",
    category: "content",
    iconName: "Search",
    color: "blue"
  },
  {
    id: "keyword-density",
    name: "Keyword Density Checker",
    slug: "keyword-density",
    description: "Analyze webpage content or raw text to measure keyword frequency, density, and readability.",
    category: "content",
    iconName: "FileText",
    color: "blue"
  },
  {
    id: "top-search-queries",
    name: "Top Search Queries",
    slug: "top-search-queries",
    description: "Find high-traffic search queries and keywords by topic or competitor domain.",
    category: "content",
    iconName: "HelpCircle",
    color: "blue"
  },
  {
    id: "meta-tags",
    name: "Meta Tags Extractor",
    slug: "meta-tags",
    description: "Extract, analyze, and preview meta tags, Open Graph tags, and Twitter Cards from any URL.",
    category: "technical",
    iconName: "Code",
    color: "emerald"
  },
  {
    id: "sitemap-finder",
    name: "Sitemap Finder",
    slug: "sitemap-finder",
    description: "Locate and validate XML sitemaps and view robots.txt files for any website.",
    category: "technical",
    iconName: "Network",
    color: "emerald"
  },
  {
    id: "index-checker",
    name: "Index Checker",
    slug: "index-checker",
    description: "Perform bulk checks to see if URLs are indexed in Google and Bing search engines.",
    category: "technical",
    iconName: "CheckSquare",
    color: "emerald"
  },
  {
    id: "crawlability",
    name: "Crawlability Test",
    slug: "crawlability",
    description: "Test if search engine spiders can access, crawl, and render a webpage.",
    category: "technical",
    iconName: "Cpu",
    color: "emerald"
  },
  {
    id: "link-analysis",
    name: "Link Analyzer",
    slug: "link-analysis",
    description: "Scan a webpage to extract internal, external, and nofollow links, showing HTTP status codes.",
    category: "links",
    iconName: "Link",
    color: "violet"
  },
  {
    id: "domain-authority",
    name: "Domain Authority Checker",
    slug: "domain-authority",
    description: "Calculate authority scores, spam scores, and referring domains for multiple domains.",
    category: "links",
    iconName: "Globe",
    color: "violet"
  },
  {
    id: "page-authority",
    name: "Page Authority Checker",
    slug: "page-authority",
    description: "Verify page-level authority scores, title tags, and meta tag status for URLs.",
    category: "links",
    iconName: "FileSpreadsheet",
    color: "violet"
  },
  {
    id: "backlinks",
    name: "Backlink Checker",
    slug: "backlinks",
    description: "Discover external backlinks pointing to your domain, showing anchor text and link types.",
    category: "links",
    iconName: "ExternalLink",
    color: "violet"
  },
  {
    id: "top-referrers",
    name: "Top Referrers Checker",
    slug: "top-referrers",
    description: "Identify top referral traffic sources and domains backlinking to a site.",
    category: "links",
    iconName: "Share2",
    color: "violet"
  },
  {
    id: "competition-checker",
    name: "Competitor SEO Checker",
    slug: "competition-checker",
    description: "Audit a competitor's website for keywords, backlinks, page speed, and index coverage.",
    category: "serp",
    iconName: "Users",
    color: "amber"
  },
  {
    id: "google-serp",
    name: "Google SERP Checker",
    slug: "google-serp",
    description: "Analyze search rankings for keyword queries in simulated Google Search Results.",
    category: "serp",
    iconName: "Globe",
    color: "amber"
  },
  {
    id: "bing-serp",
    name: "Bing SERP Checker",
    slug: "bing-serp",
    description: "Analyze search rankings for keyword queries in simulated Bing Search Results.",
    category: "serp",
    iconName: "Compass",
    color: "amber"
  },
  {
    id: "redirect-tracer",
    name: "Redirect Chain Tracer",
    slug: "redirect-tracer",
    description: "Trace redirect paths (301/302) to verify final canonical URL statuses.",
    category: "technical",
    iconName: "Link",
    color: "emerald"
  },
  {
    id: "whois-inspector",
    name: "WHOIS & DNS Inspector",
    slug: "whois-inspector",
    description: "Retrieve domain WHOIS registrar info and check DNS server records (NS, MX, TXT, A).",
    category: "technical",
    iconName: "Globe",
    color: "emerald"
  },
  {
    id: "css-scraper",
    name: "CSS Selector Scraper",
    slug: "css-scraper",
    description: "Parse a webpage's HTML structure and extract content using custom CSS selectors.",
    category: "content",
    iconName: "Code",
    color: "blue"
  },
  {
    id: "automatic-audit",
    name: "Automatic SEO Audit",
    slug: "automatic-audit",
    description: "Run a comprehensive automated SEO audit to get actionable improvement suggestions.",
    category: "technical",
    iconName: "CheckSquare",
    color: "emerald"
  }
];

// Helper to resolve icon components dynamically
export const getToolIcon = (iconName: string) => {
  const iconMap: Record<string, any> = {
    Search,
    FileText,
    Code,
    Link,
    Globe,
    FileSpreadsheet,
    ExternalLink,
    Users,
    Share2,
    HelpCircle,
    Network,
    Compass,
    CheckSquare,
    Cpu
  };
  return iconMap[iconName] || Search;
};
