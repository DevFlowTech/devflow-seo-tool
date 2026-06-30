"use client";

import React, { useState } from "react";
import { Copy, Check, Sparkles, FileCode } from "lucide-react";
import toast from "react-hot-toast";
import { ToolLayout } from "@/components/tools/ToolLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const guideSteps = [
  {
    title: "Select Schema Type",
    description: "Choose the target schema type such as Article, FAQ, Local Business, or Website."
  },
  {
    title: "Fill in Details",
    description: "Enter your content, URLs, and publisher parameters in the structured form fields."
  },
  {
    title: "Copy JSON-LD Code",
    description: "Validate the JSON syntax and copy the fully compliant code block directly to your site."
  }
];

type SchemaType = "Article" | "FAQPage" | "LocalBusiness" | "WebSite";

export default function SchemaGeneratorPage() {
  const [schemaType, setSchemaType] = useState<SchemaType>("WebSite");
  const [copied, setCopied] = useState(false);

  // Form States
  const [websiteName, setWebsiteName] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [articleTitle, setArticleTitle] = useState("");
  const [articleUrl, setArticleUrl] = useState("");
  const [articleAuthor, setArticleAuthor] = useState("");
  const [faqQuestions, setFaqQuestions] = useState([{ q: "", a: "" }]);
  const [businessName, setBusinessName] = useState("");
  const [businessPhone, setBusinessPhone] = useState("");
  const [businessAddress, setBusinessAddress] = useState("");

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    toast.success("JSON-LD copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const addFaq = () => {
    setFaqQuestions([...faqQuestions, { q: "", a: "" }]);
  };

  const updateFaq = (index: number, field: "q" | "a", value: string) => {
    const updated = [...faqQuestions];
    updated[index][field] = value;
    setFaqQuestions(updated);
  };

  const removeFaq = (index: number) => {
    setFaqQuestions(faqQuestions.filter((_, i) => i !== index));
  };

  const generateSchema = (): string => {
    let schemaObj: any = {
      "@context": "https://schema.org"
    };

    if (schemaType === "WebSite") {
      schemaObj = {
        ...schemaObj,
        "@type": "WebSite",
        "name": websiteName || "My Website",
        "url": websiteUrl || "https://example.com"
      };
    } else if (schemaType === "Article") {
      schemaObj = {
        ...schemaObj,
        "@type": "Article",
        "headline": articleTitle || "Article Title",
        "url": articleUrl || "https://example.com/article",
        "author": {
          "@type": "Person",
          "name": articleAuthor || "Author Name"
        },
        "publisher": {
          "@type": "Organization",
          "name": websiteName || "Publisher Organization",
          "logo": {
            "@type": "ImageObject",
            "url": "https://example.com/logo.png"
          }
        },
        "datePublished": new Date().toISOString().split("T")[0]
      };
    } else if (schemaType === "FAQPage") {
      schemaObj = {
        ...schemaObj,
        "@type": "FAQPage",
        "mainEntity": faqQuestions
          .filter(faq => faq.q.trim() && faq.a.trim())
          .map(faq => ({
            "@type": "Question",
            "name": faq.q,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": faq.a
            }
          }))
      };
    } else if (schemaType === "LocalBusiness") {
      schemaObj = {
        ...schemaObj,
        "@type": "LocalBusiness",
        "name": businessName || "Local Business Name",
        "telephone": businessPhone || "+1-000-000-0000",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": businessAddress || "123 Business Rd",
          "addressLocality": "CityName",
          "addressRegion": "RegionState",
          "postalCode": "000000",
          "addressCountry": "US"
        }
      };
    }

    return JSON.stringify(schemaObj, null, 2);
  };

  const rawJson = generateSchema();

  const handleValidate = () => {
    try {
      JSON.parse(rawJson);
      toast.success("JSON Syntax is 100% Valid!");
    } catch {
      toast.error("Invalid JSON Syntax!");
    }
  };

  return (
    <ToolLayout toolId="schema-generator" guideSteps={guideSteps}>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Form panel */}
        <div className="lg:col-span-6 space-y-6">
          <Card className="border-card-border/60 bg-card/40 backdrop-blur-xl shadow-md">
            <CardContent className="p-6 space-y-6 text-left">
              
              {/* Schema Type Selector */}
              <div className="space-y-2">
                <label className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Select Schema Entity</label>
                <select
                  value={schemaType}
                  onChange={(e) => setSchemaType(e.target.value as SchemaType)}
                  className="w-full bg-[#09090b] border border-card-border focus:outline-none focus:ring-1 focus:ring-primary rounded px-3 py-2.5 text-xs text-foreground font-mono"
                >
                  <option value="WebSite">Website Info (WebSite)</option>
                  <option value="Article">Blog / News Article (Article)</option>
                  <option value="FAQPage">Frequently Asked Questions (FAQPage)</option>
                  <option value="LocalBusiness">Local Store / Company (LocalBusiness)</option>
                </select>
              </div>

              {/* Dynamic Fields */}
              {schemaType === "WebSite" && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Website Name</label>
                    <input
                      type="text"
                      placeholder="e.g. DevFlow SEO Tool"
                      value={websiteName}
                      onChange={(e) => setWebsiteName(e.target.value)}
                      className="w-full bg-[#09090b] border border-card-border focus:outline-none focus:ring-1 focus:ring-primary rounded px-3 py-2 text-xs text-foreground"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Website Target URL</label>
                    <input
                      type="text"
                      placeholder="e.g. https://seo.devflow.co.in"
                      value={websiteUrl}
                      onChange={(e) => setWebsiteUrl(e.target.value)}
                      className="w-full bg-[#09090b] border border-card-border focus:outline-none focus:ring-1 focus:ring-primary rounded px-3 py-2 text-xs text-foreground"
                    />
                  </div>
                </div>
              )}

              {schemaType === "Article" && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Article Headline</label>
                    <input
                      type="text"
                      placeholder="e.g. Top 10 Technical SEO Tips"
                      value={articleTitle}
                      onChange={(e) => setArticleTitle(e.target.value)}
                      className="w-full bg-[#09090b] border border-card-border focus:outline-none focus:ring-1 focus:ring-primary rounded px-3 py-2 text-xs text-foreground"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Article URL</label>
                    <input
                      type="text"
                      placeholder="e.g. https://example.com/blog/seo-tips"
                      value={articleUrl}
                      onChange={(e) => setArticleUrl(e.target.value)}
                      className="w-full bg-[#09090b] border border-card-border focus:outline-none focus:ring-1 focus:ring-primary rounded px-3 py-2 text-xs text-foreground"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Author Name</label>
                    <input
                      type="text"
                      placeholder="e.g. John Doe"
                      value={articleAuthor}
                      onChange={(e) => setArticleAuthor(e.target.value)}
                      className="w-full bg-[#09090b] border border-card-border focus:outline-none focus:ring-1 focus:ring-primary rounded px-3 py-2 text-xs text-foreground"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Publisher Name</label>
                    <input
                      type="text"
                      placeholder="e.g. DevFlow Tech"
                      value={websiteName}
                      onChange={(e) => setWebsiteName(e.target.value)}
                      className="w-full bg-[#09090b] border border-card-border focus:outline-none focus:ring-1 focus:ring-primary rounded px-3 py-2 text-xs text-foreground"
                    />
                  </div>
                </div>
              )}

              {schemaType === "FAQPage" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-card-border pb-2">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Questions List</span>
                    <Button onClick={addFaq} variant="outline" size="sm" className="h-7 text-[9px] font-mono tracking-widest rounded-none">
                      ADD QUESTION
                    </Button>
                  </div>
                  
                  {faqQuestions.map((faq, index) => (
                    <div key={index} className="p-4 border border-card-border bg-[#09090b]/50 space-y-3 relative">
                      <div className="space-y-2">
                        <label className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground/80">Question #{index + 1}</label>
                        <input
                          type="text"
                          placeholder="e.g. What is the return policy?"
                          value={faq.q}
                          onChange={(e) => updateFaq(index, "q", e.target.value)}
                          className="w-full bg-[#09090b] border border-card-border focus:outline-none focus:ring-1 focus:ring-primary rounded px-3 py-2 text-xs text-foreground"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground/80">Accepted Answer</label>
                        <textarea
                          placeholder="e.g. We offer a 30-day return policy."
                          value={faq.a}
                          onChange={(e) => updateFaq(index, "a", e.target.value)}
                          rows={2}
                          className="w-full bg-[#09090b] border border-card-border focus:outline-none focus:ring-1 focus:ring-primary rounded px-3 py-2 text-xs text-foreground font-sans font-light"
                        />
                      </div>
                      {faqQuestions.length > 1 && (
                        <button
                          onClick={() => removeFaq(index)}
                          className="absolute top-2 right-2 text-rose-500 hover:text-rose-400 text-[9px] font-mono uppercase tracking-wider cursor-pointer"
                        >
                          REMOVE
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {schemaType === "LocalBusiness" && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Business Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Ahmed's Coffee Shop"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      className="w-full bg-[#09090b] border border-card-border focus:outline-none focus:ring-1 focus:ring-primary rounded px-3 py-2 text-xs text-foreground"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Contact Phone</label>
                    <input
                      type="text"
                      placeholder="e.g. +91 99999 88888"
                      value={businessPhone}
                      onChange={(e) => setBusinessPhone(e.target.value)}
                      className="w-full bg-[#09090b] border border-card-border focus:outline-none focus:ring-1 focus:ring-primary rounded px-3 py-2 text-xs text-foreground"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Street Address</label>
                    <input
                      type="text"
                      placeholder="e.g. 45 CG Road"
                      value={businessAddress}
                      onChange={(e) => setBusinessAddress(e.target.value)}
                      className="w-full bg-[#09090b] border border-card-border focus:outline-none focus:ring-1 focus:ring-primary rounded px-3 py-2 text-xs text-foreground"
                    />
                  </div>
                </div>
              )}

            </CardContent>
          </Card>
        </div>

        {/* Output code panel */}
        <div className="lg:col-span-6 space-y-6 text-left">
          <Card className="border-card-border/60 bg-card/40 backdrop-blur-xl shadow-md h-full flex flex-col justify-between">
            <div className="p-6 flex-1 flex flex-col space-y-4">
              <div className="flex items-center justify-between border-b border-card-border pb-3">
                <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <FileCode className="h-4 w-4 text-accent" />
                  Generated Schema (JSON-LD)
                </span>
                <div className="flex items-center gap-2">
                  <Button onClick={handleValidate} variant="outline" size="sm" className="h-7 text-[9px] font-mono tracking-widest rounded-none">
                    VALIDATE
                  </Button>
                  <Button onClick={() => handleCopy(`<script type="application/ld+json">\n${rawJson}\n</script>`)} size="sm" className="h-7 text-[9px] font-mono tracking-widest bg-foreground text-background hover:bg-foreground/90 rounded-none">
                    {copied ? <Check className="h-3 w-3 mr-1" /> : <Copy className="h-3 w-3 mr-1" />}
                    {copied ? "COPIED" : "COPY CODE"}
                  </Button>
                </div>
              </div>

              <div className="flex-1 min-h-[300px] relative">
                <pre className="absolute inset-0 bg-[#060608] border border-card-border p-4 overflow-auto rounded font-mono text-[11px] text-[#a3e635] leading-relaxed select-text">
                  {`<script type="application/ld+json">\n${rawJson}\n</script>`}
                </pre>
              </div>
            </div>
          </Card>
        </div>

      </div>
    </ToolLayout>
  );
}
