/* ============================================================
   i18n.tsx — 中英双语字典 + React Context
   产品：AIA Pro Achiever 3.0 / 友邦成就一生 3.0
   ============================================================ */
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { PRODUCT, type Lang } from "./product";

const DICT: Record<Lang, Record<string, string>> = {
  zh: {
    "app.title": "成就一生 3.0 · 客户方案演示",
    "app.console": "顾问控制台",
    "scene.hint": "按 ← → 或左右滑动翻页",

    "scene.0": "封面",
    "scene.1": "投入与红利",
    "scene.2": "增长路径",
    "scene.3": "风险匹配",
    "scene.4": "专属方案",

    "cover.eyebrow": "期缴保费投资联结保险计划（ILP）",
    "cover.for": "专属财富方案",
    "cover.goal": "您的目标",
    "cover.prepared": "方案顾问",
    "cover.start": "开始演示",

    "unit.year": "年",
    "unit.age": "岁",
    "unit.times": "倍",

    "invest.annual": "年缴保费",
    "invest.total": "累计投入本金",
    "engine.title": "只在前几年投入，之后全靠复利与红利",
    "engine.sub": "柱子代表当年进入投资的资金；绿色曲线代表假定情景下的账户价值，金色部分是 AIA 额外注入的",
    "engine.cumulative": "AIA 红利",
    "engine.after": "之后 {n} 年，您不再投入一分钱",
    "engine.after.sub": "剩下的，全部交给复利和红利",
    "chart.invest.premium": "您的保费",
    "chart.invest.welcome": "迎新红利",
    "chart.invest.special": "特别红利",
    "chart.accountValue": "假定账户价值",

    "chip.pct100.t": "100% 保费即投",
    "chip.pct100.d": "保费从首日起全数投入，不让资金空转",
    "chip.welcome.t": "迎新红利 · 最高 75%",
    "chip.welcome.d": "前 3 个保单年度逐年加码，直接增厚本金",
    "chip.special.t": "特别红利 · 5% 升至 8%",
    "chip.special.d": "第 10 年起每年 5%，第 21 年起 8%",
    "chip.cap.t": "附加费 · 11 年封顶",
    "chip.cap.d": "缴满 11 年年度保费后不再收取附加费",

    "path.title": "钱怎么长起来，红利帮了多少",
    "path.sub": "两条线之间的金色区域，就是 AIA 红利为您额外创造的价值",
    "chart.value": "账户价值",
    "chart.principal": "累计本金",
    "chart.withBonus": "含三层红利",
    "chart.withoutBonus": "仅自有资金",
    "chart.age": "年龄",
    "path.atAge": "{age} 岁时的账户价值",
    "delta.extra": "AIA 额外创造",
    "delta.extraPct": "相当于本金的 {pct}",
    "delta.totalInvested": "实际进入市场",

    "tl.title": "您的财富时间线",
    "tl.start": "投保生效",
    "tl.bonus": "红利加码期",
    "tl.cap": "附加费封顶",
    "tl.iipend": "缴费结束",
    "tl.retire": "退休领取",
    "tl.legacy": "财富传承",

    "value.title": "这笔钱，能换到什么",
    "value.sub": "把账户价值和您熟悉的生活开销放在同一把尺子上",
    "value.atAge": "{age} 岁时账户价值",
    "value.note": "换算仅为示意，帮助理解金额量级，不构成任何承诺。",
    "value.notice.eyebrow": "以手册为准",
    "value.notice.title": "本页暂不展示未经产品手册支持的生活成本换算",
    "value.notice.body": "产品手册未提供房产首付、大学学费或退休现金流的换算基准。为避免造成不准确的比较，这些示意数据已移除；具体利益请以正式利益演示书为准。",
    "value.bar.total": "账户总价值",
    "value.bar.home": "一套房产首付",
    "value.bar.edu": "一份大学学费",
    "value.bar.retire": "一年退休现金流",
    "value.mult.home": "可付 {n} 套首付",
    "value.mult.edu": "可付 {n} 份学费",
    "value.mult.retire": "可领 {n} 年",

    "funds.title": "三档组合，匹配您的风险偏好",
    "funds.sub": "点击卡片即可切换当前方案档位",
    "fund.cons": "友邦精英保守型基金",
    "fund.bal": "友邦精英平衡型基金",
    "fund.agg": "友邦精英冒险型基金",
    "fund.risk.low": "低至中风险",
    "fund.risk.mid": "中至高风险",
    "fund.risk.high": "较高风险",
    "fund.stock": "股票",
    "funds.atAge": "{age} 岁账户价值",
    "funds.current": "当前方案",

    "summary.title": "您的专属方案",
    "summary.sub": "三档情景一目了然，附下一步建议",
    "sum.client": "客户",
    "sum.advisor": "顾问",
    "sum.age": "投保年龄",
    "sum.term": "初始投资期",
    "sum.premium": "年缴保费",
    "sum.payout": "目标领取年龄",
    "sum.selected": "所选组合",
    "sum.principal": "累计投入本金",
    "sum.next": "下一步",
    "sum.next1": "确认风险偏好与投资期",
    "sum.next2": "选择附加保障（定期险 / 危疾免缴）",
    "sum.next3": "完成投保申请，无需体检",
    "sum.print": "导出 / 打印方案",
    "sum.restart": "回到封面",

    "fx.medical": "无需体检",
    "fx.pass": "保费免缴 36 个月",
    "fx.holiday": "保费假期",
    "fx.cashout": "投资期后免费提取",
    "fx.legacy": "第二受保人传承",

    "console.title": "顾问控制台",
    "console.hint": "本面板不会出现在客户视野中，可随时隐藏。",
    "console.client": "客户姓名",
    "console.advisor": "顾问姓名",
    "console.age": "投保年龄",
    "console.retire": "目标领取年龄",
    "console.premium": "年缴保费",
    "console.term": "初始投资期",
    "console.risk": "投资组合",
    "console.payout": "领取年限",
    "console.cases": "手册案例",
    "console.case.zhiwen": "致文 · 25 岁 / 10 年",
    "console.case.luna": "露娜 · 30 岁 / 20 年",
    "console.case.custom": "自定义",
    "console.stress": "下行压力测试",
    "console.stress.off": "关闭",
    "console.stress.flat": "零回报",
    "console.stress.down": "年化 −2%",
    "console.stressOn": "压力测试进行中",

    "ms.welcome": "迎新红利",
    "ms.supcap": "附加费封顶",
    "ms.iipend": "投资期结束",

    "disc.short": "演示数据 · 非保证收益 · 投资涉及风险",
    "disc.full":
      "重要提示：本页面为产品概念与演示用途，不构成保险合同、投资建议或收益承诺。友邦成就一生 3.0 计划为投资联结保险计划（ILP），投资涉及风险，包括可能亏损所投入的本金。子基金表现并无保证，单位价值及所得收入可升可跌，过往表现不可作为未来表现的指标。实际保单价值取决于所投资基金的实际表现，可能低于已缴付的保费总额。4% / 6% / 8% 为假定年投资回报率，非保证。具体保障、费用与条款以正式保单合同及经审核的利益演示书为准。"
  },

  en: {
    "app.title": "AIA Pro Achiever 3.0 · Client Presentation",
    "app.console": "Adviser console",
    "scene.hint": "Use ← → or swipe to change scenes",

    "scene.0": "Cover",
    "scene.1": "Outlay & bonuses",
    "scene.2": "Growth path",
    "scene.3": "Risk fit",
    "scene.4": "Your plan",

    "cover.eyebrow": "Regular Premium Investment-Linked Plan (ILP)",
    "cover.for": "Tailored wealth plan",
    "cover.goal": "Your goal",
    "cover.prepared": "Prepared by",
    "cover.start": "Start presentation",

    "unit.year": "yr",
    "unit.age": "",
    "unit.times": "×",

    "invest.annual": "Annual premium",
    "invest.total": "Total principal",
    "engine.title": "You fund it early — compounding and bonuses do the rest",
    "engine.sub": "Bars show capital invested that year; the green line is the illustrated account value, and gold is what AIA adds on top",
    "engine.cumulative": "AIA bonuses",
    "engine.after": "For the next {n} years, you pay nothing more",
    "engine.after.sub": "The rest is left to compounding and bonuses",
    "chart.invest.premium": "Your premiums",
    "chart.invest.welcome": "Welcome bonus",
    "chart.invest.special": "Special bonus",
    "chart.accountValue": "Illustrated account value",

    "chip.pct100.t": "100% invested from day one",
    "chip.pct100.d": "Premiums go straight to work — no idle capital",
    "chip.welcome.t": "Welcome bonus · up to 75%",
    "chip.welcome.d": "Paid over the first three policy years",
    "chip.special.t": "Special bonus · 5% to 8%",
    "chip.special.d": "5% a year from year 10, 8% from year 21",
    "chip.cap.t": "Charges capped after 11 years",
    "chip.cap.d": "No supplementary charges once 11 premiums are paid",

    "path.title": "How it grows — and what bonuses add",
    "path.sub": "The gold band between the two lines is the extra value AIA's bonuses create",
    "chart.value": "Account value",
    "chart.principal": "Cumulative principal",
    "chart.withBonus": "With all bonuses",
    "chart.withoutBonus": "Own capital only",
    "chart.age": "Age",
    "path.atAge": "Account value at age {age}",
    "delta.extra": "Extra from AIA",
    "delta.extraPct": "equal to {pct} of principal",
    "delta.totalInvested": "Capital in the market",

    "tl.title": "Your wealth timeline",
    "tl.start": "Policy starts",
    "tl.bonus": "Bonus years",
    "tl.cap": "Charges capped",
    "tl.iipend": "Premiums end",
    "tl.retire": "Retirement income",
    "tl.legacy": "Legacy",

    "value.title": "What this money can do",
    "value.sub": "Your account value measured against costs you already know",
    "value.atAge": "Account value at {age}",
    "value.note": "Conversions are illustrative, to help grasp the magnitude. Not a promise of any kind.",
    "value.notice.eyebrow": "Brochure-led",
    "value.notice.title": "No unsupported lifestyle conversions are shown here",
    "value.notice.body": "The product brochure does not provide benchmarks for property down payments, university costs or retirement cash flow. These comparisons are therefore removed; refer to the formal benefit illustration for exact policy values.",
    "value.bar.total": "Total account value",
    "value.bar.home": "One property down payment",
    "value.bar.edu": "One university degree",
    "value.bar.retire": "One year of retirement income",
    "value.mult.home": "covers {n} down payments",
    "value.mult.edu": "covers {n} degrees",
    "value.mult.retire": "lasts {n} years",

    "funds.title": "Three portfolios, three risk appetites",
    "funds.sub": "Tap a card to switch the plan's portfolio",
    "fund.cons": "AIA Elite Cautious Fund",
    "fund.bal": "AIA Elite Balanced Fund",
    "fund.agg": "AIA Elite Adventurous Fund",
    "fund.risk.low": "Low–medium risk",
    "fund.risk.mid": "Medium–high risk",
    "fund.risk.high": "Higher risk",
    "fund.stock": "Equities",
    "funds.atAge": "Value at {age}",
    "funds.current": "Current plan",

    "summary.title": "Your tailored plan",
    "summary.sub": "Three scenarios at a glance, with next steps",
    "sum.client": "Client",
    "sum.advisor": "Adviser",
    "sum.age": "Entry age",
    "sum.term": "Initial investment period",
    "sum.premium": "Annual premium",
    "sum.payout": "Target payout age",
    "sum.selected": "Selected portfolio",
    "sum.principal": "Total principal",
    "sum.next": "Next steps",
    "sum.next1": "Confirm risk appetite and horizon",
    "sum.next2": "Choose riders (term / CI waiver)",
    "sum.next3": "Complete the application — no check-up",
    "sum.print": "Export / print plan",
    "sum.restart": "Back to cover",

    "fx.medical": "No medical check-up",
    "fx.pass": "36 months premium passes",
    "fx.holiday": "Premium holiday",
    "fx.cashout": "Fee-free withdrawals after IIP",
    "fx.legacy": "Second insured legacy",

    "console.title": "Adviser console",
    "console.hint": "This panel never appears in the client's view.",
    "console.client": "Client name",
    "console.advisor": "Adviser name",
    "console.age": "Entry age",
    "console.retire": "Target payout age",
    "console.premium": "Annual premium",
    "console.term": "Initial investment period",
    "console.risk": "Portfolio",
    "console.payout": "Payout years",
    "console.cases": "Brochure cases",
    "console.case.zhiwen": "Zhiwen · 25 / 10 yrs",
    "console.case.luna": "Luna · 30 / 20 yrs",
    "console.case.custom": "Custom",
    "console.stress": "Downside stress test",
    "console.stress.off": "Off",
    "console.stress.flat": "Zero return",
    "console.stress.down": "−2% p.a.",
    "console.stressOn": "Stress test active",

    "ms.welcome": "Welcome bonus",
    "ms.supcap": "Charges capped",
    "ms.iipend": "IIP ends",

    "disc.short": "Illustrative · not guaranteed · involves risk",
    "disc.full":
      "Important: this page is a conceptual illustration only. It is not an insurance contract, investment advice or a promise of returns. AIA Pro Achiever 3.0 is an investment-linked plan (ILP); investing involves risk, including possible loss of principal. Sub-fund performance is not guaranteed, unit values may fall as well as rise, and past performance is not indicative of future results. The 4% / 6% / 8% figures are assumed annual returns and are not guaranteed. Exact terms follow the formal policy contract and the approved benefit illustration."
  }
};

