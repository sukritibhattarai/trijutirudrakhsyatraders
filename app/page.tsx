import { HomePage } from "@/components/home-page";

export default function Page() {
  return (
    <HomePage
      phone={process.env.NEXT_PUBLIC_PHONE_NUMBER}
      whatsapp={process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}
      email={process.env.BUSINESS_EMAIL}
    />
  );
}
