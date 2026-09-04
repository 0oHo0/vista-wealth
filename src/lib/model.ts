/* ============================================================
   model.ts — 测算引擎（可插拔）
   ------------------------------------------------------------
   对外契约（请勿改动函数名与返回字段）：
     project(input)      -> 单情景结果
     allScenarios(input) -> { cons, bal, agg } 三情景结果
     annuity(v, r, n)    -> 等额年金

   【重要】拿到官方计算公式后，只需替换 series() 内部实现，
   并把 ASSUME.USE_ANCHORS 设为 false。UI / 图表无需改动。
   ============================================================ */
import { PRODUCT, type CaseInput, type RiskKey } from "./product";

export const ASSUME = {
  /* 红利是否只在缴付期内发放（口径歧义，待官方公式确认） */
  bonusesDuringPaymentOnly: true,
  /* 命中手册案例时，把终值锚定到手册官方数字 */
  USE_ANCHORS: true,
  SUPPLEMENTARY_CAP_YEAR: PRODUCT.fees.supplementaryCapYear
};

export interface Row {
  year: number;
  age: number;
  premium: number;
  bonus: number;
  value: number;
  valueNoBonus: number;
  cumPremium: number;
  cumBonus: number;
}

export interface Milestone {
  id: string;
  year: number;
  age: number;
  tone: string;
  value: number;
}

export interface ScenarioResult {
  risk: RiskKey;
  gross: number;
  horizon: number;
  rows: Row[];
  ages: number[];
  principal: number;
  totalBonus: number;
  endValue: number;
  endNoBonus: number;
  delta: number;
  multiple: number;
  endNetRate: number;
  anchored: boolean;
  milestones: Milestone[];
  payout: { annual: number; monthly: number };
}

export interface CalcInput extends CaseInput {
  anchors?: Partial<Record<RiskKey, number>>;
}

/* ---------- 费率与净回报 ---------- */
function feeForYear(y: number): number {
  const sd = PRODUCT.fees.stepDown;
  return sd && y >= sd.fromYear ? sd.rate : PRODUCT.fees.annualFundMgmt;
}

export function netRate(gross: number, y: number): number {
  return gross - feeForYear(y);
}

function grossOf(riskKey: RiskKey, input: CalcInput): number {
  return PRODUCT.funds[riskKey].gross;
}

/* ---------- 当年红利（拆分为迎新 / 特别，供堆叠图使用） ---------- */
export function bonusSplit(y: number, premium: number, payYears: number) {
  let welcome = 0;
  let special = 0;
  if (!(ASSUME.bonusesDuringPaymentOnly && y > payYears)) {
    const w = PRODUCT.welcomeBonus[payYears];
    if (w && y <= 3) welcome = w[y - 1] * premium;
    PRODUCT.specialBonus.forEach((s) => {
      if (y >= s.fromYear && y <= s.toYear) special += s.rate * premium;
    });
  }
  return { welcome, special };
}

/* ---------- 单情景逐年序列（年初投入、年末增值） ---------- */
function series(riskKey: RiskKey, input: CalcInput) {
  const horizon = Math.max(1, input.retireAge - input.age);
  const gross = grossOf(riskKey, input);
  const premium = input.premium;
  const payYears = input.payYears;

  const rows: Row[] = [];
  let v = 0;
  let vNo = 0;
  let cumPremium = 0;
  let cumBonus = 0;

  for (let y = 1; y <= horizon; y++) {
    const prem = y <= payYears ? premium : 0;
    const b = bonusSplit(y, premium, payYears);
    const bonus = b.welcome + b.special;
    const r = netRate(gross, y);

    v = (v + prem + bonus) * (1 + r);
    vNo = (vNo + prem) * (1 + r);

    cumPremium += prem;
    cumBonus += bonus;

    rows.push({
      year: y,
      age: input.age + y,
      premium: prem,
      bonus: Math.round(bonus),
      value: v,
      valueNoBonus: vNo,
      cumPremium,
      cumBonus
    });
  }

  /* 锚定校准：命中手册案例时把终值对齐官方数字 */
  let anchored = false;
  const rawEnd = rows.length ? rows[rows.length - 1].value : 0;
  if (ASSUME.USE_ANCHORS && input.anchors && input.anchors[riskKey] && rawEnd > 0) {
    const scale = (input.anchors[riskKey] as number) / rawEnd;
    anchored = true;
    rows.forEach((r) => {
      r.value *= scale;
      r.valueNoBonus *= scale;
    });
  }

  const end = rows.length ? rows[rows.length - 1] : { value: 0, valueNoBonus: 0 };
  const endNet = netRate(gross, horizon);

  return {
    risk: riskKey,
    gross,
    horizon,
    rows,
    principal: cumPremium,
    totalBonus: cumBonus,
    endValue: end.value,
    endNoBonus: end.valueNoBonus,
    delta: end.value - end.valueNoBonus,
    multiple: cumPremium > 0 ? end.value / cumPremium : 0,
    endNetRate: endNet,
    anchored,
    payout: annuity(end.value, endNet, input.payoutYears || 20)
  };
}

/* ---------- 等额年金（期末支付） ---------- */
export function annuity(v: number, r: number, n = 20) {
  if (n <= 0) return { annual: 0, monthly: 0 };
  if (Math.abs(r) < 1e-9) return { annual: v / n, monthly: v / n / 12 };
  const annual = (v * r) / (1 - Math.pow(1 + r, -n));
  return { annual, monthly: annual / 12 };
}

/* ---------- 关键事件（只保留真正会发生的） ---------- */
function milestones(input: CalcInput, result: ReturnType<typeof series>): Milestone[] {
  const payYears = input.payYears;
  const out: Milestone[] = [];
  PRODUCT.milestones.forEach((m) => {
    const year = m.year === null ? payYears : (m.year as number);
    if (year > result.horizon) return;
    /* 特别红利 8% 需缴付至第 21 年，10/15/20 年期下不会触发 */
    if (m.id === "special8" && ASSUME.bonusesDuringPaymentOnly && payYears < 21) return;
    const row = result.rows[year - 1];
    out.push({
      id: m.id,
      year,
      age: input.age + year,
      tone: m.tone,
      value: row ? row.value : 0
    });
  });
  return out;
}

/* ---------- 对外：单情景 ---------- */
export function project(input: CalcInput): ScenarioResult {
  const safe = input.retireAge <= input.age ? { ...input, retireAge: input.age + 1 } : input;
  const r = series(safe.risk, safe);
  r.milestones = milestones(safe, r);
  r.ages = r.rows.map((x) => x.age);
  return r as ScenarioResult;
}

/* ---------- 对外：三情景 ---------- */
export function allScenarios(input: CalcInput): Record<RiskKey, ScenarioResult> {
  const out = {} as Record<RiskKey, ScenarioResult>;
  PRODUCT.fundOrder.forEach((k) => {
    out[k] = project({ ...input, risk: k });
  });
  return out;
}
