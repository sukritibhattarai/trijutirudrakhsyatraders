"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  BadgeCheck,
  Banknote,
  Boxes,
  Building2,
  Check,
  ChevronRight,
  CircleDollarSign,
  ClipboardCheck,
  Factory,
  Headphones,
  Mail,
  MapPin,
  Minus,
  PackageCheck,
  Phone,
  Plus,
  ShieldCheck,
  ShoppingCart,
  Trash2,
  Truck,
} from "lucide-react";
import { useMemo, useState } from "react";
import type { InquiryItem, Product } from "@/lib/products";
import { products, productById } from "@/lib/products";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

const faqs = [
  ["Which cement brands are available?", "Customers can inquire about Gajraj, Samrat, Hongshi, Sarbottam, Sagarmatha and Shaurya Cement, subject to current stock."],
  ["Are OPC and PPC cement available?", "Yes. Available options include brand-specific OPC and PPC choices shown on each cement product page. The final type should follow the project engineer’s specification."],
  ["Do you supply TMT steel bars?", "Yes. Stock-list options include 7 mm to 25 mm TMT, with Jagadamba, Ambe and Thermex choices where listed."],
  ["Is binding wire available?", "Yes. Submit the quantity you need and our team will confirm pricing and availability."],
  ["What other steel materials can I request?", "You can request black pipe, SHS/RHS and square pipe, corrugated galvanized sheets, gabion boxes, heavy GI wire, HR sheet and MS Channel."],
  ["How can I check product prices?", "Because construction-material prices change, submit a quotation request to receive the latest verified rate."],
  ["Can I request bulk quantities?", "Yes. The form accepts bulk inquiries in bags, bundles, kilograms or metric tons depending on the material."],
  ["How can I make payment?", "After the quotation is confirmed, the company accepts advance payment through bank transfer. Only use instructions sent by an authorized company representative."],
];

const productCategories = ["All materials", ...Array.from(new Set(products.map((product) => product.category)))];

function makeItem(product: Product): InquiryItem {
  return {
    productId: product.id,
    productName: product.name,
    variant: product.variants[0],
    quantity: 1,
    unit: product.defaultUnit,
  };
}

