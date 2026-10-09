// ─── سامانه ارسال پیامک — لایه انتزاعی چند-سرویس‌دهنده ─────────────
// سرویس‌دهنده‌های پشتیبانی‌شده (از طریق متغیرهای محیطی):
//   KAVENEGAR_API_KEY   → کاوه‌نگار (kavenegar.com)
//   SMSIR_API_KEY + SMSIR_LINE → SMS.ir
//   در غیر این صورت → حالت MOCK: پیامک در دیتابیس ثبت می‌شود (قابل مشاهده در لاگ)

import { db } from "@/lib/db";

export type SmsType = "BOOKING_CONFIRM" | "BOOKING_REMINDER" | "PAYMENT_RECEIPT" | "GENERAL";

export interface SmsResult {
  status: "SENT" | "FAILED" | "MOCK";
  provider: string;
  providerRef?: string;
  error?: string;
}

interface SmsTemplateData {
  trackingCode?: string;
  serviceName?: string;
  dateFa?: string;
  timeFa?: string;
  amount?: number;
  refId?: string;
}

// ─── قالب‌های پیامک ─────────────────────────────────────────────
export function buildSmsMessage(type: SmsType, data: SmsTemplateData): string {
  const fa = (n: string | number) =>
    String(n).replace(/[0-9]/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[Number(d)]);
  const price = (v: number) => fa(v.toLocaleString("en-US"));

  switch (type) {
    case "BOOKING_CONFIRM":
      return [
        `${CLINIC_NAME}`,
        `${data.fullName ? data.fullName + " عزیز،" : ""} نوبت شما ثبت شد.`,
        `خدمت: ${data.serviceName}`,
        `زمان: ${data.dateFa} ساعت ${data.timeFa}`,
        `کد پیگیری: ${data.trackingCode}`,
        `آدرس: ولیعصر، برج پزشکان مهرآوا، طبقه ۵`,
        `تلفن: ۰۲۱-۹۱۰۰۸۸۰۰`,
      ].filter(Boolean).join("\n");
    case "BOOKING_REMINDER":
      return [
        `${CLINIC_NAME}`,
        `یادآوری نوبت: فردا ${data.dateFa} ساعت ${data.timeFa}`,
        `خدمت: ${data.serviceName}`,
        `کد پیگیری: ${data.trackingCode}`,
        `لطفاً ۱۰ دقیقه قبل حاضر باشید.`,
      ].join("\n");
    case "PAYMENT_RECEIPT":
      return [
        `${CLINIC_NAME}`,
        `پرداخت شما با موفقیت انجام شد.`,
        `مبلغ: ${price(data.amount || 0)} تومان`,
        `شماره پیگیری: ${data.refId}`,
        `بابت: ${data.serviceName || "هزینه ویزیت"}`,
        `از اعتماد شما سپاسگزاریم.`,
      ].join("\n");
    default:
      return data.trackingCode ? `کد پیگیری شما: ${data.trackingCode}` : `${CLINIC_NAME}`;
  }
}

const CLINIC_NAME = "کلینیک دندانپزشکی مهرآوا";

// ─── ارسال با کاوه‌نگار ─────────────────────────────────────────
async function sendKavenegar(phone: string, message: string): Promise<SmsResult> {
  const apiKey = process.env.KAVENEGAR_API_KEY;
  if (!apiKey) return { status: "FAILED", provider: "kavenegar", error: "no api key" };
  try {
    const url = `https://api.kavenegar.com/v1/${apiKey}/sms/send.json?receptor=${encodeURIComponent(
      phone
    )}&message=${encodeURIComponent(message)}&sender=10008663`;
    const res = await fetch(url, { method: "GET" });
    const json = await res.json();
    if (json?.return?.status === 200) {
      return { status: "SENT", provider: "kavenegar", providerRef: String(json?.entries?.[0]?.messageid ?? "") };
    }
    return { status: "FAILED", provider: "kavenegar", error: json?.return?.message ?? "unknown" };
  } catch (e) {
    return { status: "FAILED", provider: "kavenegar", error: String(e) };
  }
}

// ─── ارسال با SMS.ir ────────────────────────────────────────────
async function sendSmsIr(phone: string, message: string): Promise<SmsResult> {
  const apiKey = process.env.SMSIR_API_KEY;
  const line = process.env.SMSIR_LINE;
  if (!apiKey || !line) return { status: "FAILED", provider: "smsir", error: "no api key" };
  try {
    const res = await fetch("https://api.sms.ir/v1/send/bulk", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-api-key": apiKey },
      body: JSON.stringify({ lineNumber: line, messageText: message, mobiles: [phone] }),
    });
    const json = await res.json();
    if (json?.status === 1) {
      return { status: "SENT", provider: "smsir", providerRef: String(json?.data ?? "") };
    }
    return { status: "FAILED", provider: "smsir", error: json?.message ?? "unknown" };
  } catch (e) {
    return { status: "FAILED", provider: "smsir", error: String(e) };
  }
}

// ─── تابع اصلی ارسال + ثبت لاگ ──────────────────────────────────
export async function sendSms(phone: string, type: SmsType, data: SmsTemplateData): Promise<SmsResult> {
  const message = buildSmsMessage(type, data);
  let result: SmsResult;

  if (process.env.KAVENEGAR_API_KEY) {
    result = await sendKavenegar(phone, message);
  } else if (process.env.SMSIR_API_KEY && process.env.SMSIR_LINE) {
    result = await sendSmsIr(phone, message);
  } else {
    // حالت آزمایشی: بدون کلید API — پیام در دیتابیس ذخیره می‌شود
    result = { status: "MOCK", provider: "mock" };
  }

  try {
    await db.smsLog.create({
      data: {
        phone,
        message,
        type,
        provider: result.provider,
        status: result.status,
        providerRef: result.providerRef ?? null,
      },
    });
  } catch (e) {
    console.error("SMS log failed:", e);
  }

  return result;
}
