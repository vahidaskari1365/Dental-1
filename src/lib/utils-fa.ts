// ─── ابزارهای فارسی‌سازی: اعداد، تاریخ شمسی، قیمت ─────────────────

const FA_DIGITS = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];

export function toFaDigits(input: string | number): string {
  return String(input).replace(/[0-9]/g, (d) => FA_DIGITS[Number(d)]);
}

export function formatPrice(value: number): string {
  return toFaDigits(value.toLocaleString("en-US"));
}

/** قیمت با واحد تومان */
export function formatToman(value: number): string {
  return `${formatPrice(value)} تومان`;
}

// ─── تبدیل میلادی به شمسی (الگوریتم استاندارد جلالی) ────────────
function div(a: number, b: number) {
  return ~~(a / b);
}

export function gregorianToJalali(gy: number, gm: number, gd: number): [number, number, number] {
  const g_d_m = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
  let jy = gy <= 1600 ? 0 : 979;
  gy -= gy <= 1600 ? 621 : 1600;
  const gy2 = gm > 2 ? gy + 1 : gy;
  let days =
    365 * gy +
    div(gy2 + 3, 4) -
    div(gy2 + 99, 100) +
    div(gy2 + 399, 400) -
    80 +
    gd +
    g_d_m[gm - 1];
  jy += 33 * div(days, 12053);
  days %= 12053;
  jy += 4 * div(days, 1461);
  days %= 1461;
  if (days > 365) {
    jy += div(days - 1, 365);
    days = (days - 1) % 365;
  }
  const jm = days < 186 ? 1 + div(days, 31) : 7 + div(days - 186, 30);
  const jd = 1 + (days < 186 ? days % 31 : (days - 186) % 30);
  return [jy, jm, jd];
}

export const JALALI_MONTHS = [
  "فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور",
  "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند",
];

export const WEEKDAYS_FA = ["یکشنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه", "پنجشنبه", "جمعه", "شنبه"];

/** چهارتایی: [ی,jm,jd] شمسی از تاریخ میلادی */
function jParts(date: Date): { jy: number; jm: number; jd: number } {
  const [jy, jm, jd] = gregorianToJalali(date.getFullYear(), date.getMonth() + 1, date.getDate());
  return { jy, jm, jd };
}

/** شنبه ۱۵ آذر */
export function formatJalaliFull(date: Date): string {
  const { jm, jd } = jParts(date);
  const weekday = WEEKDAYS_FA[date.getDay()];
  return `${weekday} ${toFaDigits(jd)} ${JALALI_MONTHS[jm - 1]}`;
}

/** ۱۵ آذر ۱۴۰۳ */
export function formatJalaliWithYear(date: Date): string {
  const { jy, jm, jd } = jParts(date);
  return `${toFaDigits(jd)} ${JALALI_MONTHS[jm - 1]} ${toFaDigits(jy)}`;
}

export function jalaliShort(date: Date): { day: string; month: string; weekday: string } {
  const { jm, jd } = jParts(date);
  return {
    day: toFaDigits(jd),
    month: JALALI_MONTHS[jm - 1],
    weekday: WEEKDAYS_FA[date.getDay()],
  };
}

/** کلید فنی میلادی YYYY-MM-DD برای ذخیره در دیتابیس */
export function dateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** ساعت ۲۴h به فارسی: "14:00" → "۱۴:۰۰" */
export function faTime(slot: string): string {
  return toFaDigits(slot);
}

/** تبدیل ساعت "14:00" به نمایش ۱۲ ساعته فارسی */
export function faTime12(slot: string): string {
  const [h, m] = slot.split(":").map(Number);
  const period = h < 12 ? "صبح" : h < 17 ? "ظهر" : "شب";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${toFaDigits(h12)}:${toFaDigits(String(m).padStart(2, "0"))} ${period}`;
}

/** ولیدیشن موبایل ایران */
export function isValidIranPhone(phone: string): boolean {
  const cleaned = phone.replace(/[۰-۹]/g, (d) => String(FA_DIGITS.indexOf(d))).replace(/[^0-9+]/g, "");
  return /^(\+98|0098|0)?9\d{9}$/.test(cleaned);
}

/** نرمال‌سازی شماره موبایل به فرم 09xxxxxxxxx */
export function normalizePhone(phone: string): string {
  const cleaned = phone.replace(/[۰-۹]/g, (d) => String(FA_DIGITS.indexOf(d))).replace(/[^0-9+]/g, "");
  if (cleaned.startsWith("+98")) return "0" + cleaned.slice(3);
  if (cleaned.startsWith("0098")) return "0" + cleaned.slice(4);
  if (cleaned.startsWith("98") && cleaned.length === 12) return "0" + cleaned.slice(2);
  if (cleaned.startsWith("9") && cleaned.length === 10) return "0" + cleaned;
  return cleaned;
}

/** کد پیگیری خوانا مثل MHR-8K3F2 */
export function generateTrackingCode(prefix: string): string {
  const chars = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 5; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return `${prefix}-${code}`;
}
