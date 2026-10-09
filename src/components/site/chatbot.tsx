"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import {
  MessageCircleHeart,
  X,
  SendHorizonal,
  Loader2,
  Sparkles,
  PhoneCall,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CLINIC } from "@/lib/clinic";

interface Msg {
  role: "user" | "assistant";
  content: string;
}

const SUGGESTIONS = [
  "دندانم درد می‌کند، چه کار کنم؟",
  "هزینه ایمپلنت چقدر است؟",
  "ارتودنسی شفاف چطور انجام می‌شود؟",
  "بعد از عصب‌کشی چه نکاتی را رعایت کنم؟",
];

const WELCOME: Msg = {
  role: "assistant",
  content:
    "سلام! من **دستیار هوشمند مهرآوا** هستم؛ ۲۴ ساعته برای مشاوره دندانپزشکی در خدمت شما.\n\nمی‌توانم درباره درد دندان، خدمات، هزینه‌ها و روند درمان‌ها راهنمایی‌تان کنم. چطور می‌توانم کمک کنم؟",
};

function getSessionId(): string {
  if (typeof window === "undefined") return "anon";
  let id = sessionStorage.getItem("mehrava-chat-id");
  if (!id) {
    id = `s-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
    sessionStorage.setItem("mehrava-chat-id", id);
  }
  return id;
}

export function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [nudge, setNudge] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const sessionId = useRef<string>("anon");

  useEffect(() => {
    sessionId.current = getSessionId();
    const timer = setTimeout(() => setNudge(true), 6000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const openHandler = () => setOpen(true);
    window.addEventListener("open-chatbot", openHandler);
    return () => window.removeEventListener("open-chatbot", openHandler);
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading, open]);

  const send = useCallback(
    async (text: string) => {
      const content = text.trim();
      if (!content || loading) return;
      setError("");
      setInput("");
      const next = [...messages, { role: "user" as const, content }];
      setMessages(next);
      setLoading(true);
      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionId: sessionId.current,
            messages: next.slice(-12).map((m) => ({ role: m.role, content: m.content })),
          }),
        });
        const json = await res.json();
        if (!res.ok) {
          setError(json.error ?? "خطا در پاسخ‌دهی؛ دوباره تلاش کنید");
        } else {
          setMessages((m) => [...m, { role: "assistant", content: json.reply }]);
        }
      } catch {
        setError("خطای شبکه؛ اتصال اینترنت را بررسی کنید");
      } finally {
        setLoading(false);
      }
    },
    [messages, loading]
  );

  return (
    <>
      {/* دکمه شناور */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 160, damping: 18, delay: 1.2 }}
        className="fixed bottom-5 start-5 z-50 flex flex-col items-start gap-3"
      >
        <AnimatePresence>
          {nudge && !open && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 6, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 140, damping: 16 }}
              className="glass rounded-2xl rounded-bl-md px-4 py-3 max-w-[230px] shadow-soft relative"
            >
              <button
                onClick={() => setNudge(false)}
                className="absolute top-2 end-2 text-muted-foreground hover:text-foreground"
                aria-label="بستن پیام خوش‌آمد"
              >
                <X className="w-3.5 h-3.5" />
              </button>
              <p className="text-[12.5px] font-semibold leading-6 text-teal-deep pe-4">
                سوالی درباره سلامت دندان‌هایتان دارید؟ همین حالا بپرسید!
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? "بستن گفتگو" : "گفتگو با دستیار هوشمند"}
          className="relative w-16 h-16 rounded-full bg-gradient-to-b from-primary to-teal-deep shadow-lift flex items-center justify-center text-white btn-tactile animate-pulse-ring hover:scale-105 transition-transform"
        >
          <AnimatePresence mode="wait">
            {open ? (
              <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
                <X className="w-6 h-6" strokeWidth={2.2} />
              </motion.span>
            ) : (
              <motion.span key="msg" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
                <MessageCircleHeart className="w-7 h-7" strokeWidth={1.8} />
              </motion.span>
            )}
          </AnimatePresence>
          {!open && (
            <span className="absolute -top-0.5 -end-0.5 w-4 h-4 rounded-full bg-emerald-400 border-2 border-white" aria-label="آنلاین" />
          )}
        </button>
      </motion.div>

      {/* پنجره چت */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 140, damping: 20 }}
            role="dialog"
            aria-label="چت مشاوره هوشمند دندانپزشکی"
            className="fixed z-50 bottom-24 start-5 end-5 sm:end-auto sm:w-[400px] h-[560px] max-h-[calc(100dvh-8rem)] rounded-3xl bg-white shadow-soft flex flex-col overflow-hidden border border-border"
          >
            {/* هدر */}
            <div className="bg-gradient-to-l from-teal-deep to-primary px-5 py-4 flex items-center gap-3 shrink-0">
              <span className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center">
                <MessageCircleHeart className="w-5 h-5 text-white" strokeWidth={1.9} />
              </span>
              <div className="flex-1">
                <p className="font-extrabold text-white text-[14px]">دستیار هوشمند مهرآوا</p>
                <p className="text-[11px] text-white/70 flex items-center gap-1.5 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
                  آنلاین — پاسخ‌دهی فوری
                </p>
              </div>
              <button
                onClick={() => {
                  setMessages([WELCOME]);
                  setError("");
                }}
                className="w-9 h-9 rounded-lg hover:bg-white/12 flex items-center justify-center text-white/80 hover:text-white transition-colors"
                aria-label="شروع گفتگوی جدید"
              >
                <RotateCcw className="w-4.5 h-4.5" />
              </button>
            </div>

            {/* پیام‌ها */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto scrollbar-thin px-4 py-4 space-y-3.5 bg-mint-soft/50">
              {messages.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ type: "spring", stiffness: 130, damping: 20 }}
                  className={`flex ${m.role === "user" ? "justify-start" : "justify-end"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-[13px] leading-7 ${
                      m.role === "user"
                        ? "bg-primary text-white rounded-br-md"
                        : "bg-white shadow-softer text-foreground rounded-bl-md border border-border/60"
                    }`}
                  >
                    {m.role === "assistant" ? (
                      <div className="prose-chat">
                        <ReactMarkdown
                          components={{
                            p: ({ children }) => <p className="mb-1.5 last:mb-0">{children}</p>,
                            strong: ({ children }) => <strong className="font-extrabold text-primary">{children}</strong>,
                            ul: ({ children }) => <ul className="list-disc ps-4 my-1 space-y-1">{children}</ul>,
                            ol: ({ children }) => <ol className="list-decimal ps-4 my-1 space-y-1">{children}</ol>,
                            li: ({ children }) => <li>{children}</li>,
                            h1: ({ children }) => <p className="font-extrabold">{children}</p>,
                            h2: ({ children }) => <p className="font-extrabold">{children}</p>,
                            h3: ({ children }) => <p className="font-extrabold">{children}</p>,
                            a: ({ children, href }) => (
                              <a href={href} className="text-primary font-bold underline" target="_blank" rel="noopener noreferrer">
                                {children}
                              </a>
                            ),
                          }}
                        >
                          {m.content}
                        </ReactMarkdown>
                      </div>
                    ) : (
                      m.content
                    )}
                  </div>
                </motion.div>
              ))}

              {/* در حال تایپ */}
              {loading && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-end">
                  <div className="bg-white shadow-softer border border-border/60 rounded-2xl rounded-bl-md px-4 py-3.5 flex items-center gap-1.5">
                    {[0, 1, 2].map((i) => (
                      <motion.span
                        key={i}
                        animate={{ y: [0, -5, 0], opacity: [0.4, 1, 0.4] }}
                        transition={{ duration: 1, repeat: Infinity, delay: i * 0.18 }}
                        className="w-2 h-2 rounded-full bg-primary"
                      />
                    ))}
                  </div>
                </motion.div>
              )}

              {error && (
                <p className="text-[12px] font-semibold text-destructive bg-white border border-destructive/25 rounded-xl px-4 py-3 text-center" role="alert">
                  {error}
                </p>
              )}
            </div>

            {/* پیشنهادها */}
            {messages.length <= 1 && !loading && (
              <div className="px-4 pb-2.5 flex flex-wrap gap-2 shrink-0">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="text-[11.5px] font-semibold text-primary bg-white border border-accent hover:bg-secondary rounded-full px-3.5 py-2 transition-colors btn-tactile flex items-center gap-1.5"
                  >
                    <Sparkles className="w-3 h-3" />
                    {s}
                  </button>
                ))}
              </div>
            )}

            {/* ورودی */}
            <div className="p-3.5 bg-white border-t border-border shrink-0">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  send(input);
                }}
                className="flex items-center gap-2.5"
              >
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="سوال خود را بنویسید..."
                  aria-label="متن پیام"
                  className="flex-1 h-12 rounded-xl bg-muted/70 border border-border px-4 text-[13.5px] outline-none focus:ring-2 focus:ring-ring/40 focus:border-primary/40 transition-all placeholder:text-muted-foreground/60"
                  maxLength={1000}
                />
                <Button
                  type="submit"
                  size="icon"
                  disabled={!input.trim() || loading}
                  className="w-12 h-12 rounded-xl bg-primary hover:bg-teal-deep shrink-0 btn-tactile"
                  aria-label="ارسال پیام"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <SendHorizonal className="w-5 h-5 -scale-x-100" />}
                </Button>
              </form>
              <p className="mt-2.5 text-center text-[10.5px] text-muted-foreground flex items-center justify-center gap-1.5">
                <PhoneCall className="w-3 h-3" />
                مشاوره هوشمند جایگزین معاینه حضوری نیست | اورژانس: {CLINIC.emergencyPhone}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
