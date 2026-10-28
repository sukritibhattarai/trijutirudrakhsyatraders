import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = siteConfig.url;
  return { rules: { userAgent: "*", allow: "/", disallow: ["/api/", "/thank-you", "/order-confirmation"] }, sitemap: `${baseUrl}/sitemap.xml` };
}
