import Image from "next/image";
import { siteConfig } from "@/lib/site-config";

export function BrandLogo({
  height = 44,
  priority = false,
  className = "",
}: {
  height?: number;
  priority?: boolean;
  className?: string;
}) {
  const width = Math.round(height * (254 / 178));

  return (
    <span
      className={`relative block shrink-0 overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-slate-200 ${className}`}
      style={{ width, height }}
    >
      <Image
        src={siteConfig.logo}
        alt="Trijuti Rudrakshya Traders official stamp logo"
        fill
        priority={priority}
        sizes={`${width}px`}
        className="object-contain"
      />
    </span>
  );
}
