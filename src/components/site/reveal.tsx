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

/** نمایان‌سازی نرم هنگام اسکرول — فیزیک فنری ملایم */
export function Reveal({ children, delay = 0, y = 28, className, once = true }: RevealProps) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: "-80px" }}
      transition={{ type: "spring", stiffness: 90, damping: 20, delay }}
    >
      {children}
    </motion.div>
  );
}

/** ظهور پلکانی با تأخیر متغیر — برای گرید‌ها */
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
          initial={reduce ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ type: "spring", stiffness: 90, damping: 20, delay: i * step }}
        >
          {child}
        </motion.div>
      ))}
    </div>
  );
}
