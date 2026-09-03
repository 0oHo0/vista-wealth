/* ============================================================
   product.js — 产品介绍页：三档基金迷你环形图 + 案例成长曲线
   案例曲线终点锚定产品手册示例值（4%→S$361,400；8%→S$1,061,100），
   中间年度按"年金累积 + 后续滚存"的真实形状归一化，仅作示意。
   ============================================================ */
(function () {
  const charts = {};

  function miniRing(id, stockPct, color) {
    const c = echarts.init(document.getElementById(id));
    const render = () => c.setOption({
      series: [{
        type: "pie", radius: ["62%", "86%"], center: ["50%", "50%"],
        label: { show: false }, labelLine: { show: false }, silent: true,
        data: [
          { value: stockPct, itemStyle: { color } },
          { value: 100 - stockPct, itemStyle: { color: "#dde6ea" } }
        ]
      }],
      graphic: [{
        type: "text", left: "center", top: "center",
        style: { text: stockPct + "%", fontSize: 19, fontWeight: 700, fill: "#0e2a33" }
      }, {
        type: "text", left: "center", top: "62%",
        style: { text: I18N.t("chart.stock"), fontSize: 10.5, fill: "#8fa0a8" }
      }]
    }, true);
    render();
    return c;
  }

  /* 案例曲线：形状真实、终点锚定手册值 */
  function caseSeries(r, target, premium, payYears, totalYears) {
    const raw = [];
    let v = 0;
    for (let y = 1; y <= totalYears; y++) {
      if (y <= payYears) v = (v + premium) * (1 + r);
      else v = v * (1 + r);
      raw.push(v);
    }
    const scale = target / raw[raw.length - 1];
    return raw.map(x => Math.round(x * scale));
  }

  function renderCase() {
    if (!charts.case) charts.case = echarts.init(document.getElementById("caseChart"));
    const ages = [], start = 25, total = 40;
    for (let y = 1; y <= total; y++) ages.push(start + y);
    const s4 = caseSeries(0.04, 361400, 7200, 10, total);
    const s8 = caseSeries(0.08, 1061100, 7200, 10, total);
    const grad = c => new echarts.graphic.LinearGradient(0, 0, 0, 1, [
      { offset: 0, color: c + "44" }, { offset: 1, color: c + "05" }]);
    charts.case.setOption({
      tooltip: {
        trigger: "axis", backgroundColor: "rgba(14,42,51,.94)", borderWidth: 0,
        textStyle: { color: "#fff", fontSize: 12 },
        valueFormatter: v => "S$ " + new Intl.NumberFormat("en-SG").format(Math.round(v))
      },
      legend: { top: 0, right: 0, icon: "roundRect", itemWidth: 12, itemHeight: 4, textStyle: { color: "#60747d", fontSize: 12 } },
      grid: { left: 62, right: 16, top: 34, bottom: 28 },
      xAxis: {
        type: "category", data: ages,
        axisLine: { lineStyle: { color: "#d7e0e4" } },
        axisTick: { show: false }, axisLabel: { color: "#8fa0a8", fontSize: 11, interval: 3 }, splitLine: { show: false }
      },
      yAxis: {
        type: "value", axisLabel: {
          color: "#8fa0a8", fontSize: 11,
          formatter: v => I18N.getLang() === "zh"
            ? (v >= 1e4 ? (v / 1e4).toFixed(0) + "万" : v)
            : new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(v)
        }, axisLine: { show: false }, axisTick: { show: false },
        splitLine: { lineStyle: { color: "#eef2f4" } }
      },
      series: [
        { name: I18N.t("chart.cons"), type: "line", smooth: true, showSymbol: false, data: s4, lineStyle: { width: 2.6, color: "#4a7fb5" }, itemStyle: { color: "#4a7fb5" }, areaStyle: { color: grad("#4a7fb5") } },
        { name: I18N.t("chart.agg"), type: "line", smooth: true, showSymbol: false, data: s8, lineStyle: { width: 2.6, color: "#d4a23a" }, itemStyle: { color: "#d4a23a" }, areaStyle: { color: grad("#d4a23a") } }
      ]
    }, true);
  }

  document.addEventListener("DOMContentLoaded", () => {
    charts.cons = miniRing("fundCons", 30, "#4a7fb5");
    charts.bal = miniRing("fundBal", 40, "#0f9484");
    charts.agg = miniRing("fundAgg", 90, "#d4a23a");
    renderCase();
    I18N.onChange(() => {
      charts.cons.dispose(); charts.bal.dispose(); charts.agg.dispose();
      charts.cons = miniRing("fundCons", 30, "#4a7fb5");
      charts.bal = miniRing("fundBal", 40, "#0f9484");
      charts.agg = miniRing("fundAgg", 90, "#d4a23a");
      renderCase();
    });
    let rt;
    window.addEventListener("resize", () => {
      clearTimeout(rt);
      rt = setTimeout(() => Object.values(charts).forEach(c => c && c.resize()), 120);
    });
  });
})();
