"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { TESTIMONIALS } from "@/lib/clinic";
import { toFaDigits } from "@/lib/utils-fa";

export function Testimonials() {
  const [page, setPage] = useState(0);
  const perPage = 3;
  const pages = Math.ceil(TESTIMONIALS.length / perPage);
  const visible = TESTIMONIALS.slice(page * perPage, page * perPage + perPage);

  return (
    <section id="testimonials" className="relative py-24 overflow-hidden" aria-label="نظرات مراجعین">
      <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-transparent via-mint-soft/70 to-transparent -z-10" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
          <div className="max-w-xl">
            <span className="inline-block text-[13px] font-bold text-primary bg-white shadow-softer rounded-full px-4 py-1.5 mb-4">
              نظرات واقعی مراجعین
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-teal-deep leading-snug text-balance">
              اعتماد شما، گران‌ترین سرمایه ما
            </h2>
          </div>
          {/* کنترل اسلایدر */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setPage((p) => (p - 1 + pages) % pages)}
              className="w-11 h-11 rounded-full bg-white shadow-softer flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors btn-tactile"
              aria-label="نظرات قبلی"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            <div className="flex gap-1.5" aria-label={`صفحه ${page + 1} از ${pages}`}>
              {[...Array(pages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i)}
                  aria-label={`صفحه ${i + 1}`}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === page ? "w-7 bg-primary" : "w-2 bg-primary/25 hover:bg-primary/50"
                  }`}
                />
              ))}
            </div>
            <button
              onClick={() => setPage((p) => (p + 1) % pages)}
              className="w-11 h-11 rounded-full bg-white shadow-softer flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors btn-tactile"
              aria-label="نظرات بعدی"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="relative mt-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={page}
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 24 }}
              transition={{ type: "spring", stiffness: 110, damping: 22 }}
              className="grid md:grid-cols-3 gap-5"
            >
              {visible.map((t) => (
                <article
                  key={t.id}
                  className="relative rounded-3xl bg-white shadow-softer hover:shadow-lift transition-all duration-500 p-7 flex flex-col"
                >
                  <Quote className="absolute top-6 end-6 w-9 h-9 text-secondary" aria-hidden />
                  <div className="flex gap-0.5" aria-label={`امتیاز ${t.rating} از ۵`}>
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < t.rating ? "text-amber-400 fill-amber-400" : "text-border"}`}
                      />
                    ))}
                  </div>
                  <p className="mt-4 text-[13.5px] leading-7.5 text-foreground/80 flex-1">{t.text}</p>
                  <footer className="mt-6 pt-5 border-t border-border flex items-center justify-between">
                    <div>
                      <p className="font-extrabold text-[14px] text-teal-deep">{t.name}</p>
                      <p className="text-[11.5px] text-muted-foreground mt-0.5">{t.service}</p>
                    </div>
                    <span className="text-[11.5px] text-muted-foreground/70">{t.date}</span>
                  </footer>
                </article>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        <p className="mt-8 text-center text-[12.5px] text-muted-foreground">
          میانگین امتیاز {toFaDigits("4.9")} از ۵ بر اساس {toFaDigits(612)} نظر ثبت‌شده در سامانه‌های معتبر
        </p>
      </div>
    </section>
  );
}
