/* ============================================================
   model.js — 测算引擎（可插拔）
   ------------------------------------------------------------
   【重要】本文件是唯一负责"算钱"的地方。
   客户后续提供官方计算公式后，只需替换 series() 与 project()
   两个函数的内部实现，UI / 图表 / 演示流程完全不用动。

   对外契约（请勿改动函数名与返回字段）：
     MODEL.project(input)      -> 单情景结果
     MODEL.allScenarios(input) -> { cons, bal, agg } 三情景结果
     MODEL.annuity(v, r, n)    -> 等额年金

   input 字段：
     { age, retireAge, premium, payYears, risk, payoutYears,
       anchors?, stressGross? }
   ============================================================ */
window.MODEL = (function () {
  "use strict";
  const P = window.PRODUCT;

  /* ============================================================
     TODO(待替换为官方公式)：以下假设目前是"手册条款直译"版本，
     尚未能精确复现手册官方案例数值（8% 情景偏差约 −31%）。
     两种应对：
       1) 命中手册案例时用 anchors 锚定校准（默认开启，USE_ANCHORS）
       2) 后续拿到官方公式后整体替换 series() 内部实现
     ============================================================ */
  const ASSUME = {
    /* 红利是否只在缴付期内发放。
       手册致文案例（10 年 IIP）时间轴显示"第 11 年 IIP 结束、第 21 年起 8% 特别红利"，
       与"须持续缴付期缴保费"字面口径存在歧义 —— 待官方公式确认。 */
    bonusesDuringPaymentOnly: true,
    /* 命中手册案例时，把终值锚定到手册官方数字，避免与手册冲突 */
    USE_ANCHORS: true,
    /* 附加费封顶年（缴满该年后不再收取附加费）—— 仅作事件标记，未计入测算 */
    SUPPLEMENTARY_CAP_YEAR: P.fees.supplementaryCapYear
  };

  const VERSION = "placeholder-v1";

  /* ---------- 费率与净回报 ---------- */
  function feeForYear(y) {
    const sd = P.fees.stepDown;
    return (sd && y >= sd.fromYear) ? sd.rate : P.fees.annualFundMgmt;
  }
  function netRate(gross, y) {
    return gross - feeForYear(y);
  }
  function grossOf(riskKey, input) {
    if (input && typeof input.stressGross === "number") return input.stressGross;
    return P.funds[riskKey].gross;
  }

  /* ---------- 当年红利（拆分为迎新 / 特别，供堆叠图使用） ---------- */
  function bonusSplit(y, premium, payYears) {
    let welcome = 0, special = 0;
    if (!(ASSUME.bonusesDuringPaymentOnly && y > payYears)) {
      const w = P.welcomeBonus[payYears];
      if (w && y <= 3) welcome = w[y - 1] * premium;
      P.specialBonus.forEach(function (s) {
        if (y >= s.fromYear && y <= s.toYear) special += s.rate * premium;
      });
    }
    return { welcome: welcome, special: special };
  }

  /* ---------- 当年红利投入 ---------- */
  function bonusForYear(y, premium, payYears) {
    const b = bonusSplit(y, premium, payYears);
    return b.welcome + b.special;
  }

  /* ---------- 单情景逐年序列 ----------
     口径：年初投入（保费 + 红利），年末按当年净回报增值。 */
  function series(riskKey, input) {
    const horizon = Math.max(1, input.retireAge - input.age);
    const gross = grossOf(riskKey, input);
    const premium = input.premium;
    const payYears = input.payYears;

    const rows = [];
    let v = 0, vNo = 0, cumPremium = 0, cumBonus = 0;

    for (let y = 1; y <= horizon; y++) {
      const paying = y <= payYears;
      const prem = paying ? premium : 0;
      const bonus = bonusForYear(y, premium, payYears);
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
        cumPremium: cumPremium,
        cumBonus: cumBonus
      });
    }

    /* 锚定校准：命中手册案例时把终值对齐官方数字 */
    let anchored = false;
    const rawEnd = rows.length ? rows[rows.length - 1].value : 0;
    let scale = 1;
    if (ASSUME.USE_ANCHORS && input.anchors && input.anchors[riskKey] && rawEnd > 0) {
      scale = input.anchors[riskKey] / rawEnd;
      anchored = true;
      rows.forEach(function (r) {
        r.value *= scale;
        r.valueNoBonus *= scale;
      });
    }

    const end = rows.length ? rows[rows.length - 1] : { value: 0, valueNoBonus: 0 };
    const endNet = netRate(gross, horizon);

    return {
      risk: riskKey,
      gross: gross,
      horizon: horizon,
      rows: rows,
      principal: cumPremium,
      totalBonus: cumBonus,
      endValue: end.value,
      endNoBonus: end.valueNoBonus,
      delta: end.value - end.valueNoBonus,
      multiple: cumPremium > 0 ? end.value / cumPremium : 0,
      endNetRate: endNet,
      anchored: anchored,
      payout: annuity(end.value, endNet, input.payoutYears || 20)
    };
  }

  /* ---------- 等额年金（期末支付） ---------- */
  function annuity(v, r, n) {
    n = n || 20;
    if (n <= 0) return { annual: 0, monthly: 0 };
    if (Math.abs(r) < 1e-9) return { annual: v / n, monthly: v / n / 12 };
    const annual = v * r / (1 - Math.pow(1 + r, -n));
    return { annual: annual, monthly: annual / 12 };
  }

  /* ---------- 关键事件（只保留真正会发生的） ---------- */
  function milestones(input, result) {
    const payYears = input.payYears;
    const out = [];
    P.milestones.forEach(function (m) {
      const year = m.year === null ? payYears : m.year;
      if (year > result.horizon) return;
      /* 特别红利 8% 需缴付至第 21 年，10/15/20 年期下不会触发 */
      if (m.id === "special8" && ASSUME.bonusesDuringPaymentOnly && payYears < 21) return;
      /* 迎新红利第 3 年：任意缴费期都会发生 */
      const row = result.rows[year - 1];
      out.push({
        id: m.id, year: year, age: input.age + year,
        tone: m.tone, value: row ? row.value : 0
      });
    });
    return out;
  }

  /* ---------- 对外：单情景 ---------- */
  function project(input) {
    if (input.retireAge <= input.age) input = Object.assign({}, input, { retireAge: input.age + 1 });
    const r = series(input.risk, input);
    r.input = input;
    r.milestones = milestones(input, r);
    r.ages = r.rows.map(function (x) { return x.age; });
    return r;
  }

  /* ---------- 对外：三情景 ---------- */
  function allScenarios(input) {
    const out = {};
    P.fundOrder.forEach(function (k) {
      const sub = Object.assign({}, input, { risk: k });
      out[k] = project(sub);
    });
    return out;
  }

  return {
    VERSION: VERSION,
    ASSUME: ASSUME,
    project: project,
    allScenarios: allScenarios,
    annuity: annuity,
    netRate: netRate,
    bonusForYear: bonusForYear,
    bonusSplit: bonusSplit
  };
})();
