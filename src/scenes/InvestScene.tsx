/* 幕 1 · 投入与红利引擎 */
import { useI18n } from "@/lib/i18n";
import type { DemoState } from "@/lib/useCalc";
import type { ScenarioResult } from "@/lib/model";
import { SceneHead } from "@/components/SceneBits";
import { Chart } from "@/components/charts/Chart";
import { investOption } from "@/components/charts/options";
import { NumberTicker } from "@/components/magicui/number-ticker";
import { PRODUCT } from "@/lib/product";

const CHIPS = ["chip.pct100", "chip.welcome", "chip.special", "chip.cap"];

export function InvestScene({ state, current }: { state: DemoState; current: ScenarioResult }) {
  const { t } = useI18n();
  const i18n = useI18n();

  return (
    <div className="flex h-full flex-col">
      <SceneHead eyebrow={t("scene.1")} title={t("engine.title")} sub={t("engine.sub")} />
      <div className="mt-5 flex min-h-0 flex-1 gap-10 px-14 pb-8">
        <div className="min-w-0 flex-1">
          <Chart option={investOption(useI18n(), state, current)} />
        </div>

        <div className="flex w-[280px] shrink-0 flex-col justify-center gap-6">
          <div className="rounded-2xl border border-gold/20 bg-gold/[.07] px-4 py-3">
            <div className="text-[13px] font-semibold text-gold">{t("engine.after", { n: current.horizon - state.payYears })}</div>
            <div className="mt-1 text-[12px] leading-snug text-ink-faint">{t("engine.after.sub")}</div>
          </div>

          {/* 等式 */}
          <div className="rounded-3xl bg-paper p-6 shadow-card ring-1 ring-black/[.04]">
            <div className="flex items-baseline justify-between">
              <span className="text-[13px] text-ink-faint">{t("invest.total")}</span>
              <span className="text-[19px] font-semibold num">
                <NumberTicker value={current.principal} prefix={PRODUCT.currency.symbol + " "} />
              </span>
            </div>
            <div className="my-1.5 text-center text-[15px] text-ink-faint">+</div>
            <div className="flex items-baseline justify-between">
              <span className="text-[13px] text-gold">{t("engine.cumulative")}</span>
              <span className="text-[19px] font-semibold num text-gold">
                <NumberTicker value={current.totalBonus} prefix={PRODUCT.currency.symbol + " "} />
              </span>
            </div>
            <div className="my-1.5 text-center text-[15px] text-ink-faint">=</div>
            <div className="flex items-baseline justify-between border-t border-hairline pt-3">
              <span className="text-[13px] font-medium">{t("delta.totalInvested")}</span>
              <span className="text-[22px] font-semibold num text-teal">
                <NumberTicker
                  value={current.principal + current.totalBonus}
                  prefix={PRODUCT.currency.symbol + " "}
                />
              </span>
            </div>
          </div>

          {/* 产品要点 chips */}
          <div className="space-y-2.5">
            {CHIPS.map((key) => (
              <div key={key} className="rounded-2xl border-l-[3px] border-gold/60 bg-white/60 px-4 py-2.5">
                <div className="text-[13.5px] font-semibold">{t(key + ".t")}</div>
                <div className="mt-0.5 text-[12px] leading-snug text-ink-faint">{t(key + ".d")}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
