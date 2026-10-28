"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowRight, Banknote, Check, ClipboardCheck, Home, Mail, PhoneCall, ShieldCheck, Truck } from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import { siteConfig } from "@/lib/site-config";

export function ThankYouContent() {
  const params = useSearchParams();
  const inquiryId = params.get("inquiryId");
  const customer = params.get("customer") || "there";
  const items = (params.get("items") || "").split("|").filter(Boolean);
  const emailDelivered = params.get("emailStatus") !== "delayed";

  if (!inquiryId) {
    return <main id="main-content" className="grid min-h-screen place-items-center bg-[#f7f9fb] p-6"><div className="max-w-lg rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-xl"><ShieldCheck className="mx-auto text-[#dc7d04]" size={42} /><h1 className="mt-5 text-3xl font-black tracking-tight text-[#0c2442]">No inquiry reference found</h1><p className="mt-3 leading-7 text-slate-500">This page only confirms inquiries that have completed the submission process.</p><Link href="/" className="btn-primary mt-6">Return home</Link></div></main>;
  }

  return (
    <main id="main-content" className="min-h-screen bg-[#f3f6f9] px-4 py-10 sm:py-16">
      <div className="mx-auto max-w-3xl overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_24px_70px_rgba(12,36,66,.12)]">
        <div className="relative overflow-hidden bg-[#0c2442] px-6 py-12 text-center text-white sm:px-12">
          <div className="grid-texture absolute inset-0 opacity-40" />
          <div className="relative"><div className="relative mx-auto w-fit"><BrandLogo height={92} priority className="!rounded-2xl !ring-white/20" /><span className="absolute -bottom-2 -right-2 grid h-10 w-10 place-items-center rounded-full border-4 border-[#0c2442] bg-[#f59e0b] text-[#07182d]"><Check size={22} strokeWidth={3} /></span></div><p className="mt-7 text-xs font-black uppercase tracking-[.17em] text-[#f8bd52]">Order request received</p><h1 className="mt-3 text-4xl font-black tracking-[-.045em] sm:text-5xl">Thank you, {customer}.</h1><p className="mx-auto mt-4 max-w-xl leading-7 text-slate-300">{emailDelivered ? "We’ve received your construction-material order request and sent a copy to your email." : "We’ve securely received your construction-material order request. The confirmation email is temporarily delayed."}</p></div>
        </div>
        <div className="p-5 sm:p-10">
          <div className="flex flex-col justify-between gap-3 rounded-2xl bg-[#fff7e8] p-5 sm:flex-row sm:items-center"><div><span className="text-xs font-bold uppercase tracking-[.13em] text-[#9a5300]">Inquiry reference</span><strong className="mt-1 block text-xl tracking-wide text-[#0c2442]">{inquiryId}</strong></div><span className="rounded-full bg-white px-4 py-2 text-xs font-extrabold text-[#0c2442] shadow-sm">Status: New inquiry</span></div>
          {items.length ? <div className="mt-7"><h2 className="font-extrabold text-[#0c2442]">Materials requested</h2><div className="mt-3 divide-y divide-slate-200 rounded-2xl border border-slate-200 px-5">{items.map((item) => <div key={item} className="flex items-start gap-3 py-4 text-sm leading-6 text-slate-600"><ClipboardCheck size={18} className="mt-1 shrink-0 text-[#dc7d04]" />{item}</div>)}</div></div> : null}
          {!emailDelivered ? <div className="mt-6 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-5"><Mail className="mt-0.5 shrink-0 text-amber-700" size={20} /><p className="text-sm leading-6 text-amber-900"><strong>Your inquiry is saved, but the confirmation email could not be sent yet.</strong><br />Keep the inquiry reference above. The sales team can still review your request in the inquiry sheet.</p></div> : null}
          <div className="mt-8 grid gap-3 sm:grid-cols-3">{[
            [PhoneCall, "1. Sales follow-up", "A representative will contact you to confirm the requirement."],
            [Banknote, "2. Verified quotation", "You’ll receive current pricing, freight and advance details."],
            [Truck, "3. Order & delivery", "After payment verification, the order and delivery are arranged."],
          ].map(([Icon, title, copy]) => { const IconComponent = Icon as typeof PhoneCall; return <article key={title as string} className="rounded-2xl bg-[#f7f9fb] p-5"><IconComponent className="text-[#dc7d04]" size={22} /><strong className="mt-4 block text-sm text-[#0c2442]">{title as string}</strong><p className="mt-2 text-xs leading-5 text-slate-500">{copy as string}</p></article>; })}</div>
          <div className="mt-7 flex items-start gap-3 rounded-2xl border border-blue-100 bg-blue-50 p-5"><ShieldCheck className="mt-0.5 shrink-0 text-[#17385f]" /><p className="text-sm leading-6 text-[#38506e]"><strong>This confirms receipt of your order request, not final acceptance or payment.</strong><br />Final price, stock and delivery are confirmed by the sales team. Only transfer an advance after receiving verified company bank instructions from authorized staff.</p></div>
          <a href={`mailto:${siteConfig.email}`} className="mt-4 flex items-center justify-center gap-2 break-all rounded-xl border border-slate-200 px-4 py-3 text-center text-sm font-bold text-[#0c2442] transition hover:border-[#dc7d04] hover:text-[#9a5300]"><Mail size={17} />{siteConfig.email}</a>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row"><Link href="/" className="btn-primary focus-ring flex-1"><Home size={18} />Back to home</Link><Link href="/#products" className="btn-secondary focus-ring flex-1">Browse more materials <ArrowRight size={17} /></Link></div>
        </div>
      </div>
    </main>
  );
}
