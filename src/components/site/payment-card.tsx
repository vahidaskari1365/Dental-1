"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  CreditCard,
  ShieldCheck,
  Loader2,
  BadgeCheck,
  XCircle,
  Receipt,
  Lock,
  Smartphone,
} from "lucide-react";
import { CLINIC, VISIT_FEE } from "@/lib/clinic";
import { formatToman, toFaDigits } from "@/lib/utils-fa";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

type PayStage = "form" | "gateway" | "verifying" | "done" | "failed";

interface PayStart {
  paymentId: string;
  trackingCode: string;
  amountToman: number;
  mock: boolean;
  redirectUrl?: string;
}

interface PayReceipt {
  refId?: string;
  amountToman: number;
  mock: boolean;
}

const PRESETS = [
  { label: "ویزیت اولیه (معاینه + طرح درمان)", amount: VISIT_FEE },
  { label: "ویزیت کنترل بعد از درمان", amount: 150000 },
];

export function PaymentSection() {
  const { toast } = useToast();
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState<number>(VISIT_FEE);
  const [custom, setCustom] = useState(false);

  const [stage, setStage] = useState<PayStage>("form");
  const [pay, setPay] = useState<PayStart | null>(null);
  const [receipt, setReceipt] = useState<PayReceipt | null>(null);
  const [error, setError] = useState("");
  const [starting, setStarting] = useState(false);

  async function startPayment() {
    setError("");
    if (fullName.trim().length < 3) return setError("نام و نام خانوادگی را کامل وارد کنید");
    if (!/^0?9\d{9}$/.test(phone.replace(/\D/g, "").replace(/^98/, "0")))
      return setError("شماره موبایل معتبر وارد کنید");
    setStarting(true);
    try {
      const res = await fetch("/api/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: fullName.trim(),
          phone: phone.trim(),
          amount,
          description: PRESETS.find((p) => p.amount === amount)?.label ?? "هزینه خدمات دندانپزشکی",
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error ?? "خطا در آغاز پرداخت");
        return;
      }
      const start: PayStart = json;
      setPay(start);
      if (start.mock) {
        setStage("gateway");
      } else if (start.redirectUrl) {
        window.location.href = start.redirectUrl; // درگاه واقعی زرین‌پال
      }
    } catch {
      setError("خطای شبکه؛ دوباره تلاش کنید");
    } finally {
      setStarting(false);
    }
  }

  async function confirmGateway() {
    if (!pay) return;
    setStage("verifying");
    try {
      const res = await fetch("/api/payment/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentId: pay.paymentId }),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        setReceipt({ refId: json.refId, amountToman: json.amountToman, mock: json.mock });
        setStage("done");
        toast({ title: "پرداخت با موفقیت انجام شد", description: "رسید برای شما پیامک شد" });
      } else {
        setError(json.error ?? "پرداخت ناموفق بود");
        setStage("failed");
      }
    } catch {
      setError("خطا در تأیید پرداخت");
      setStage("failed");
    }
  }

  function cancelGateway() {
    setStage("form");
    setPay(null);
  }

  return (
    <section id="payment" className="py-24" aria-label="پرداخت آنلاین هزینه ویزیت">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* توضیحات */}
          <div className="max-w-xl">
            <span className="inline-block text-[13px] font-bold text-primary bg-secondary rounded-full px-4 py-1.5 mb-4">
              پرداخت امن آنلاین
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-teal-deep leading-snug text-balance">
              هزینه ویزیت را آنلاین، بدون صف و تماس پرداخت کنید
            </h2>
            <p className="mt-5 text-[15px] leading-8 text-muted-foreground">
              پس از پرداخت، رسید رسمی به‌صورت پیامک برای شما ارسال می‌شود. مبلغ پرداختی در
              صورت شروع درمان در همان جلسه، کامل از فاکتور نهایی کسر خواهد شد.
            </p>
            <ul className="mt-7 space-y-4">
              {[
                { icon: ShieldCheck, t: "درگاه امن زرین‌پال", d: "تمام تراکنش‌ها با پروتکل SSL و تأییدیه بانک مرکزی" },
                { icon: Receipt, t: "رسید پیامکی فوری", d: "بلافاصله پس از پرداخت، رسید رسمی دریافت می‌کنید" },
                { icon: CreditCard, t: "قابل کسر از فاکتور", d: "مبلغ ویزیت در صورت شروع درمان، رایگان می‌شود" },
              ].map((f) => (
                <li key={f.t} className="flex gap-4">
                  <span className="w-11 h-11 rounded-xl bg-white shadow-softer flex items-center justify-center shrink-0">
                    <f.icon className="w-5 h-5 text-primary" strokeWidth={1.9} />
                  </span>
                  <div>
                    <p className="font-extrabold text-[14px] text-teal-deep">{f.t}</p>
                    <p className="text-[13px] text-muted-foreground mt-1 leading-6">{f.d}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* فرم پرداخت */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ type: "spring", stiffness: 85, damping: 20 }}
            className="rounded-[2rem] bg-white shadow-soft p-7 sm:p-9"
          >
            <h3 className="font-extrabold text-lg text-teal-deep">فرم پرداخت هزینه ویزیت</h3>

            <div className="mt-6 space-y-5">
              <div className="space-y-2">
                <Label htmlFor="pay-name" className="text-[13.5px] font-semibold">نام و نام خانوادگی *</Label>
                <Input
                  id="pay-name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="مثال: امیر کاظمی"
                  className="h-12 rounded-xl"
                  autoComplete="name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pay-phone" className="text-[13.5px] font-semibold">شماره موبایل *</Label>
                <Input
                  id="pay-phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                  inputMode="tel"
                  dir="ltr"
                  className="h-12 rounded-xl text-end"
                  autoComplete="tel"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-[13.5px] font-semibold">نوع پرداخت</Label>
                <div className="space-y-2.5" role="radiogroup" aria-label="انتخاب مبلغ">
                  {PRESETS.map((p) => (
                    <button
                      key={p.amount}
                      type="button"
                      onClick={() => { setAmount(p.amount); setCustom(false); }}
                      role="radio"
                      aria-checked={amount === p.amount && !custom}
                      className={`w-full text-start rounded-xl border-2 px-4 py-3.5 flex items-center justify-between transition-all btn-tactile ${
                        amount === p.amount && !custom
                          ? "border-primary bg-secondary"
                          : "border-border hover:border-primary/40"
                      }`}
                    >
                      <span className="text-[13.5px] font-semibold text-foreground">{p.label}</span>
                      <span className="text-[13px] font-extrabold text-primary">{formatToman(p.amount)}</span>
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setCustom(true)}
                    role="radio"
                    aria-checked={custom}
                    className={`w-full text-start rounded-xl border-2 px-4 py-3.5 transition-all btn-tactile ${
                      custom ? "border-primary bg-secondary" : "border-border hover:border-primary/40"
                    }`}
                  >
                    <span className="text-[13.5px] font-semibold text-foreground">مبلغ دلخواه (تسویه بخشی از فاکتور)</span>
                  </button>
                  {custom && (
                    <Input
                      value={amount ? toFaDigits(amount.toLocaleString("en-US")) : ""}
                      onChange={(e) => {
                        const raw = e.target.value.replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d))).replace(/\D/g, "");
                        setAmount(Math.min(Number(raw || 0), 200000000));
                      }}
                      inputMode="numeric"
                      dir="ltr"
                      className="h-12 rounded-xl text-end font-bold"
                      aria-label="مبلغ به تومان"
                    />
                  )}
                </div>
              </div>

              {error && (
                <p className="text-[13px] font-semibold text-destructive bg-destructive/8 border border-destructive/20 rounded-xl px-4 py-3" role="alert">
                  {error}
                </p>
              )}

              <Button
                onClick={startPayment}
                disabled={starting || amount < 10000}
                className="w-full h-13 rounded-xl text-[15px] font-bold bg-primary hover:bg-teal-deep btn-tactile shadow-soft"
              >
                {starting ? (
                  <>
                    <Loader2 className="w-5 h-5 me-2 animate-spin" />
                    در حال اتصال به درگاه...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5 me-2" />
                    پرداخت {formatToman(amount)}
                  </>
                )}
              </Button>
              <p className="text-center text-[11.5px] text-muted-foreground flex items-center justify-center gap-1.5">
                <Lock className="w-3.5 h-3.5" />
                اتصال شما با گواهی SSL رمزنگاری می‌شود
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── درگاه شبیه‌سازی‌شده ── */}
      <Dialog open={stage === "gateway" || stage === "verifying"} onOpenChange={(o) => !o && cancelGateway()}>
        <DialogContent className="sm:max-w-md rounded-3xl p-0 overflow-hidden" dir="rtl">
          <div className="bg-gradient-to-l from-teal-deep to-primary px-6 py-5 text-white">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2.5 text-white text-[15px]">
                <ShieldCheck className="w-5 h-5" />
                درگاه پرداخت اینترنتی زرین‌پال
              </DialogTitle>
            </DialogHeader>
            <p className="text-[12px] text-white/75 mt-1">پرداخت امن به {CLINIC.name}</p>
          </div>

          <div className="p-6 space-y-5">
            <div className="rounded-2xl bg-mint-soft border border-accent p-4 space-y-2.5 text-[13px]">
              <div className="flex justify-between">
                <span className="text-muted-foreground">پذیرنده</span>
                <span className="font-bold">{CLINIC.shortName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">مبلغ</span>
                <span className="font-extrabold text-primary text-[15px]">{pay ? formatToman(pay.amountToman) : ""}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">کد سفارش</span>
                <span className="font-bold tracking-wider" dir="ltr">{pay?.trackingCode}</span>
              </div>
            </div>

            <div className="rounded-2xl border border-border p-4 space-y-3">
              <p className="text-[12px] font-bold text-muted-foreground flex items-center gap-2">
                <Smartphone className="w-4 h-4" />
                شبیه‌ساز ترمینال پرداخت (حالت آزمایشی)
              </p>
              <Input
                defaultValue="6104  ****  ****  3791"
                dir="ltr"
                readOnly
                className="h-11 rounded-xl text-end bg-muted/50 font-bold"
                aria-label="شماره کارت (نمایشی)"
              />
              <p className="text-[11px] leading-5 text-muted-foreground">
                این یک شبیه‌ساز امن برای نمایش فرآیند پرداخت است. با ثبت کلید میانجی زرین‌پال در تنظیمات، پرداخت واقعی فعال می‌شود.
              </p>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={confirmGateway}
                disabled={stage === "verifying"}
                className="flex-1 h-12 rounded-xl bg-primary hover:bg-teal-deep font-bold btn-tactile"
              >
                {stage === "verifying" ? (
                  <>
                    <Loader2 className="w-4.5 h-4.5 me-2 animate-spin" />
                    در حال پردازش...
                  </>
                ) : (
                  "پرداخت و دریافت رسید"
                )}
              </Button>
              <Button
                variant="outline"
                onClick={cancelGateway}
                disabled={stage === "verifying"}
                className="rounded-xl border-border"
              >
                انصراف
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── رسید موفقیت/عدم موفقیت ── */}
      <Dialog open={stage === "done" || stage === "failed"} onOpenChange={(o) => !o && setStage("form")}>
        <DialogContent className="sm:max-w-sm rounded-3xl" dir="rtl">
          {stage === "done" && receipt && (
            <div className="text-center py-4">
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 12 }}
                className="inline-flex w-18 h-18 rounded-full bg-secondary items-center justify-center mb-4"
              >
                <BadgeCheck className="w-9 h-9 text-primary" strokeWidth={1.8} />
              </motion.span>
              <h3 className="text-xl font-extrabold text-teal-deep">پرداخت موفق</h3>
              <p className="mt-2 text-[13px] text-muted-foreground">رسید پیامکی ارسال شد</p>
              <div className="mt-5 rounded-2xl bg-mint-soft border border-accent p-5 space-y-2.5 text-[13px] text-start">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">مبلغ</span>
                  <span className="font-extrabold">{formatToman(receipt.amountToman)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">شماره پیگیری</span>
                  <span className="font-extrabold text-primary" dir="ltr">{receipt.refId}</span>
                </div>
              </div>
              <Button
                onClick={() => setStage("form")}
                className="mt-6 w-full rounded-xl bg-primary hover:bg-teal-deep btn-tactile"
              >
                بازگشت به سایت
              </Button>
            </div>
          )}
          {stage === "failed" && (
            <div className="text-center py-4">
              <span className="inline-flex w-18 h-18 rounded-full bg-destructive/10 items-center justify-center mb-4">
                <XCircle className="w-9 h-9 text-destructive" strokeWidth={1.8} />
              </span>
              <h3 className="text-xl font-extrabold text-foreground">پرداخت ناموفق</h3>
              <p className="mt-2 text-[13px] text-muted-foreground leading-6">{error}</p>
              <Button
                onClick={() => setStage("form")}
                variant="outline"
                className="mt-6 w-full rounded-xl"
              >
                تلاش مجدد
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}

// ─── هندلر بازگشت از درگاه واقعی زرین‌پال (?payment-callback=1) ──
export function PaymentCallbackHandler() {
  const params = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;
    const paymentId = params.get("pay");
    if (params.get("payment-callback") !== "1" || !paymentId) return;

    (async () => {
      try {
        const res = await fetch("/api/payment/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ paymentId }),
        });
        const json = await res.json();
        if (res.ok && json.success) {
          toast({
            title: "پرداخت با موفقیت انجام شد",
            description: `شماره پیگیری: ${json.refId} — رسید پیامکی ارسال شد`,
          });
        } else {
          toast({ title: "پرداخت ناموفق بود", description: json.error ?? "در صورت کسر مبلغ تا ۷۲ ساعت بازگشت داده می‌شود", variant: "destructive" });
        }
      } catch {
        toast({ title: "خطا در تأیید پرداخت", variant: "destructive" });
      } finally {
        router.replace("/", { scroll: false });
      }
    })();
  }, [params, router, toast]);

  return null;
}
