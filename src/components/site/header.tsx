"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { CalendarCheck, Menu, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { CLINIC } from "@/lib/clinic";
import { ScrollProgress } from "@/components/site/hero";

const NAV = [
  { href: "#home", label: "خانه" },
  { href: "#services", label: "خدمات" },
  { href: "#doctors", label: "پزشکان" },
  { href: "#booking", label: "نوبت‌دهی" },
  { href: "#testimonials", label: "نظرات" },
  { href: "#faq", label: "سوالات متداول" },
  { href: "#contact", label: "تماس" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { scrollY } = useScroll();

  /* تشخیص اسکرول با موتور فریمر — بدون scroll listener دستی */
  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 24));

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 120, damping: 20 }}
      className={`fixed top-0 inset-x-0 z-40 transition-all duration-300 ease-cinematic ${
        scrolled ? "glass py-2" : "bg-transparent py-4"
      }`}
    >
      <ScrollProgress />
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between gap-4">
          {/* لوگو */}
          <a href="#home" className="flex items-center gap-3 group" aria-label={CLINIC.name}>
            <span className="relative w-11 h-11 drop-shadow-[0_4px_10px_rgba(0,98,65,0.28)] group-hover:scale-105 group-hover:rotate-3 transition-transform duration-300 ease-cinematic">
              <Image src="/logo.svg?v=5" alt="لوگوی کلینیک دندانپزشکی مهرآوا" width={44} height={44} priority />
            </span>
            <span className="leading-tight">
              <span className="block font-extrabold text-[15.5px] text-teal-deep">مهرآوا</span>
              <span className="block text-[11px] text-muted-foreground">کلینیک دندانپزشکی</span>
            </span>
          </a>

          {/* ناوبری دسکتاپ */}
          <nav className="hidden lg:flex items-center gap-1" aria-label="ناوبری اصلی">
            {NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="px-3.5 py-2 rounded-full text-[13.5px] font-medium text-foreground/75 hover:text-primary hover:bg-primary/8 transition-colors"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* تماس + CTA */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href={`tel:${CLINIC.phoneRaw}`}
              className="flex items-center gap-2 text-sm font-semibold text-teal-deep hover:text-primary transition-colors"
            >
              <span className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center">
                <Phone className="w-4 h-4 text-primary" strokeWidth={2} />
              </span>
              <span dir="ltr">{CLINIC.phone}</span>
            </a>
            <Button
              asChild
              className="rounded-full btn-tactile shadow-soft hover:shadow-lift bg-primary hover:bg-teal-deep"
            >
              <a href="#booking">
                <CalendarCheck className="w-4 h-4 me-1.5" />
                رزرو نوبت
              </a>
            </Button>
          </div>

          {/* منوی موبایل */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="outline" size="icon" className="rounded-xl bg-white/70" aria-label="باز کردن منو">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] rounded-s-3xl">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2.5 text-teal-deep ps-10">
                  <Image src="/logo.svg?v=5" alt="" width={30} height={30} />
                  منوی کلینیک مهرآوا
                </SheetTitle>
              </SheetHeader>
              <nav className="mt-2 flex flex-col gap-1 px-4" aria-label="ناوبری موبایل">
                {NAV.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="px-4 py-3 rounded-xl text-[15px] font-medium text-foreground/80 hover:bg-secondary hover:text-primary transition-colors"
                  >
                    {item.label}
                  </a>
                ))}
                <Button asChild className="mt-4 rounded-xl bg-primary hover:bg-teal-deep">
                  <a href="#booking" onClick={() => setOpen(false)}>
                    <CalendarCheck className="w-4 h-4 me-1.5" />
                    رزرو نوبت آنلاین
                  </a>
                </Button>
                <a
                  href={`tel:${CLINIC.phoneRaw}`}
                  className="mt-2 flex items-center justify-center gap-2 text-sm font-semibold text-teal-deep"
                >
                  <Phone className="w-4 h-4" />
                  <span dir="ltr">{CLINIC.phone}</span>
                </a>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </motion.header>
  );
}
