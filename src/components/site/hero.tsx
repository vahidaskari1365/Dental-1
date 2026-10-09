"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import {
  CalendarCheck,
  MessageCircleHeart,
  ShieldCheck,
  Clock3,
  Star,
  Sparkles,
  BadgeCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { STATS, CLINIC } from "@/lib/clinic";
import { toFaDigits } from "@/lib/utils-fa";

const TRUST = [
  { icon: ShieldCheck, label: "تضمین بی‌دردی" },
  { icon: BadgeCheck, label: "گارانتی کتبی خدمات" },
  { icon: Clock3, label: "اورژانس ۲۴ ساعته" },
];

export function Hero() {
  const openChat = () => window.dispatchEvent(new CustomEvent("open-chatbot"));

  return (
    <section id="home" className="relative overflow-hidden min-h-[100dvh] flex items-center pt-28 pb-16">
      {/* پس‌زمینه تزئینی */}
      <div aria-hidden className="absolute inset-0 -z-10">
        <div className="absolute -top-32 -start-32 w-[520px] h-[520px] rounded-full bg-secondary blur-3xl opacity-80" />
        <div className="absolute top-1/3 -end-40 w-[460px] h-[460px] rounded-full bg-accent/50 blur-3xl opacity-70" />
        <div className="absolute bottom-0 start-1/3 w-[380px] h-[380px] rounded-full bg-mint-soft blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          {/* محتوا */}
          <div className="max-w-xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 100, damping: 18 }}
              className="inline-flex items-center gap-2 rounded-full bg-white/80 glass px-4 py-2 text-[13px] font-semibold text-primary mb-6"
            >
              <Sparkles className="w-4 h-4" />
              بیش از {toFaDigits("12500")} لبخند سالم در {toFaDigits(15)} سال
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 90, damping: 18, delay: 0.08 }}
              className="text-4xl sm:text-5xl xl:text-[3.4rem] font-extrabold leading-[1.25] text-balance text-teal-deep"
            >
              لبخندی سالم،
              <br />
              <span className="relative inline-block text-primary">
                اعتمادی ماندگار
                <svg
                  className="absolute -bottom-2 start-0 w-full"
                  viewBox="0 0 220 12"
                  fill="none"
                  aria-hidden
                >
                  <motion.path
                    d="M3 9C60 3 160 3 217 8"
                    stroke="#14B8A6"
                    strokeWidth="5"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.9, delay: 0.7, ease: "easeOut" }}
                  />
                </svg>
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 90, damping: 18, delay: 0.16 }}
              className="mt-6 text-[15.5px] leading-8 text-muted-foreground max-w-[58ch]"
            >
              در کلینیک دندانپزشکی مهرآوا، با تیمی از متخصصان بورد، تجهیزات دیجیتال نسل جدید
              و پروتکل تضمین بی‌دردی، تجربه‌ای آرامش‌بخش از دندانپزشکی می‌سازیم — از ایمپلنت
              تا طراحی لبخند، همه با گارانتی کتبی.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 90, damping: 18, delay: 0.24 }}
              className="mt-8 flex flex-wrap items-center gap-3"
            >
              <Button
                asChild
                size="lg"
                className="rounded-full h-13 px-7 text-[15px] font-bold bg-primary hover:bg-teal-deep btn-tactile shadow-soft hover:shadow-lift animate-pulse-ring"
              >
                <a href="#booking">
                  <CalendarCheck className="w-5 h-5 me-2" />
                  رزرو نوبت آنلاین
                </a>
              </Button>
              <Button
                size="lg"
                onClick={openChat}
                variant="outline"
                className="rounded-full h-13 px-7 text-[15px] font-semibold bg-white/80 glass border-transparent btn-tactile hover:bg-white"
              >
                <MessageCircleHeart className="w-5 h-5 me-2 text-primary" />
                مشاوره هوشمند رایگان
              </Button>
            </motion.div>

            {/* نشان‌های اعتماد */}
            <motion.ul
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-9 flex flex-wrap gap-x-6 gap-y-3"
            >
              {TRUST.map((t) => (
                <li key={t.label} className="flex items-center gap-2 text-[13.5px] font-semibold text-foreground/70">
                  <span className="w-7 h-7 rounded-lg bg-secondary flex items-center justify-center">
                    <t.icon className="w-4 h-4 text-primary" strokeWidth={2} />
                  </span>
                  {t.label}
                </li>
              ))}
            </motion.ul>
          </div>

          {/* تصویر + کارت‌های شناور */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 80, damping: 18, delay: 0.15 }}
            className="relative mx-auto w-full max-w-[440px] lg:max-w-none"
          >
            <div className="relative rounded-[2.2rem] overflow-hidden shadow-soft rotate-[1.5deg] hover:rotate-0 transition-transform duration-700">
              <Image
                src="/images/hero-clinic.png"
                alt="فضای مدرن و آرامش‌بخش کلینیک دندانپزشکی مهرآوا"
                width={864}
                height={1152}
                priority
                className="w-full h-auto object-cover aspect-[3/4]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-teal-deep/25 via-transparent to-transparent" />
            </div>

            {/* کارت امتیاز */}
            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-8 -start-3 sm:-start-8 glass rounded-2xl p-4 shadow-soft"
            >
              <div className="flex items-center gap-3">
                <span className="w-11 h-11 rounded-xl bg-primary flex items-center justify-center">
                  <Star className="w-5 h-5 text-white fill-white" />
                </span>
                <div>
                  <p className="font-extrabold text-lg leading-none text-teal-deep">{toFaDigits("4.9")}</p>
                  <p className="text-[11.5px] text-muted-foreground mt-1">از {toFaDigits(612)} نظر واقعی</p>
                </div>
              </div>
            </motion.div>

            {/* کارت تجربه */}
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute bottom-14 -end-2 sm:-end-6 glass rounded-2xl p-4 shadow-soft"
            >
              <p className="text-[12px] text-muted-foreground">تخصص ما</p>
              <p className="font-extrabold text-teal-deep mt-0.5">
                {toFaDigits(4200)}+ ایمپلنت موفق
              </p>
              <div className="flex gap-0.5 mt-2" aria-label="امتیاز ۵ از ۵">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                ))}
              </div>
            </motion.div>

            {/* نقطه‌های تزئینی */}
            <div aria-hidden className="absolute -top-5 -end-5 grid grid-cols-4 gap-1.5 opacity-40">
              {[...Array(12)].map((_, i) => (
                <span key={i} className="w-1.5 h-1.5 rounded-full bg-primary" />
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ─── نوار آمار با شمارنده متحرک ─────────────────────────────────
export function StatsBar() {
  return (
    <section className="relative" aria-label="آمار کلینیک">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="glass rounded-3xl shadow-soft px-6 py-8 sm:px-10 grid grid-cols-2 lg:grid-cols-4 gap-y-8">
          {STATS.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 90, damping: 18, delay: i * 0.08 }}
              className="text-center lg:border-s lg:border-border first:border-s-0"
            >
              <Counter value={s.value} suffix={s.suffix} />
              <p className="mt-1 text-[13px] font-medium text-muted-foreground">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Counter({ value, suffix }: { value: number; suffix: string }) {
  // انیمیشن شمارنده با requestAnimationFrame
  return (
    <p className="font-extrabold text-3xl sm:text-4xl text-primary" dir="ltr">
      <AnimatedNumber target={value} />
      {suffix}
    </p>
  );
}

function AnimatedNumber({ target }: { target: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [n, setN] = useState(0);
  const reduce = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    if (!inView) return;
    const dur = reduce ? 1 : 1600;
    const start = performance.now();
    let raf: number;
    const tick = (t: number) => {
      const p = Math.min((t - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, target, reduce]);

  return (
    <span ref={ref} className="tabular-nums">
      {toFaDigits(n.toLocaleString("en-US"))}
    </span>
  );
}
