"use client";

import { motion } from "framer-motion";
import { Clock3, Check, ArrowLeft, CalendarPlus } from "lucide-react";
import { SERVICES } from "@/lib/clinic";
import { formatToman } from "@/lib/utils-fa";
import { DynamicIcon } from "./icon";
import { Reveal } from "./reveal";
import { Button } from "@/components/ui/button";

export function Services() {
  const featured = SERVICES.filter((s) => s.featured);
  const rest = SERVICES.filter((s) => !s.featured);

  return (
    <section id="services" className="py-24 sm:py-28" aria-label="خدمات دندانپزشکی">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <Reveal className="max-w-2xl">
          <span className="inline-block text-[13px] font-bold text-primary bg-secondary rounded-full px-4 py-1.5 mb-4">
            خدمات تخصصی
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-teal-deep leading-snug text-balance">
            هر لبخند، یک طرح درمان اختصاصی
          </h2>
          <p className="mt-4 text-[15px] leading-8 text-muted-foreground">
            از درمان‌های حفاظتی تا بازسازی کامل لبخند؛ تمام خدمت‌ها زیر نظر متخصص همان حوزه
            و با قیمت شفاف و از پیش اعلام‌شده ارائه می‌شود.
          </p>
        </Reveal>

        {/* بنتو: دو کارت بزرگ + گرید */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {featured.map((s, i) => (
            <motion.article
              key={s.id}
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ type: "spring", stiffness: 90, damping: 20, delay: i * 0.1 }}
              className={`group relative overflow-hidden rounded-3xl bg-white shadow-softer hover:shadow-lift transition-all duration-500 p-7 flex flex-col ${
                i === 0 ? "lg:row-span-2 bg-gradient-to-b from-teal-deep to-primary text-white [&_p]:text-white/80" : ""
              }`}
            >
              {i === 0 && (
                <div aria-hidden className="absolute -top-16 -end-16 w-48 h-48 rounded-full bg-white/8 blur-2xl" />
              )}
              <span
                className={`w-13 h-13 rounded-2xl flex items-center justify-center mb-5 ${
                  i === 0 ? "bg-white/15" : "bg-secondary"
                }`}
              >
                <DynamicIcon name={s.icon} className={`w-6 h-6 ${i === 0 ? "text-white" : "text-primary"}`} strokeWidth={1.8} />
              </span>
              <h3 className={`text-xl font-extrabold ${i === 0 ? "text-white" : "text-teal-deep"}`}>{s.title}</h3>
              <p className="mt-2.5 text-[13.5px] leading-7 flex-1">{s.shortDesc}</p>
              {i === 0 && (
                <ul className="mt-5 space-y-2.5">
                  {s.highlights.map((h) => (
                    <li key={h} className="flex items-center gap-2 text-[13px] font-medium text-white/90">
                      <span className="w-5 h-5 rounded-full bg-white/15 flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3" strokeWidth={3} />
                      </span>
                      {h}
                    </li>
                  ))}
                </ul>
              )}
              <div className={`mt-6 pt-5 border-t flex items-center justify-between ${i === 0 ? "border-white/15" : "border-border"}`}>
                <div>
                  <p className={`text-[11px] ${i === 0 ? "text-white/70" : "text-muted-foreground"}`}>شروع از</p>
                  <p className={`font-extrabold text-[15px] ${i === 0 ? "text-white" : "text-primary"}`}>
                    {formatToman(s.priceFrom)}
                  </p>
                </div>
                <a
                  href="#booking"
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all group-hover:-translate-x-1 ${
                    i === 0 ? "bg-white text-primary" : "bg-secondary text-primary group-hover:bg-primary group-hover:text-white"
                  }`}
                  aria-label={`رزرو نوبت ${s.title}`}
                >
                  <ArrowLeft className="w-4.5 h-4.5" strokeWidth={2} />
                </a>
              </div>
            </motion.article>
          ))}

          {rest.map((s, i) => {
            const greenBox = i % 2 === 1;
            return (
            <motion.article
              key={s.id}
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ type: "spring", stiffness: 90, damping: 20, delay: (i % 3) * 0.08 }}
              className={`group rounded-3xl shadow-softer hover:shadow-lift transition-all duration-500 p-6 hover:-translate-y-1.5 flex flex-col ${
                greenBox
                  ? "bg-gradient-to-br from-secondary via-secondary/75 to-mint-soft border border-primary/10"
                  : "bg-white"
              }`}
            >
              <div className="flex items-start justify-between">
                <span className={`w-11 h-11 rounded-xl flex items-center justify-center transition-colors duration-300 ${
                  greenBox ? "bg-white shadow-softer" : "bg-secondary"
                } group-hover:bg-primary`}>
                  <DynamicIcon name={s.icon} className="w-5 h-5 text-primary group-hover:text-white transition-colors duration-300" strokeWidth={1.8} />
                </span>
                <span className={`flex items-center gap-1.5 text-[11.5px] text-muted-foreground rounded-full px-3 py-1 ${
                  greenBox ? "bg-white/80 border border-primary/8" : "bg-mint-soft"
                }`}>
                  <Clock3 className="w-3.5 h-3.5" />
                  {s.duration}
                </span>
              </div>
              <h3 className="mt-4 text-[16.5px] font-extrabold text-teal-deep">{s.title}</h3>
              <p className="mt-2 text-[13px] leading-6.5 text-muted-foreground flex-1">{s.shortDesc}</p>
              <div className="mt-4 flex items-center justify-between">
                <p className="text-[13.5px] font-bold text-primary">{formatToman(s.priceFrom)}</p>
                <a
                  href="#booking"
                  className="text-[12.5px] font-semibold text-primary/80 hover:text-primary inline-flex items-center gap-1 transition-colors"
                >
                  رزرو
                  <ArrowLeft className="w-3.5 h-3.5" />
                </a>
              </div>
            </motion.article>
            );
          })}
        </div>

        <Reveal className="mt-10 text-center" delay={0.1}>
          <Button
            asChild
            variant="outline"
            className="rounded-full h-12 px-8 font-semibold bg-white/70 glass border-transparent btn-tactile hover:bg-white"
          >
            <a href="#booking">
              <CalendarPlus className="w-4.5 h-4.5 me-2 text-primary" />
              مشاوره و طرح درمان رایگان بگیرید
            </a>
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
