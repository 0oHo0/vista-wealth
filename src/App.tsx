/* App — 分幕叙事外壳：顶栏 / 舞台 / 进度条 / 顾问控制台 */
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { I18nProvider, useI18n } from "@/lib/i18n";
import { PRODUCT, type RiskKey } from "@/lib/product";
import { defaultState, useCalc, type DemoState } from "@/lib/useCalc";
import { CoverScene } from "@/scenes/CoverScene";
import { InvestScene } from "@/scenes/InvestScene";
import { PathScene } from "@/scenes/PathScene";
import { FundsScene } from "@/scenes/FundsScene";
import { PlanScene } from "@/scenes/PlanScene";
import { AdviserConsole } from "@/components/AdviserConsole";
import { cn } from "@/lib/utils";

const TOTAL = 5;

function Shell() {
  const { t, lang, setLang } = useI18n();
  const [state, setState] = useState<DemoState>(() => defaultState("zh"));
  const [scene, setScene] = useState(0);
  const [dir, setDir] = useState(1);
  const [consoleOpen, setConsoleOpen] = useState(false);

  const { scenarios, current, hitCase } = useCalc(state);

  const goTo = useCallback((n: number, back?: boolean) => {
    const clamped = Math.max(0, Math.min(TOTAL - 1, n));
    setDir(back === undefined ? (clamped >= scene ? 1 : -1) : back ? -1 : 1);
    setScene(clamped);
  }, [scene]);

  const next = useCallback(() => goTo(scene + 1, false), [goTo, scene]);
  const prev = useCallback(() => goTo(scene - 1, true), [goTo, scene]);

  const patch = useCallback((p: Partial<DemoState>) => setState((s) => ({ ...s, ...p })), []);

  const loadCase = useCallback(
    (id: string) => {
      const c = PRODUCT.cases.find((x) => x.id === id);
      if (!c) return;
      const ci = c.input;
      setState({
        clientName: c.name[lang],
        advisor: state.advisor,
        age: ci.age,
        retireAge: ci.retireAge,
        premium: ci.premium,
        payYears: ci.payYears,
        risk: ci.risk,
        payoutYears: ci.payoutYears
      });
    },
    [lang, state.advisor]
  );

  const print = useCallback(() => {
    if (scene !== 5) {
      goTo(5);
      setTimeout(() => window.print(), 500);
    } else {
      window.print();
    }
  }, [scene, goTo]);

  /* 键盘导航 */
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      switch (e.key) {
        case "ArrowRight":
        case "PageDown":
          e.preventDefault();
          next();
          break;
        case "ArrowLeft":
        case "PageUp":
          e.preventDefault();
          prev();
          break;
        case " ":
          e.preventDefault();
          next();
          break;
        case "Home":
          goTo(0, true);
          break;
        case "End":
          goTo(TOTAL - 1);
          break;
        case "c":
        case "C":
          setConsoleOpen((o) => !o);
          break;
        case "f":
        case "F":
          if (!document.fullscreenElement) {
            (document.documentElement.requestFullscreen || (() => {})).call(document.documentElement);
          } else if (document.exitFullscreen) {
            document.exitFullscreen();
          }
          break;
        case "p":
        case "P":
          if (scene === 5) window.print();
          break;
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [next, prev, goTo, scene]);

  /* 触摸滑动 */
  const touch = useRef({ x: 0, y: 0, tracking: false });
  const onTouchStart = (e: React.TouchEvent) => {
    touch.current = { x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY, tracking: true };
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touch.current.tracking) return;
    touch.current.tracking = false;
    const dx = e.changedTouches[0].clientX - touch.current.x;
    const dy = e.changedTouches[0].clientY - touch.current.y;
    if (Math.abs(dx) > 56 && Math.abs(dx) > Math.abs(dy) * 1.4) {
      if (dx < 0) next();
      else prev();
    }
  };

  const scenes = useMemo(
    () => [
      <CoverScene key={0} state={state} current={current} hitCase={hitCase} onStart={() => goTo(1, false)} />,
      <InvestScene key={1} state={state} current={current} />,
      <PathScene key={2} state={state} current={current} />,
      <FundsScene
        key={3}
        payoutAge={state.retireAge}
        scenarios={scenarios}
        risk={state.risk}
        onPick={(k: RiskKey) => patch({ risk: k })}
      />,
      <PlanScene
        key={4}
        state={state}
        scenarios={scenarios}
        onRestart={() => goTo(0, true)}
        onPrint={print}
      />
    ],
    [state, current, hitCase, scenarios, goTo, patch, print]
  );

  return (
    <div className="flex h-full flex-col">
      {/* 顶栏 */}
      <header className="flex h-16 shrink-0 items-center justify-between border-b border-hairline px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-ink text-[15px] font-bold text-cream">
            A
          </div>
          <div>
            <div className="text-[14px] font-semibold leading-tight">{t("app.title")}</div>
            <div className="text-[11px] leading-tight text-ink-faint">{t("cover.eyebrow")}</div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="rounded-full bg-hairline px-3 py-1 text-[11.5px] text-ink-faint">
            {t("disc.short")}
          </span>
          <button
            onClick={() => setConsoleOpen((o) => !o)}
            className={cn(
              "rounded-full px-4 py-2 text-[12.5px] font-medium transition-colors",
              consoleOpen ? "bg-gold text-white" : "bg-ink text-white hover:bg-ink/85"
            )}
          >
            {t("app.console")}
          </button>
          <div className="flex overflow-hidden rounded-full ring-1 ring-hairline">
            {(["zh", "en"] as const).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={cn(
                  "px-3.5 py-1.5 text-[12.5px] font-medium transition-colors",
                  lang === l ? "bg-ink text-white" : "text-ink-soft hover:bg-hairline"
                )}
              >
                {l === "zh" ? "中文" : "EN"}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* 舞台 */}
      <main className="relative min-h-0 flex-1 overflow-hidden" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        <AnimatePresence initial={false} custom={dir}>
          <motion.section
            key={scene}
            custom={dir}
            initial={{ opacity: 0, x: dir * 64 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: dir * -64 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0"
          >
            {scenes[scene]}
          </motion.section>
        </AnimatePresence>
      </main>

      {/* 底部进度 */}
      <footer className="flex h-14 shrink-0 items-center justify-between border-t border-hairline px-8">
        <div className="flex items-center gap-1.5">
          {Array.from({ length: TOTAL }).map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              data-dot={i}
              className={cn(
                "flex items-center gap-2 rounded-full px-3 py-1.5 text-[12px] transition-colors",
                scene === i ? "bg-ink text-white" : "text-ink-faint hover:bg-hairline"
              )}
            >
              <span
                className={cn(
                  "h-1.5 w-1.5 rounded-full",
                  scene === i ? "bg-gold" : "bg-ink/25"
                )}
              />
              {t("scene." + i)}
            </button>
          ))}
        </div>
        <div className="text-[11.5px] text-ink-faint">
          <kbd className="rounded border border-hairline px-1.5 py-0.5">←</kbd>{" "}
          <kbd className="rounded border border-hairline px-1.5 py-0.5">→</kbd> {t("scene.hint")}
        </div>
      </footer>

      <AdviserConsole
        open={consoleOpen}
        state={state}
        hitCaseId={hitCase?.id ?? null}
        onPatch={patch}
        onLoadCase={loadCase}
        onToggle={(o) => setConsoleOpen((prev) => (o === undefined ? !prev : o))}
      />
    </div>
  );
}

export default function App() {
  return (
    <I18nProvider>
      <Shell />
    </I18nProvider>
  );
}
