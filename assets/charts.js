/* ============================================================
   charts.js — ECharts 封装（深色演示舞台配色）  v2
   原则：能用图就不用数字 —— 坐标轴不摆数字，改用直接标注
   对外：CHARTS.spark / invest / path / valueBars / ring / summaryBars / resize
   ============================================================ */
window.CHARTS = (function () {
  "use strict";
  const P = window.PRODUCT;
  const T = {
    axisLabel: "rgba(242,247,248,.46)",
    axisLine: "rgba(255,255,255,.16)",
    splitLine: "rgba(255,255,255,.07)",
    tipBg: "rgba(6,24,31,.96)",
    tipInk: "#F2F7F8"
  };

  const instances = [];
  function inst(el) {
    let c = null;
    for (let i = 0; i < instances.length; i++) if (instances[i].el === el) { c = instances[i].c; break; }
    if (!c) { c = echarts.init(el); instances.push({ el: el, c: c }); }
    return c;
  }

  function tip() {
    return {
      trigger: "axis",
      backgroundColor: T.tipBg, borderWidth: 1,
      borderColor: "rgba(255,255,255,.14)", padding: [9, 13],
      textStyle: { color: T.tipInk, fontSize: 12.5 },
      axisPointer: { lineStyle: { color: "rgba(255,255,255,.26)" } }
    };
  }
  function moneyFmt(v) { return I18N.currency() + " " + I18N.fmtMoney(v); }
  function grad(color, top, bottom) {
    return new echarts.graphic.LinearGradient(0, 0, 0, 1, [
      { offset: 0, color: color + (top || "55") },
      { offset: 1, color: color + (bottom || "05") }
    ]);
  }

  /* ============ 封面迷你曲线（无坐标轴） ============ */
  function spark(el, result) {
    const c = inst(el);
    const f = P.funds[result.risk];
    c.setOption({
      grid: { left: 6, right: 6, top: 8, bottom: 6 },
      xAxis: { type: "category", show: false, boundaryGap: false, data: result.ages },
      yAxis: { type: "value", show: false },
      series: [{
        type: "line", data: result.rows.map(r => r.value),
        smooth: true, showSymbol: false,
        lineStyle: { width: 2.2, color: f.color },
        itemStyle: { color: f.color },
        areaStyle: { color: grad(f.color, "45", "02") }
      }]
    }, true);
    return c;
  }

  /* ============ 幕 1 · 每年实际投入（堆叠柱） ============ */
  function invest(el, input, result) {
    const c = inst(el);
    const ages = result.ages;
    const prem = [], wel = [], spe = [];
    result.rows.forEach(function (r) {
      const b = M_SPLIT(r.year, input);
      prem.push(r.premium);
      wel.push(Math.round(b.welcome));
      spe.push(Math.round(b.special));
    });

    const marks = [{
      xAxis: input.payYears - 1,
      label: {
        formatter: I18N.t("ms.iipend"), color: "#F4DFA6",
        fontSize: 11.5, fontWeight: 500, position: "insideEndBottom", rotate: 0
      },
      lineStyle: { color: "rgba(220,169,65,.55)", type: "dashed", width: 1.3 }
    }];

    const afterYears = result.horizon - input.payYears;
    c.setOption({
      tooltip: Object.assign(tip(), {
        formatter: function (ps) {
          let s = "<b>" + I18N.t("chart.age") + " " + ps[0].axisValue + "</b>";
          let tot = 0;
          ps.slice().reverse().forEach(function (p) {
            tot += p.value;
            if (p.value > 0) s += "<br/>" + p.marker + p.seriesName + "　<b>" + moneyFmt(p.value) + "</b>";
          });
          s += "<br/><span style='opacity:.75'>" + I18N.t("delta.totalInvested") +
            "　<b>" + moneyFmt(tot) + "</b></span>";
          return s;
        }
      }),
      legend: {
        top: 0, left: 8, icon: "roundRect", itemWidth: 13, itemHeight: 5, itemGap: 16,
        textStyle: { color: T.axisLabel, fontSize: 12 }
      },
      grid: { left: 10, right: 14, top: 34, bottom: 26, containLabel: true },
      xAxis: {
        type: "category", data: ages,
        axisLine: { lineStyle: { color: T.axisLine } },
        axisTick: { show: false },
        axisLabel: {
          color: T.axisLabel, fontSize: 11.5,
          interval: Math.max(1, Math.floor(ages.length / 9))
        }
      },
      yAxis: { type: "value", show: false, max: v => v * 1.18 },
      series: [
        {
          name: I18N.t("chart.invest.premium"), type: "bar", stack: "inv",
          data: prem, barCategoryGap: "28%",
          itemStyle: { color: "#4F7E9E", borderRadius: [0, 0, 0, 0] }
        },
        {
          name: I18N.t("chart.invest.welcome"), type: "bar", stack: "inv",
          data: wel, itemStyle: { color: "#DCA941" },
          markLine: { silent: true, symbol: "none", data: marks }
        },
        {
          name: I18N.t("chart.invest.special"), type: "bar", stack: "inv",
          data: spe, itemStyle: { color: "#F0CE7E", borderRadius: [4, 4, 0, 0] }
        }
      ],
      graphic: afterYears > 0 ? [{
        type: "group", left: "58%", top: "middle",
        children: [
          {
            type: "text", style: {
              text: I18N.t("engine.after", { n: afterYears }),
              fill: "rgba(242,247,248,.5)", fontSize: 19, fontWeight: 600,
              lineHeight: 30, textAlign: "center"
            }
          },
          {
            type: "text", top: 74, style: {
              text: I18N.t("engine.after.sub"),
              fill: "rgba(242,247,248,.28)", fontSize: 12.5, textAlign: "center"
            }
          }
        ]
      }] : []
    }, true);
    return c;
  }

  function M_SPLIT(year, input) {
    return window.MODEL.bonusSplit(year, input.premium, input.payYears);
  }

  /* ============ 幕 2 · 增长路径 + 红利差额（单图） ============ */
  function path(el, result, input) {
    const c = inst(el);
    const ages = result.ages;
    const f = P.funds[result.risk];
    const base = result.rows.map(r => r.valueNoBonus);
    const band = result.rows.map(r => Math.max(0, r.value - r.valueNoBonus));
    const gold = "#DCA941";

    const wanted = ["welcome", "supcap", "iipend"];
    const POS = {
      welcome: { position: "insideStartTop", offset: [26, 0] },
      supcap: { position: "insideEndTop", offset: [0, 0] },
      iipend: { position: "insideStartBottom", offset: [24, 0] }
    };
    const seen = {}, marks = [];
    result.milestones.forEach(function (m) {
      if (wanted.indexOf(m.id) < 0 || seen[m.year]) return;
      seen[m.year] = 1;
      const p = POS[m.id];
      marks.push({
        xAxis: m.year - 1,
        label: {
          formatter: I18N.t("ms." + m.id), color: "#F4DFA6",
          fontSize: 11, fontWeight: 500,
          position: p.position, offset: p.offset, rotate: 0
        },
        lineStyle: { color: "rgba(220,169,65,.45)", type: "dashed", width: 1.2 }
      });
    });

    c.setOption({
      tooltip: Object.assign(tip(), {
        formatter: function (ps) {
          const i = ps[0].dataIndex;
          return "<b>" + I18N.t("chart.age") + " " + ps[0].axisValue + "</b>" +
            "<br/>" + I18N.t("chart.withBonus") + "　<b>" + moneyFmt(result.rows[i].value) + "</b>" +
            "<br/>" + I18N.t("chart.withoutBonus") + "　<b>" + moneyFmt(base[i]) + "</b>" +
            "<br/><span style='color:#F4DFA6'>" + I18N.t("delta.extra") +
            "　<b>" + moneyFmt(band[i]) + "</b></span>";
        }
      }),
      legend: {
        top: 0, left: 8, icon: "roundRect", itemWidth: 13, itemHeight: 5, itemGap: 16,
        data: [I18N.t("chart.withBonus"), I18N.t("chart.withoutBonus"), I18N.t("chart.principal")],
        textStyle: { color: T.axisLabel, fontSize: 12 }
      },
      grid: { left: 10, right: 20, top: 34, bottom: 26, containLabel: true },
      xAxis: {
        type: "category", data: ages, boundaryGap: false,
        axisLine: { lineStyle: { color: T.axisLine } }, axisTick: { show: false },
        axisLabel: {
          color: T.axisLabel, fontSize: 11.5,
          interval: Math.max(1, Math.floor(ages.length / 9))
        },
        splitLine: { show: false }
      },
      yAxis: {
        type: "value", show: false,
        max: v => v * 1.12
      },
      series: [
        {
          name: I18N.t("chart.withoutBonus"),
          type: "line", stack: "d", smooth: true, showSymbol: false,
          data: base,
          lineStyle: { width: 1.5, color: "rgba(255,255,255,.4)", type: "dashed" },
          itemStyle: { color: "rgba(255,255,255,.4)" },
          areaStyle: { color: "rgba(255,255,255,0)" },
          markLine: { silent: true, symbol: "none", data: marks }
        },
        {
          name: I18N.t("chart.withBonus"),
          type: "line", stack: "d", smooth: true, showSymbol: false,
          data: band,
          lineStyle: { width: 3.2, color: f.color },
          itemStyle: { color: f.color },
          areaStyle: { color: grad(gold, "5e", "12") },
          z: 5
        },
        {
          name: I18N.t("chart.principal"),
          type: "line", smooth: true, showSymbol: false,
          data: result.rows.map(r => r.cumPremium),
          lineStyle: { width: 1.4, color: "rgba(255,255,255,.3)", type: "dashed" },
          itemStyle: { color: "rgba(255,255,255,.3)" }
        }
      ]
    }, true);
    return c;
  }

  /* ============ 幕 3 · 价值换算（横向对比条） ============ */
  function valueBars(el, result, input) {
    const c = inst(el);
    const v = result.endValue;
    const edu = P.translators.filter(x => x.id === "edu")[0].unitCost;
    const home = P.translators.filter(x => x.id === "home")[0].unitCost;
    const annual = result.payout.annual;

    const nEdu = v / edu, nHome = v / home, nRet = input.payoutYears;

    /* 自下而上渲染：最后一项在最上方 */
    const cats = [
      I18N.t("value.bar.retire"),
      I18N.t("value.bar.edu"),
      I18N.t("value.bar.home"),
      I18N.t("value.bar.total")
    ];
    const vals = [annual, edu, home, v];
    const labels = [
      I18N.t("value.mult.retire", { n: I18N.fmtNum(nRet, 0) }),
      I18N.t("value.mult.edu", { n: I18N.fmtNum(nEdu, 1) }),
      I18N.t("value.mult.home", { n: I18N.fmtNum(nHome, 1) }),
      moneyFmt(v)
    ];
    const colors = ["rgba(255,255,255,.2)", "rgba(255,255,255,.2)", "rgba(255,255,255,.2)", "#DCA941"];

    c.setOption({
      tooltip: {
        trigger: "item",
        backgroundColor: T.tipBg, borderWidth: 1,
        borderColor: "rgba(255,255,255,.14)", padding: [9, 13],
        textStyle: { color: T.tipInk, fontSize: 12.5 },
        formatter: p => "<b>" + p.name + "</b><br/>" + moneyFmt(p.value)
      },
      grid: { left: 10, right: 150, top: 14, bottom: 10, containLabel: true },
      xAxis: { type: "value", show: false },
      yAxis: {
        type: "category", data: cats, inverse: false,
        axisLine: { show: false }, axisTick: { show: false },
        axisLabel: { color: "rgba(242,247,248,.78)", fontSize: 13.5, margin: 16 }
      },
      series: [{
        type: "bar", barWidth: "52%",
        data: vals.map(function (x, i) {
          return {
            value: x,
            itemStyle: { color: colors[i], borderRadius: [0, 6, 6, 0] }
          };
        }),
        label: {
          show: true, position: "right", distance: 12,
          color: "#F4DFA6", fontSize: 13, fontWeight: 600,
          formatter: p => labels[p.dataIndex]
        },
        animationDuration: 700
      }]
    }, true);
    return c;
  }

  /* ============ 幕 4 · 股债环形图 ============ */
  function ring(el, fundKey, highlighted) {
    const c = inst(el);
    const f = P.funds[fundKey];
    const stock = Math.round(f.stock * 100);
    c.setOption({
      series: [{
        type: "pie", radius: ["64%", "88%"], center: ["50%", "50%"],
        silent: true, label: { show: false }, labelLine: { show: false },
        data: [
          { value: stock, itemStyle: { color: f.color } },
          { value: 100 - stock, itemStyle: { color: "rgba(255,255,255,.1)" } }
        ]
      }],
      graphic: [
        {
          type: "text", left: "center", top: "40%",
          style: {
            text: stock + "%", fontSize: 25, fontWeight: 650,
            fill: highlighted ? "#F4DFA6" : "#F2F7F8", textAlign: "center"
          }
        },
        {
          type: "text", left: "center", top: "60%",
          style: { text: I18N.t("fund.stock"), fontSize: 11.5, fill: "rgba(242,247,248,.46)", textAlign: "center" }
        }
      ]
    }, true);
    return c;
  }

  /* ============ 幕 5 · 三档结果（横向条） ============ */
  function summaryBars(el, scenarios, input) {
    const c = inst(el);
    const order = ["agg", "bal", "cons"]; /* 自下而上 → cons 在最上 */
    const cats = [], vals = [], cols = [], sel = [];
    order.slice().reverse().forEach(function (k) {
      cats.push(I18N.t("fund." + k));
      vals.push(scenarios[k].endValue);
      cols.push(P.funds[k].color);
      sel.push(k === input.risk);
    });

    c.setOption({
      tooltip: {
        trigger: "item", backgroundColor: T.tipBg, borderWidth: 1,
        borderColor: "rgba(255,255,255,.14)", padding: [9, 13],
        textStyle: { color: T.tipInk, fontSize: 12.5 },
        formatter: p => "<b>" + p.name + "</b><br/>" + moneyFmt(p.value)
      },
      grid: { left: 10, right: 130, top: 12, bottom: 8, containLabel: true },
      xAxis: { type: "value", show: false },
      yAxis: {
        type: "category", data: cats,
        axisLine: { show: false }, axisTick: { show: false },
        axisLabel: {
          color: "rgba(242,247,248,.78)", fontSize: 12.5, margin: 14,
          formatter: v => v.length > 9 ? v.slice(0, 8) + "…" : v
        }
      },
      series: [{
        type: "bar", barWidth: "50%",
        data: vals.map(function (x, i) {
          return {
            value: x,
            itemStyle: {
              color: sel[i] ? cols[i] : "rgba(255,255,255,.14)",
              borderRadius: [0, 6, 6, 0]
            }
          };
        }),
        label: {
          show: true, position: "right", distance: 12,
          color: "#F4DFA6", fontSize: 13.5, fontWeight: 600,
          formatter: p => moneyFmt(p.value)
        },
        animationDuration: 700
      }]
    }, true);
    return c;
  }

  function resize() {
    instances.forEach(function (o) { o.c && o.c.resize(); });
  }

  return {
    spark: spark, invest: invest, path: path,
    valueBars: valueBars, ring: ring, summaryBars: summaryBars,
    resize: resize
  };
})();
