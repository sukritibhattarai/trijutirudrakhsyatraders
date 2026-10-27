import type { Metadata } from "next";
import { Suspense } from "react";
import { ThankYouContent } from "@/components/thank-you-content";

export const metadata: Metadata = {
  title: "Order Request Confirmation",
  description: "Confirmation that a construction-material order request was received.",
  robots: { index: false, follow: false },
};

export default function OrderConfirmationPage() {
  return (
    <Suspense
      fallback={
        <div className="grid min-h-screen place-items-center bg-[#f7f9fb] font-bold text-[#0c2442]">
          Loading your confirmation…
        </div>
      }
    >
      <ThankYouContent />
    </Suspense>
  );
}