export function HomePage({ phone, whatsapp, email }: { phone?: string; whatsapp?: string; email?: string }) {
  const router = useRouter();
  const [items, setItems] = useState<InquiryItem[]>([]);
  const [selectionMessage, setSelectionMessage] = useState("");
  const [activeCategory, setActiveCategory] = useState("All materials");

  const totalQuantity = useMemo(() => items.reduce((sum, item) => sum + item.quantity, 0), [items]);
  const visibleProducts = useMemo(
    () => activeCategory === "All materials" ? products : products.filter((product) => product.category === activeCategory),
    [activeCategory],
  );

  function addProduct(product: Product) {
    setItems((current) => {
      const existingIndex = current.findIndex((item) => item.productId === product.id);
      if (existingIndex >= 0) {
        return current.map((item, index) => index === existingIndex ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...current, makeItem(product)];
    });
    setSelectionMessage(`${product.name} added to your quotation.`);
    window.setTimeout(() => setSelectionMessage(""), 2600);
  }

  function updateItem(index: number, patch: Partial<InquiryItem>) {
    setItems((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, ...patch } : item));
  }

  function continueToCheckout() {
    if (!items.length) {
      setSelectionMessage("Please add at least one product first.");
      document.getElementById("products")?.scrollIntoView({ behavior: "smooth" });
      return;
    }
    const params = new URLSearchParams({ items: JSON.stringify(items) });
    router.push(`/checkout?${params.toString()}`);
  }

  const whatsappHref = whatsapp ? `https://wa.me/${whatsapp.replace(/\D/g, "")}` : undefined;
  const phoneHref = phone ? `tel:${phone.replace(/[^+\d]/g, "")}` : undefined;

  return (
    <>
      <SiteHeader phone={phone} />
      <main id="main-content" className="pb-20 md:pb-0">
        <section className="relative overflow-hidden bg-[#07182d] text-white">
          <div className="grid-texture absolute inset-0 opacity-60" />
          <div className="absolute -left-40 top-20 h-80 w-80 rounded-full bg-[#17385f] blur-3xl" />
          <div className="container-shell relative grid min-h-[680px] items-center gap-12 py-16 lg:grid-cols-[.95fr_1.05fr] lg:py-20">
            <div className="z-10 max-w-2xl">
              <span className="eyebrow !text-[#f59e0b]">Construction supply partner</span>
              <h1 className="mt-6 text-[clamp(2.7rem,6.3vw,5.4rem)] font-black leading-[.96] tracking-[-.055em]">Building your dream? Get the right materials at the right price.</h1>
              <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">Cement, TMT steel, pipes, sheets, wire and gabion materials—all in one quotation, with pricing confirmed for your quantity and location.</p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a href="#products" className="btn-primary focus-ring">Get a free quotation <ArrowRight size={18} /></a>
                {whatsappHref ? <a href={whatsappHref} target="_blank" rel="noreferrer" className="btn-light focus-ring">WhatsApp us</a> : <a href={`mailto:${email}`} className="btn-light focus-ring"><Mail size={17} />Email sales</a>}
              </div>
              <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-300">
                <span className="flex items-center gap-2"><Check size={16} className="text-[#f59e0b]" />Multiple brands</span>
                <span className="flex items-center gap-2"><Check size={16} className="text-[#f59e0b]" />Bulk inquiries</span>
                <span className="flex items-center gap-2"><Check size={16} className="text-[#f59e0b]" />Direct sales support</span>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -inset-5 rotate-2 rounded-[2rem] border border-white/10 bg-white/5" />
              <div className="relative aspect-[4/3] overflow-hidden rounded-[1.6rem] border border-white/15 shadow-2xl">
                <Image
                  src="/images/trijuti-construction-materials-hero.png"
                  alt="Cement, TMT steel, pipes, wire and galvanized roofing sheets at a construction site"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 55vw"
                  className="object-cover"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#07182d]/90 to-transparent p-6 pt-20">
                  <p className="text-sm font-bold">One inquiry. Multiple materials.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-slate-200 bg-white">
          <div className="container-shell grid divide-y divide-slate-200 py-4 sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-4">
            {[
              [BadgeCheck, "Verified quotation", "Latest market pricing"],
              [Boxes, "Choice of materials", "Cement, steel, pipe & wire"],
              [Truck, "Delivery planning", "Confirmed for your location"],
              [Headphones, "Human support", "Sales-team follow-up"],
            ].map(([Icon, title, text], index) => {
              const IconComponent = Icon as typeof BadgeCheck;
              return <div key={title as string} className={`flex items-center gap-3 px-4 py-4 ${index === 0 ? "sm:pl-0" : ""}`}><IconComponent className="shrink-0 text-[#dc7d04]" size={22} /><div><strong className="block text-sm">{title as string}</strong><span className="text-xs text-slate-500">{text as string}</span></div></div>;
            })}
          </div>
        </section>

        <section id="products" className="bg-[#f7f9fb] py-24">
          <div className="container-shell">
            <div className="grid gap-8 lg:grid-cols-[.8fr_1.2fr] lg:items-end">
              <div><span className="eyebrow">Materials we supply</span><h2 className="section-title mt-4">Start with what your project needs.</h2></div>
              <div className="lg:pl-16"><p className="section-copy">Choose a brand or material and add the approximate quantity. No price shown here is invented—our sales team confirms the current rate, stock and delivery charge.</p></div>
            </div>
            <div className="mt-9 flex flex-wrap gap-2" role="group" aria-label="Filter products by category">
              {productCategories.map((category) => {
                const count = category === "All materials" ? products.length : products.filter((product) => product.category === category).length;
                const selected = activeCategory === category;
                return (
                  <button
                    key={category}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => setActiveCategory(category)}
                    className={`focus-ring rounded-full border px-4 py-2 text-sm font-extrabold transition ${selected ? "border-[#0c2442] bg-[#0c2442] text-white shadow-md" : "border-slate-300 bg-white text-slate-600 hover:border-[#dc7d04] hover:text-[#9a5300]"}`}
                  >
                    {category} <span className={selected ? "text-white/60" : "text-slate-400"}>({count})</span>
                  </button>
                );
              })}
            </div>
            <p className="mt-4 text-sm font-semibold text-slate-500" aria-live="polite">Showing {visibleProducts.length} of {products.length} materials</p>
            <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {visibleProducts.map((product) => (
                <article key={product.id} className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_8px_32px_rgba(12,36,66,.06)] transition hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(12,36,66,.12)]">
                  <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                    <Image src={product.image} alt={product.imageAlt} fill sizes="(max-width: 768px) 100vw, 33vw" className={`${product.imageFit === "contain" ? "object-contain p-4" : "object-cover"} transition duration-500 group-hover:scale-[1.025]`} />
                    <span className="absolute left-4 top-4 rounded-full bg-[#07182d]/90 px-3 py-1 text-[10px] font-bold uppercase tracking-[.13em] text-white">{product.category}</span>
                  </div>
                  <div className="p-6">
                    <Link href={`/products/${product.id}`} className="focus-ring inline-flex rounded"><h3 className="text-xl font-extrabold tracking-tight text-[#0c2442] transition hover:text-[#dc7d04]">{product.name}</h3></Link>
                    <p className="mt-2 min-h-12 text-sm leading-6 text-slate-500">{product.description}</p>
                    <Link href={`/products/${product.id}`} className="mt-3 inline-flex items-center gap-1 text-xs font-extrabold uppercase tracking-[.1em] text-[#17385f] hover:text-[#dc7d04]">View product page <ArrowRight size={14} /></Link>
                    <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-5">
                      <div><span className="block text-[10px] font-bold uppercase tracking-[.12em] text-slate-400">Current rate</span><strong className="text-[#dc7d04]">Request latest price</strong></div>
                      <button onClick={() => addProduct(product)} className="focus-ring grid h-11 w-11 place-items-center rounded-full bg-[#0c2442] text-white transition hover:bg-[#17385f]" aria-label={`Add ${product.name} to quotation`}><Plus size={19} /></button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="quote-builder" className="bg-white py-24">
          <div className="container-shell grid gap-12 lg:grid-cols-[.74fr_1.26fr]">
            <div>
              <span className="eyebrow">Quotation builder</span>
              <h2 className="section-title mt-4">Build your material list.</h2>
              <p className="section-copy mt-5">Add one or several items. Quantities can be approximate—we’ll confirm everything before any payment or delivery arrangement.</p>
              <div className="mt-8 rounded-2xl bg-[#0c2442] p-6 text-white">
                <div className="flex items-start gap-4"><ShieldCheck className="mt-1 shrink-0 text-[#f59e0b]" /><div><strong className="block text-lg">No instant payment</strong><p className="mt-2 text-sm leading-6 text-slate-300">This form creates an inquiry, not a confirmed order. Never transfer money until authorized staff provide a verified quotation and company bank instructions.</p></div></div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-[#f7f9fb] p-4 shadow-[0_22px_60px_rgba(12,36,66,.09)] sm:p-7">
              <div className="flex items-center justify-between border-b border-slate-200 pb-5"><div><h3 className="text-xl font-extrabold">Your inquiry list</h3><p className="mt-1 text-sm text-slate-500">{items.length ? `${items.length} material type${items.length === 1 ? "" : "s"} · ${totalQuantity} total units` : "No materials added yet"}</p></div><ShoppingCart className="text-[#dc7d04]" /></div>
              {items.length ? (
                <div className="divide-y divide-slate-200">
                  {items.map((item, index) => {
                    const product = productById(item.productId)!;
                    return (
                      <div key={item.productId} className="py-5">
                        <div className="flex items-start gap-3">
                          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-white"><Image src={product.image} alt="" fill sizes="64px" className={product.imageFit === "contain" ? "object-contain p-1" : "object-cover"} /></div>
                          <div className="min-w-0 flex-1"><strong className="block truncate">{item.productName}</strong><span className="text-xs font-bold uppercase tracking-[.12em] text-[#dc7d04]">Price on request</span></div>
                          <button onClick={() => setItems((current) => current.filter((_, itemIndex) => itemIndex !== index))} className="focus-ring rounded-lg p-2 text-slate-400 hover:bg-white hover:text-red-600" aria-label={`Remove ${item.productName}`}><Trash2 size={17} /></button>
                        </div>
                        <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_110px_130px]">
                          <label className="text-xs font-bold text-slate-600">Type / size<select value={item.variant} onChange={(event) => updateItem(index, { variant: event.target.value })} className="mt-1.5 h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm font-medium text-[#13233c]">{product.variants.map((variant) => <option key={variant}>{variant}</option>)}</select></label>
                          <label className="text-xs font-bold text-slate-600">Quantity<div className="mt-1.5 flex h-11 rounded-lg border border-slate-300 bg-white"><button className="grid w-9 place-items-center" onClick={() => updateItem(index, { quantity: Math.max(1, item.quantity - 1) })} aria-label="Decrease quantity"><Minus size={14} /></button><input aria-label={`${item.productName} quantity`} type="number" min="1" value={item.quantity} onChange={(event) => updateItem(index, { quantity: Math.max(1, Number(event.target.value) || 1) })} className="min-w-0 flex-1 border-x border-slate-200 text-center text-sm font-bold outline-none" /><button className="grid w-9 place-items-center" onClick={() => updateItem(index, { quantity: item.quantity + 1 })} aria-label="Increase quantity"><Plus size={14} /></button></div></label>
                          <label className="text-xs font-bold text-slate-600">Unit<select value={item.unit} onChange={(event) => updateItem(index, { unit: event.target.value })} className="mt-1.5 h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm font-medium text-[#13233c]">{product.units.map((unit) => <option key={unit}>{unit}</option>)}</select></label>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="grid min-h-52 place-items-center py-10 text-center"><div><PackageCheck className="mx-auto text-slate-300" size={42} /><p className="mt-4 font-bold text-slate-500">Choose materials from the cards above</p><a href="#products" className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-[#dc7d04]">Browse products <ChevronRight size={15} /></a></div></div>
              )}
              <button onClick={continueToCheckout} disabled={!items.length} className="btn-primary focus-ring mt-4 w-full">Continue to request form <ArrowRight size={18} /></button>
              {selectionMessage ? <p role="status" className="mt-3 text-center text-sm font-semibold text-[#17385f]">{selectionMessage}</p> : null}
            </div>
          </div>
        </section>

        <section id="process" className="bg-[#07182d] py-24 text-white">
          <div className="container-shell">
            <div className="max-w-2xl"><span className="eyebrow !text-[#f59e0b]">Clear from inquiry to delivery</span><h2 className="section-title mt-4">A safer, verified purchase process.</h2></div>
            <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              {[
                [ClipboardCheck, "01", "Send your list", "Tell us the materials, specification, quantity and delivery location."],
                [CircleDollarSign, "02", "Receive a quotation", "We confirm current pricing, stock, transport and the advance amount."],
                [Banknote, "03", "Pay verified details", "Use only company bank instructions provided by authorized staff."],
                [Truck, "04", "Confirmation & delivery", "Staff verify payment, confirm the order and arrange delivery."],
              ].map(([Icon, number, title, copy]) => {
                const IconComponent = Icon as typeof ClipboardCheck;
                return <article key={number as string} className="rounded-2xl border border-white/10 bg-white/[.055] p-6"><div className="flex items-center justify-between"><IconComponent className="text-[#f59e0b]" /><span className="text-sm font-black text-white/30">{number as string}</span></div><h3 className="mt-8 text-xl font-extrabold">{title as string}</h3><p className="mt-3 text-sm leading-6 text-slate-300">{copy as string}</p></article>;
              })}
            </div>
          </div>
        </section>

        <section id="about" className="scroll-mt-24 bg-white py-24">
          <div className="container-shell grid items-center gap-14 lg:grid-cols-2">
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl"><Image src="/images/real-tmt-steel.jpg" alt="TMT steel bars ready for supply" fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" /><div className="absolute inset-0 bg-gradient-to-t from-[#07182d]/75 via-transparent to-transparent" /><div className="absolute bottom-6 left-6 right-6 flex items-end justify-between text-white"><div><span className="text-xs font-bold uppercase tracking-[.14em] text-[#f59e0b]">For projects of every scale</span><p className="mt-1 text-xl font-extrabold">From a few bags to bulk supply</p></div><Building2 className="hidden sm:block" size={40} /></div></div>
            <div><span className="eyebrow">About our company</span><h2 className="section-title mt-4">One quotation process for the materials that keep work moving.</h2><p className="section-copy mt-5">Trijuti Rudrakshya Traders Pvt. Ltd. helps customers request cement, reinforcement steel, pipes, roofing sheets, wire and fabrication materials through one clear quotation process. Our team confirms current stock, market rate and delivery details for the quantity and location supplied by the customer.</p><div className="mt-8 grid gap-4 sm:grid-cols-2">{[
              [Boxes, "Multiple options", "Compare brands and types in one request."],
              [MapPin, "Location-based delivery", "Transport is confirmed for your exact site."],
              [PackageCheck, "Bulk-friendly", "Send large requirements with clear units."],
              [Headphones, "Direct follow-up", "A sales representative confirms every detail."],
            ].map(([Icon, title, copy]) => { const IconComponent = Icon as typeof Boxes; return <div key={title as string} className="rounded-xl border border-slate-200 p-5"><IconComponent className="text-[#dc7d04]" size={22} /><strong className="mt-4 block">{title as string}</strong><p className="mt-1 text-sm leading-6 text-slate-500">{copy as string}</p></div>; })}</div><div className="mt-8 flex flex-col gap-3 sm:flex-row"><a href="#quote-builder" className="btn-primary focus-ring">Build my quotation <ArrowRight size={18} /></a><a href={`mailto:${email}`} className="btn-secondary focus-ring"><Mail size={17} />Email the office</a></div></div>
          </div>
        </section>

        <section id="faq" className="bg-[#f7f9fb] py-24">
          <div className="container-shell grid gap-12 lg:grid-cols-[.72fr_1.28fr]">
            <div><span className="eyebrow">Frequently asked</span><h2 className="section-title mt-4">Answers before you inquire.</h2><p className="section-copy mt-5">Still unsure? Add your question to the project notes and our sales team can address it during follow-up.</p></div>
            <div className="space-y-3">{faqs.map(([question, answer], index) => <details key={question} className="group rounded-xl border border-slate-200 bg-white px-5 py-1" open={index === 0}><summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 font-extrabold text-[#0c2442]"><span>{question}</span><Plus className="shrink-0 transition group-open:rotate-45" size={19} /></summary><p className="pb-5 pr-8 text-sm leading-7 text-slate-500">{answer}</p></details>)}</div>
          </div>
        </section>

        <section className="bg-[#f59e0b] py-16 text-[#07182d]">
          <div className="container-shell flex flex-col items-start justify-between gap-7 lg:flex-row lg:items-center"><div><p className="text-xs font-black uppercase tracking-[.16em]">Ready to plan your supply?</p><h2 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Get a current quotation for your material list.</h2></div><div className="flex flex-wrap gap-3"><a href="#quote-builder" className="btn-light focus-ring">Request latest price <ArrowRight size={18} /></a>{phoneHref ? <a href={phoneHref} className="btn-secondary focus-ring !border-[#07182d]/20 !bg-transparent"><Phone size={17} />Call now</a> : null}</div></div>
        </section>
      </main>
      <SiteFooter phone={phone} email={email} />
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 p-3 shadow-[0_-10px_30px_rgba(7,24,45,.12)] backdrop-blur md:hidden">
        <div className="mx-auto flex max-w-lg gap-2">
          <a href="#quote-builder" className="btn-primary focus-ring !min-h-12 flex-1 !px-3 text-sm"><Factory size={17} />Build quotation</a>
          {whatsappHref ? <a href={whatsappHref} target="_blank" rel="noreferrer" className="btn-secondary focus-ring !min-h-12 !px-4" aria-label="Contact us on WhatsApp">WhatsApp</a> : <a href={`mailto:${email}`} className="btn-secondary focus-ring !min-h-12 !px-4" aria-label="Email the office"><Mail size={18} /></a>}
        </div>
      </div>
    </>
  );
}
