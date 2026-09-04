/* 幕 0 · 封面 */
import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import { PRODUCT, type Lang } from "@/lib/product";
import type { DemoState } from "@/lib/useCalc";
import type { ScenarioResult, BrochureCase } from "@/lib/model";
import { NumberTicker } from "@/components/magicui/number-ticker";
import { Chart } from "@/components/charts/Chart";
import { sparkOption } from "@/components/charts/options";
import { Button } from "@/components/ui/button";

interface Props {
  state: DemoState;
  current: ScenarioResult;
  hitCase: BrochureCase | null;
  onStart: () => void;
}

export function CoverScene({ state, current, hitCase, onStart }: Props) {
  const { t, lang, money } = useI18n();
  const i18n = useI18n();
  const brand = PRODUCT.brand[lang as Lang];

  return (
    <div className="flex h-full items-center px-14">
      <div className="grid w-full grid-cols-[1.08fr_.92fr] items-center gap-14">
        {/* 左：身份与开场 */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="text-[13px] font-semibold uppercase tracking-[.2em] text-gold"
          >
            {brand.latin}
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="mt-4 text-[52px] font-semibold leading-[1.08] tracking-tight"
          >
            {t("cover.for")}
            <br />
            <span className="text-gold">{state.clientName}</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25, duration: 0.6 }}
            className="mt-4 max-w-[46ch] text-[15px] leading-relaxed text-ink-faint"
          >
            {hitCase ? hitCase.persona[lang as Lang] : `${brand.name} · ${brand.category}`}
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35, duration: 0.6 }}
            className="mt-7 flex items-center gap-8"
          >
            {[
              { k: t("sum.age"), v: `${state.age} ${t("unit.age")}` },
              { k: t("invest.annual"), v: money(state.premium) },
              { k: t("sum.payout"), v: `${state.retireAge} ${t("unit.age")}` }
            ].map((x) => (
              <div key={x.k}>
                <div className="text-[12px] text-ink-faint">{x.k}</div>
                <div className="mt-0.5 text-[17px] font-semibold num">{x.v}</div>
              </div>
            ))}
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.6 }}
            className="mt-9"
          >
            <Button variant="gold" size="lg" onClick={onStart}>
              {t("cover.start")}
            </Button>
          </motion.div>
        </div>

        {/* 右：目标卡片 */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-4xl bg-paper p-9 shadow-pop ring-1 ring-black/[.04]"
        >
          <div className="text-[13px] font-medium text-gold">{t("cover.goal")}</div>
          <div className="mt-2 text-[46px] font-semibold leading-none tracking-tight num text-ink">
            <NumberTicker value={current.endValue} prefix={PRODUCT.currency.symbol + " "} />
          </div>
          <div className="mt-2 text-[13px] text-ink-faint">
            {t("path.atAge", { age: state.retireAge })}
          </div>
          <div className="mt-5 h-[120px]">
            <Chart option={sparkOption(i18n, current)} />
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-hairline pt-4 text-[13px]">
            <span className="text-ink-faint">{t("cover.prepared")}</span>
            <span className="font-semibold">{state.advisor}</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
