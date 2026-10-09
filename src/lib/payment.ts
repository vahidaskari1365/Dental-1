// ─── درگاه پرداخت زرین‌پال — حالت سندباکس و واقعی ─────────────────
// ZARINPAL_MERCHANT_ID تنظیم نشده → حالت شبیه‌سازی امن (Sandbox Mock)
// برای اتصال واقعی: ZARINPAL_MERCHANT_ID=xxxx-xxxx-... در .env.local

export interface PaymentRequest {
  amount: number; // ریال
  description: string;
  callbackUrl: string;
  mobile?: string;
  email?: string;
}

export interface PaymentStartResult {
  success: boolean;
  authority?: string;
  redirectUrl?: string;
  mock?: boolean;
  error?: string;
}

export interface PaymentVerifyResult {
  success: boolean;
  refId?: string;
  cardPan?: string;
  mock?: boolean;
  error?: string;
}

const ZARINPAL_START = "https://api.zarinpal.com/pg/v4/payment/request.json";
const ZARINPAL_VERIFY = "https://api.zarinpal.com/pg/v4/payment/verify.json";
const ZARINPAL_PAGE = "https://www.zarinpal.com/pg/StartPay/";
const SANDBOX_MERCHANT = "00000000-0000-0000-0000-000000000000";

function isSandbox(): boolean {
  const m = process.env.ZARINPAL_MERCHANT_ID;
  return !m || m === SANDBOX_MERCHANT;
}

// ─── شروع تراکنش ────────────────────────────────────────────────
export async function startPayment(req: PaymentRequest): Promise<PaymentStartResult> {
  if (isSandbox()) {
    // شبیه‌سازی: authority ساختگی که با verify شبیه‌سازی‌شده تأیید می‌شود
    const authority = "SBA" + Date.now().toString(36).toUpperCase() + Math.random().toString(36).slice(2, 8).toUpperCase();
    return {
      success: true,
      authority,
      mock: true,
      redirectUrl: `/payment-gateway?Authority=${authority}&Status=OK&Amount=${req.amount}&Desc=${encodeURIComponent(req.description)}`,
    };
  }

  try {
    const res = await fetch(ZARINPAL_START, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        merchant_id: process.env.ZARINPAL_MERCHANT_ID,
        amount: req.amount, // ریال
        description: req.description,
        callback_url: req.callbackUrl,
        metadata: { mobile: req.mobile, email: req.email },
      }),
    });
    const json = await res.json();
    const authority = json?.data?.authority;
    if (json?.data?.code === 100 && authority) {
      return { success: true, authority, redirectUrl: ZARINPAL_PAGE + authority };
    }
    return { success: false, error: json?.errors?.message ?? "درگاه پرداخت در دسترس نیست" };
  } catch (e) {
    return { success: false, error: String(e) };
  }
}

// ─── تأیید تراکنش ───────────────────────────────────────────────
export async function verifyPayment(authority: string, amount: number): Promise<PaymentVerifyResult> {
  if (isSandbox()) {
    if (authority.startsWith("SBA")) {
      return { success: true, refId: String(1000000 + Math.floor(Math.random() * 8999999)), mock: true };
    }
    return { success: false, error: "authority نامعتبر" };
  }

  try {
    const res = await fetch(ZARINPAL_VERIFY, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        merchant_id: process.env.ZARINPAL_MERCHANT_ID,
        amount,
        authority,
      }),
    });
    const json = await res.json();
    const code = json?.data?.code;
    if (code === 100 || code === 101) {
      return {
        success: true,
        refId: String(json?.data?.ref_id ?? ""),
        cardPan: json?.data?.card_pan,
      };
    }
    return { success: false, error: json?.errors?.message ?? "تراکنش تأیید نشد" };
  } catch (e) {
    return { success: false, error: String(e) };
  }
}

export const paymentIsSandbox = isSandbox;
