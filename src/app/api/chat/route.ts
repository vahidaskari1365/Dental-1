import { NextRequest } from "next/server";
import ZAI from "z-ai-web-dev-sdk";
import { db } from "@/lib/db";
import { CLINIC, SERVICES, VISIT_FEE } from "@/lib/clinic";

export const runtime = "nodejs";
export const maxDuration = 60;

// ─── محدودیت نرخ ساده در حافظه ──────────────────────────────────
const rateMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 12; // پیام در هر دقیقه
const RATE_WINDOW = 60_000;

function checkRate(sessionId: string): boolean {
  const now = Date.now();
  const entry = rateMap.get(sessionId);
  if (!entry || now > entry.resetAt) {
    rateMap.set(sessionId, { count: 1, resetAt: now + RATE_WINDOW });
    return true;
  }
  if (entry.count >= RATE_LIMIT) return false;
  entry.count++;
  return true;
}

// ─── پرامپت سیستم — دستیار مشاوره دندانپزشکی ─────────────────────
const SYSTEM_PROMPT = `تو «دستیار هوشمند مهرآوا» هستی؛ مشاور دندانپزشکی هوشمند ${CLINIC.name}.

## اطلاعات کلینیک
- نام: ${CLINIC.name}
- آدرس: ${CLINIC.address}
- تلفن: ${CLINIC.phone} | اورژانس ۲۴ ساعته: ${CLINIC.emergencyPhone}
- ساعات کاری: شنبه تا چهارشنبه ۹ تا ۲۱، پنجشنبه ۹ تا ۱۸، جمعه فقط اورژانس
- هزینه ویزیت اولیه (معاینه کامل + مشاوره + طرح درمان): ${VISIT_FEE.toLocaleString("en-US")} تومان (پرداخت آنلاین از سایت)
- خدمات اصلی و قیمت شروع:
${SERVICES.map((s) => `  • ${s.title}: از ${s.priceFrom.toLocaleString("en-US")} تومان — ${s.shortDesc}`).join("\n")}
- رزرو نوبت: آنلاین از همین سایت (بخش نوبت‌دهی) یا تلفنی
- امکان پرداخت اقساطی تا ۱۰ ماه بدون بهره برای درمان‌های بالای ۱۰ میلیون تومان
- گارانتی: ایمپلنت مادام‌العمر، روکش‌ها ۵ سال

## وظیفه تو
1. پاسخ به سوالات سلامت دهان و دندان: علت درد، حساسیت، خون‌ریزی لثه، بوی بد دهان، مراقبت بعد از درمان، کودکان، بارداری، ارتودنسی، ایمپلنت، زیبایی و...
2. راهنمایی برای انتخاب خدمت مناسب و توضیح روند درمان‌ها
3. تشویق به رزرو نوبت برای تشخیص حضوری
4. معرفی شفاف خدمات و قیمت‌ها

## قواعد ایمنی (بسیار مهم)
- هرگز تشخیص قطعی نده و در موارد خطرناک فوراً ارجاع بده: تورم شدید صورت/گردن، تب همراه درد دندان، خون‌ریزی بی‌وقفه، دندان درآورده یا شکسته، درد شدید ناگهانی → بگو «همین حالا با اورژانس کلینیک ${CLINIC.emergencyPhone} تماس بگیرید»
- تأکید کن که مشاوره تو جایگزین معاینه حضوری نیست
- درباره داروهای خاص فقط اطلاعات عمومی بده و نسخه‌نگاری نکن
- در سوالات غیرمرتبط با دندانپزشکی، محترمانه بحث را به موضوع سلامت دهان برگردان

## لحن و قالب پاسخ
- فارسی روان، گرم و صمیمی مثل یک منشی حرفه‌ای و آگاه — از پرسیدن سوال نترس
- پاسخ‌ها کوتاه و قابل‌فهم: حداکثر ۴-۵ جمله یا ۴-۵ بولت کوتاه
- از تیتر markdown و لیست استفاده کن اما از جدول استفاده نکن
- ایموجی استفاده نکن
- در پایان پاسخ‌های مربوط به مشکل، یک جمله راهنمایی عملی برای قدم بعدی بده`;

// ─── POST: گفتگو با دستیار ──────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const sessionId = String(body.sessionId ?? "").slice(0, 64) || "anon";
    const messages = Array.isArray(body.messages) ? body.messages : [];

    if (!messages.length) {
      return Response.json({ error: "پیامی ارسال نشده است" }, { status: 400 });
    }
    if (messages.length > 24) {
      return Response.json({ error: "گفتگو بیش از حد طولانی است؛ صفحه را رفرش کنید" }, { status: 400 });
    }

    if (!checkRate(sessionId)) {
      return Response.json(
        { error: "تعداد پیام‌ها زیاد است؛ چند لحظه صبر کنید." },
        { status: 429 }
      );
    }

    const last = messages[messages.length - 1];
    const userContent = String(last?.content ?? "").slice(0, 2000).trim();
    if (!userContent) {
      return Response.json({ error: "متن پیام خالی است" }, { status: 400 });
    }

    // ساخت پیام‌ها برای مدل
    const chatMessages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...messages.slice(-12).map((m: { role: string; content: string }) => ({
        role: m.role === "assistant" ? "assistant" : "user",
        content: String(m.content).slice(0, 2000),
      })),
    ];

    const zai = await ZAI.create();
    const completion = await zai.chat.completions.create({
      messages: chatMessages,
      thinking: { type: "disabled" },
    });

    const reply =
      completion?.choices?.[0]?.message?.content ??
      "متاسفانه در این لحظه امکان پاسخ‌دهی نیست. لطفاً با شماره " + CLINIC.phone + " تماس بگیرید.";

    // ذخیره لاگ گفتگو (بدون انتظار)
    db.chatMessage
      .createMany({
        data: [
          { sessionId, role: "user", content: userContent },
          { sessionId, role: "assistant", content: String(reply).slice(0, 4000) },
        ],
      })
      .catch(() => {});

    return Response.json({ reply });
  } catch (e) {
    console.error("chat error:", e);
    return Response.json(
      { error: "دستیار هوشمند موقتاً در دسترس نیست. برای مشاوره فوری با ۰۲۱-۹۱۰۰۸۸۰۰ تماس بگیرید." },
      { status: 500 }
    );
  }
}
