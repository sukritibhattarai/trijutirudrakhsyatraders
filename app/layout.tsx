import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: {
    default: "Trijuti Rudrakshya Traders | Construction Materials Nepal",
    template: "%s | Trijuti Rudrakshya Traders",
  },
  description:
    "Request current quotations for cement, TMT steel, pipes, roofing sheets, wire, gabion boxes and fabrication steel in Nepal.",
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
    type: "website",
    images: [{ url: "/images/real-tmt-steel.jpg", width: 1800, height: 1013 }],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>{children}</body>
    </html>
  );
}
