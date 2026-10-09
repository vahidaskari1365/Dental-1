# Worklog

---
Task ID: 1
Agent: main (Super Z)
Task: نصب اسکیل‌های GitHub درخواستی و ساخت وب‌سایت کامل مطب دندانپزشکی

Work Log:
- کلون ۸ مخزن GitHub درخواستی (taste-skill-plugin, impeccable, playwright-cli, awesome-design-md, img2threejs, ui-ux-pro-max-skill, claude-seo, awesome-free-llm-apis)
- نصب اسکیل‌ها در /home/z/my-project/skills/ (taste, playwright-cli, ui-ux-pro-max, claude-seo, design-references, free-llm-apis-ref)
- استخراج اصول طراحی از اسکیل‌ها: Soft Structuralism (حوزه سلامت)، پالت تک‌رنگ teal، فونت Vazirmatn، ضد-سنترینگ hero، ممنوعیت ایموجی، فیزیک فنری framer-motion
- راه‌اندازی Next.js 16 + Tailwind 4 + shadcn/ui + Prisma (SQLite)
- اسکیمای دیتابیس: Appointment, Payment, SmsLog, ChatMessage
- تولید ۵ تصویر اختصاصی با AI (hero clinic + ۳ پرتره پزشک + OG banner)
- فونت وزیرمتن به‌صورت local (5 وزن) با next/font/local
- سیستم طراحی RTL کامل: teal palette، glass morphism، سایه‌های نرم، prefers-reduced-motion
- API: POST/GET /api/appointments (نوبت‌دهی + اسلات‌ها), /api/chat (GLM), /api/payment + /verify (زرین‌پال)
- لایه پیامک چند-سرویس‌دهنده: Kavenegar / SMS.ir / Mock با لاگ دیتابیس
- درگاه زرین‌پال: حالت واقعی + سندباکس شبیه‌سازی‌شده با رسید پیامکی
- چت‌بات: z-ai-web-dev-sdk (GLM از فهرست free-llm-apis) + پرامپت سیستم فارسی + guardrails ایمنی + rate limit + ذخیره لاگ
- سئو: JSON-LD (@type Dentist + AggregateRating + Review + OfferCatalog + WebSite)، sitemap.xml، robots.txt، OpenGraph، metadata فارسی کامل
- کامپوننت‌ها: Header (glass sticky)، Hero (split + کارت شناور + شمارنده)، StatsBar، Services (bento)، WhyUs، Doctors، Booking (۳ مرحله‌ای + تقویم شمسی)، Testimonials (اسلایدر)، PaymentSection (+ شبیه‌ساز درگاه + هندلر callback)، FAQ (accordion)، Contact (نقشه SVG)، Footer (sticky)، Chatbot (شناور)
- ابزار فارسی: تبدیل جلالی، ارقام فارسی، اعتبارسنجی موبایل ایران، کد پیگیری
- تست E2E با agent-browser: رزرو کامل نوبت (MHR-95VKP)، پرداخت کامل (PAY-V64RD، refId 9334769)، گفتگوی چت‌بات، ریسپانسیو iPhone 14
- رفع باگ: سرریز افقی ۱۲۸px در RTL (blob نوبت‌دهی)، خطای setState در effect، aria-selected
- پاک‌سازی داده‌های تست + lint پاس

Stage Summary:
- وب‌سایت تک‌صفحه‌ای کامل کلینیک دندانپزشکی مهرآوا در / (فقط route مجاز)
- نوبت‌دهی، پیامک، پرداخت، چت‌بات AI و سئو همگی تست‌شده و فعال
- اتصال واقعی: KAVENEGAR_API_KEY یا SMSIR_API_KEY برای پیامک، ZARINPAL_MERCHANT_ID برای پرداخت (بدون کلید → حالت Mock/سندباکس امن)
- تصاویر در public/images/، اسکریپت‌ها در scripts/، اسکیل‌ها در skills/
