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
    alternates: { canonical: `/products/${product.id}` },
    openGraph: {
      title: `${product.name} | Request Latest Price`,
      description: product.tagline,
      url: `/products/${product.id}`,
      images: [{ url: product.image }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} | Request Latest Price`,
      description: product.tagline,
      images: [product.image],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  if (slug === "giriraj-cement") permanentRedirect("/products/gajraj-cement");
  const product = productById(slug);
  if (!product) notFound();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const productUrl = `${siteUrl}/products/${product.id}`;
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.details,
    image: `${siteUrl}${product.image}`,
    category: product.category,
    url: productUrl,
    seller: { "@type": "Organization", name: siteConfig.name, url: siteUrl },
  };
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "Products", item: `${siteUrl}/#products` },
      { "@type": "ListItem", position: 3, name: product.name, item: productUrl },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema).replaceAll("<", "\\u003c") }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema).replaceAll("<", "\\u003c") }} />
      <ProductLandingPage
        product={product}
        phone={process.env.NEXT_PUBLIC_PHONE_NUMBER}
        whatsapp={process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}
        email={siteConfig.email}
      />
    </>
  );
}
