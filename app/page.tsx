import { HomePage } from "@/components/home-page";
import { siteConfig } from "@/lib/site-config";

export default function Page() {
  return (
    <HomePage
      phone={process.env.NEXT_PUBLIC_PHONE_NUMBER}
      whatsapp={process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}
      email={siteConfig.email}
    />
  );
}
