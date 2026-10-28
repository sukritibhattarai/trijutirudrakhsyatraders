import type { Metadata } from "next";
import { siteConfig } from "@/lib/site-config";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "Trijuti Rudrakshya Traders | Construction Materials Nepal",
    template: "%s | Trijuti Rudrakshya Traders",
  },
  description:
    "Request current quotations for cement, TMT steel, pipes, roofing sheets, wire, gabion boxes and fabrication steel in Nepal.",
  alternates: { canonical: "/" },
  applicationName: "Trijuti Rudrakshya Traders",
  authors: [{ name: "Trijuti Rudrakshya Traders Pvt. Ltd." }],
  category: "Construction materials",
  robots: { index: true, follow: true },
  icons: {
    icon: "/images/trijuti-rudrakshya-office-logo.jpeg",
    apple: "/images/trijuti-rudrakshya-office-logo.jpeg",
  },
  keywords: [
    "cement supplier Nepal",
    "TMT steel Nepal",
    "binding wire Nepal",
    "construction materials quotation",
    "Sarbottam Cement",
    "Hongshi Cement",
    "Gajraj Cement",
    "Sagarmatha Cement",
    "Shaurya Cement",
    "steel pipe Nepal",
    "gabion box Nepal",
    "GI wire Nepal",
  ],
  openGraph: {
    title: "Trijuti Rudrakshya Traders Pvt. Ltd.",
    description: "The right construction materials, with a quotation confirmed for your project.",
    url: "/",
    siteName: "Trijuti Rudrakshya Traders Pvt. Ltd.",
    locale: "en_NP",
    type: "website",
    images: [{ url: "/images/real-tmt-steel.jpg", width: 1800, height: 1013 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Trijuti Rudrakshya Traders Pvt. Ltd.",
    description: "Request current quotations for cement, steel, pipes, roofing, wire and construction materials in Nepal.",
    images: ["/images/real-tmt-steel.jpg"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        <a href="#main-content" className="skip-link">Skip to main content</a>
        {children}
      </body>
    </html>
  );
}
