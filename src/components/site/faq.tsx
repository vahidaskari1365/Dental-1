"use client";

import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FAQS } from "@/lib/clinic";

export function Faq() {
  return (
    <section id="faq" className="py-24" aria-label="سوالات متداول">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto">
          <span className="inline-block text-[13px] font-bold text-primary bg-secondary rounded-full px-4 py-1.5 mb-4">
            پاسخ شفاف
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-teal-deep leading-snug text-balance">
            سوالاتی که بیشترین بار را از دوش شما برمی‌دارد
          </h2>
          <p className="mt-4 text-[14.5px] leading-7.5 text-muted-foreground">
            پاسخ سوالتان را پیدا نکردید؟ دستیار هوشمند ما ۲۴ ساعته آنلاین است.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ type: "spring", stiffness: 90, damping: 20 }}
          className="mt-12 rounded-3xl bg-white shadow-softer px-6 sm:px-8 py-4"
        >
          <Accordion type="single" collapsible className="w-full">
            {FAQS.map((f, i) => (
              <AccordionItem key={i} value={`faq-${i}`} className="border-border">
                <AccordionTrigger className="text-start text-[14.5px] font-bold text-foreground hover:text-primary hover:no-underline py-5">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="text-[13.5px] leading-8 text-muted-foreground pb-5">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}
