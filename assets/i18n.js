/* ============================================================
   i18n.js — 中英双语字典与切换
   产品：AIA Pro Achiever 3.0 / 友邦成就一生 3.0
   ============================================================ */
(function () {
  "use strict";

  const DICT = {
    /* ==========================================================
       中文
       ========================================================== */
    zh: {
      /* ---- 应用外壳 ---- */
      "app.title": "成就一生 3.0 · 客户方案演示",
      "app.console": "顾问控制台",
      "app.demo": "演示数据 · 非保证收益",
      "app.lang": "EN",
      "scene.hint": "按 ← → 或左右滑动翻页",

      /* ---- 幕次导航 ---- */
      "scene.0": "封面",
      "scene.1": "投入与红利",
      "scene.2": "增长路径",
      "scene.3": "价值换算",
      "scene.4": "风险匹配",
      "scene.5": "专属方案",

      /* ---- 封面 ---- */
      "cover.eyebrow": "期缴保费投资联结保险计划（ILP）",
      "cover.for": "专属财富方案",
      "cover.goal": "您的目标",
      "cover.prepared": "方案顾问",
      "cover.start": "开始演示",

      /* ---- 通用 ---- */
      "unit.year": "年",
      "unit.age": "岁",
      "unit.times": "倍",

      /* ---- 幕 1：投入与红利 ---- */
      "invest.annual": "年缴保费",
      "invest.total": "累计投入本金",
      "engine.title": "只在前几年投入，之后全靠复利与红利",
      "engine.sub": "每一根柱子 = 当年实际进入投资的资金；金色部分是 AIA 额外替您注入的",
      "engine.cumulative": "AIA 红利",
      "engine.after": "之后 {n} 年\n您不再投入一分钱",
      "engine.after.sub": "剩下的，全部交给复利和红利",
      "chart.invest.premium": "您的保费",
      "chart.invest.welcome": "迎新红利",
      "chart.invest.special": "特别红利",
      "chart.invest.ownOnly": "没有红利的情形",

      "chip.pct100.t": "100% 保费即投",
      "chip.pct100.d": "保费从首日起全数投入，不让资金空转",
      "chip.welcome.t": "迎新红利 · 最高 75%",
      "chip.welcome.d": "前 3 个保单年度逐年加码，直接增厚本金",
      "chip.special.t": "特别红利 · 5% 升至 8%",
      "chip.special.d": "第 10 年起每年 5%，第 21 年起 8%",
      "chip.cap.t": "附加费 · 11 年封顶",
      "chip.cap.d": "缴满 11 年年度保费后不再收取附加费",

      /* ---- 幕 2：增长路径 ---- */
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

      /* ---- 幕 3：价值换算 ---- */
      "value.title": "这笔钱，能换到什么",
      "value.sub": "把账户价值和您熟悉的生活开销放在同一把尺子上",
      "value.atAge": "{age} 岁时账户价值",
      "value.note": "换算仅为示意，帮助理解金额量级，不构成任何承诺。",
      "value.bar.total": "账户总价值",
      "value.bar.home": "一套房产首付",
      "value.bar.edu": "一份大学学费",
      "value.bar.retire": "一年退休现金流",
      "value.mult.home": "可付 {n} 套首付",
      "value.mult.edu": "可付 {n} 份学费",
      "value.mult.retire": "可领 {n} 年",

      /* ---- 幕 4：风险匹配 ---- */
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

      /* ---- 幕 5：专属方案 ---- */
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

      /* ---- 灵活保障 chips ---- */
      "fx.medical": "无需体检",
      "fx.pass": "保费免缴证 36 个月",
      "fx.holiday": "保费假期",
      "fx.cashout": "投资期后免费提取",
      "fx.legacy": "第二受保人传承",

      /* ---- 顾问控制台 ---- */
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

      /* ---- 事件节点 ---- */
      "ms.welcome": "迎新红利",
      "ms.supcap": "附加费封顶",
      "ms.iipend": "投资期结束",

      /* ---- 免责 ---- */
      "disc.short": "演示数据 · 非保证收益 · 投资涉及风险",
      "disc.full": "重要提示：本页面为产品概念与演示用途，不构成保险合同、投资建议或收益承诺。友邦成就一生 3.0 计划为投资联结保险计划（ILP），投资涉及风险，包括可能亏损所投入的本金。子基金表现并无保证，单位价值及所得收入可升可跌，过往表现不可作为未来表现的指标。实际保单价值取决于所投资基金的实际表现，可能低于已缴付的保费总额。4% / 6% / 8% 为假定年投资回报率，非保证。具体保障、费用与条款以正式保单合同及经审核的利益演示书为准。"
    },

    /* ==========================================================
       English
       ========================================================== */
    en: {
      "app.title": "AIA Pro Achiever 3.0 · Client Presentation",
      "app.console": "Adviser console",
      "app.demo": "Illustrative only — not guaranteed",
      "app.lang": "中文",
      "scene.hint": "Use ← → or swipe to change scenes",

      "scene.0": "Cover",
      "scene.1": "Outlay & bonuses",
      "scene.2": "Growth path",
      "scene.3": "What it means",
      "scene.4": "Risk fit",
      "scene.5": "Your plan",

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
      "engine.sub": "Each bar = capital actually invested that year; the gold portion is what AIA adds on top",
      "engine.cumulative": "AIA bonuses",
      "engine.after": "For the next {n} years\nyou pay nothing more",
      "engine.after.sub": "The rest is left to compounding and bonuses",
      "chart.invest.premium": "Your premiums",
      "chart.invest.welcome": "Welcome bonus",
      "chart.invest.special": "Special bonus",
      "chart.invest.ownOnly": "Without bonuses",

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

      "value.title": "What this money can do",
      "value.sub": "Your account value measured against costs you already know",
      "value.atAge": "Account value at {age}",
      "value.note": "Conversions are illustrative, to help grasp the magnitude. Not a promise of any kind.",
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
      "disc.full": "Important: this page is a conceptual illustration only. It is not an insurance contract, investment advice or a promise of returns. AIA Pro Achiever 3.0 is an investment-linked plan (ILP); investing involves risk, including possible loss of principal. Sub-fund performance is not guaranteed, unit values may fall as well as rise, and past performance is not indicative of future results. The 4% / 6% / 8% figures are assumed annual returns and are not guaranteed. Exact terms follow the formal policy contract and the approved benefit illustration."
    }
  };

  /* ================= 运行时 ================= */
  let lang = "zh";
  try { lang = localStorage.getItem("vista-lang") || "zh"; } catch (e) { /* file:// 下忽略 */ }
  if (!DICT[lang]) lang = "zh";

  const listeners = [];

  function t(key, vars) {
    let s = (DICT[lang] && DICT[lang][key]) || (DICT.zh[key]) || key;
    if (vars) {
      Object.keys(vars).forEach(function (k) {
        s = s.replace(new RegExp("\\{" + k + "\\}", "g"), vars[k]);
      });
    }
    return s;
  }
  function getLang() { return lang; }
  function setLang(next) {
    if (!DICT[next] || next === lang) return;
    lang = next;
    try { localStorage.setItem("vista-lang", lang); } catch (e) { /* noop */ }
    document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";
    applyI18n();
    listeners.forEach(function (fn) { fn(lang); });
  }
  function onChange(fn) { listeners.push(fn); }

  /* ---------- 数字格式 ---------- */
  function fmtMoney(v) {
    return Math.round(Number(v) || 0).toLocaleString("en-US");
  }
  function fmtPct(v, digits) {
    return ((v || 0) * 100).toFixed(digits === undefined ? 0 : digits) + "%";
  }
  function fmtNum(v, digits) {
    return (Number(v) || 0).toFixed(digits === undefined ? 1 : digits);
  }
  function compact(v) {
    const n = Math.round(Number(v) || 0);
    const a = Math.abs(n);
    if (lang === "zh") {
      if (a >= 1e8) return (n / 1e8).toFixed(2) + "亿";
      if (a >= 1e4) return (n / 1e4).toFixed(a >= 1e6 ? 0 : 1) + "万";
      return String(n);
    }
    if (a >= 1e6) return (n / 1e6).toFixed(2) + "M";
    if (a >= 1e3) return (n / 1e3).toFixed(a >= 1e5 ? 0 : 1) + "K";
    return String(n);
  }
  function currency() { return window.PRODUCT.currency.symbol; }
  function money(v) { return currency() + " " + fmtMoney(v); }

  function applyI18n(root) {
    (root || document).querySelectorAll("[data-i18n]").forEach(function (el) {
      el.textContent = t(el.getAttribute("data-i18n"));
    });
  }

  window.I18N = {
    t: t, getLang: getLang, setLang: setLang, onChange: onChange,
    applyI18n: applyI18n, fmtMoney: fmtMoney, fmtPct: fmtPct, fmtNum: fmtNum,
    compact: compact, currency: currency, money: money
  };

  document.addEventListener("DOMContentLoaded", function () {
    document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";
    applyI18n();
    document.querySelectorAll("[data-lang-btn]").forEach(function (btn) {
      btn.addEventListener("click", function () { setLang(btn.getAttribute("data-lang-btn")); });
    });
    syncLangButtons();
    onChange(syncLangButtons);
  });

  function syncLangButtons() {
    document.querySelectorAll("[data-lang-btn]").forEach(function (b) {
      b.classList.toggle("active", b.getAttribute("data-lang-btn") === lang);
    });
  }
})();
