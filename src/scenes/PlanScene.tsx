/* 幕 5 · 专属方案（打印定位：#scene-print） */
import { useI18n } from "@/lib/i18n";
import { PRODUCT, type RiskKey } from "@/lib/product";
import type { DemoState } from "@/lib/useCalc";
import type { ScenarioResult } from "@/lib/model";
import { SceneHead } from "@/components/SceneBits";
import { Chart } from "@/components/charts/Chart";
import { summaryBarsOption } from "@/components/charts/options";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const FLEX = ["fx.medical", "fx.pass", "fx.holiday", "fx.cashout", "fx.legacy"];

interface Props {
  state: DemoState;
  scenarios: Record<RiskKey, ScenarioResult>;
  onRestart: () => void;
  onPrint: () => void;
}

export function PlanScene({ state, scenarios, onRestart, onPrint }: Props) {
  const { t, money } = useI18n();
  const i18n = useI18n();

  const rows = [
    { k: t("sum.client"), v: state.clientName },
    { k: t("sum.advisor"), v: state.advisor },
    { k: t("sum.age"), v: `${state.age} ${t("unit.age")}` },
    { k: t("sum.term"), v: `${state.payYears} ${t("unit.year")}` },
    { k: t("sum.premium"), v: money(state.premium), money: true },
    { k: t("sum.payout"), v: `${state.retireAge} ${t("unit.age")}` },
    { k: t("sum.selected"), v: t("fund." + state.risk) },
    { k: t("sum.principal"), v: money(scenarios[state.risk].principal), money: true }
  ];

  return (
    <div id="scene-print" className="flex h-full flex-col">
      <SceneHead eyebrow={t("scene.4")} title={t("summary.title")} sub={t("summary.sub")} />
      <div className="mt-4 flex min-h-0 flex-1 gap-8 px-14 pb-6">
        {/* 左：方案要素 */}
        <div className="w-[250px] shrink-0 self-center rounded-3xl bg-paper p-6 shadow-card ring-1 ring-black/[.04]">
          {rows.map((r) => (
            <div key={r.k} className="flex items-baseline justify-between border-b border-hairline py-2 last:border-0">
              <span className="text-[12.5px] text-ink-faint">{r.k}</span>
              <span translate={r.money ? "no" : undefined} className="text-[13.5px] font-semibold num">{r.v}</span>
            </div>
          ))}
        </div>

        {/* 中：三情景对比 + 灵活权益 */}
        <div className="flex min-w-0 flex-1 flex-col gap-4">
          <div className="min-h-0 flex-1 rounded-3xl bg-paper p-4 shadow-card ring-1 ring-black/[.04]">
            <Chart option={summaryBarsOption(i18n, scenarios, state)} />
          </div>
          <div className="flex flex-wrap gap-2">
            {FLEX.map((key) => (
              <Badge key={key} variant="gold" className="text-[12px]">
                {t(key)}
              </Badge>
            ))}
          </div>
        </div>

        {/* 右：下一步 + 操作 */}
        <div className="flex w-[240px] shrink-0 flex-col justify-center">
          <div className="text-[13px] font-semibold text-gold">{t("sum.next")}</div>
          <ol className="mt-3 space-y-3.5">
            {["sum.next1", "sum.next2", "sum.next3"].map((key, i) => (
              <li key={key} className="flex gap-3">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gold-faint text-[12px] font-bold text-gold">
                  {i + 1}
                </span>
                <span className="text-[13.5px] leading-snug text-ink-soft">{t(key)}</span>
              </li>
            ))}
          </ol>
          <div className="mt-7 flex flex-col gap-2.5">
            <Button variant="gold" onClick={onPrint}>
              {t("sum.print")}
            </Button>
            <Button variant="ghost" onClick={onRestart}>
              {t("sum.restart")}
            </Button>
          </div>
        </div>
      </div>
      <div className="px-14 pb-5 text-[11px] leading-relaxed text-ink-faint/80">{t("disc.full")}</div>
    </div>
  );
}
