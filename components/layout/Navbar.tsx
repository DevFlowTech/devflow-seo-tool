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
    <header className="sticky top-0 z-50 w-full border-b border-card-border/40 bg-background/70 backdrop-blur-xl transition-all duration-350 shadow-[0_1px_15px_rgba(0,0,0,0.4)]">
      <div className="container mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
        
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2.5 font-sans text-xl tracking-tight group hover:scale-[1.01] transition-transform duration-200">
          <div className="p-1.5 rounded-lg bg-primary/10 text-primary border border-primary/20 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 shadow-[0_0_15px_rgba(163,230,53,0.1)]">
            <Wrench className="h-5 w-5" />
          </div>
          <span className="font-extrabold text-foreground tracking-tight select-none">
            DevFlow <span className="text-accent font-black glowing-text">SEO</span>
            <span className="text-muted-foreground/60 text-xs font-mono font-medium ml-1.5 px-1.5 py-0.5 rounded bg-card-border/30 border border-card-border/50">v1.0</span>
          </span>
        </Link>

        {/* DESKTOP NAV */}
        <nav className="hidden md:flex items-center gap-8">
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
                      "flex items-center gap-1.5 text-xs uppercase font-mono tracking-wider transition-colors hover:text-primary cursor-pointer py-1 relative",
                      isActive ? "text-primary font-bold" : "text-muted-foreground"
                    )}
                  >
                    {link.label}
                    <ChevronDown className={cn("h-3.5 w-3.5 transition-transform duration-300", isMegaMenuOpen && "transform rotate-180")} />
                    {isActive && (
                      <span className="absolute bottom-[-18px] left-0 right-0 h-[2px] bg-primary rounded shadow-[0_0_8px_rgba(163,230,53,0.8)]" />
                    )}
                  </button>
                  {isMegaMenuOpen && (
                    <div className="absolute left-1/2 transform -translate-x-1/2 top-11 w-screen max-w-5xl px-4 animate-fadeIn">
                      <MegaMenu onClose={() => setIsMegaMenuOpen(false)} className="glass-panel" />
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
                  "text-xs uppercase font-mono tracking-wider transition-colors hover:text-primary py-1 relative",
                  isActive ? "text-primary font-bold" : "text-muted-foreground"
                )}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-[-18px] left-0 right-0 h-[2px] bg-primary rounded shadow-[0_0_8px_rgba(163,230,53,0.8)]" />
                )}
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
