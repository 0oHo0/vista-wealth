/* 幕 4 · 风险匹配（三档基金卡片 + 环形图） */
import { useI18n } from "@/lib/i18n";
import { PRODUCT, type RiskKey } from "@/lib/product";
import type { ScenarioResult } from "@/lib/model";
import { SceneHead } from "@/components/SceneBits";
import { Chart } from "@/components/charts/Chart";
import { ringOption } from "@/components/charts/options";
import { NumberTicker } from "@/components/magicui/number-ticker";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function FundsScene({
  payoutAge,
  scenarios,
  risk,
  onPick
}: {
  payoutAge: number;
  scenarios: Record<RiskKey, ScenarioResult>;
  risk: RiskKey;
  onPick: (k: RiskKey) => void;
}) {
  const { t, fmtPct } = useI18n();
  const i18n = useI18n();

  return (
    <div className="flex h-full flex-col">
      <SceneHead eyebrow={t("scene.3")} title={t("funds.title")} sub={t("funds.sub")} />
      <div className="mt-5 flex min-h-0 flex-1 items-stretch gap-8 px-14 pb-9">
        {PRODUCT.fundOrder.map((k) => {
          const f = PRODUCT.funds[k];
          const s = scenarios[k];
          const on = k === risk;
          return (
            <button
              key={k}
              onClick={() => onPick(k)}
              className={cn(
                "flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-4xl bg-paper p-7 text-left transition-all duration-300",
                on
                  ? "shadow-pop ring-2 ring-gold/70"
                  : "shadow-card ring-1 ring-black/[.04] hover:-translate-y-1 hover:shadow-pop"
              )}
            >
              <div className="flex items-center justify-between">
                <span className="text-[16px] font-semibold">{t("fund." + k)}</span>
                {on && <Badge variant="gold">{t("funds.current")}</Badge>}
              </div>
              <div className="mt-2 text-[12.5px] text-ink-faint">
                {fmtPct(f.gross, 0)} · {t("fund.risk." + f.risk)}
              </div>
              <div className="min-h-0 flex-1 py-2">
                <Chart option={ringOption(i18n, k, on)} />
              </div>
              <div className="text-[13px] text-ink-faint">{t("funds.atAge", { age: payoutAge })}</div>
              <div
                className={cn(
                  "mt-1 text-[24px] font-semibold leading-none num",
                  on ? "text-gold" : "text-ink"
                )}
              >
                <NumberTicker value={s.endValue} prefix={PRODUCT.currency.symbol + " "} />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
