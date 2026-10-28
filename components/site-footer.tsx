import Link from "next/link";
import { Clock3, FileText, Mail, MapPin, Phone } from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import { siteConfig } from "@/lib/site-config";

export function SiteFooter({ phone, email }: { phone?: string; email?: string }) {
  const contactEmail = email || siteConfig.email;

  return (
    <footer id="contact" className="bg-[#07182d] text-white">
      <div className="container-shell grid gap-12 py-16 md:grid-cols-[1.3fr_.7fr_.9fr]">
        <div>
          <div className="mb-5 flex items-center gap-3">
            <BrandLogo height={52} />
            <div><strong className="block">Trijuti Rudrakshya Traders</strong><span className="text-xs uppercase tracking-[.15em] text-slate-400">Pvt. Ltd.</span></div>
          </div>
          <p className="max-w-md leading-7 text-slate-300">Cement, TMT steel, pipes, sheets, wire and other construction materials for residential and commercial requirements in Nepal.</p>
        </div>
        <div>
          <h3 className="mb-4 font-bold">Quick links</h3>
          <div className="flex flex-col gap-3 text-sm text-slate-300">
            <Link href="/#products">Products</Link><Link href="/#about">About us</Link><Link href="/#process">How it works</Link><Link href="/#faq">FAQ</Link><Link href="/checkout">Quotation request</Link>
          </div>
        </div>
        <div>
          <h3 className="mb-4 font-bold">Business contact</h3>
          <div className="space-y-3 text-sm text-slate-300">
            {phone ? <p className="flex gap-3"><Phone size={17} className="mt-0.5 shrink-0 text-[#f59e0b]" /><a href={`tel:${phone.replace(/[^+\d]/g, "")}`} className="transition hover:text-white">{phone}</a></p> : null}
            <p className="flex gap-3"><Mail size={17} className="mt-0.5 shrink-0 text-[#f59e0b]" /><a className="break-all transition hover:text-white" href={`mailto:${contactEmail}`}>{contactEmail}</a></p>
            <p className="flex gap-3"><MapPin size={17} className="mt-0.5 shrink-0 text-[#f59e0b]" />{siteConfig.address.display}</p>
            <p className="flex gap-3"><FileText size={17} className="mt-0.5 shrink-0 text-[#f59e0b]" />PAN: {siteConfig.pan}</p>
            <p className="flex gap-3"><Clock3 size={17} className="mt-0.5 shrink-0 text-[#f59e0b]" />{siteConfig.inquiryAvailability}</p>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10"><div className="container-shell flex flex-col gap-2 py-5 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between"><p>© {new Date().getFullYear()} Trijuti Rudrakshya Traders Pvt. Ltd.</p><p>Prices and delivery charges are confirmed by the sales team.</p></div></div>
    </footer>
  );
}
