/* ============================================================
   useCalc.ts — 演示状态 + 测算（命中手册案例时锚定校准）
   ============================================================ */
import { useMemo } from "react";
import { PRODUCT, type BrochureCase, type RiskKey } from "./product";
import { allScenarios, type CalcInput, type ScenarioResult } from "./model";

export interface DemoState {
  clientName: string;
  advisor: string;
  age: number;
  retireAge: number;
  premium: number;
  payYears: number;
  risk: RiskKey;
  payoutYears: number;
}

export function defaultState(lang: "zh" | "en"): DemoState {
  return {
    clientName: PRODUCT.defaults.clientName[lang],
    advisor: PRODUCT.defaults.advisor[lang],
    age: PRODUCT.defaults.age,
    retireAge: PRODUCT.defaults.retireAge,
    premium: PRODUCT.defaults.premium,
    payYears: PRODUCT.defaults.payYears,
    risk: PRODUCT.defaults.risk,
    payoutYears: PRODUCT.defaults.payoutYears
  };
}

/* 只有参数与手册案例完全一致时才启用锚定，避免调整后数值失真 */
function matchCase(input: CalcInput): BrochureCase | null {
  for (const c of PRODUCT.cases) {
    const ci = c.input;
    if (
      ci.age === input.age &&
      ci.retireAge === input.retireAge &&
      ci.premium === input.premium &&
      ci.payYears === input.payYears &&
      ci.payoutYears === input.payoutYears
    ) {
      return c;
    }
  }
  return null;
}

export function useCalc(state: DemoState) {
  return useMemo(() => {
    const input: CalcInput = {
      age: state.age,
      retireAge: state.retireAge,
      premium: state.premium,
      payYears: state.payYears,
      risk: state.risk,
      payoutYears: state.payoutYears
    };
    const hitCase = matchCase(input);
    if (hitCase) input.anchors = hitCase.anchors;
    const scenarios = allScenarios(input);
    const current: ScenarioResult = scenarios[state.risk];
    return { scenarios, current, hitCase };
  }, [state]);
}
