"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  motion,
  useInView,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from "framer-motion";
import {
  CalendarCheck,
  MessageCircleHeart,
  ShieldCheck,
  Clock3,
  Star,
  Sparkles,
  BadgeCheck,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { STATS } from "@/lib/clinic";
import { toFaDigits } from "@/lib/utils-fa";

const TRUST = [
  { icon: ShieldCheck, label: "تضمین بی‌دردی" },
  { icon: BadgeCheck, label: "گارانتی کتبی خدمات" },
  { icon: Clock3, label: "اورژانس ۲۴ ساعته" },
];

/* منحنی سینمایی — ورود مطمئن بدون بازگشت */
const EASE_CINEMA = [0.16, 1, 0.3, 1] as const;

/* دکمه مغناطیسی — جذب اشاره‌گر با فیزیک فنری (فقط دسکتاپ) */
function Magnetic({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 140, damping: 15, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 140, damping: 15, mass: 0.4 });
  const ref = useRef<HTMLDivElement>(null);

  if (reduce) return <>{children}</>;

  return (
    <motion.div
      ref={ref}
      style={{ x: sx, y: sy }}
      onMouseMove={(e) => {
        const r = ref.current?.getBoundingClientRect();
        if (!r) return;
        x.set((e.clientX - r.left - r.width / 2) * 0.22);
        y.set((e.clientY - r.top - r.height / 2) * 0.22);
      }}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
      className="inline-block"
    >
      {children}
    </motion.div>
  );
}

export function Hero() {
  const openChat = () => window.dispatchEvent(new CustomEvent("open-chatbot"));
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);

  /* پارالاکس سینمایی بک‌گراند — فقط transform، بدون scroll listener */
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "34%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  return (
    <section
      id="home"
      ref={sectionRef}
      className="relative overflow-hidden min-h-[100dvh] flex items-center pt-28 pb-20"
      aria-label="معرفی کلینیک"
    >
      {/* ─── بک‌گراند سینمایی تمام‌صفحه ─── */}
      <div aria-hidden className="absolute inset-0 -z-10">
        <motion.div
          style={reduce ? undefined : { y: bgY, scale: bgScale }}
          className="absolute inset-0"
          initial={reduce ? false : { opacity: 0, scale: 1.14, filter: "blur(14px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{ duration: 1.4, ease: EASE_CINEMA }}
        >
          <div className={reduce ? "absolute inset-0" : "absolute inset-0 animate-kenburns"}>
            <Image
              src="/images/hero-bg.png"
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          </div>
        </motion.div>

        {/* اسکریم خوانایی — قشر سفید از سمت متن (راست) به شفاف */}
        <div className="absolute inset-0 bg-gradient-to-l from-white/97 via-white/82 to-white/15" />
        {/* محو تدریجی به بوم سایت — برش سینمایی پایین */}
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background to-transparent" />
        {/* هاله سبز ظریف برای هویت برند */}
        <div className="absolute -bottom-24 start-1/4 w-[480px] h-[480px] rounded-full bg-primary/10 blur-3xl" />
      </div>

      <motion.div
        style={reduce ? undefined : { y: contentY, opacity: contentOpacity }}
        className="max-w-7xl mx-auto px-4 sm:px-6 w-full"
      >
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          {/* ─── محتوا — سمت راست (RTL) ─── */}
          <div className="max-w-xl">
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE_CINEMA, delay: 0.15 }}
              className="inline-flex items-center gap-2 rounded-full glass px-4 py-2 text-[13px] font-semibold text-primary mb-6"
            >
              <Sparkles className="w-4 h-4" />
              بیش از {toFaDigits("12500")} لبخند سالم در {toFaDigits(15)} سال
            </motion.div>

            <motion.h1
              initial={reduce ? false : { opacity: 0, y: 34, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.85, ease: EASE_CINEMA, delay: 0.25 }}
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
                    stroke="#00754a"
                    strokeWidth="5"
                    strokeLinecap="round"
                    initial={reduce ? false : { pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.8, delay: 0.75, ease: EASE_CINEMA }}
                  />
                </svg>
              </span>
            </motion.h1>

            <motion.p
              initial={reduce ? false : { opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, ease: EASE_CINEMA, delay: 0.42 }}
              className="mt-6 text-[15.5px] leading-8 text-muted-foreground max-w-[58ch]"
            >
              در کلینیک دندانپزشکی مهرآوا، با تیمی از متخصصان بورد، تجهیزات دیجیتال نسل جدید
              و پروتکل تضمین بی‌دردی، تجربه‌ای آرامش‌بخش از دندانپزشکی می‌سازیم — از ایمپلنت
              تا طراحی لبخند، همه با گارانتی کتبی.
            </motion.p>

            <motion.div
              initial={reduce ? false : { opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, ease: EASE_CINEMA, delay: 0.54 }}
              className="mt-8 flex flex-wrap items-center gap-3"
            >
              <Magnetic>
                <Button
                  asChild
                  size="lg"
                  className="rounded-full h-13 px-7 text-[15px] font-bold bg-brand-green hover:bg-primary btn-tactile shadow-soft hover:shadow-lift animate-pulse-ring"
                >
                  <a href="#booking">
                    <CalendarCheck className="w-5 h-5 me-2" />
                    رزرو نوبت آنلاین
                  </a>
                </Button>
              </Magnetic>
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

            {/* نشان‌های اعتماد — کادرهای سبز */}
            <motion.ul
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.72 }}
              className="mt-9 flex flex-wrap gap-3"
            >
              {TRUST.map((t, i) => (
                <motion.li
                  key={t.label}
                  initial={reduce ? false : { opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: EASE_CINEMA, delay: 0.78 + i * 0.12 }}
                  className="flex items-center gap-2.5 rounded-2xl bg-secondary/85 border border-primary/12 px-4 py-2.5 text-[13px] font-bold text-teal-deep shadow-softer"
                >
                  <span className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center shrink-0">
                    <t.icon className="w-4 h-4 text-white" strokeWidth={2} />
                  </span>
                  {t.label}
                </motion.li>
              ))}
            </motion.ul>
          </div>

          {/* ─── کارت‌های شناور روی عکس — سمت چپ ─── */}
          <div className="relative hidden lg:block h-[340px]" aria-hidden>
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 40, rotate: -6 }}
              animate={{ opacity: 1, y: 0, rotate: 0 }}
              transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.6 }}
              className="absolute top-2 end-6"
            >
              <motion.div
                animate={reduce ? undefined : { y: [0, -12, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="glass rounded-2xl p-4 shadow-soft"
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
                <div className="flex gap-0.5 mt-2.5" aria-label="امتیاز ۵ از ۵">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  ))}
                </div>
              </motion.div>
            </motion.div>

            <motion.div
              initial={reduce ? false : { opacity: 0, y: 40, rotate: 5 }}
              animate={{ opacity: 1, y: 0, rotate: 0 }}
              transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.78 }}
              className="absolute bottom-4 start-0"
            >
              <motion.div
                animate={reduce ? undefined : { y: [0, 10, 0] }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="glass rounded-2xl p-4 shadow-soft"
              >
                <p className="text-[12px] text-muted-foreground">تخصص ما</p>
                <p className="font-extrabold text-teal-deep mt-0.5">
                  {toFaDigits(4200)}+ ایمپلنت موفق
                </p>
                <div className="mt-2 h-1.5 w-36 rounded-full bg-secondary overflow-hidden">
                  <motion.div
                    initial={reduce ? false : { x: "100%" }}
                    animate={{ x: 0 }}
                    transition={{ duration: 1.1, ease: EASE_CINEMA, delay: 1.05 }}
                    className="h-full w-full rounded-full bg-brand-green"
                  />
                </div>
              </motion.div>
            </motion.div>

            <motion.div
              initial={reduce ? false : { opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 110, damping: 19, delay: 0.95 }}
              className="absolute top-1/2 -translate-y-1/2 start-16"
            >
              <motion.div
                animate={reduce ? undefined : { y: [0, 8, 0] }}
                transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="glass-dark rounded-2xl px-4 py-3 shadow-soft"
              >
                <p className="text-[11.5px] text-white/75">نزدیک‌ترین نوبت خالی</p>
                <p className="font-extrabold text-white mt-0.5 text-[15px]">امروز — ساعت {toFaDigits("16:30")}</p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* نشانگر اسکرول سینمایی */}
      <motion.a
        href="#stats"
        aria-label="رفتن به بخش بعدی"
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.8 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex-col items-center gap-1.5 hidden sm:flex"
      >
        <span className="text-[11px] font-medium text-muted-foreground">اسکرول کنید</span>
        <motion.span
          animate={reduce ? undefined : { y: [0, 7, 0], opacity: [1, 0.35, 1] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="w-4.5 h-4.5 text-primary" />
        </motion.span>
      </motion.a>
    </section>
  );
}

