"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sun, Moon, Menu, X, ChevronDown, Wrench } from "lucide-react";
import { MegaMenu } from "./MegaMenu";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const megaMenuRef = useRef<HTMLDivElement>(null);

  // Handle outside click to close mega menu
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (megaMenuRef.current && !megaMenuRef.current.contains(event.target as Node)) {
        setIsMegaMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/tools", label: "Tools", isTools: true },
    { href: "/about", label: "About" },
    { href: "/developer-console", label: "Console" }
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur-sm transition-colors duration-200">
      <div className="container mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
        
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-3 font-sans text-lg tracking-tight group">
          <span className="font-mono text-xs px-2 py-1 border border-foreground/80 bg-foreground text-background font-bold tracking-widest select-none">
            DF/SEO
          </span>
          <span className="font-light text-foreground select-none">
            DevFlow <span className="font-medium">SEO</span>
          </span>
        </Link>

        {/* DESKTOP NAV */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => {
            const isActive = 
              link.href === "/" 
                ? pathname === "/" 
                : pathname.startsWith(link.href);

            if (link.isTools) {
              return (
                <div key={link.label} className="relative" ref={megaMenuRef}>
                  <button
                    onClick={() => setIsMegaMenuOpen(!isMegaMenuOpen)}
                    className={cn(
                      "flex items-center gap-1 text-[11px] font-mono uppercase tracking-wider transition-colors hover:text-foreground cursor-pointer py-1 relative",
                      isActive ? "text-foreground font-semibold" : "text-muted-foreground"
                    )}
                  >
                    {link.label}
                    <ChevronDown className={cn("h-3 w-3 transition-transform duration-200", isMegaMenuOpen && "transform rotate-180")} />
                  </button>
                  {isMegaMenuOpen && (
                    <div className="absolute left-1/2 transform -translate-x-1/2 top-10 w-screen max-w-5xl px-4 animate-fadeIn">
                      <MegaMenu onClose={() => setIsMegaMenuOpen(false)} className="glass-panel rounded-none border border-border" />
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link
                key={link.label}
                href={link.href}
                className={cn(
                  "text-[11px] font-mono uppercase tracking-wider transition-colors hover:text-foreground py-1 relative",
                  isActive ? "text-foreground font-semibold" : "text-muted-foreground"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* BUTTON ACTIONS */}
        <div className="flex items-center gap-3">
          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded border border-card-border/60 hover:bg-card-border/20 text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
            aria-label="Open menu"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* MOBILE DRAWER */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-card-border/60 bg-background w-full py-4 px-4 space-y-4 animate-slideDown max-h-[calc(100vh-4rem)] overflow-y-auto">
          <div className="flex flex-col space-y-3">
            {navLinks.map((link) => {
              const isActive = 
                link.href === "/" 
                  ? pathname === "/" 
                  : pathname.startsWith(link.href);

              return (
                <div key={link.label} className="w-full">
                  {link.isTools ? (
                    <div className="space-y-2">
                      <Link
                        href="/tools"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={cn(
                          "block text-base font-semibold py-1",
                          isActive ? "text-primary" : "text-foreground"
                        )}
                      >
                        All Tools
                      </Link>
                      <div className="pl-4 border-l border-card-border">
                        <MegaMenu onClose={() => setIsMobileMenuOpen(false)} className="glass-panel p-2 shadow-none border-none grid-cols-1 bg-transparent max-w-full" />
                      </div>
                    </div>
                  ) : (
                    <Link
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={cn(
                        "block text-base font-semibold py-1",
                        isActive ? "text-primary" : "text-foreground"
                      )}
                    >
                      {link.label}
                    </Link>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}
export default Navbar;
