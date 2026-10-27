import type { Metadata } from "next";
import { Suspense } from "react";
import { CheckoutForm } from "@/components/checkout-form";

export const metadata: Metadata = {
  title: "Request a Quotation",
  description: "Send your construction-material requirements for a current quotation.",
};

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="grid min-h-screen place-items-center bg-[#f7f9fb] font-bold text-[#0c2442]">Preparing your inquiry…</div>}>
      <CheckoutForm />
    </Suspense>
  );
}
