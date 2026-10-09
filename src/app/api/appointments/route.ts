import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sendSms } from "@/lib/sms";
import { SERVICES, TIME_SLOTS } from "@/lib/clinic";
import {
  formatJalaliFull,
  faTime12,
  isValidIranPhone,
  normalizePhone,
  generateTrackingCode,
  dateKey,
} from "@/lib/utils-fa";

// ─── GET: وضعیت اسلات‌های یک روز ────────────────────────────────
export async function GET(req: NextRequest) {
  const date = req.nextUrl.searchParams.get("date");
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ error: "پارامتر تاریخ نامعتبر است" }, { status: 400 });
  }

  const d = new Date(date + "T12:00:00");
  const weekday = d.getDay(); // 5 = جمعه

  // جمعه‌ها فقط اورژانس — نوبت آنلاین ندارد
  if (weekday === 5) {
    return NextResponse.json({ closed: true, reason: "friday", slots: [] });
  }

  const booked = await db.appointment.findMany({
    where: { date, status: { in: ["PENDING", "CONFIRMED"] } },
    select: { timeSlot: true },
  });
  const bookedSet = new Set(booked.map((b) => b.timeSlot));

  // حذف اسلات‌های گذشته برای امروز (زمان تهران)
  const nowTehran = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Tehran" }));
  const todayKey = dateKey(nowTehran);
  let slots = TIME_SLOTS.filter((s) => !bookedSet.has(s));
  if (date === todayKey) {
    const nowMin = nowTehran.getHours() * 60 + nowTehran.getMinutes();
    slots = slots.filter((s) => {
      const [h, m] = s.split(":").map(Number);
      return h * 60 + m > nowMin + 60; // حداقل ۱ ساعت فاصله
    });
  }

  return NextResponse.json({
    closed: false,
    slots,
    taken: TIME_SLOTS.filter((s) => bookedSet.has(s)),
  });
}

// ─── POST: ثبت نوبت جدید ────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const fullName = String(body.fullName ?? "").trim();
    const phoneRaw = String(body.phone ?? "").trim();
    const serviceId = String(body.serviceId ?? "");
    const date = String(body.date ?? "");
    const timeSlot = String(body.timeSlot ?? "");
    const notes = String(body.notes ?? "").trim() || null;

    // اعتبارسنجی
    if (fullName.length < 3) {
      return NextResponse.json({ error: "نام و نام خانوادگی را کامل وارد کنید" }, { status: 400 });
    }
    if (!isValidIranPhone(phoneRaw)) {
      return NextResponse.json({ error: "شماره موبایل معتبر نیست (مثال: ۰۹۱۲۳۴۵۶۷۸۹)" }, { status: 400 });
    }
    const service = SERVICES.find((s) => s.id === serviceId);
    if (!service) {
      return NextResponse.json({ error: "خدمت انتخاب‌شده معتبر نیست" }, { status: 400 });
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !TIME_SLOTS.includes(timeSlot)) {
      return NextResponse.json({ error: "زمان نوبت نامعتبر است" }, { status: 400 });
    }
    const d = new Date(date + "T12:00:00");
    if (d.getDay() === 5) {
      return NextResponse.json({ error: "روز جمعه پذیرش آنلاین نداریم" }, { status: 400 });
    }

    // بررسی تداخل نوبت
    const conflict = await db.appointment.findFirst({
      where: { date, timeSlot, status: { in: ["PENDING", "CONFIRMED"] } },
    });
    if (conflict) {
      return NextResponse.json({ error: "این بازه زمانی همگی پر شده است؛ لطفاً زمان دیگری انتخاب کنید" }, { status: 409 });
    }

    // جلوگیری از نوبت تکراری با همین شماره در همان روز
    const phone = normalizePhone(phoneRaw);
    const duplicate = await db.appointment.findFirst({
      where: { phone, date, status: { in: ["PENDING", "CONFIRMED"] } },
    });
    if (duplicate) {
      return NextResponse.json(
        { error: "شما قبلاً برای این روز نوبت ثبت کرده‌اید. برای تغییر نوبت با کلینیک تماس بگیرید." },
        { status: 409 }
      );
    }

    const trackingCode = generateTrackingCode("MHR");
    const dateFa = formatJalaliFull(d);
    const timeFa = faTime12(timeSlot);

    const appointment = await db.appointment.create({
      data: { trackingCode, fullName, phone, serviceId, serviceName: service.title, date, timeSlot, notes },
    });

    // ارسال پیامک تأیید
    const sms = await sendSms(phone, "BOOKING_CONFIRM", {
      trackingCode,
      serviceName: service.title,
      dateFa,
      timeFa,
    });

    return NextResponse.json({
      success: true,
      appointment: {
        trackingCode: appointment.trackingCode,
        fullName: appointment.fullName,
        serviceName: appointment.serviceName,
        dateFa,
        timeFa,
        priceFrom: service.priceFrom,
      },
      sms: { status: sms.status, provider: sms.provider },
    });
  } catch (e) {
    console.error("appointment error:", e);
    return NextResponse.json({ error: "خطای غیرمنتظره در ثبت نوبت. لطفاً دوباره تلاش کنید." }, { status: 500 });
  }
}
