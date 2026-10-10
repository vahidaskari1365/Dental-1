"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  once?: boolean;
}

/* منحنی سینمایی — ورود مطمئن بدون بازگشت */
const EASE_CINEMA = [0.16, 1, 0.3, 1] as const;

/** نمایان‌سازی سینمایی هنگام اسکرول — محو شدن بلور + جابه‌جایی، منحنی اعتماد‌نفس */
export function Reveal({ children, delay = 0, y = 28, className, once = true }: RevealProps) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once, margin: "-80px" }}
      transition={{ duration: 0.8, ease: EASE_CINEMA, delay }}
    >
      {children}
    </motion.div>
  );
}

/** ظهور پلکانی سینمایی با تأخیر متغیر — برای گرید‌ها */
export function Stagger({
  children,
  className,
  step = 0.08,
}: {
  children: ReactNode[];
  className?: string;
  step?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <div className={className}>
      {children.map((child, i) => (
        <motion.div
          key={i}
          initial={reduce ? false : { opacity: 0, y: 26, filter: "blur(6px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.75, ease: EASE_CINEMA, delay: i * step }}
        >
          {child}
        </motion.div>
      ))}
    </div>
  );
}
