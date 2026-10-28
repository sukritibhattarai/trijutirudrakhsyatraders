"use client";

import type { CSSProperties } from "react";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  BadgeCheck,
  Boxes,
  Check,
  ChevronRight,
  ClipboardCheck,
  Headphones,
  MapPin,
  Minus,
  PackageCheck,
  Phone,
  Plus,
  ShieldCheck,
  Truck,
} from "lucide-react";
import type { Product } from "@/lib/products";
import { products } from "@/lib/products";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export function ProductLandingPage({
  product,
  phone,
  whatsapp,
  email,
}: {
  product: Product;
  phone?: string;
  whatsapp?: string;
  email?: string;
}) {
  const router = useRouter();
  const [variant, setVariant] = useState(product.variants[0]);
  const [quantity, setQuantity] = useState(1);
  const [unit, setUnit] = useState(product.defaultUnit);
  const accentStyle = { "--product-accent": product.accent } as CSSProperties;
  const relatedProducts = products.filter((item) => item.id !== product.id && item.category === product.category);
  const otherProducts = [
    ...relatedProducts,
    ...products.filter((item) => item.id !== product.id && item.category !== product.category),
  ].slice(0, 3);
  const whatsappHref = whatsapp ? `https://wa.me/${whatsapp.replace(/\D/g, "")}` : undefined;
  const phoneHref = phone ? `tel:${phone.replace(/[^+\d]/g, "")}` : undefined;

  function requestQuote() {
    const items = [{
      productId: product.id,
      productName: product.name,
      variant,
      quantity,
      unit,
    }];
    router.push(`/checkout?${new URLSearchParams({ items: JSON.stringify(items) }).toString()}`);
  }

  return (
    <div style={accentStyle}>
      <SiteHeader phone={phone} />
      <main id="main-content">
        <div className="border-b border-slate-200 bg-white">
          <div className="container-shell flex min-h-12 items-center gap-2 overflow-x-auto text-xs font-semibold text-slate-500">
            <Link href="/" className="whitespace-nowrap hover:text-[#0c2442]">Home</Link><ChevronRight size={13} /><Link href="/#products" className="whitespace-nowrap hover:text-[#0c2442]">Products</Link><ChevronRight size={13} /><span className="whitespace-nowrap text-[#0c2442]">{product.name}</span>
          </div>
        </div>

        <section className="relative overflow-hidden bg-[#07182d] text-white">
          <div className="grid-texture absolute inset-0 opacity-50" />
          <div className="absolute right-0 top-0 h-full w-1/2 opacity-20" style={{ background: `radial-gradient(circle at 70% 40%, ${product.accent}, transparent 66%)` }} />
          <div className="container-shell relative grid min-h-[650px] items-center gap-12 py-14 lg:grid-cols-[.95fr_1.05fr] lg:py-20">
            <div>
              <span className="eyebrow !text-[#f8bd52]">{product.category} quotation</span>
              <h1 className="mt-6 text-[clamp(3rem,6.5vw,5.5rem)] font-black leading-[.94] tracking-[-.055em]">{product.name}</h1>
              <p className="mt-6 max-w-xl text-xl font-semibold leading-8 text-white">{product.tagline}</p>
              <p className="mt-4 max-w-xl leading-7 text-slate-300">Prices change with type, quantity, availability and delivery location. Submit your requirement to receive the latest verified quotation.</p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row"><a href="#request-price" className="btn-primary focus-ring">Request latest price <ArrowRight size={18} /></a>{whatsappHref ? <a href={whatsappHref} target="_blank" rel="noreferrer" className="btn-light focus-ring">WhatsApp us</a> : null}</div>
              <div className="mt-8 flex flex-wrap gap-4 text-sm text-slate-300"><span className="flex items-center gap-2"><Check size={16} className="text-[#f59e0b]" />No invented pricing</span><span className="flex items-center gap-2"><Check size={16} className="text-[#f59e0b]" />Stock confirmation</span><span className="flex items-center gap-2"><Check size={16} className="text-[#f59e0b]" />Delivery planning</span></div>
            </div>
            <div className="relative">
              <div className="absolute -inset-4 rotate-2 rounded-[2rem] border border-white/10 bg-white/5" />
              <div className="relative aspect-square overflow-hidden rounded-[1.8rem] border border-white/15 bg-white shadow-2xl">
                <Image src={product.image} alt={product.imageAlt} fill priority sizes="(max-width: 1024px) 100vw, 50vw" className={product.imageFit === "contain" ? "object-contain p-7" : "object-cover"} />
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-slate-200 bg-white">
          <div className="container-shell grid py-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              [BadgeCheck, "Latest-price request", "Confirmed by our team"],
              [Boxes, "Flexible quantity", product.units.join(" / ")],
              [MapPin, "Delivery planning", "Based on exact location"],
              [Headphones, "Sales support", "Direct human follow-up"],
            ].map(([Icon, title, copy], index) => { const IconComponent = Icon as typeof BadgeCheck; return <div key={title as string} className={`flex items-center gap-3 border-slate-200 px-4 py-4 ${index ? "lg:border-l" : ""}`}><IconComponent size={21} style={{ color: product.accent }} /><div><strong className="block text-sm">{title as string}</strong><span className="text-xs text-slate-500">{copy as string}</span></div></div>; })}
          </div>
        </section>

        <section id="request-price" className="bg-[#f7f9fb] py-24">
          <div className="container-shell grid gap-12 lg:grid-cols-[.9fr_1.1fr] lg:items-start">
            <div className="lg:sticky lg:top-28">
              <span className="eyebrow">Configure your request</span>
              <h2 className="section-title mt-4">Tell us exactly what you need.</h2>
              <p className="section-copy mt-5">Choose a specification and approximate quantity. Your final price and delivery charge are confirmed only after the sales team reviews the inquiry.</p>
              <div className="mt-8 space-y-3">{product.inquiryTips.map((tip, index) => <div key={tip} className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4"><span className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-xs font-black text-white" style={{ background: product.accent }}>{index + 1}</span><span className="text-sm font-bold text-[#263b57]">{tip}</span></div>)}</div>
            </div>

            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_22px_60px_rgba(12,36,66,.1)]">
              <div className="border-b border-slate-200 p-6 sm:p-8"><div className="flex items-center gap-4"><div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-slate-100"><Image src={product.image} alt="" fill sizes="80px" className={product.imageFit === "contain" ? "object-contain p-2" : "object-cover"} /></div><div><span className="text-[10px] font-black uppercase tracking-[.14em]" style={{ color: product.accent }}>{product.category}</span><h3 className="mt-1 text-2xl font-black text-[#0c2442]">{product.name}</h3><p className="mt-1 text-sm font-bold text-[#dc7d04]">Request latest price</p></div></div></div>
              <div className="space-y-6 p-6 sm:p-8">
                <label className="block"><span className="mb-2 block text-sm font-extrabold text-[#263b57]">Type / grade / size</span><select value={variant} onChange={(event) => setVariant(event.target.value)} className="h-12 w-full rounded-xl border border-slate-300 bg-white px-4 font-semibold outline-none focus:border-[#dc7d04] focus:ring-4 focus:ring-orange-100">{product.variants.map((option) => <option key={option}>{option}</option>)}</select></label>
                <div className="grid gap-5 sm:grid-cols-2">
                  <label><span className="mb-2 block text-sm font-extrabold text-[#263b57]">Quantity</span><div className="flex h-12 rounded-xl border border-slate-300"><button type="button" onClick={() => setQuantity((value) => Math.max(1, value - 1))} className="grid w-12 place-items-center" aria-label="Decrease quantity"><Minus size={16} /></button><input aria-label="Quantity" type="number" min="1" value={quantity} onChange={(event) => setQuantity(Math.max(1, Number(event.target.value) || 1))} className="min-w-0 flex-1 border-x border-slate-200 text-center font-extrabold outline-none" /><button type="button" onClick={() => setQuantity((value) => value + 1)} className="grid w-12 place-items-center" aria-label="Increase quantity"><Plus size={16} /></button></div></label>
                  <label><span className="mb-2 block text-sm font-extrabold text-[#263b57]">Unit</span><select value={unit} onChange={(event) => setUnit(event.target.value)} className="h-12 w-full rounded-xl border border-slate-300 bg-white px-4 font-semibold outline-none focus:border-[#dc7d04] focus:ring-4 focus:ring-orange-100">{product.units.map((option) => <option key={option}>{option}</option>)}</select></label>
                </div>
                <div className="rounded-2xl bg-[#fff7e8] p-5"><div className="flex justify-between gap-4"><span className="text-sm font-bold text-[#9a5300]">Estimated total</span><strong className="text-right text-[#0c2442]">Pending quotation</strong></div><p className="mt-2 text-xs leading-5 text-[#7a5a2c]">Market price, stock, transport and advance amount will be confirmed before an order is accepted.</p></div>
                <button onClick={requestQuote} className="btn-primary focus-ring w-full">Continue to quotation form <ArrowRight size={18} /></button>
                {phoneHref ? <a href={phoneHref} className="btn-secondary focus-ring w-full"><Phone size={17} />Call sales team</a> : null}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white py-24">
          <div className="container-shell grid gap-14 lg:grid-cols-2 lg:items-center">
            <div><span className="eyebrow">About this material</span><h2 className="section-title mt-4">Know what you are requesting.</h2><p className="section-copy mt-5">{product.details}</p><h3 className="mt-9 text-sm font-black uppercase tracking-[.14em] text-[#0c2442]">Common project uses</h3><div className="mt-4 grid gap-4">{product.applications.map((application) => <div key={application} className="flex items-center gap-3 rounded-xl border border-slate-200 p-4"><span className="grid h-8 w-8 place-items-center rounded-full bg-[#f7f9fb]"><Check size={16} style={{ color: product.accent }} /></span><span className="font-bold text-[#263b57]">{application}</span></div>)}</div></div>
            <div className="rounded-3xl bg-[#0c2442] p-7 text-white sm:p-10"><span className="text-xs font-black uppercase tracking-[.15em] text-[#f59e0b]">What you can request</span><div className="mt-7 space-y-6">{product.highlights.map((highlight, index) => <div key={highlight} className="flex gap-4"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/10 font-black text-[#f8bd52]">0{index + 1}</span><div><strong className="block text-lg">{highlight}</strong><p className="mt-1 text-sm leading-6 text-slate-300">Include this detail in the quotation request for faster confirmation.</p></div></div>)}</div><div className="mt-8 border-t border-white/10 pt-7"><div className="flex items-start gap-3"><ShieldCheck className="mt-1 shrink-0 text-[#f59e0b]" /><p className="text-sm leading-6 text-slate-300">No payment is taken online. Verified advance-bank instructions are shared only after quotation confirmation.</p></div></div></div>
          </div>
        </section>

        <section className="bg-[#f7f9fb] py-24">
          <div className="container-shell"><div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><span className="eyebrow">Explore more</span><h2 className="mt-4 text-3xl font-black tracking-tight text-[#0c2442] sm:text-4xl">Other available materials</h2></div><Link href="/#products" className="inline-flex items-center gap-2 text-sm font-extrabold text-[#dc7d04]">View all products <ArrowRight size={16} /></Link></div><div className="mt-9 grid gap-5 md:grid-cols-3">{otherProducts.map((item) => <Link key={item.id} href={`/products/${item.id}`} className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"><div className="relative aspect-[16/10] bg-slate-100"><Image src={item.image} alt={item.imageAlt} fill sizes="(max-width: 768px) 100vw, 33vw" className={item.imageFit === "contain" ? "object-contain p-4" : "object-cover"} /></div><div className="flex items-center justify-between p-5"><div><span className="text-[10px] font-black uppercase tracking-[.13em] text-slate-400">{item.category}</span><h3 className="mt-1 font-extrabold text-[#0c2442]">{item.name}</h3></div><span className="grid h-10 w-10 place-items-center rounded-full bg-[#0c2442] text-white"><ArrowRight size={16} /></span></div></Link>)}</div></div>
        </section>

        <section className="bg-[#f59e0b] py-16 text-[#07182d]"><div className="container-shell flex flex-col items-start justify-between gap-7 lg:flex-row lg:items-center"><div><p className="text-xs font-black uppercase tracking-[.16em]">Need {product.name}?</p><h2 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Request the latest verified price today.</h2></div><a href="#request-price" className="btn-light focus-ring">Configure requirement <ArrowRight size={18} /></a></div></section>
      </main>
      <SiteFooter phone={phone} email={email} />
    </div>
  );
}