// ─── باند سینمایی آمار — سبز جنگلی تیره با نویز و درخشش ─────────
export function StatsBar() {
  return (
    <section id="stats" className="relative noise bg-forest" aria-label="آمار کلینیک">
      {/* درخشش‌های سینمایی */}
      <div aria-hidden className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 start-1/4 w-[420px] h-[420px] rounded-full bg-brand-green/25 blur-3xl" />
        <div className="absolute -bottom-40 end-8 w-[380px] h-[380px] rounded-full bg-emerald-300/10 blur-3xl" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-l from-transparent via-white/25 to-transparent" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-14">
        <motion.p
          initial={false}
          whileInView={{ opacity: [0, 1], y: [14, 0] }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: EASE_CINEMA }}
          className="text-center text-[13px] font-semibold tracking-wide text-emerald-100/70 mb-9"
        >
          مهرآوا در یک نگاه
        </motion.p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-10 gap-x-4">
          {STATS.map((s, i) => (
            <motion.div
              key={s.label}
              initial={false}
              whileInView={{ opacity: [0, 1], y: [22, 0] }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.65, ease: EASE_CINEMA, delay: i * 0.1 }}
              className="text-center lg:border-s lg:border-white/12 first:border-s-0"
            >
              <p className="font-extrabold text-3xl sm:text-[2.6rem] text-white" dir="ltr">
                <AnimatedNumber target={s.value} />
                {s.suffix}
              </p>
              <p className="mt-1.5 text-[13px] font-medium text-emerald-100/70">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
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

/* نوار پیشرفت اسکرول سینمایی — خط نازک سبز بالای صفحه */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 26, restDelta: 0.001 });
  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="fixed top-0 inset-x-0 z-[60] h-[3px] origin-right bg-gradient-to-l from-brand-green via-primary to-forest"
    />
  );
}
