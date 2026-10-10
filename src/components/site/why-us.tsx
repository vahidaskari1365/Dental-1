"use client";

import { motion } from "framer-motion";
import { WHY_US, CLINIC } from "@/lib/clinic";
import { DynamicIcon } from "./icon";
import { Phone } from "lucide-react";

export function WhyUs() {
  return (
    <section className="relative py-24 overflow-hidden" aria-label="چرا مهرآوا">
      <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-mint-soft via-secondary/40 to-transparent -z-10" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-[1fr_1.4fr] gap-12 items-start">
          {/* ستون معرفی */}
          <div className="lg:sticky lg:top-28">
            <span className="inline-block text-[13px] font-bold text-primary bg-white shadow-softer rounded-full px-4 py-1.5 mb-4">
              چرا کلینیک مهرآوا؟
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-teal-deep leading-snug text-balance">
              دندانپزشکی، آن‌طور که باید باشد: بی‌درد، شفاف و قابل‌اعتماد
            </h2>
            <p className="mt-5 text-[15px] leading-8 text-muted-foreground">
              از سال {CLINIC.establishedYear} تاکنون، اعتماد مراجعین با سه اصل ساخته شده:
              صداقت در طرح درمان، شفافیت کامل در هزینه‌ها و پیگیری منظم بعد از درمان.
              ما حتی اگر درمان لازم نداشته باشید، به شما می‌گوییم.
            </p>
            <a
              href={`tel:${CLINIC.phoneRaw}`}
              className="mt-7 inline-flex items-center gap-3 rounded-2xl bg-white shadow-softer px-5 py-4 hover:shadow-lift transition-shadow"
            >
              <span className="w-11 h-11 rounded-xl bg-primary flex items-center justify-center animate-pulse-ring">
                <Phone className="w-5 h-5 text-white" strokeWidth={2} />
              </span>
              <span>
                <span className="block text-[12px] text-muted-foreground">مشاوره تلفنی رایگان</span>
                <span className="block font-extrabold text-teal-deep" dir="ltr">{CLINIC.phone}</span>
              </span>
            </a>
          </div>

          {/* گرید مزیت‌ها — برخی در کادر سبز جنگلی */}
          <div className="grid sm:grid-cols-2 gap-5">
            {WHY_US.map((w, i) => {
              const solid = i === 1 || i === 2;
              return (
              <motion.article
                key={w.title}
                initial={{ opacity: 0, y: 26 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ type: "spring", stiffness: 90, damping: 20, delay: i * 0.09 }}
                className={`relative overflow-hidden rounded-3xl p-7 transition-all duration-500 hover:-translate-y-1.5 ${
                  solid
                    ? "bg-forest text-white shadow-soft hover:shadow-lift noise"
                    : i === 0
                      ? "bg-white shadow-softer hover:shadow-lift"
                      : "bg-white/70 glass hover:shadow-lift"
                }`}
              >
                {solid && (
                  <div aria-hidden className="absolute -top-14 -start-14 w-44 h-44 rounded-full bg-brand-green/30 blur-2xl" />
                )}
                <span className={`relative w-13 h-13 rounded-2xl flex items-center justify-center mb-5 ${
                  solid ? "bg-white/12" : "bg-secondary"
                }`}>
                  <DynamicIcon name={w.icon} className={`w-6 h-6 ${solid ? "text-white" : "text-primary"}`} strokeWidth={1.8} />
                </span>
                <h3 className={`relative text-[16.5px] font-extrabold ${solid ? "text-white" : "text-teal-deep"}`}>{w.title}</h3>
                <p className={`relative mt-2.5 text-[13.5px] leading-7 ${solid ? "text-emerald-100/85" : "text-muted-foreground"}`}>{w.desc}</p>
              </motion.article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
