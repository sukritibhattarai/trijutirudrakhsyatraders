import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { ProductLandingPage } from "@/components/product-landing-page";
import { productById, products } from "@/lib/products";
import { siteConfig } from "@/lib/site-config";

type ProductPageProps = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return [...products.map((product) => ({ slug: product.id })), { slug: "giriraj-cement" }];
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = productById(slug);
  if (!product) return {};
  return {
    title: `${product.name} Latest Price Inquiry in Nepal`,
    description: `${product.tagline} Submit quantity and delivery location to Trijuti Rudrakshya Traders for a current quotation.`,
    openGraph: {
      title: `${product.name} | Request Latest Price`,
      description: product.tagline,
      images: [{ url: product.image }],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  if (slug === "giriraj-cement") permanentRedirect("/products/gajraj-cement");
  const product = productById(slug);
  if (!product) notFound();

  return (
    <ProductLandingPage
      product={product}
      phone={process.env.NEXT_PUBLIC_PHONE_NUMBER}
      whatsapp={process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}
      email={siteConfig.email}
    />
  );
}
