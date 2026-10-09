import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyPayment } from "@/lib/payment";
import { sendSms } from "@/lib/sms";
import { formatToman } from "@/lib/utils-fa";

// ─── POST: تأیید نهایی تراکنش ───────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const paymentId = String(body.paymentId ?? "");

    const payment = await db.payment.findUnique({ where: { id: paymentId } });
    if (!payment) {
      return NextResponse.json({ error: "تراکنش یافت نشد" }, { status: 404 });
    }
    if (payment.status === "PAID") {
      return NextResponse.json({
        success: true,
        refId: payment.refId,
        alreadyPaid: true,
        amountToman: payment.amount,
      });
    }
    if (!payment.authority) {
      return NextResponse.json({ error: "این تراکنش آغاز نشده است" }, { status: 400 });
    }

    const verify = await verifyPayment(payment.authority, payment.amount * 10);

    if (!verify.success) {
      await db.payment.update({ where: { id: payment.id }, data: { status: "FAILED" } });
      return NextResponse.json({ success: false, error: verify.error ?? "پرداخت ناموفق بود" }, { status: 400 });
    }

    await db.payment.update({
      where: { id: payment.id },
      data: {
        status: "PAID",
        refId: verify.refId ?? null,
        cardPan: verify.cardPan ?? null,
      },
    });

    // ارسال پیامک رسید پرداخت
    await sendSms(payment.phone, "PAYMENT_RECEIPT", {
      amount: payment.amount,
      refId: verify.refId,
      serviceName: payment.description,
    });

    return NextResponse.json({
      success: true,
      refId: verify.refId,
      amountToman: payment.amount,
      amountFa: formatToman(payment.amount),
      mock: verify.mock ?? false,
    });
  } catch (e) {
    console.error("payment verify error:", e);
    return NextResponse.json({ error: "خطای غیرمنتظره در تأیید پرداخت" }, { status: 500 });
  }
}
