"use client";

import { Sparkle } from "lucide-react";

import { Marquee } from "@/components/magicui/marquee";
import { SERVICES } from "@/lib/clinic";

/* نوار متحرک خدمات — الگوگرفته از Marquee کتابخانه Magic UI
   (استفاده‌شده در قالب‌های portfolio و blog-template همان مجموعه)
   چیدمان RTL: کانتینر LTR برای انیمیشن یکنواخت، آیتم‌ها RTL */
const EXTRA = ["تضمین بی‌دردی", "گارانتی کتبی خدمات", "اورژانس ۲۴ ساعته"];

export function MarqueeStrip() {
  const items = [
    ...SERVICES.map((s) => s.title),
    ...EXTRA,
  ];

  return (
    <section
      aria-label="فهرست خدمات کلینیک"
      className="relative border-b border-primary/10 bg-white py-4 overflow-hidden"
      dir="ltr"
    >
      <Marquee pauseOnHover className="[--duration:36s] [--gap:0px] py-1">
        <ul dir="rtl" className="flex items-center">
          {items.map((label) => (
            <li
              key={label}
              className="flex shrink-0 items-center gap-2.5 px-7 text-[14.5px] font-extrabold text-teal-deep/75 whitespace-nowrap"
            >
              <Sparkle className="w-3.5 h-3.5 text-brand-green shrink-0" aria-hidden />
              {label}
            </li>
          ))}
        </ul>
      </Marquee>

      {/* محو لبه‌ها */}
      <div aria-hidden className="pointer-events-none absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-white to-transparent" />
      <div aria-hidden className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-white to-transparent" />
    </section>
  );
}
