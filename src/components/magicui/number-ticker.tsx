/* Magic UI — NumberTicker（数字滚动）
   来源模式：magicui.design 的 NumberTicker，本项目改为「值变化即动画」，
   适配顾问控制台实时调参场景。 */
import { useEffect } from "react";
import { motion, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

interface NumberTickerProps {
  value: number;
  prefix?: string;
  className?: string;
  springConfig?: { damping?: number; stiffness?: number };
}

export function NumberTicker({ value, prefix = "", className, springConfig }: NumberTickerProps) {
  const spring = useSpring(0, {
    damping: springConfig?.damping ?? 34,
    stiffness: springConfig?.stiffness ?? 110
  });
  const display = useTransform(spring, (v) => prefix + Math.round(v).toLocaleString("en-US"));

  useEffect(() => {
    spring.set(Number(value) || 0);
  }, [value, spring]);

  return (
    <motion.span translate="no" className={cn("tabular-nums", className)}>
      {display}
    </motion.span>
  );
}
