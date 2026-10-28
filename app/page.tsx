import { HomePage } from "@/components/home-page";
import { products } from "@/lib/products";
import { siteConfig } from "@/lib/site-config";

export default function Page() {
  const siteUrl = siteConfig.url;
  const phone = process.env.NEXT_PUBLIC_PHONE_NUMBER;
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteUrl,
    logo: `${siteUrl}${siteConfig.logo}`,
    email: siteConfig.email,
    taxID: siteConfig.pan,
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.address.streetAddress,
      addressLocality: siteConfig.address.addressLocality,
      addressCountry: "NP",
    },
    areaServed: { "@type": "Country", name: "Nepal" },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "sales",
      email: siteConfig.email,
      ...(phone ? { telephone: phone } : {}),
      areaServed: "NP",
    },
  };
  const catalogSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Construction materials available for quotation",
    itemListElement: products.map((product, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `${siteUrl}/products/${product.id}`,
      name: product.name,
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema).replaceAll("<", "\\u003c") }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(catalogSchema).replaceAll("<", "\\u003c") }} />
      <HomePage
        phone={phone}
        whatsapp={process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}
        email={siteConfig.email}
      />
    </>
  );
}
