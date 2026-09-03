/* ============================================================
   app.js — 财富规划器：参数模型 + 多档收益测算 + ECharts 联动
   测算口径（示意，可在 CONFIG 中调整）：
   - 净收益率 = 假定回报 - 1.45% 年度基金管理费
   - 年初投入(保费+红利)，年末按净收益率增值
   - 迎新红利：前 3 保单年度，比例随缴费期；特别红利：第10年起5%
   ============================================================ */
(function () {
  const CONFIG = {
    fee: 0.0145,
    gross: { cons: 0.04, bal: 0.06, agg: 0.08 },
    welcome: {
      10: [0.10, 0.13, 0.15],
      15: [0.15, 0.20, 0.25],
      20: [0.20, 0.25, 0.30]
    },
    alloc: {
      cons: { stock: 0.30, bond: 0.70 },
      bal: { stock: 0.40, bond: 0.60 },
      agg: { stock: 0.90, bond: 0.10 }
    },
    colors: { cons: "#4a7fb5", bal: "#0f9484", agg: "#d4a23a" }
  };

  const DEFAULTS = { age: 30, retireAge: 60, premium: 36000, payYears: 10, risk: "agg", withdrawYears: 20 };
  const state = Object.assign({}, DEFAULTS);

  /* ---------- 测算 ---------- */
  function project() {
    const horizon = state.retireAge - state.age;
    const rows = [];
    const acc = { cons: 0, bal: 0, agg: 0 };
    let principal = 0;
    const welcome = CONFIG.welcome[state.payYears];

    for (let y = 1; y <= horizon; y++) {
      const paying = y <= state.payYears;
      const prem = paying ? state.premium : 0;
      let bonus = 0;
      if (paying) {
        if (y <= 3) bonus += welcome[y - 1] * state.premium;
        if (y >= 10 && y <= 20) bonus += 0.05 * state.premium;
        if (y >= 21) bonus += 0.08 * state.premium;
        principal += prem;
        Object.keys(acc).forEach(k => { acc[k] += prem + bonus; });
      }
      Object.keys(acc).forEach(k => {
        const r = CONFIG.gross[k] - CONFIG.fee;
        acc[k] *= (1 + r);
      });
      rows.push({
        year: y, age: state.age + y, premium: prem, bonus: Math.round(bonus),
        cons: Math.round(acc.cons), bal: Math.round(acc.bal), agg: Math.round(acc.agg)
      });
    }
    const end = rows[rows.length - 1] || { cons: 0, bal: 0, agg: 0 };
    const annuity = {};
    Object.keys(CONFIG.gross).forEach(k => {
      const r = CONFIG.gross[k] - CONFIG.fee;
      const v = end[k] || 0;
      annuity[k] = r > 0 ? v * r / (1 - Math.pow(1 + r, -state.withdrawYears)) : v / state.withdrawYears;
    });
    return { rows, principal, end, annuity, horizon };
  }

  /* ---------- DOM helpers ---------- */
  const $ = s => document.querySelector(s);
  const $$ = s => Array.from(document.querySelectorAll(s));
  const money = v => I18N.fmtMoney(v);

  function setSliderFill(el) {
    const min = +el.min, max = +el.max, v = +el.value;
    el.style.setProperty("--fill", ((v - min) / (max - min) * 100) + "%");
  }

  /* ---------- charts ---------- */
  let growthChart, stackChart, allocChart;

  function compact(v) {
    v = +v;
    if (I18N.getLang() === "zh") {
      if (Math.abs(v) >= 1e8) return (v / 1e8).toFixed(1) + "亿";
      if (Math.abs(v) >= 1e4) return (v / 1e4).toFixed(Math.abs(v) >= 1e6 ? 0 : 1) + "万";
      return "" + v;
    }
    return new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(v);
  }
  function baseGrid(mini) {
    return mini ? { left: 52, right: 12, top: 28, bottom: 24 } : { left: 64, right: 16, top: 30, bottom: 26 };
  }
  function axisStyle() {
    return {
      axisLine: { lineStyle: { color: "#d7e0e4" } },
      axisTick: { show: false },
      axisLabel: { color: "#8fa0a8", fontSize: 11 },
      splitLine: { lineStyle: { color: "#eef2f4" } }
    };
  }
  function area(color) {
    return new echarts.graphic.LinearGradient(0, 0, 0, 1, [
      { offset: 0, color: color + "55" }, { offset: 1, color: color + "08" }
    ]);
  }

  function renderGrowth(result) {
    const ages = result.rows.map(r => r.age);
    const mk = (key, color, name) => ({
      name, type: "line", smooth: true, showSymbol: false,
      data: result.rows.map(r => r[key]),
      lineStyle: { width: 2.6, color },
      itemStyle: { color },
      areaStyle: { color: area(color) },
      emphasis: { focus: "series" }
    });
    const t = I18N.t;
    growthChart.setOption({
      color: [CONFIG.colors.cons, CONFIG.colors.bal, CONFIG.colors.agg],
      tooltip: {
        trigger: "axis", backgroundColor: "rgba(14,42,51,.94)", borderWidth: 0,
        textStyle: { color: "#fff", fontSize: 12 },
        valueFormatter: v => I18N.currencySymbol() + " " + money(v)
      },
      legend: {
        top: 2, right: 8, icon: "roundRect", itemWidth: 12, itemHeight: 4,
        textStyle: { color: "#60747d", fontSize: 12 }
      },
      grid: baseGrid(),
      xAxis: Object.assign(axisStyle(), { type: "category", data: ages }),
      yAxis: Object.assign(axisStyle(), { type: "value", axisLabel: { color: "#8fa0a8", fontSize: 11, formatter: v => compact(v) } }),
      series: [
        mk("cons", CONFIG.colors.cons, t("chart.cons")),
        mk("bal", CONFIG.colors.bal, t("chart.bal")),
        mk("agg", CONFIG.colors.agg, t("chart.agg"))
      ],
      graphic: []
    }, true);
  }

  function renderStack(result) {
    const key = state.risk;
    const ages = result.rows.map(r => r.age);
    const principalSeries = [];
    const gainSeries = [];
    let runPrincipal = 0;
    result.rows.forEach(r => {
      runPrincipal += r.premium;
      principalSeries.push(runPrincipal);
      gainSeries.push(Math.max(0, r[key] - runPrincipal));
    });
    const t = I18N.t;
    stackChart.setOption({
      tooltip: {
        trigger: "axis", backgroundColor: "rgba(14,42,51,.94)", borderWidth: 0,
        textStyle: { color: "#fff", fontSize: 12 },
        valueFormatter: v => I18N.currencySymbol() + " " + money(v)
      },
      legend: { top: 2, right: 8, icon: "roundRect", itemWidth: 12, itemHeight: 4, textStyle: { color: "#60747d", fontSize: 12 } },
      grid: baseGrid(true),
      xAxis: Object.assign(axisStyle(), { type: "category", data: ages, axisLabel: { color: "#8fa0a8", fontSize: 10, interval: 4 } }),
      yAxis: Object.assign(axisStyle(), { type: "value", axisLabel: { color: "#8fa0a8", fontSize: 10, formatter: v => compact(v) } }),
      series: [
        {
          name: t("chart.principal"), type: "line", stack: "x", smooth: true, showSymbol: false,
          data: principalSeries, lineStyle: { width: 1.6, color: "#9fb6c0" },
          itemStyle: { color: "#c3d4dc" }, areaStyle: { color: "#c3d4dc" }
        },
        {
          name: t("chart.gainArea"), type: "line", stack: "x", smooth: true, showSymbol: false,
          data: gainSeries, lineStyle: { width: 2, color: CONFIG.colors[key] },
          itemStyle: { color: CONFIG.colors[key] }, areaStyle: { color: area(CONFIG.colors[key]) }
        }
      ]
    }, true);
  }

  function renderAlloc() {
    const a = CONFIG.alloc[state.risk];
    const t = I18N.t;
    allocChart.setOption({
      tooltip: { trigger: "item", backgroundColor: "rgba(14,42,51,.94)", borderWidth: 0, textStyle: { color: "#fff" }, valueFormatter: v => v + "%" },
      series: [{
        type: "pie", radius: ["58%", "82%"], center: ["50%", "52%"],
        avoidLabelOverlap: true,
        label: { show: true, formatter: "{d}%", color: "#33505a", fontSize: 12, fontWeight: 600 },
        labelLine: { length: 8, length2: 6 },
        data: [
          { value: Math.round(a.stock * 100), name: t("chart.stock"), itemStyle: { color: CONFIG.colors[state.risk] } },
          { value: Math.round(a.bond * 100), name: t("chart.bond"), itemStyle: { color: "#cdd9de" } }
        ]
      }]
    }, true);
  }

  /* ---------- KPI / timeline / table ---------- */
  function renderKpi(result) {
    const key = state.risk;
    const endVal = result.end[key];
    const sym = I18N.currencySymbol();
    $("#kpiInvested").textContent = sym + " " + money(result.principal);
    $("#kpiValue").textContent = sym + " " + money(endVal);
    $("#kpiGain").textContent = sym + " " + money(endVal - result.principal);
    $("#kpiMultiple").textContent = result.principal > 0 ? (endVal / result.principal).toFixed(2) + "×" : "—";
    $("#kpiAnnual").textContent = sym + " " + money(result.annuity[key]) + " / " + I18N.t("unit.yr");
    $("#withdrawMeta").textContent = I18N.t("kpi.for") + " " + state.withdrawYears + " " + I18N.t("kpi.years");

    $("#scenarioCons").textContent = sym + " " + money(result.end.cons);
    $("#scenarioBal").textContent = sym + " " + money(result.end.bal);
    $("#scenarioAgg").textContent = sym + " " + money(result.end.agg);
  }

  function renderTimeline(result) {
    const payEndAge = state.age + state.payYears;
    const map = {
      "#tlAge1": state.age + 1,
      "#tlAge2": state.age + 10,
      "#tlAge3": payEndAge,
      "#tlAge4": state.age + 21,
      "#tlAge5": state.retireAge
    };
    Object.entries(map).forEach(([sel, val]) => { $(sel).textContent = val; });
  }

  function renderTable(result) {
    const majorYears = new Set([1, 2, 3, state.payYears, result.horizon]);
    const frag = document.createDocumentFragment();
    result.rows.forEach(r => {
      const tr = document.createElement("tr");
      if (majorYears.has(r.year)) tr.className = "major";
      const sym = "";
      tr.innerHTML =
        `<td>${r.year}</td><td>${r.age}</td>` +
        `<td>${r.premium ? money(r.premium) : "—"}</td>` +
        `<td>${r.bonus ? money(r.bonus) : "—"}</td>` +
        `<td>${money(r.cons)}</td><td>${money(r.bal)}</td><td>${money(r.agg)}</td>`;
      frag.appendChild(tr);
    });
    $("#yearBody").innerHTML = "";
    $("#yearBody").appendChild(frag);
    const wrap = $("#yearBody").closest(".table-wrap");
    if (wrap) wrap.scrollTop = 0;
  }

  /* ---------- 全量渲染 ---------- */
  function renderAll() {
    const result = project();
    renderKpi(result);
    renderGrowth(result);
    renderStack(result);
    renderAlloc();
    renderTimeline(result);
    renderTable(result);
  }

  /* 语言切换时仅刷新滑块显示值，不触发事件循环 */
  function refreshSliderLabels() {
    const au = `<small>${I18N.t("ctrl.ageUnit")}</small>`;
    const yu = `<small>${I18N.t("ctrl.yearUnit")}</small>`;
    $("#ageVal").innerHTML = `${state.age}${au}`;
    $("#retireAgeVal").innerHTML = `${state.retireAge}${au}`;
    $("#withdrawYearsVal").innerHTML = `${state.withdrawYears}${yu}`;
    $("#premiumVal").innerHTML = `${I18N.currencySymbol()} ${money(state.premium)}`;
  }

  /* ---------- 控件绑定 ---------- */
  function bindControls() {
    const bindSlider = (id, valSel, fmt) => {
      const el = $("#" + id), valEl = $(valSel);
      const update = () => {
        state[id] = +el.value;
        valEl.innerHTML = fmt(+el.value);
        setSliderFill(el);
        renderAll();
      };
      el.addEventListener("input", update);
      update();
    };
    const ageFmt = v => `${v}<small>${I18N.t("ctrl.ageUnit")}</small>`;
    const yearFmt = v => `${v}<small>${I18N.t("ctrl.yearUnit")}</small>`;
    const sym = () => I18N.currencySymbol();
    bindSlider("age", "#ageVal", ageFmt);
    bindSlider("retireAge", "#retireAgeVal", ageFmt);
    bindSlider("premium", "#premiumVal", v => `${sym()} ${money(v)}`);
    bindSlider("withdrawYears", "#withdrawYearsVal", yearFmt);

    $$("[data-pay]").forEach(btn => {
      btn.addEventListener("click", () => {
        state.payYears = +btn.getAttribute("data-pay");
        $$("[data-pay]").forEach(b => b.classList.toggle("active", +b.getAttribute("data-pay") === state.payYears));
        renderAll();
      });
    });
    $$("[data-risk]").forEach(btn => {
      btn.addEventListener("click", () => {
        state.risk = btn.getAttribute("data-risk");
        $$("[data-risk]").forEach(b => b.classList.toggle("active", b.getAttribute("data-risk") === state.risk));
        renderAll();
      });
    });
    $("#resetBtn").addEventListener("click", () => {
      Object.assign(state, DEFAULTS);
      $("#age").value = state.age; $("#retireAge").value = state.retireAge;
      $("#premium").value = state.premium; $("#withdrawYears").value = state.withdrawYears;
      ["age", "retireAge", "premium", "withdrawYears"].forEach(id => {
        const el = $("#" + id); el.dispatchEvent(new Event("input")); setSliderFill(el);
      });
      $$("[data-pay]").forEach(b => b.classList.toggle("active", +b.getAttribute("data-pay") === state.payYears));
      $$("[data-risk]").forEach(b => b.classList.toggle("active", b.getAttribute("data-risk") === state.risk));
    });
    const printBtn = $("#printBtn");
    if (printBtn) printBtn.addEventListener("click", () => window.print());
  }

  /* ---------- init ---------- */
  document.addEventListener("DOMContentLoaded", () => {
    growthChart = echarts.init($("#growthChart"));
    stackChart = echarts.init($("#stackChart"));
    allocChart = echarts.init($("#allocChart"));

    // 初始控件状态
    $("#age").value = state.age; $("#retireAge").value = state.retireAge;
    $("#premium").value = state.premium; $("#withdrawYears").value = state.withdrawYears;
    $$("[data-pay]").forEach(b => b.classList.toggle("active", +b.getAttribute("data-pay") === state.payYears));
    $$("[data-risk]").forEach(b => b.classList.toggle("active", b.getAttribute("data-risk") === state.risk));

    bindControls();
    ["age", "retireAge", "premium", "withdrawYears"].forEach(id => setSliderFill($("#" + id)));
    renderAll();

    // 语言切换后重渲染（轴名/货币格式/滑块显示值）
    I18N.onChange(() => { refreshSliderLabels(); renderAll(); });

    // iPad 旋转 / 窗口变化自适应
    let rt;
    window.addEventListener("resize", () => {
      clearTimeout(rt);
      rt = setTimeout(() => [growthChart, stackChart, allocChart].forEach(c => c && c.resize()), 120);
    });
    if (window.ResizeObserver) {
      const ro = new ResizeObserver(() => [growthChart, stackChart, allocChart].forEach(c => c && c.resize()));
      [$("#growthChart"), $("#stackChart"), $("#allocChart")].forEach(el => ro.observe(el.parentElement));
    }
  });
})();
