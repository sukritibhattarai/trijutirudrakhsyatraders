"use client";

import Link from "next/link";
import { Menu, Phone, X } from "lucide-react";
import { useState } from "react";
import { BrandLogo } from "@/components/brand-logo";

const nav = [
  ["Products", "/#products"],
  ["About", "/#about"],
  ["How it works", "/#process"],
  ["FAQ", "/#faq"],
  ["Contact", "/#contact"],
];

export function SiteHeader({ phone }: { phone?: string }) {
  const [open, setOpen] = useState(false);
  const phoneHref = phone ? `tel:${phone.replace(/[^+\d]/g, "")}` : undefined;

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur">
      <div className="container-shell flex h-[76px] items-center justify-between">
        <Link href="/" className="focus-ring flex items-center gap-3 rounded-lg" aria-label="Trijuti Rudrakshya Traders home">
          <BrandLogo height={44} priority />
          <span className="leading-tight">
            <strong className="block text-sm font-extrabold tracking-tight text-[#0c2442] sm:text-[15px]">Trijuti Rudrakshya</strong>
            <span className="block text-[10px] font-bold uppercase tracking-[.18em] text-slate-500">Traders Pvt. Ltd.</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex" aria-label="Primary navigation">
          {nav.map(([label, href]) => <a key={href} href={href} className="focus-ring rounded text-sm font-semibold text-slate-600 transition hover:text-[#0c2442]">{label}</a>)}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          {phoneHref ? (
            <a href={phoneHref} className="focus-ring flex items-center gap-2 rounded-lg px-2 py-2 text-sm font-bold text-[#0c2442]"><Phone size={17} />Call now</a>
          ) : null}
          <a href="/#quote-builder" className="btn-primary focus-ring !min-h-11 !px-4 text-sm">Get quotation</a>
        </div>

        <button className="focus-ring grid h-11 w-11 place-items-center rounded-lg border border-slate-200 lg:hidden" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-label="Toggle navigation">
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {open ? (
        <div className="border-t border-slate-200 bg-white px-4 py-5 lg:hidden">
          <nav className="mx-auto flex max-w-lg flex-col gap-2">
            {nav.map(([label, href]) => <a key={href} href={href} onClick={() => setOpen(false)} className="rounded-lg px-4 py-3 font-semibold text-slate-700 hover:bg-slate-50">{label}</a>)}
            <a href="/#quote-builder" onClick={() => setOpen(false)} className="btn-primary mt-2">Get a free quotation</a>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
