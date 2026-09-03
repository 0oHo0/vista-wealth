/* ============================================================
   i18n.js — 中英双语字典与切换逻辑（无依赖，离线可用）
   ============================================================ */
(function () {
  const DICT = {
    zh: {
      /* nav */
      "nav.plan": "财富规划",
      "nav.product": "产品介绍",
      "nav.sub": "投资储蓄计划 · 客户演示",
      "nav.demo": "演示数据，非保证收益",

      /* planner controls */
      "planner.title": "客户规划参数",
      "planner.subtitle": "拖动调整，图表实时更新",
      "ctrl.age": "当前年龄",
      "ctrl.ageUnit": "岁",
      "ctrl.yearUnit": "年",
      "unit.yr": "年",
      "ctrl.retire": "目标领取年龄",
      "ctrl.premium": "每年投入",
      "ctrl.payYears": "缴费期",
      "ctrl.risk": "投资组合（假定年回报）",
      "ctrl.withdrawYears": "退休后领取年限",
      "risk.cons": "保守型",
      "risk.bal": "平衡型",
      "risk.agg": "进取型",
      "planner.reset": "重置为示例客户",
      "planner.print": "导出 / 打印本方案",
      "planner.note": "演示模型：回报率已扣除 1.45% 年度基金管理费假设；迎新红利与特别红利规则参考产品条款简化，正式利益须以保单合同及利益演示书为准。",

      /* kpi */
      "kpi.invested": "累计投入本金",
      "kpi.valueAt": "领取时账户价值（所选档位）",
      "kpi.gain": "累计收益",
      "kpi.multiple": "本金倍数",
      "kpi.annualIncome": "退休后每年约可领取",
      "kpi.for": "按",
      "kpi.years": "年等额领取",
      "kpi.scenarios": "三档情景对比 · 领取时账户价值",

      /* charts */
      "chart.growth": "账户价值增长路径（三档情景）",
      "chart.growth.hint": "横轴为年龄，纵轴为账户价值",
      "chart.stack": "本金与收益构成",
      "chart.alloc": "资产配置比例",
      "chart.stock": "股票",
      "chart.bond": "固定收益",
      "chart.principal": "累计本金",
      "chart.gainArea": "累计收益",
      "chart.cons": "保守 4%",
      "chart.bal": "平衡 6%",
      "chart.agg": "进取 8%",
      "chart.payEnd": "缴费期满",
      "chart.retire": "开始领取",
      "chart.age": "年龄",

      /* timeline */
      "tl.title": "保单年度关键事件",
      "tl.welcome": "迎新红利",
      "tl.welcome.d": "前 3 个保单年度逐年投入即获额外红利",
      "tl.special5": "特别红利 5%",
      "tl.special5.d": "第 10 个保单年度起，每年追加投入的 5%",
      "tl.payend": "初始投资期结束",
      "tl.payend.d": "之后不再缴付保费，账户继续滚动增值",
      "tl.special8": "特别红利提升至 8%",
      "tl.special8.d": "第 21 个保单年度起提升",
      "tl.retire": "开始领取",
      "tl.retire.d": "可一次性提取或按年领取",

      /* table */
      "table.title": "逐年利益演示表",
      "table.year": "保单年度",
      "table.age": "年龄",
      "table.premium": "当年投入",
      "table.bonus": "红利投入",
      "table.cons": "保守 4%",
      "table.bal": "平衡 6%",
      "table.agg": "进取 8%",

      "footnote": "注：以上为基于假定年投资回报率的示意测算，并非保证收益。投资涉及风险，实际账户价值可能高于或低于演示数值，甚至低于累计投入本金。",

      /* product page */
      "pr.eyebrow": "长期投资储蓄计划",
      "pr.h1": "远景成长投资储蓄计划",
      "pr.hero.p": "从第一天起，100% 保费用于投资；迎新红利加持初始资本，特别红利加速长期复利，配合专业基金组合，陪客户从容走向每一个人生目标。",
      "pr.cta.plan": "立即为客户规划",
      "pr.cta.detail": "了解计划亮点",
      "pr.feat.title": "计划六大亮点",
      "pr.feat.sub": "把整个投资旅程的潜在回报推到更高",
      "pr.f1.t": "100% 保费即投",
      "pr.f1.d": "保费从缴纳首日起全部用于投资，不让资金等待，尽早开始复利积累。",
      "pr.f2.t": "迎新红利",
      "pr.f2.d": "前 3 个保单年度按年缴保费比例发放，最高可达年缴保费的 75%，直接增厚初始资本。",
      "pr.f3.t": "特别红利",
      "pr.f3.d": "第 10 年起每年额外 5%、第 21 年起提升至 8%，持续为长期投资加码。",
      "pr.f4.t": "三种投资期",
      "pr.f4.d": "10 / 15 / 20 年初始投资期自由选择，匹配不同的人生时间表与资金安排。",
      "pr.f5.t": "专业基金组合",
      "pr.f5.d": "精英基金、引导性组合与零售基金可选，全球顶级投资机构管理，股债搭配覆盖不同风险偏好。",
      "pr.f6.t": "保障可叠加",
      "pr.f6.d": "可加购定期寿险、危疾免缴等附加契约，投资之余为家庭构筑安全网，且无需体检即可投保。",

      "pr.fund.title": "三类风险组合，匹配不同目标",
      "pr.fund.sub": "股票与固定收益策略性搭配，长期追求回报与稳定性的平衡",
      "fund.cons": "保守型基金",
      "fund.bal": "平衡型基金",
      "fund.agg": "进取型基金",
      "fund.risk.low": "低至中风险",
      "fund.risk.mid": "中至高风险",
      "fund.risk.high": "较高风险",
      "fund.assume": "假定回报",

      "pr.case.title": "客户案例：25 岁开始，65 岁退休",
      "pr.case.p1": "年投入",
      "pr.case.p2": "缴费期",
      "pr.case.p3": "投资组合",
      "pr.case.p3v": "进取型基金",
      "pr.case.note": "按产品手册示例：8% 假定年回报率下，65 岁退保可得约 S$1,061,100；4% 假定回报率下约 S$361,400。数值为手册假设演示，非保证。",

      "pr.guard.title": "灵活与安心，同样重要",
      "g1.t": "保费免缴证",
      "g1.d": "每缴满 5 年可获免缴证，最长累计 12 个月，从容安排现金流。",
      "g2.t": "保费假期",
      "g2.d": "遇到经济压力可申请暂停缴费，待状况恢复后继续计划。",
      "g3.t": "灵活套现",
      "g3.d": "投资期结束后可按需提取保单价值，不收取提取费用。",
      "g4.t": "家产规划",
      "g4.d": "可指定第二受保人完成保单传承，让财富跨越代际延续。",

      "pr.disclaimer": "重要提示：本页面仅为产品概念与演示用途，不构成保险合同、投资建议或收益承诺。投资联结计划涉及投资风险，子基金表现并无保证，单位价值及收入可升可降，过往表现不代表未来收益，提前终止可能损失本金。具体保障、费用与条款以正式保单合同为准。",
      "pr.cta2.t": "为客户生成专属规划",
      "pr.cta2.p": "调整年龄、年投入与风险偏好，立即看到三档情景下的长期收益路径",
      "pr.cta2.btn": "进入财富规划器"
    },

    en: {
      "nav.plan": "Wealth Planner",
      "nav.product": "The Plan",
      "nav.sub": "Investment-Linked Savings · Client Demo",
      "nav.demo": "Illustrative only — returns are not guaranteed",

      "planner.title": "Client Inputs",
      "planner.subtitle": "Drag to adjust — charts update live",
      "ctrl.age": "Current age",
      "ctrl.ageUnit": "yrs",
      "ctrl.yearUnit": "yrs",
      "unit.yr": "yr",
      "ctrl.retire": "Payout age",
      "ctrl.premium": "Annual investment",
      "ctrl.payYears": "Premium term",
      "ctrl.risk": "Portfolio (assumed return)",
      "ctrl.withdrawYears": "Annual payout duration",
      "risk.cons": "Cautious",
      "risk.bal": "Balanced",
      "risk.agg": "Adventurous",
      "planner.reset": "Reset to sample client",
      "planner.print": "Export / Print plan",
      "planner.note": "Illustrative model: assumed returns are net of a 1.45% annual fund management fee. Welcome and special bonus rules are simplified from product terms; actual benefits follow the policy contract and official benefit illustration.",

      "kpi.invested": "Total principal invested",
      "kpi.valueAt": "Account value at payout (selected)",
      "kpi.gain": "Cumulative gain",
      "kpi.multiple": "Multiple of principal",
      "kpi.annualIncome": "Estimated annual income",
      "kpi.for": "level payout over",
      "kpi.years": "years",
      "kpi.scenarios": "Three scenarios · account value at payout",

      "chart.growth": "Account value growth (three scenarios)",
      "chart.growth.hint": "Age on x-axis, account value on y-axis",
      "chart.stack": "Principal vs. gain",
      "chart.alloc": "Asset allocation",
      "chart.stock": "Equities",
      "chart.bond": "Fixed income",
      "chart.principal": "Cumulative principal",
      "chart.gainArea": "Cumulative gain",
      "chart.cons": "Cautious 4%",
      "chart.bal": "Balanced 6%",
      "chart.agg": "Adventurous 8%",
      "chart.payEnd": "Premium term ends",
      "chart.retire": "Payout starts",
      "chart.age": "Age",

      "tl.title": "Key policy milestones",
      "tl.welcome": "Welcome bonus",
      "tl.welcome.d": "Granted in the first 3 policy years upon each annual premium",
      "tl.special5": "Special bonus 5%",
      "tl.special5.d": "From policy year 10, an extra 5% of annual premium each year",
      "tl.payend": "Initial investment period ends",
      "tl.payend.d": "No further premiums; the account keeps compounding",
      "tl.special8": "Special bonus rises to 8%",
      "tl.special8.d": "From policy year 21 onwards",
      "tl.retire": "Payout begins",
      "tl.retire.d": "Lump-sum withdrawal or annual income",

      "table.title": "Year-by-year illustration",
      "table.year": "Policy yr",
      "table.age": "Age",
      "table.premium": "Premium",
      "table.bonus": "Bonus",
      "table.cons": "Cautious 4%",
      "table.bal": "Balanced 6%",
      "table.agg": "Adv. 8%",

      "footnote": "Note: Figures are illustrative projections based on assumed rates of return and are not guaranteed. Investments carry risk — actual account values may be higher or lower than shown and may be less than total premiums paid.",

      "pr.eyebrow": "Long-Term Investment-Linked Savings Plan",
      "pr.h1": "Vista Growth Investment Plan",
      "pr.hero.p": "From day one, 100% of premiums are invested. A welcome bonus boosts your starting capital, special bonuses accelerate long-term compounding, and professionally managed funds carry clients toward every life goal.",
      "pr.cta.plan": "Plan for a client",
      "pr.cta.detail": "Plan highlights",
      "pr.feat.title": "Six plan highlights",
      "pr.feat.sub": "Maximising the potential of the entire investment journey",
      "pr.f1.t": "100% invested from day one",
      "pr.f1.d": "Every premium dollar is invested immediately — no waiting, compounding starts early.",
      "pr.f2.t": "Welcome bonus",
      "pr.f2.d": "Paid in the first three policy years, up to 75% of annual premium — instantly enlarging starting capital.",
      "pr.f3.t": "Special bonus",
      "pr.f3.d": "An extra 5% every year from policy year 10, rising to 8% from year 21.",
      "pr.f4.t": "Three premium terms",
      "pr.f4.d": "Choose a 10-, 15- or 20-year initial investment period to match each life timeline.",
      "pr.f5.t": "Professional fund line-up",
      "pr.f5.d": "Elite funds, guided portfolios and retail funds managed by world-class institutions, across risk profiles.",
      "pr.f6.t": "Optional protection",
      "pr.f6.d": "Add term life and premium waiver riders — a family safety net alongside investment, with no medical underwriting.",

      "pr.fund.title": "Three risk portfolios for every goal",
      "pr.fund.sub": "Strategic equity / fixed-income blends balancing long-term return and stability",
      "fund.cons": "Cautious Fund",
      "fund.bal": "Balanced Fund",
      "fund.agg": "Adventurous Fund",
      "fund.risk.low": "Low–medium risk",
      "fund.risk.mid": "Medium–high risk",
      "fund.risk.high": "Higher risk",
      "fund.assume": "Assumed return",

      "pr.case.title": "Client story: starting at 25, retiring at 65",
      "pr.case.p1": "Annual premium",
      "pr.case.p2": "Premium term",
      "pr.case.p3": "Portfolio",
      "pr.case.p3v": "Adventurous Fund",
      "pr.case.note": "Per the product brochure: at an assumed 8% return, surrender value at age 65 is about S$1,061,100; at 4%, about S$361,400. Assumed illustration only — not guaranteed.",

      "pr.guard.title": "Flexibility and peace of mind",
      "g1.t": "Premium waiver vouchers",
      "g1.d": "Earned every 5 paid years, usable for up to 12 cumulative months.",
      "g2.t": "Premium holiday",
      "g2.d": "Pause premiums during financial strain and resume when ready.",
      "g3.t": "Flexible withdrawal",
      "g3.d": "After the investment period, withdraw account value with no withdrawal charge.",
      "g4.t": "Legacy planning",
      "g4.d": "Name a second life insured to transfer the policy across generations.",

      "pr.disclaimer": "Important: this page is a conceptual product illustration only. It is not an insurance contract, investment advice or a return promise. Investment-linked plans carry investment risk; sub-fund performance is not guaranteed, unit values and income may fall or rise, past performance does not indicate future results, and early termination may result in principal loss. Exact coverage, charges and terms follow the formal policy contract.",
      "pr.cta2.t": "Build a tailored client plan",
      "pr.cta2.p": "Adjust age, annual investment and risk profile to see long-term paths under all three scenarios instantly",
      "pr.cta2.btn": "Open the Wealth Planner"
    }
  };

  let lang = localStorage.getItem("vista-lang") || "zh";
  const listeners = [];

  function t(key) {
    return (DICT[lang] && DICT[lang][key]) || (DICT.zh[key]) || key;
  }
  function getLang() { return lang; }
  function setLang(next) {
    if (!DICT[next]) return;
    lang = next;
    localStorage.setItem("vista-lang", lang);
    document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";
    applyI18n();
    listeners.forEach(fn => fn(lang));
  }
  function onChange(fn) { listeners.push(fn); }

  function applyI18n(root) {
    (root || document).querySelectorAll("[data-i18n]").forEach(el => {
      el.textContent = t(el.getAttribute("data-i18n"));
    });
    (root || document).querySelectorAll("[data-i18n-html]").forEach(el => {
      el.innerHTML = t(el.getAttribute("data-i18n-html"));
    });
  }

  function fmtMoney(v, opts) {
    opts = opts || {};
    const locale = lang === "zh" ? "zh-CN" : "en-SG";
    const currency = opts.currency || "CNY";
    if (opts.compact) {
      return new Intl.NumberFormat(locale, {
        notation: "compact", maximumFractionDigits: 1
      }).format(Math.round(v));
    }
    return new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(Math.round(v));
  }
  function currencySymbol() { return lang === "zh" ? "¥" : "S$"; }

  window.I18N = { t, getLang, setLang, onChange, applyI18n, fmtMoney, currencySymbol };

  document.addEventListener("DOMContentLoaded", () => {
    document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";
    applyI18n();
    document.querySelectorAll("[data-lang-btn]").forEach(btn => {
      btn.addEventListener("click", () => setLang(btn.getAttribute("data-lang-btn")));
    });
    syncLangButtons();
    onChange(syncLangButtons);
  });
  function syncLangButtons() {
    document.querySelectorAll("[data-lang-btn]").forEach(b => {
      b.classList.toggle("active", b.getAttribute("data-lang-btn") === lang);
    });
  }
})();
