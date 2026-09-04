/* Timeline — 人生财富时间线（Aceternity 风格的克制版：细线 + 光点 + 入场动画） */
import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";

interface TimelineNode {
  key: string;
  label: string;
  age: number;
  tone: "gold" | "teal" | "ink";
}

interface TimelineProps {
  nodes: TimelineNode[];
}

const toneDot: Record<string, string> = {
  gold: "bg-gold shadow-[0_0_0_4px_rgba(176,141,87,.18)]",
  teal: "bg-teal shadow-[0_0_0_4px_rgba(14,124,107,.15)]",
  ink: "bg-ink/70 shadow-[0_0_0_4px_rgba(23,25,28,.08)]"
};

export function Timeline({ nodes }: TimelineProps) {
  const { t } = useI18n();
  return (
    <div className="relative w-full">
      <div className="mb-3 text-[13px] font-medium tracking-wide text-ink-faint">{t("tl.title")}</div>
      <div className="relative">
        {/* 基线 */}
        <div className="absolute left-0 right-0 top-[7px] h-px bg-hairline" />
        {/* 进度光带 */}
        <motion.div
          className="absolute left-0 top-[6px] h-[3px] rounded-full bg-gradient-to-r from-gold/70 to-gold/25"
          initial={{ width: 0 }}
          whileInView={{ width: "100%" }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        />
        <div className="relative flex justify-between">
          {nodes.map((n, i) => (
            <motion.div
              key={n.key}
              className="flex flex-col items-start"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.25 + i * 0.12, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className={`h-[15px] w-[15px] rounded-full border-2 border-cream ${toneDot[n.tone]}`} />
              <span className="mt-3 text-[15px] font-semibold text-ink">{n.label}</span>
              <span className="text-[12px] font-medium tabular-nums text-ink-faint">
                {n.age} {t("unit.age")}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
