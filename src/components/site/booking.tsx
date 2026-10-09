"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CalendarDays,
  Clock3,
  User,
  Check,
  ChevronRight,
  ChevronLeft,
  Loader2,
  MessageSquareText,
  PhoneCall,
  BadgeCheck,
  AlertCircle,
  Lock,
} from "lucide-react";
import { SERVICES, TIME_SLOTS } from "@/lib/clinic";
import {
  formatToman,
  jalaliShort,
  dateKey,
  faTime12,
  toFaDigits,
} from "@/lib/utils-fa";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";

interface BookingResult {
  trackingCode: string;
  fullName: string;
  serviceName: string;
  dateFa: string;
  timeFa: string;
  priceFrom: number;
}

interface SlotResponse {
  closed: boolean;
  reason?: string;
  slots: string[];
}

const STEPS = [
  { id: 1, label: "انتخاب خدمت", icon: CalendarDays },
  { id: 2, label: "زمان نوبت", icon: Clock3 },
  { id: 3, label: "اطلاعات تماس", icon: User },
];

// تولید ۱۴ روز آینده
function nextDays(n: number): Date[] {
  const out: Date[] = [];
  const today = new Date();
  for (let i = 0; i < n; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    out.push(d);
  }
  return out;
}

export function Booking() {
  const [step, setStep] = useState(1);
  const [serviceId, setServiceId] = useState("");
  const [date, setDate] = useState<Date | null>(null);
  const [timeSlot, setTimeSlot] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");

  const [slots, setSlots] = useState<string[] | null>(null);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [fridayClosed, setFridayClosed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<BookingResult | null>(null);
  const [smsStatus, setSmsStatus] = useState<string>("");

  const days = useMemo(() => nextDays(14), []);
  const service = SERVICES.find((s) => s.id === serviceId);

  const fetchSlots = useCallback(async (d: Date) => {
    setSlotsLoading(true);
    setFridayClosed(false);
    setTimeSlot("");
    try {
      const res = await fetch(`/api/appointments?date=${dateKey(d)}`);
      const json: SlotResponse = await res.json();
      if (json.closed) {
        setFridayClosed(true);
        setSlots([]);
      } else {
        setSlots(json.slots);
      }
    } catch {
      setError("خطا در دریافت اسلات‌ها. دوباره تلاش کنید.");
      setSlots([]);
    } finally {
      setSlotsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (date) fetchSlots(date);
  }, [date, fetchSlots]);

  async function submit() {
    setError("");
    if (fullName.trim().length < 3) return setError("نام و نام خانوادگی را کامل وارد کنید");
    if (!/^0?9\d{9}$/.test(phone.replace(/\D/g, "").replace(/^98/, "0")))
      return setError("شماره موبایل معتبر وارد کنید (مثال: ۰۹۱۲۳۴۵۶۷۸۹)");
    setSubmitting(true);
    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceId,
          date: date ? dateKey(date) : "",
          timeSlot,
          fullName: fullName.trim(),
          phone: phone.trim(),
          notes: notes.trim(),
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error ?? "خطا در ثبت نوبت");
      } else {
        setResult(json.appointment);
        setSmsStatus(json.sms?.status ?? "");
        setStep(4);
      }
    } catch {
      setError("خطای شبکه؛ اتصال اینترنت را بررسی کنید");
    } finally {
      setSubmitting(false);
    }
  }

  const canNext =
    (step === 1 && !!serviceId) ||
    (step === 2 && !!date && !!timeSlot) ||
    step === 3;

  return (
    <section id="booking" className="relative py-24 overflow-hidden" aria-label="سامانه نوبت‌دهی آنلاین">
      <div aria-hidden className="absolute inset-0 -z-10">
        <div className="absolute top-20 -start-40 w-[420px] h-[420px] rounded-full bg-secondary blur-3xl opacity-70" />
        <div className="absolute bottom-10 -end-32 w-[380px] h-[380px] rounded-full bg-mint-soft blur-3xl" />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto">
          <span className="inline-block text-[13px] font-bold text-primary bg-secondary rounded-full px-4 py-1.5 mb-4">
            نوبت‌دهی آنلاین
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-teal-deep leading-snug text-balance">
            در کمتر از ۲ دقیقه نوبت بگیرید
          </h2>
          <p className="mt-4 text-[14.5px] leading-7.5 text-muted-foreground">
            نوبت شما بلافاصله ثبت و پیامک تأیید ارسال می‌شود؛ یک روز قبل هم پیامک یادآوری دریافت می‌کنید.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ type: "spring", stiffness: 85, damping: 20 }}
          className="mt-12 rounded-[2rem] bg-white shadow-soft overflow-hidden"
        >
          {/* مراحل */}
          {step < 4 && (
            <div className="flex items-center justify-center gap-0 px-6 pt-8 pb-6" aria-label={`مرحله ${step} از ۳`}>
              {STEPS.map((s, i) => {
                const active = step === s.id;
                const done = step > s.id;
                return (
                  <div key={s.id} className="flex items-center">
                    <div className="flex flex-col items-center gap-2">
                      <span
                        className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                          done
                            ? "bg-primary text-white"
                            : active
                              ? "bg-secondary text-primary ring-4 ring-secondary/60"
                              : "bg-muted text-muted-foreground/50"
                        }`}
                      >
                        {done ? <Check className="w-5 h-5" strokeWidth={2.5} /> : <s.icon className="w-5 h-5" strokeWidth={2} />}
                      </span>
                      <span
                        className={`text-[11.5px] font-semibold whitespace-nowrap ${
                          active ? "text-primary" : done ? "text-foreground/70" : "text-muted-foreground/50"
                        }`}
                      >
                        {s.label}
                      </span>
                    </div>
                    {i < STEPS.length - 1 && (
                      <span className={`w-14 sm:w-24 h-0.5 mx-2 mb-6 rounded-full transition-colors ${step > s.id ? "bg-primary" : "bg-border"}`} />
                    )}
                  </div>
                );
              })}
            </div>
          )}

          <div className="px-6 sm:px-10 pb-10">
            <AnimatePresence mode="wait">
              {/* ── مرحله ۱: انتخاب خدمت ── */}
              {step === 1 && (
                <motion.div
                  key="s1"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ type: "spring", stiffness: 120, damping: 22 }}
                  className="grid sm:grid-cols-2 gap-3"
                >
                  {SERVICES.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => {
                        setServiceId(s.id);
                        setStep(2);
                      }}
                      className={`text-start rounded-2xl border-2 p-4 transition-all duration-200 btn-tactile ${
                        serviceId === s.id
                          ? "border-primary bg-secondary"
                          : "border-border bg-white hover:border-primary/40 hover:bg-mint-soft/50"
                      }`}
                      aria-pressed={serviceId === s.id}
                    >
                      <span className="font-bold text-[14.5px] text-teal-deep">{s.title}</span>
                      <span className="block mt-1 text-[12px] text-muted-foreground leading-6">{s.shortDesc}</span>
                      <span className="block mt-2 text-[12.5px] font-bold text-primary">
                        شروع از {formatToman(s.priceFrom)}
                      </span>
                    </button>
                  ))}
                </motion.div>
              )}

              {/* ── مرحله ۲: انتخاب زمان ── */}
              {step === 2 && (
                <motion.div
                  key="s2"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ type: "spring", stiffness: 120, damping: 22 }}
                >
                  <p className="text-[13.5px] font-bold text-teal-deep mb-3">
                    ۱. روز مراجعه را انتخاب کنید
                    {service && <span className="ms-2 font-medium text-muted-foreground">— خدمت: {service.title}</span>}
                  </p>
                  <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-thin" role="listbox" aria-label="انتخاب روز">
                    {days.map((d) => {
                      const j = jalaliShort(d);
                      const isFriday = d.getDay() === 5;
                      const selected = date && dateKey(date) === dateKey(d);
                      return (
                        <button
                          key={dateKey(d)}
                          disabled={isFriday}
                          onClick={() => setDate(d)}
                          role="option"
                          aria-selected={selected}
                          className={`shrink-0 w-[74px] rounded-2xl border-2 py-3 px-2 text-center transition-all duration-200 btn-tactile ${
                            isFriday
                              ? "border-border/50 bg-muted/50 opacity-50 cursor-not-allowed"
                              : selected
                                ? "border-primary bg-primary text-white shadow-soft"
                                : "border-border bg-white hover:border-primary/40"
                          }`}
                        >
                          <span className={`block text-[11px] font-medium ${selected ? "text-white/80" : "text-muted-foreground"}`}>
                            {j.weekday}
                          </span>
                          <span className={`block text-xl font-extrabold mt-1 ${selected ? "text-white" : "text-teal-deep"}`}>
                            {j.day}
                          </span>
                          <span className={`block text-[10.5px] mt-0.5 ${selected ? "text-white/75" : "text-muted-foreground/70"}`}>
                            {isFriday ? "اورژانس" : j.month}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  <p className="text-[13.5px] font-bold text-teal-deep mt-6 mb-3">۲. ساعت مراجعه</p>
                  {!date && (
                    <p className="text-[13px] text-muted-foreground bg-muted/60 rounded-xl p-4">
                      ابتدا روز مراجعه را از تقویم بالا انتخاب کنید
                    </p>
                  )}
                  {date && slotsLoading && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      {[...Array(8)].map((_, i) => (
                        <Skeleton key={i} className="h-14 rounded-xl" />
                      ))}
                    </div>
                  )}
                  {date && !slotsLoading && fridayClosed && (
                    <p className="text-[13px] text-muted-foreground bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center gap-2">
                      <AlertCircle className="w-4.5 h-4.5 text-amber-500 shrink-0" />
                      روز جمعه فقط پذیرش اورژانس تلفنی داریم. لطفاً روز دیگری انتخاب کنید.
                    </p>
                  )}
                  {date && !slotsLoading && !fridayClosed && slots && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      {TIME_SLOTS.map((t) => {
                        const available = slots.includes(t);
                        const selected = timeSlot === t;
                        return (
                          <button
                            key={t}
                            disabled={!available}
                            onClick={() => setTimeSlot(t)}
                            aria-pressed={selected}
                            className={`rounded-xl border-2 py-3 text-[13px] font-bold transition-all duration-200 btn-tactile ${
                              selected
                                ? "border-primary bg-primary text-white shadow-soft"
                                : available
                                  ? "border-border bg-white hover:border-primary/40 text-teal-deep"
                                  : "border-border/40 bg-muted/40 text-muted-foreground/40 cursor-not-allowed line-through"
                            }`}
                          >
                            {faTime12(t)}
                          </button>
                        );
                      })}
                    </div>
                  )}
                  {date && !slotsLoading && !fridayClosed && slots && slots.length === 0 && (
                    <p className="text-[13px] text-muted-foreground bg-muted/60 rounded-xl p-4">
                      همه اسلات‌های این روز پر شده است؛ روز دیگری را انتخاب کنید.
                    </p>
                  )}
                </motion.div>
              )}

              {/* ── مرحله ۳: اطلاعات تماس ── */}
              {step === 3 && (
                <motion.div
                  key="s3"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ type: "spring", stiffness: 120, damping: 22 }}
                  className="grid lg:grid-cols-[1.3fr_1fr] gap-8"
                >
                  <div className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="bk-name" className="text-[13.5px] font-semibold">
                        نام و نام خانوادگی <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="bk-name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="مثال: سارا محمدی"
                        className="h-12 rounded-xl border-border bg-white"
                        autoComplete="name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bk-phone" className="text-[13.5px] font-semibold">
                        شماره موبایل <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="bk-phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                        inputMode="tel"
                        dir="ltr"
                        className="h-12 rounded-xl border-border bg-white text-end"
                        autoComplete="tel"
                      />
                      <p className="text-[11.5px] text-muted-foreground flex items-center gap-1.5">
                        <Lock className="w-3.5 h-3.5" />
                        شماره شما فقط برای ارسال پیامک نوبت استفاده می‌شود.
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bk-notes" className="text-[13.5px] font-semibold">
                        توضیحات (اختیاری)
                      </Label>
                      <Textarea
                        id="bk-notes"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="مثلاً: از دندانپزشکی می‌ترسم، چند سالی است درمان نشده‌ام..."
                        className="min-h-24 rounded-xl border-border bg-white resize-none"
                      />
                    </div>
                  </div>

                  {/* خلاصه نوبت */}
                  <aside className="rounded-2xl bg-mint-soft border border-accent p-6 h-fit" aria-label="خلاصه نوبت">
                    <h3 className="font-extrabold text-teal-deep text-[15px] mb-4">خلاصه نوبت شما</h3>
                    <dl className="space-y-3 text-[13px]">
                      <div className="flex justify-between gap-3">
                        <dt className="text-muted-foreground">خدمت</dt>
                        <dd className="font-bold text-foreground">{service?.title}</dd>
                      </div>
                      <div className="flex justify-between gap-3">
                        <dt className="text-muted-foreground">روز</dt>
                        <dd className="font-bold text-foreground">{date ? jalaliShort(date).weekday + " " + jalaliShort(date).day + " " + jalaliShort(date).month : "—"}</dd>
                      </div>
                      <div className="flex justify-between gap-3">
                        <dt className="text-muted-foreground">ساعت</dt>
                        <dd className="font-bold text-foreground">{timeSlot ? faTime12(timeSlot) : "—"}</dd>
                      </div>
                      <div className="flex justify-between gap-3">
                        <dt className="text-muted-foreground">هزینه تقریبی</dt>
                        <dd className="font-extrabold text-primary">{service ? formatToman(service.priceFrom) : "—"}</dd>
                      </div>
                    </dl>
                    <p className="mt-4 pt-4 border-t border-accent text-[11.5px] leading-6 text-muted-foreground">
                      هزینه دقیق پس از معاینه و طرح درمان اعلام می‌شود. ویزیت اولیه {formatToman(350000)} است که در صورت شروع درمان کسر خواهد شد.
                    </p>
                  </aside>
                </motion.div>
              )}

              {/* ── مرحله ۴: موفقیت ── */}
              {step === 4 && result && (
                <motion.div
                  key="s4"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", stiffness: 100, damping: 18 }}
                  className="text-center py-6"
                >
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 12, delay: 0.1 }}
                    className="inline-flex w-20 h-20 rounded-full bg-secondary items-center justify-center mb-5"
                  >
                    <BadgeCheck className="w-10 h-10 text-primary" strokeWidth={1.8} />
                  </motion.span>
                  <h3 className="text-2xl font-extrabold text-teal-deep">نوبت شما با موفقیت ثبت شد</h3>
                  <p className="mt-3 text-[14px] text-muted-foreground leading-7">
                    {result.fullName} عزیز، منتظر دیدار شما هستیم
                  </p>

                  <div className="mt-7 max-w-md mx-auto rounded-2xl bg-mint-soft border border-accent p-6 text-start space-y-3 text-[13.5px]">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">کد پیگیری</span>
                      <span className="font-extrabold text-primary tracking-wider" dir="ltr">{result.trackingCode}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">خدمت</span>
                      <span className="font-bold">{result.serviceName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">زمان</span>
                      <span className="font-bold">{result.dateFa} — ساعت {result.timeFa}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">وضعیت پیامک</span>
                      <span className="font-bold flex items-center gap-1.5">
                        <MessageSquareText className="w-4 h-4 text-primary" />
                        {smsStatus === "MOCK" ? "ثبت شد (حالت آزمایشی)" : "ارسال شد"}
                      </span>
                    </div>
                  </div>

                  <div className="mt-7 flex flex-wrap justify-center gap-3">
                    <Button asChild className="rounded-full bg-primary hover:bg-teal-deep btn-tactile">
                      <a href="#payment">پرداخت هزینه ویزیت آنلاین</a>
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setStep(1);
                        setServiceId("");
                        setDate(null);
                        setTimeSlot("");
                        setFullName("");
                        setPhone("");
                        setNotes("");
                        setResult(null);
                      }}
                      className="rounded-full bg-white glass border-transparent"
                    >
                      رزرو نوبت جدید
                    </Button>
                  </div>

                  <p className="mt-5 text-[12px] text-muted-foreground flex items-center justify-center gap-1.5">
                    <PhoneCall className="w-3.5 h-3.5" />
                    برای تغییر یا لغو نوبت با شماره ۰۲۱-۹۱۰۰۸۸۰۰ تماس بگیرید
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* خطا */}
            {error && step < 4 && (
              <motion.p
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-5 text-[13px] font-semibold text-destructive bg-destructive/8 border border-destructive/20 rounded-xl px-4 py-3 flex items-center gap-2"
                role="alert"
              >
                <AlertCircle className="w-4.5 h-4.5 shrink-0" />
                {error}
              </motion.p>
            )}

            {/* دکمه‌های ناوبری */}
            {step < 4 && (
              <div className="mt-8 flex items-center justify-between">
                <Button
                  variant="ghost"
                  onClick={() => setStep((s) => Math.max(1, s - 1))}
                  disabled={step === 1}
                  className="rounded-full text-muted-foreground disabled:opacity-0"
                >
                  <ChevronRight className="w-4.5 h-4.5 me-1" />
                  مرحله قبل
                </Button>
                {step < 3 ? (
                  <Button
                    onClick={() => canNext && setStep((s) => s + 1)}
                    disabled={!canNext}
                    className="rounded-full h-12 px-8 bg-primary hover:bg-teal-deep btn-tactile shadow-soft disabled:shadow-none"
                  >
                    مرحله بعد
                    <ChevronLeft className="w-4.5 h-4.5 ms-1" />
                  </Button>
                ) : (
                  <Button
                    onClick={submit}
                    disabled={submitting}
                    className="rounded-full h-12 px-8 bg-primary hover:bg-teal-deep btn-tactile shadow-soft disabled:shadow-none"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4.5 h-4.5 me-2 animate-spin" />
                        در حال ثبت...
                      </>
                    ) : (
                      <>
                        <Check className="w-4.5 h-4.5 me-2" />
                        ثبت نهایی نوبت
                      </>
                    )}
                  </Button>
                )}
              </div>
            )}
          </div>
        </motion.div>

        {/* یادداشت اعتماد */}
        <div className="mt-6 flex flex-wrap justify-center gap-x-7 gap-y-2 text-[12px] font-medium text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-primary" />
            اطلاعات شما محرمانه است
          </span>
          <span className="flex items-center gap-1.5">
            <MessageSquareText className="w-3.5 h-3.5 text-primary" />
            پیامک تأیید و یادآوری خودکار
          </span>
          <span className="flex items-center gap-1.5">
            <BadgeCheck className="w-3.5 h-3.5 text-primary" />
            لغو رایگان تا ۲۴ ساعت قبل
          </span>
        </div>
      </div>
    </section>
  );
}
