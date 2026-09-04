/* 幕 2 · 增长路径 + 红利价值 + 人生时间线 */
import { useI18n } from "@/lib/i18n";
import type { DemoState } from "@/lib/useCalc";
import type { ScenarioResult } from "@/lib/model";
import { SceneHead } from "@/components/SceneBits";
import { Chart } from "@/components/charts/Chart";
import { pathOption } from "@/components/charts/options";
import { Timeline } from "@/components/charts/Timeline";
import { NumberTicker } from "@/components/magicui/number-ticker";
import { PRODUCT } from "@/lib/product";

export function PathScene({ state, current }: { state: DemoState; current: ScenarioResult }) {
  const { t, fmtPct } = useI18n();
  const i18n = useI18n();

  const pct = current.principal > 0 ? current.delta / current.principal : 0;
  const timelineNodes = [
    { key: "start", label: t("tl.start"), age: state.age, tone: "teal" as const },
    { key: "bonus", label: t("tl.bonus"), age: state.age + 3, tone: "gold" as const },
    { key: "cap", label: t("tl.cap"), age: state.age + 11, tone: "ink" as const },
    { key: "iipend", label: t("tl.iipend"), age: state.age + state.payYears, tone: "teal" as const },
    { key: "retire", label: t("tl.retire"), age: state.retireAge, tone: "gold" as const },
    { key: "legacy", label: t("tl.legacy"), age: state.retireAge + 10, tone: "ink" as const }
  ];

  return (
    <div className="flex h-full flex-col">
      <SceneHead eyebrow={t("scene.2")} title={t("path.title")} sub={t("path.sub")} />
      <div className="mt-4 flex min-h-0 flex-1 gap-10 px-14">
        <div className="min-w-0 flex-1">
          <Chart option={pathOption(i18n, current, state)} />
        </div>
        <div className="flex w-[262px] shrink-0 flex-col justify-center gap-7">
          <div>
            <div className="text-[13px] font-medium text-ink-faint">
              {t("path.atAge", { age: state.retireAge })}
            </div>
            <div className="mt-1 whitespace-nowrap text-[38px] font-semibold leading-none tracking-tight num text-gold">
              <NumberTicker value={current.endValue} prefix={PRODUCT.currency.symbol + " "} />
            </div>
          </div>
          <div className="h-px bg-hairline" />
          <div>
            <div className="text-[13px] font-medium text-ink-faint">{t("delta.extra")}</div>
            <div className="mt-1 text-[26px] font-semibold leading-none tracking-tight num text-teal">
              <NumberTicker value={current.delta} prefix={PRODUCT.currency.symbol + " "} />
            </div>
            <div className="mt-2 text-[13px] text-ink-faint">
              {t("delta.extraPct", { pct: fmtPct(pct, 0) })}
            </div>
          </div>
        </div>
      </div>
      {/* 人生时间线 */}
      <div className="px-14 pb-7 pt-4">
        <Timeline nodes={timelineNodes} />
      </div>
    </div>
  );
}
