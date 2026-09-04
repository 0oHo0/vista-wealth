/* 幕级通用小件：标题区 / 统计块 */
import { cn } from "@/lib/utils";

export function SceneHead({
  eyebrow,
  title,
  sub,
  className
}: {
  eyebrow: string;
  title: string;
  sub?: string;
  className?: string;
}) {
  return (
    <div className={cn("px-14 pt-8", className)}>
      <div className="text-[13px] font-semibold uppercase tracking-[.14em] text-gold">{eyebrow}</div>
      <h2 className="mt-2 text-[30px] font-semibold leading-tight tracking-tight text-ink">{title}</h2>
      {sub && <p className="mt-2 text-[15px] text-ink-faint">{sub}</p>}
    </div>
  );
}

export function StatBlock({
  label,
  value,
  sub,
  tone = "ink",
  className
}: {
  label: React.ReactNode;
  value: React.ReactNode;
  sub?: React.ReactNode;
  tone?: "ink" | "gold" | "teal";
  className?: string;
}) {
  const toneCls = tone === "gold" ? "text-gold" : tone === "teal" ? "text-teal" : "text-ink";
  return (
    <div className={className}>
      <div className="text-[13px] font-medium text-ink-faint">{label}</div>
      <div className={cn("mt-1 text-[34px] font-semibold leading-none tracking-tight num", toneCls)}>
        {value}
      </div>
      {sub && <div className="mt-2 text-[13px] text-ink-faint">{sub}</div>}
    </div>
  );
}
