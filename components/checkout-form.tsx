"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, ClipboardList, LoaderCircle, LockKeyhole, Mail, MapPin, Phone, ShieldCheck, UserRound } from "lucide-react";
import { FormEvent, useEffect, useMemo, useState } from "react";
import type { InquiryItem } from "@/lib/products";
import { productById } from "@/lib/products";
import { BrandLogo } from "@/components/brand-logo";

type FormFields = {
  fullName: string;
  phone: string;
  email: string;
  location: string;
  notes: string;
  company: string;
  consent: boolean;
};

function parseItems(value: string | null): InquiryItem[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item): item is InquiryItem => {
      if (!item || typeof item !== "object") return false;
      const candidate = item as Partial<InquiryItem>;
      return Boolean(
        candidate.productId &&
        productById(candidate.productId) &&
        candidate.productName &&
        candidate.variant &&
        candidate.unit &&
        typeof candidate.quantity === "number" &&
        candidate.quantity > 0,
      );
    }).slice(0, 20);
  } catch {
    return [];
  }
}

export function CheckoutForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const items = useMemo(() => parseItems(searchParams.get("items")), [searchParams]);
  const [requestToken, setRequestToken] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [fields, setFields] = useState<FormFields>({ fullName: "", phone: "", email: "", location: "", notes: "", company: "", consent: false });

  useEffect(() => {
    setRequestToken(crypto.randomUUID());
  }, []);

  function setField<Key extends keyof FormFields>(key: Key, value: FormFields[Key]) {
    setFields((current) => ({ ...current, [key]: value }));
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;
    if (!items.length) {
      setError("Your inquiry list is empty. Return to the products page and select at least one material.");
      return;
    }
    if (!requestToken) {
      setError("The form is still preparing. Please try again in a moment.");
      return;
    }

    setSubmitting(true);
    setError("");
    try {
      const response = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...fields, requestToken, items }),
      });
      const result = await response.json() as { success?: boolean; inquiryId?: string; emailDelivered?: boolean; message?: string };
      if (!response.ok || !result.success || !result.inquiryId) {
        throw new Error(result.message || "We could not submit your inquiry. Please try again.");
      }
      const params = new URLSearchParams({
        inquiryId: result.inquiryId,
        customer: fields.fullName,
        items: items.map((item) => `${item.productName} (${item.variant}) — ${item.quantity} ${item.unit}`).join("|"),
        emailStatus: result.emailDelivered === false ? "delayed" : "sent",
      });
      router.replace(`/order-confirmation?${params.toString()}`);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "We could not submit your inquiry. Please try again.");
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#eaf0f5]">
      <div className="border-b border-slate-200 bg-white">
        <div className="container-shell flex h-[74px] items-center justify-between">
          <Link href="/" className="focus-ring flex items-center gap-3 rounded-lg"><BrandLogo height={42} priority /><span className="hidden text-sm font-extrabold text-[#0c2442] sm:block">Trijuti Rudrakshya Traders</span></Link>
          <Link href="/" className="focus-ring flex items-center gap-2 rounded-lg text-sm font-bold text-slate-600 hover:text-[#0c2442]"><ArrowLeft size={16} />Back to products</Link>
        </div>
      </div>

      <div className="container-shell py-12 lg:py-16">
        <div className="mb-10 max-w-2xl"><span className="eyebrow">Quotation request</span><h1 className="mt-4 text-4xl font-black tracking-[-.045em] text-[#0c2442] sm:text-5xl">Tell us where your project is.</h1><p className="mt-4 leading-7 text-slate-500">Your information goes to the sales team for current pricing, stock and delivery confirmation. No payment is collected on this page.</p></div>

        <div className="grid gap-8 lg:grid-cols-[1.1fr_.9fr] lg:items-start">
          <form onSubmit={submit} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_16px_50px_rgba(12,36,66,.08)] sm:p-8" noValidate>
            <div className="flex items-center gap-3 border-b border-slate-200 pb-5"><span className="grid h-10 w-10 place-items-center rounded-xl bg-[#fff4df] text-[#dc7d04]"><ClipboardList size={20} /></span><div><h2 className="font-extrabold">Contact & delivery details</h2><p className="text-sm text-slate-500">All fields marked required must be completed.</p></div></div>
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <Field label="Full name" icon={UserRound} required><input required name="fullName" autoComplete="name" value={fields.fullName} onChange={(event) => setField("fullName", event.target.value)} placeholder="Your full name" className="form-input" /></Field>
              <Field label="Phone number" icon={Phone} required><input required name="phone" autoComplete="tel" inputMode="tel" value={fields.phone} onChange={(event) => setField("phone", event.target.value)} placeholder="e.g. +977 98XXXXXXXX" className="form-input" /></Field>
              <Field label="Email address" icon={Mail} required><input required name="email" type="email" autoComplete="email" value={fields.email} onChange={(event) => setField("email", event.target.value)} placeholder="you@example.com" className="form-input" /></Field>
              <div className="hidden" aria-hidden="true"><label>Company<input tabIndex={-1} autoComplete="off" value={fields.company} onChange={(event) => setField("company", event.target.value)} /></label></div>
            </div>
            <div className="mt-5"><Field label="Delivery / project location" icon={MapPin} required><textarea required name="location" autoComplete="street-address" rows={3} value={fields.location} onChange={(event) => setField("location", event.target.value)} placeholder="Kindly share your exact location" className="form-input !h-auto py-3" /></Field></div>
            <div className="mt-5"><label className="mb-2 block text-sm font-extrabold text-[#263b57]">Project notes <span className="font-medium text-slate-400">(optional)</span></label><textarea name="notes" rows={4} value={fields.notes} onChange={(event) => setField("notes", event.target.value)} placeholder="Project stage, preferred delivery date, other sizes or specifications…" className="form-input !h-auto py-3" /></div>
            <label className="mt-6 flex cursor-pointer items-start gap-3 rounded-xl bg-[#f7f9fb] p-4 text-sm leading-6 text-slate-600"><input required type="checkbox" checked={fields.consent} onChange={(event) => setField("consent", event.target.checked)} className="mt-1 h-4 w-4 accent-[#dc7d04]" /><span>I agree that the sales team may contact me about this inquiry. I understand that prices, stock, delivery and advance-payment details are confirmed separately.</span></label>

            {error ? <div role="alert" className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold leading-6 text-red-700">{error}</div> : null}
            <button type="submit" disabled={submitting || !items.length} className="btn-primary focus-ring mt-6 w-full">{submitting ? <><LoaderCircle className="animate-spin" size={19} />Submitting inquiry…</> : <>Submit quotation request <ArrowRight size={18} /></>}</button>
            <p className="mt-4 flex items-center justify-center gap-2 text-center text-xs text-slate-500"><LockKeyhole size={14} />Credentials and integrations run securely on the server.</p>
          </form>

          <aside className="lg:sticky lg:top-6">
            <div className="overflow-hidden rounded-3xl bg-[#0c2442] text-white shadow-[0_18px_50px_rgba(12,36,66,.2)]">
              <div className="border-b border-white/10 p-6"><p className="text-xs font-bold uppercase tracking-[.15em] text-[#f59e0b]">Inquiry summary</p><h2 className="mt-2 text-2xl font-black">Materials requested</h2></div>
              {items.length ? <div className="divide-y divide-white/10 px-6">{items.map((item) => {
                const product = productById(item.productId)!;
                return <div key={item.productId} className="flex gap-4 py-5"><div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-white"><Image src={product.image} alt="" fill sizes="64px" className={product.imageFit === "contain" ? "object-contain p-1" : "object-cover"} /></div><div className="min-w-0"><strong className="block">{item.productName}</strong><p className="mt-1 text-sm text-slate-300">{item.variant}</p><p className="mt-1 text-sm font-bold text-[#f8bd52]">{item.quantity} {item.unit}</p></div></div>;
              })}</div> : <div className="p-8 text-sm leading-6 text-slate-300">No products were selected. <Link href="/#products" className="font-bold text-[#f59e0b]">Choose products first.</Link></div>}
              <div className="bg-[#07182d] p-6"><div className="flex items-start gap-3"><ShieldCheck className="mt-1 shrink-0 text-[#f59e0b]" size={20} /><p className="text-sm leading-6 text-slate-300"><strong className="text-white">Price: Pending quotation</strong><br />Delivery fee and advance amount are confirmed by the sales team.</p></div></div>
            </div>
            <div className="mt-5 grid grid-cols-3 gap-2 text-center text-[11px] font-bold text-slate-500">{[[Check, "Validated form"], [LockKeyhole, "Server-side"], [Phone, "Human follow-up"]].map(([Icon, text]) => { const IconComponent = Icon as typeof Check; return <div key={text as string} className="rounded-xl border border-slate-200 bg-white p-3"><IconComponent className="mx-auto mb-2 text-[#dc7d04]" size={17} />{text as string}</div>; })}</div>
          </aside>
        </div>
      </div>
      <style jsx global>{`.form-input{height:48px;width:100%;border:1px solid #cbd5e1;border-radius:10px;background:#fff!important;padding:0 14px;color:#13233c;caret-color:#13233c;color-scheme:light;outline:none;transition:border-color .2s,box-shadow .2s}.form-input:focus{border-color:#dc7d04;box-shadow:0 0 0 3px rgba(245,158,11,.14)}.form-input::placeholder{color:#94a3b8}.form-input:-webkit-autofill,.form-input:-webkit-autofill:hover,.form-input:-webkit-autofill:focus{-webkit-text-fill-color:#13233c!important;-webkit-box-shadow:0 0 0 1000px #fff inset!important;box-shadow:0 0 0 1000px #fff inset!important;caret-color:#13233c!important}`}</style>
    </main>
  );
}

function Field({ label, icon: Icon, required, children }: { label: string; icon: typeof UserRound; required?: boolean; children: React.ReactNode }) {
  return <label className="block"><span className="mb-2 flex items-center gap-2 text-sm font-extrabold text-[#263b57]"><Icon size={15} className="text-[#dc7d04]" />{label}{required ? <span className="text-red-500">*</span> : null}</span>{children}</label>;
}
