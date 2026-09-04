/* 顾问控制台（深色 overlay，客户看不到；C 键开关） */
import { useEffect } from "react";
import { useI18n } from "@/lib/i18n";
import { PRODUCT, type RiskKey } from "@/lib/product";
import type { DemoState } from "@/lib/useCalc";
import { cn } from "@/lib/utils";

interface Props {
  open: boolean;
  state: DemoState;
  hitCaseId: string | null;
  onPatch: (patch: Partial<DemoState>) => void;
  onLoadCase: (id: string) => void;
  onToggle: (open?: boolean) => void;
}

const SLIDERS = [
  { id: "age", key: "console.age", min: 18, max: 55, step: 1, fmtAge: true },
  { id: "retire", key: "console.retire", min: 45, max: 80, step: 1, fmtAge: true },
  { id: "premium", key: "console.premium", min: 6000, max: 60000, step: 600, fmtAge: false },
  { id: "payout", key: "console.payout", min: 5, max: 30, step: 1, fmtAge: false }
] as const;

export function AdviserConsole({ open, state, hitCaseId, onPatch, onLoadCase, onToggle }: Props) {
  const { t, money, lang } = useI18n();

  /* 语言切换时重新渲染控制台文案 —— key 由 App 传入 */

  function setSlider(id: string, raw: number) {
    if (id === "age") {
      const retireAge = Math.max(state.retireAge, raw + 5);
      onPatch({ age: raw, retireAge });
    } else if (id === "retire") {
      onPatch({ retireAge: Math.max(raw, state.age + 5) });
    } else if (id === "premium") {
      onPatch({ premium: raw });
    } else if (id === "payout") {
      onPatch({ payoutYears: raw });
    }
  }

  function sliderValue(id: string): number {
    if (id === "age") return state.age;
    if (id === "retire") return state.retireAge;
    if (id === "premium") return state.premium;
    return state.payoutYears;
  }

  function fill(el: HTMLInputElement) {
    const min = +el.min;
    const max = +el.max;
    const v = +el.value;
    el.style.setProperty("--fill", ((v - min) / (max - min)) * 100 + "%");
  }

  useEffect(() => {
    document.querySelectorAll<HTMLInputElement>("#consoleBody input[type=range]").forEach(fill);
  });

  return (
    <aside
      className={cn(
        "fixed bottom-[56px] right-0 top-[64px] z-40 w-[320px] translate-x-full overflow-y-auto bg-[#0C1319] text-[#E8EDF0] shadow-pop transition-transform duration-300 ease-out",
        open && "translate-x-0"
      )}
    >
      <div className="border-b border-white/10 px-6 py-5">
        <h3 className="text-[15px] font-semibold">{t("console.title")}</h3>
        <p className="mt-1 text-[11.5px] leading-snug text-white/40">{t("console.hint")}</p>
      </div>

      <div id="consoleBody" className="space-y-5 px-6 py-5" key={lang}>
        {/* 姓名 */}
        <div className="space-y-3">
          {(["clientName", "advisor"] as const).map((field) => (
            <div key={field}>
              <label className="text-[11.5px] text-white/45">
                {field === "clientName" ? t("console.client") : t("console.advisor")}
              </label>
              <input
                type="text"
                value={state[field]}
                onChange={(e) => onPatch({ [field]: e.target.value } as Partial<DemoState>)}
                className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-[13px] outline-none focus:border-gold/60"
              />
            </div>
          ))}
        </div>

        {/* 滑块 */}
        {SLIDERS.map((d) => (
          <div key={d.id}>
            <label className="flex items-baseline justify-between text-[11.5px] text-white/45">
              <span>{t(d.key)}</span>
              <span translate="no" className="num text-[12.5px] font-semibold text-white/85">
                {d.fmtAge
                  ? `${sliderValue(d.id)} ${t("unit.age")}`
                  : d.id === "premium"
                    ? money(state.premium)
                    : `${state.payoutYears} ${t("unit.year")}`}
              </span>
            </label>
            <input
              type="range"
              min={d.min}
              max={d.max}
              step={d.step}
              value={sliderValue(d.id)}
              onChange={(e) => setSlider(d.id, +e.target.value)}
              className="mt-2 w-full"
            />
          </div>
        ))}

        {/* 投资期 */}
        <div>
          <label className="text-[11.5px] text-white/45">{t("console.term")}</label>
          <div className="mt-2 grid grid-cols-3 gap-1.5">
            {PRODUCT.iipOptions.map((y) => (
              <button
                key={y}
                onClick={() => onPatch({ payYears: y })}
                className={cn(
                  "rounded-lg py-2 text-[12.5px] transition-colors",
                  state.payYears === y ? "bg-gold text-white" : "bg-white/5 text-white/60 hover:bg-white/10"
                )}
              >
                {y} {t("unit.year")}
              </button>
            ))}
          </div>
        </div>

        {/* 组合 */}
        <div>
          <label className="text-[11.5px] text-white/45">{t("console.risk")}</label>
          <div className="mt-2 grid grid-cols-3 gap-1.5">
            {PRODUCT.fundOrder.map((k) => (
              <button
                key={k}
                title={t("fund." + k)}
                onClick={() => onPatch({ risk: k as RiskKey })}
                className={cn(
                  "rounded-lg py-2 text-[12.5px] transition-colors",
                  state.risk === k ? "bg-gold text-white" : "bg-white/5 text-white/60 hover:bg-white/10"
                )}
              >
                {PRODUCT.funds[k].gross * 100}%
              </button>
            ))}
          </div>
        </div>

        {/* 手册案例 */}
        <div>
          <div className="text-[11.5px] text-white/45">{t("console.cases")}</div>
          <div className="mt-2 grid grid-cols-2 gap-1.5">
            {PRODUCT.cases.map((c) => (
              <button
                key={c.id}
                onClick={() => onLoadCase(c.id)}
                className={cn(
                  "rounded-lg py-2 text-[12px] transition-colors",
                  hitCaseId === c.id ? "bg-gold text-white" : "bg-white/5 text-white/60 hover:bg-white/10"
                )}
              >
                {t("console.case." + c.id)}
              </button>
            ))}
          </div>
          <button
            onClick={() => onPatch({ stressGross: null })}
            className={cn(
              "mt-1.5 w-full rounded-lg py-2 text-[12px] transition-colors",
              !hitCaseId ? "bg-gold text-white" : "bg-white/5 text-white/60 hover:bg-white/10"
            )}
          >
            {t("console.case.custom")}
          </button>
        </div>

        <div className="border-t border-white/10 pt-4 text-[11px] leading-relaxed text-white/35">
          C {t("app.console")} · F 全屏 · P {t("sum.print")} · ← → {t("scene.hint")}
        </div>
      </div>
    </aside>
  );
}
