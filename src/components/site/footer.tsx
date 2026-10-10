"use client";

import Image from "next/image";
import { Phone, Instagram, Send, ShieldCheck, ArrowUp } from "lucide-react";
import { CLINIC, SERVICES } from "@/lib/clinic";

export function Footer() {
  return (
    <footer className="mt-auto bg-teal-deep text-white/85 relative overflow-hidden" role="contentinfo">
      <div aria-hidden className="absolute -top-24 -start-24 w-72 h-72 rounded-full bg-white/4 blur-3xl" />
      <div aria-hidden className="absolute -bottom-28 -end-20 w-80 h-80 rounded-full bg-primary/20 blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-16 pb-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* برند */}
          <div className="lg:col-span-2 max-w-sm">
            <div className="flex items-center gap-3">
              <span className="relative w-12 h-12 drop-shadow-[0_6px_16px_rgba(0,0,0,0.35)]">
                <Image src="/logo-v6.svg" alt="لوگوی کلینیک مهرآوا" width={48} height={48} />
              </span>
              <div>
                <p className="font-extrabold text-white text-lg">کلینیک مهرآوا</p>
                <p className="text-[12px] text-white/60 mt-0.5">{CLINIC.tagline}</p>
              </div>
            </div>
            <p className="mt-5 text-[13.5px] leading-7.5 text-white/70">
              از سال ۱۳۸۹ همراه شما در سلامت و زیبایی لبخند؛ با تیم متخصص بورد، تجهیزات دیجیتال
              نسل جدید و تعهد کتبی به بی‌دردی و شفافیت هزینه‌ها.
            </p>
            <div className="mt-5 flex items-center gap-2.5">
              <a
                href={`tel:${CLINIC.phoneRaw}`}
                className="flex items-center gap-2 rounded-xl bg-white/10 hover:bg-white/18 px-4 py-2.5 text-[13px] font-bold text-white transition-colors"
              >
                <Phone className="w-4 h-4" />
                <span dir="ltr">{CLINIC.phone}</span>
              </a>
              <a
                href={CLINIC.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="اینستاگرام"
                className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/18 flex items-center justify-center transition-colors"
              >
                <Instagram className="w-4.5 h-4.5" />
              </a>
              <a
                href={CLINIC.telegram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="تلگرام"
                className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/18 flex items-center justify-center transition-colors"
              >
                <Send className="w-4.5 h-4.5" />
              </a>
            </div>
          </div>

          {/* خدمات */}
          <nav aria-label="خدمات در فوتر">
            <h3 className="font-extrabold text-white text-[15px] mb-4">خدمات تخصصی</h3>
            <ul className="space-y-2.5">
              {SERVICES.slice(0, 6).map((s) => (
                <li key={s.id}>
                  <a href="#services" className="text-[13px] text-white/65 hover:text-white transition-colors">
                    {s.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* دسترسی سریع */}
          <nav aria-label="دسترسی سریع">
            <h3 className="font-extrabold text-white text-[15px] mb-4">دسترسی سریع</h3>
            <ul className="space-y-2.5 text-[13px] text-white/65">
              <li><a href="#booking" className="hover:text-white transition-colors">رزرو نوبت آنلاین</a></li>
              <li><a href="#payment" className="hover:text-white transition-colors">پرداخت هزینه ویزیت</a></li>
              <li><a href="#doctors" className="hover:text-white transition-colors">تیم پزشکان</a></li>
              <li><a href="#testimonials" className="hover:text-white transition-colors">نظرات مراجعین</a></li>
              <li><a href="#faq" className="hover:text-white transition-colors">سوالات متداول</a></li>
              <li><a href="#contact" className="hover:text-white transition-colors">آدرس و تماس</a></li>
            </ul>
          </nav>
        </div>

        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[12px] text-white/50 text-center sm:text-start">
            © ۱۴۰۴ کلینیک دندانپزشکی مهرآوا — تمامی حقوق محفوظ است | مجوز رسمی وزارت بهداشت
          </p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-[11.5px] text-white/50">
              <ShieldCheck className="w-4 h-4" />
              دارای نماد اعتماد الکترونیکی
            </span>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="w-9 h-9 rounded-xl bg-white/10 hover:bg-primary flex items-center justify-center transition-colors"
              aria-label="بازگشت به بالای صفحه"
            >
              <ArrowUp className="w-4.5 h-4.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
