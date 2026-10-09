"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { GraduationCap, Award, CalendarPlus } from "lucide-react";
import { DOCTORS } from "@/lib/clinic";
import { toFaDigits } from "@/lib/utils-fa";

export function Doctors() {
  return (
    <section id="doctors" className="py-24" aria-label="تیم پزشکان">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
          <div className="max-w-xl">
            <span className="inline-block text-[13px] font-bold text-primary bg-secondary rounded-full px-4 py-1.5 mb-4">
              تیم متخصصان
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-teal-deep leading-snug text-balance">
              دست شما، در دستان متخصصان بورد
            </h2>
          </div>
          <p className="text-[14px] leading-7 text-muted-foreground max-w-sm">
            هر درمان فقط توسط متخصص همان حوزه انجام می‌شود؛ نه عمومی‌تر از آنچه هستیم، نه ادعایی بیش از توان.
          </p>
        </div>

        <div className="mt-12 grid md:grid-cols-3 gap-6">
          {DOCTORS.map((d, i) => (
            <motion.article
              key={d.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ type: "spring", stiffness: 85, damping: 20, delay: i * 0.12 }}
              className="group relative rounded-[1.8rem] bg-white shadow-softer hover:shadow-lift transition-all duration-500 overflow-hidden"
            >
              {/* تصویر */}
              <div className="relative aspect-[4/4.4] overflow-hidden">
                <Image
                  src={d.image}
                  alt={`پورتره ${d.name} — ${d.specialty}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover object-top group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-teal-deep/70 via-teal-deep/5 to-transparent" />
                <span className="absolute top-4 start-4 rounded-full glass px-3.5 py-1.5 text-[12px] font-bold text-primary">
                  {toFaDigits(d.experience)} سال تجربه
                </span>
                <div className="absolute bottom-4 inset-x-4 text-white">
                  <h3 className="text-lg font-extrabold">{d.name}</h3>
                  <p className="text-[12.5px] text-white/85 mt-0.5">{d.specialty}</p>
                </div>
              </div>

              {/* اطلاعات */}
              <div className="p-6">
                <div className="flex items-start gap-2.5 text-[12.5px] leading-6 text-muted-foreground">
                  <GraduationCap className="w-4.5 h-4.5 text-primary shrink-0 mt-0.5" strokeWidth={1.8} />
                  <span>{d.degrees}</span>
                </div>
                <p className="mt-3 text-[13px] leading-7 text-foreground/70">{d.bio}</p>
                <a
                  href="#booking"
                  className="mt-5 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-secondary hover:bg-primary text-primary hover:text-white font-semibold text-[13.5px] py-3 transition-all duration-300 btn-tactile"
                >
                  <CalendarPlus className="w-4 h-4" />
                  رزرو نوبت با {d.name.replace("دکتر ", "دکتر ")}
                </a>
              </div>
            </motion.article>
          ))}
        </div>

        {/* نشان اعتبار */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-[12.5px] font-semibold text-muted-foreground"
        >
          {["عضو انجمن دندانپزشکی ایران", "عضو FDI اروپا", "مجوز رسمی وزارت بهداشت", "گارانتی کتبی خدمات"].map((b) => (
            <span key={b} className="flex items-center gap-2">
              <Award className="w-4 h-4 text-primary" />
              {b}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
