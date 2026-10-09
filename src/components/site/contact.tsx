"use client";

import { motion } from "framer-motion";
import { MapPin, Phone, Clock3, Mail, Siren, Instagram, Send } from "lucide-react";
import { CLINIC } from "@/lib/clinic";
import { Reveal } from "./reveal";

export function Contact() {
  return (
    <section id="contact" className="relative py-24 overflow-hidden" aria-label="تماس و آدرس">
      <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-transparent to-secondary/60 -z-10" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-10 items-stretch">
          {/* اطلاعات تماس */}
          <div>
            <span className="inline-block text-[13px] font-bold text-primary bg-white shadow-softer rounded-full px-4 py-1.5 mb-4">
              در دسترس شما
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-teal-deep leading-snug text-balance">
              کلینیک مهرآوا، همین گوشه‌ی ولیعصر
            </h2>

            <div className="mt-8 grid sm:grid-cols-2 gap-4">
              <Reveal delay={0.05} className="rounded-2xl bg-white shadow-softer p-5">
                <span className="w-11 h-11 rounded-xl bg-secondary flex items-center justify-center mb-3">
                  <MapPin className="w-5 h-5 text-primary" strokeWidth={1.9} />
                </span>
                <h3 className="font-extrabold text-[14px] text-teal-deep">آدرس کلینیک</h3>
                <p className="mt-1.5 text-[13px] leading-6.5 text-muted-foreground">{CLINIC.address}</p>
              </Reveal>

              <Reveal delay={0.1} className="rounded-2xl bg-white shadow-softer p-5">
                <span className="w-11 h-11 rounded-xl bg-secondary flex items-center justify-center mb-3">
                  <Phone className="w-5 h-5 text-primary" strokeWidth={1.9} />
                </span>
                <h3 className="font-extrabold text-[14px] text-teal-deep">تلفن رزرو</h3>
                <p className="mt-1.5 text-[14px] font-extrabold text-foreground" dir="ltr">{CLINIC.phone}</p>
                <p className="text-[12px] text-muted-foreground mt-1">پاسخگویی ۹ صبح تا ۹ شب</p>
              </Reveal>

              <Reveal delay={0.15} className="rounded-2xl bg-white shadow-softer p-5">
                <span className="w-11 h-11 rounded-xl bg-secondary flex items-center justify-center mb-3">
                  <Clock3 className="w-5 h-5 text-primary" strokeWidth={1.9} />
                </span>
                <h3 className="font-extrabold text-[14px] text-teal-deep">ساعات کاری</h3>
                <ul className="mt-1.5 space-y-1">
                  {CLINIC.workingHours.map((w) => (
                    <li key={w.days} className="text-[12.5px] text-muted-foreground flex justify-between gap-2">
                      <span>{w.days}</span>
                      <span className="font-semibold text-foreground/80">{w.hours}</span>
                    </li>
                  ))}
                </ul>
              </Reveal>

              <Reveal delay={0.2} className="rounded-2xl bg-white shadow-softer p-5">
                <span className="w-11 h-11 rounded-xl bg-secondary flex items-center justify-center mb-3">
                  <Mail className="w-5 h-5 text-primary" strokeWidth={1.9} />
                </span>
                <h3 className="font-extrabold text-[14px] text-teal-deep">ایمیل و شبکه‌ها</h3>
                <p className="mt-1.5 text-[13px] font-semibold text-foreground/80" dir="ltr">{CLINIC.email}</p>
                <div className="mt-3 flex gap-2">
                  <a
                    href={CLINIC.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center hover:bg-primary transition-colors group"
                    aria-label="اینستاگرام کلینیک"
                  >
                    <Instagram className="w-4.5 h-4.5 text-primary group-hover:text-white" strokeWidth={1.9} />
                  </a>
                  <a
                    href={CLINIC.telegram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center hover:bg-primary transition-colors group"
                    aria-label="تلگرام کلینیک"
                  >
                    <Send className="w-4.5 h-4.5 text-primary group-hover:text-white" strokeWidth={1.9} />
                  </a>
                </div>
              </Reveal>
            </div>

            {/* اورژانس */}
            <motion.a
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.25 }}
              href={`tel:${CLINIC.phoneRaw}`}
              className="mt-5 flex items-center justify-between gap-4 rounded-2xl bg-teal-deep text-white p-5 shadow-lift hover:shadow-soft transition-shadow group"
            >
              <div className="flex items-center gap-4">
                <span className="w-12 h-12 rounded-xl bg-white/12 flex items-center justify-center group-hover:animate-pulse-ring">
                  <Siren className="w-6 h-6" strokeWidth={1.9} />
                </span>
                <div>
                  <p className="font-extrabold text-[15px]">اورژانس دندانپزشکی ۲۴ ساعته</p>
                  <p className="text-[12.5px] text-white/70 mt-0.5">دندان‌درد شدید، شکستگی، تورم — همین حالا تماس بگیرید</p>
                </div>
              </div>
              <span className="font-extrabold text-lg hidden sm:block" dir="ltr">{CLINIC.emergencyPhone}</span>
            </motion.a>
          </div>

          {/* نقشه */}
          <Reveal delay={0.15} className="min-h-[380px]">
            <div className="relative h-full min-h-[380px] rounded-[2rem] overflow-hidden shadow-soft bg-mint-soft">
              {/* نقشه استایل‌شده (بدون وابستگی خارجی) */}
              <svg viewBox="0 0 600 500" className="absolute inset-0 w-full h-full" aria-hidden>
                <rect width="600" height="500" fill="#E7F6F1" />
                <path d="M0 120 C150 110 250 140 380 120 S550 90 600 100" stroke="#CBE8DE" strokeWidth="26" fill="none" />
                <path d="M0 260 C120 250 260 280 400 260 S560 240 600 250" stroke="#CBE8DE" strokeWidth="34" fill="none" />
                <path d="M0 400 C180 390 320 420 600 395" stroke="#CBE8DE" strokeWidth="20" fill="none" />
                <path d="M120 0 C130 160 110 320 125 500" stroke="#CBE8DE" strokeWidth="18" fill="none" />
                <path d="M300 0 C290 180 310 340 295 500" stroke="#CBE8DE" strokeWidth="24" fill="none" />
                <path d="M470 0 C480 150 460 350 475 500" stroke="#CBE8DE" strokeWidth="16" fill="none" />
                <rect x="160" y="150" width="70" height="50" rx="6" fill="#D9EEE5" />
                <rect x="340" y="160" width="90" height="60" rx="6" fill="#D9EEE5" />
                <rect x="180" y="300" width="60" height="70" rx="6" fill="#D9EEE5" />
                <rect x="380" y="310" width="80" height="55" rx="6" fill="#D9EEE5" />
                <circle cx="320" cy="255" r="60" fill="#14B8A6" opacity="0.12" />
                <circle cx="320" cy="255" r="34" fill="#14B8A6" opacity="0.18" />
              </svg>
              {/* پین */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-[38%] left-1/2 -translate-x-1/2 flex flex-col items-center"
              >
                <span className="relative w-14 h-14 rounded-2xl bg-primary shadow-lift flex items-center justify-center rotate-45">
                  <MapPin className="w-6 h-6 text-white -rotate-45" strokeWidth={2} />
                </span>
                <span className="mt-3 rounded-full bg-white shadow-soft px-4 py-2 text-[12px] font-extrabold text-teal-deep whitespace-nowrap">
                  برج پزشکان مهرآوا — طبقه ۵
                </span>
              </motion.div>
              <div className="absolute bottom-5 inset-x-5 flex items-center justify-between gap-3 rounded-2xl bg-white/90 glass px-5 py-4">
                <p className="text-[12.5px] leading-6 text-foreground/80 font-medium">{CLINIC.addressShort}</p>
                <a
                  href={`https://www.google.com/maps?q=${CLINIC.geo.lat},${CLINIC.geo.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 rounded-xl bg-primary text-white text-[12.5px] font-bold px-4 py-2.5 hover:bg-teal-deep transition-colors btn-tactile"
                >
                  مسیریابی
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
