/* ============================================================
   product.config.js — 产品配置层
   真实产品：AIA Pro Achiever 3.0 / 友邦成就一生 3.0
   新加坡期缴保费投资联结保险计划（ILP）
   ------------------------------------------------------------
   本文件只放「产品规则与数值」，不放 UI 文案（文案在 i18n.js）。
   换新产品时只需替换本文件 + i18n 文案，UI 与图表无需改动。
   数值口径来源：AIA Pro Achiever 3.0 产品手册（2024-04-22 版）。
   ============================================================ */
window.PRODUCT = (function () {
  "use strict";

  return {
    /* ---------- 品牌 ---------- */
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

    /* ---------- 币种（新加坡产品，统一用新元） ---------- */
    currency: { symbol: "S$", code: "SGD", locale: "en-SG" },

    /* ---------- 三档基金组合（取自产品手册） ---------- */
    funds: {
      cons: { key: "cons", gross: 0.04, stock: 0.30, bond: 0.70, risk: "low",  color: "#5B8DB8" },
      bal:  { key: "bal",  gross: 0.06, stock: 0.40, bond: 0.60, risk: "mid",  color: "#2FA093" },
      agg:  { key: "agg",  gross: 0.08, stock: 0.90, bond: 0.10, risk: "high", color: "#D8A93F" }
    },
    fundOrder: ["cons", "bal", "agg"],

    /* ---------- 费用 ---------- */
    fees: {
      /* 年度基金管理费 */
      annualFundMgmt: 0.0145,
      /* 手册露娜案例：首 24 年 1.45%，第 25 年起 1.35% */
      stepDown: { fromYear: 25, rate: 0.0135 },
      /* 附加费封顶：缴付 11 年年度保费后不再收取 */
      supplementaryCapYear: 11
    },

    /* ---------- 迎新红利：前 3 个保单年度，比例随初始投资期 ----------
       20 年期合计 20%+25%+30% = 75%，即手册所称「高达 75% 迎新红利」 */
    welcomeBonus: {
      10: [0.10, 0.13, 0.15],
      15: [0.15, 0.20, 0.25],
      20: [0.20, 0.25, 0.30]
    },

    /* ---------- 特别红利：须持续缴付期缴保费 ---------- */
    specialBonus: [
      { fromYear: 10, toYear: 20, rate: 0.05 },
      { fromYear: 21, toYear: 999, rate: 0.08 }
    ],

    /* ---------- 初始投资期（IIP）选项 ---------- */
    iipOptions: [10, 15, 20],

    /* ---------- 投资管理背书（取自手册） ---------- */
    investment: {
      aum: 2760,                 /* 亿美元，截至 2023-06-30 */
      aumAsOf: "2023-06-30",
      managers: ["Baillie Gifford", "BlackRock", "Capital Group", "Wellington Management"]
    },

    /* ---------- 手册官方案例 ----------
       anchors：手册给出的官方演示终值，用于锚定校准，
       保证工具输出与手册数字一致，避免客户对照时穿帮。 */
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
    ],

    /* ---------- 关键事件节点（用于增长曲线标记） ---------- */
    milestones: [
      { id: "welcome",  year: 1,  tone: "gold" },
      { id: "welcome3", year: 3,  tone: "gold" },
      { id: "special5", year: 10, tone: "gold" },
      { id: "supcap",   year: 11, tone: "teal" },
      { id: "special8", year: 21, tone: "gold" },
      { id: "iipend",   year: null, tone: "teal" } /* = payYears */
    ],

    /* ---------- 六大亮点（文案 key 在 i18n.js） ---------- */
    highlights: [
      { key: "hl.invest",  tone: "teal" },
      { key: "hl.welcome", tone: "gold" },
      { key: "hl.special", tone: "gold" },
      { key: "hl.iip",     tone: "teal" },
      { key: "hl.funds",   tone: "teal" },
      { key: "hl.rider",   tone: "teal" }
    ],

    /* ---------- 灵活与保障（文案 key 在 i18n.js） ---------- */
    flexPoints: [
      { key: "fx.medical" },
      { key: "fx.pass" },
      { key: "fx.holiday" },
      { key: "fx.cashout" },
      { key: "fx.legacy" },
      { key: "fx.aum" }
    ],

    /* ---------- 下行压力测试情景 ---------- */
    stress: [
      { id: "flat",  gross: 0.00, key: "console.stress.flat" },
      { id: "down",  gross: -0.02, key: "console.stress.down" }
    ],

    /* ---------- 生活单位换算系数（价值翻译器） ---------- */
    translators: [
      { id: "retire",  key: "tr.retire",  monthlyDivisor: 12 },
      { id: "edu",     key: "tr.edu",     unitCost: 120000, unitLabelKey: "tr.edu.unit" },
      { id: "home",    key: "tr.home",    unitCost: 400000, unitLabelKey: "tr.home.unit" }
    ],

    /* ---------- 默认客户参数 ---------- */
    defaults: {
      clientName: { zh: "陈先生", en: "Mr. Tan" },
      advisor: { zh: "您的财务顾问", en: "Your Financial Adviser" },
      age: 30,
      retireAge: 60,
      premium: 12000,
      payYears: 20,
      risk: "agg",
      payoutYears: 20
    }
  };
})();
