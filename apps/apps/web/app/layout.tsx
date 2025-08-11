import "./globals.css";
import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "DiviFlow",
  description: "Utbytte & skatte-automatisering for norske investorer",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="no">
      <body className="min-h-screen">
        <header className="sticky top-0 z-30 backdrop-blur supports-[backdrop-filter]:bg-slate-950/50 border-b border-white/10">
          <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-indigo-400 to-indigo-600 ring-2 ring-indigo-400/30 shadow-lg" />
              <div>
                <div className="text-xl font-semibold tracking-tight">DiviFlow</div>
                <div className="text-xs text-slate-400">Utbytte & skatte-automatisering</div>
              </div>
              <span className="ml-2 inline-flex items-center rounded-md border border-yellow-400/30 bg-yellow-500/20 px-2 py-0.5 text-xs text-yellow-300">
                Beta
              </span>
            </div>
            <div className="text-xs text-slate-400">Demo – ingen ekte data</div>
          </div>
        </header>

        <main className="mx-auto max-w-6xl px-4 py-8 space-y-8">{children}</main>

        <footer className="py-6 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} DiviFlow — Demo
        </footer>
      </body>
    </html>
  );
}