interface I18nCtx {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string, vars?: Record<string, string | number>) => string;
  money: (v: number) => string;
  fmtPct: (v: number, digits?: number) => string;
  fmtNum: (v: number, digits?: number) => string;
}

const Ctx = createContext<I18nCtx | null>(null);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    try {
      const saved = localStorage.getItem("vista-lang");
      return saved === "en" ? "en" : "zh";
    } catch {
      return "zh";
    }
  });

  const setLang = (l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem("vista-lang", l);
    } catch {
      /* file:// 下忽略 */
    }
  };

  useEffect(() => {
    document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";
  }, [lang]);

  const value = useMemo<I18nCtx>(() => {
    const t = (key: string, vars?: Record<string, string | number>) => {
      let s = DICT[lang][key] ?? DICT.zh[key] ?? key;
      if (vars) {
        Object.keys(vars).forEach((k) => {
          s = s.replace(new RegExp("\\{" + k + "\\}", "g"), String(vars[k]));
        });
      }
      return s;
    };
    const money = (v: number) =>
      PRODUCT.currency.symbol + " " + Math.round(Number(v) || 0).toLocaleString("en-US");
    const fmtPct = (v: number, digits = 0) => ((v || 0) * 100).toFixed(digits) + "%";
    const fmtNum = (v: number, digits = 1) => (Number(v) || 0).toFixed(digits);
    return { lang, setLang, t, money, fmtPct, fmtNum };
  }, [lang]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useI18n(): I18nCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
