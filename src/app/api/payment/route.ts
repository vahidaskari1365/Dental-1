import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { startPayment } from "@/lib/payment";
import { isValidIranPhone, normalizePhone, generateTrackingCode } from "@/lib/utils-fa";
import { VISIT_FEE } from "@/lib/clinic";

// ─── POST: شروع پرداخت هزینه ویزیت ──────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const fullName = String(body.fullName ?? "").trim();
    const phoneRaw = String(body.phone ?? "").trim();
    const description = String(body.description ?? "هزینه ویزیت اولیه").trim().slice(0, 200);
    const amountToman = Number(body.amount ?? VISIT_FEE);

    if (fullName.length < 3) {
      return NextResponse.json({ error: "نام و نام خانوادگی را کامل وارد کنید" }, { status: 400 });
    }
    if (!isValidIranPhone(phoneRaw)) {
      return NextResponse.json({ error: "شماره موبایل معتبر نیست" }, { status: 400 });
    }
    if (!Number.isFinite(amountToman) || amountToman < 10000 || amountToman > 200000000) {
      return NextResponse.json({ error: "مبلغ پرداخت خارج از محدوده مجاز است" }, { status: 400 });
    }

    const phone = normalizePhone(phoneRaw);
    const trackingCode = generateTrackingCode("PAY");
    const amountRial = amountToman * 10;

    const payment = await db.payment.create({
      data: { trackingCode, fullName, phone, description, amount: amountToman, status: "PENDING" },
    });

    // URL بازگشت: همان صفحه اصلی + پرامپتر کنترلی (تک‌صفحه‌ای)
    const origin = req.headers.get("origin") ?? "http://localhost:3000";
    const callbackUrl = `${origin}/?payment-callback=1&pay=${payment.id}`;

    const start = await startPayment({
      amount: amountRial,
      description: `${description} — ${CLINIC_NAME} — کد ${trackingCode}`,
      callbackUrl,
      mobile: phone,
    });

    if (!start.success) {
      await db.payment.update({ where: { id: payment.id }, data: { status: "FAILED" } });
      return NextResponse.json({ error: start.error ?? "خطا در اتصال به درگاه پرداخت" }, { status: 502 });
    }

    await db.payment.update({
      where: { id: payment.id },
      data: { authority: start.authority ?? null },
    });

    return NextResponse.json({
      success: true,
      paymentId: payment.id,
      trackingCode,
      amountToman,
      mock: start.mock ?? false,
      redirectUrl: start.redirectUrl,
      authority: start.authority,
    });
  } catch (e) {
    console.error("payment start error:", e);
    return NextResponse.json({ error: "خطای غیرمنتظره در آغاز پرداخت" }, { status: 500 });
  }
}

const CLINIC_NAME = "کلینیک مهرآوا";
