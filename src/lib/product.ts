/* ============================================================
   product.ts — 产品配置层
   真实产品：AIA Pro Achiever 3.0 / 友邦成就一生 3.0
   新加坡期缴保费投资联结保险计划（ILP）
   数值口径来源：AIA Pro Achiever 3.0 产品手册（2024-04-22 版）。
   本文件只放「产品规则与数值」，不放 UI 文案（文案在 i18n.tsx）。
   ============================================================ */

export type Lang = "zh" | "en";
export type RiskKey = "cons" | "bal" | "agg";

export interface CaseInput {
  age: number;
  retireAge: number;
  premium: number;
  payYears: number;
  risk: RiskKey;
  payoutYears: number;
}

export interface BrochureCase {
  id: string;
  name: Record<Lang, string>;
  persona: Record<Lang, string>;
  input: CaseInput;
  anchors: Partial<Record<RiskKey, number>>;
  note: Record<Lang, string>;
}

export const PRODUCT = {
  brand: {
    zh: {
      name: "友邦成就一生 3.0 计划",
      latin: "AIA Pro Achiever 3.0",
      category: "期缴保费投资联结保险计划（ILP）",
      insurer: "由友邦新加坡私人有限公司（AIA Singapore）承保"
    },
    en: {
      name: "AIA Pro Achiever 3.0",
      latin: "AIA Pro Achiever 3.0",
      category: "Regular Premium Investment-Linked Plan (ILP)",
      insurer: "Underwritten by AIA Singapore Private Limited"
    }
  },

  currency: { symbol: "S$", code: "SGD", locale: "en-SG" },

  /* 三档基金组合（取自产品手册） */
  funds: {
    cons: { key: "cons" as RiskKey, gross: 0.04, stock: 0.3, bond: 0.7, risk: "low", color: "#5B7FA6" },
    bal: { key: "bal" as RiskKey, gross: 0.06, stock: 0.4, bond: 0.6, risk: "mid", color: "#0E7C6B" },
    agg: { key: "agg" as RiskKey, gross: 0.08, stock: 0.9, bond: 0.1, risk: "high", color: "#B08D57" }
  },
  fundOrder: ["cons", "bal", "agg"] as RiskKey[],

  fees: {
    annualFundMgmt: 0.0145,
    stepDown: { fromYear: 25, rate: 0.0135 },
    supplementaryCapYear: 11
  },

  /* 迎新红利：前 3 个保单年度；20 年期合计 75% */
  welcomeBonus: {
    10: [0.1, 0.13, 0.15],
    15: [0.15, 0.2, 0.25],
    20: [0.2, 0.25, 0.3]
  } as Record<number, number[]>,

  /* 特别红利：须持续缴付期缴保费 */
  specialBonus: [
    { fromYear: 10, toYear: 20, rate: 0.05 },
    { fromYear: 21, toYear: 999, rate: 0.08 }
  ],

  iipOptions: [10, 15, 20],

  investment: {
    aum: 2760,
    aumAsOf: "2023-06-30",
    managers: ["Baillie Gifford", "BlackRock", "Capital Group", "Wellington Management"]
  },

  /* 手册官方案例 + 锚定校准值 */
  cases: [
    {
      id: "zhiwen",
      name: { zh: "致文", en: "Zhiwen" },
      persona: {
        zh: "25 岁单身管理人员，目标 65 岁前退休",
        en: "Single executive, 25, aiming to retire before 65"
      },
      input: { age: 25, retireAge: 65, premium: 7200, payYears: 10, risk: "agg", payoutYears: 20 },
      anchors: { agg: 1061100, cons: 361400 },
      note: {
        zh: "手册假设：8% 假定年回报率下，65 岁退保约 S$1,061,100；4% 假定回报率下约 S$361,400。",
        en: "Per brochure: at an assumed 8% return, surrender value at 65 is about S$1,061,100; at 4%, about S$361,400."
      }
    },
    {
      id: "luna",
      name: { zh: "露娜", en: "Luna" },
      persona: {
        zh: "30 岁母亲，为儿子鲁加准备升学与传承资金",
        en: "Mother, 30, funding her son Ruga's education and legacy"
      },
      input: { age: 30, retireAge: 65, premium: 12000, payYears: 20, risk: "agg", payoutYears: 20 },
      anchors: { agg: 2352000 },
      note: {
        zh: "手册假设：8% 假定年回报率下，鲁加退保时约 S$2,352,000（已含转让给第二受保人）。",
        en: "Per brochure: at an assumed 8% return, surrender value is about S$2,352,000 after transfer to the second insured."
      }
    }
  ] as BrochureCase[],

  milestones: [
    { id: "welcome", year: 1, tone: "gold" },
    { id: "welcome3", year: 3, tone: "gold" },
    { id: "special5", year: 10, tone: "gold" },
    { id: "supcap", year: 11, tone: "teal" },
    { id: "special8", year: 21, tone: "gold" },
    { id: "iipend", year: null as number | null, tone: "teal" }
  ],

  /* 生活单位换算系数（价值翻译器） */
  translators: {
    edu: { unitCost: 120000 },
    home: { unitCost: 400000 }
  },

  defaults: {
    clientName: { zh: "陈先生", en: "Mr. Tan" },
    advisor: { zh: "您的财务顾问", en: "Your Financial Adviser" },
    age: 30,
    retireAge: 60,
    premium: 12000,
    payYears: 20,
    risk: "agg" as RiskKey,
    payoutYears: 20
  }
};

export type Product = typeof PRODUCT;
