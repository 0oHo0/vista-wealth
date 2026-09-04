/* ============================================================
   charts — ECharts 浅色主题封装（TradingView 质感：渐变、平滑、跟随 tooltip）
   原则：能用图就不用数字 —— 坐标轴不摆数字，改用直接标注
   ============================================================ */
import * as echarts from "echarts";
import { PRODUCT, type RiskKey } from "@/lib/product";
import { bonusSplit, type CalcInput, type ScenarioResult, type Row } from "@/lib/model";
import type { I18nCtx } from "@/lib/i18n";

/* ---- 浅色主题 tokens ---- */
export const T = {
  label: "rgba(23,25,28,.45)",
  labelStrong: "rgba(23,25,28,.78)",
  line: "rgba(23,25,28,.1)",
  tipBg: "rgba(255,255,255,.97)",
  tipInk: "#17191C",
  tipBorder: "rgba(23,25,28,.08)"
};

export function tooltip(i18n: I18nCtx) {
  return {
    trigger: "axis" as const,
    backgroundColor: T.tipBg,
    borderWidth: 1,
    borderColor: T.tipBorder,
    padding: [10, 14],
    extraCssText: "border-radius:14px;box-shadow:0 8px 32px rgba(23,25,28,.10);backdrop-filter:blur(8px);",
    textStyle: { color: T.tipInk, fontSize: 12.5 },
    axisPointer: { lineStyle: { color: "rgba(23,25,28,.18)" } },
    ...{ i18n }
  };
}

export function moneyFmt(i18n: I18nCtx, v: number) {
  return i18n.money(v);
}

function grad(color: string, top: string, bottom: string) {
  return new echarts.graphic.LinearGradient(0, 0, 0, 1, [
    { offset: 0, color: color + top },
    { offset: 1, color: color + bottom }
  ]);
}

/* ============ 封面迷你面积图（无坐标轴） ============ */
export function sparkOption(i18n: I18nCtx, result: ScenarioResult): echarts.EChartsOption {
  const f = PRODUCT.funds[result.risk];
  return {
    grid: { left: 6, right: 6, top: 8, bottom: 6 },
    xAxis: { type: "category", show: false, boundaryGap: false, data: result.ages },
    yAxis: { type: "value", show: false },
    series: [
      {
        type: "line",
        data: result.rows.map((r) => r.value),
        smooth: true,
        showSymbol: false,
        lineStyle: { width: 2.4, color: f.color },
        itemStyle: { color: f.color },
        areaStyle: { color: grad(f.color, "3d", "03") }
      }
    ]
  };
}

/* ============ 幕 1 · 每年实际投入（堆叠柱） ============ */
export function investOption(i18n: I18nCtx, input: CalcInput, result: ScenarioResult): echarts.EChartsOption {
  const ages = result.ages;
  const prem: number[] = [];
  const wel: number[] = [];
  const spe: number[] = [];
  result.rows.forEach((r: Row) => {
    const b = bonusSplit(r.year, input.premium, input.payYears);
    prem.push(r.premium);
    wel.push(Math.round(b.welcome));
    spe.push(Math.round(b.special));
  });

  const opt: echarts.EChartsOption = {
    tooltip: {
      ...tooltip(i18n),
      formatter: (ps: any) => {
        let s = "<b>" + i18n.t("chart.age") + " " + ps[0].axisValue + "</b>";
        let tot = 0;
        ps.slice().reverse().forEach((p: any) => {
          if (p.seriesName === i18n.t("chart.accountValue")) {
            s += "<br/>" + p.marker + p.seriesName + "　<b>" + moneyFmt(i18n, p.value) + "</b>";
          } else {
            tot += p.value;
            if (p.value > 0) s += "<br/>" + p.marker + p.seriesName + "　<b>" + moneyFmt(i18n, p.value) + "</b>";
          }
        });
        s +=
          "<br/><span style='opacity:.7'>" +
          i18n.t("delta.totalInvested") +
          "　<b>" +
          moneyFmt(i18n, tot) +
          "</b></span>";
        return s;
      }
    },
    legend: {
      top: 0,
      left: 4,
      icon: "roundRect",
      itemWidth: 13,
      itemHeight: 5,
      itemGap: 16,
      data: [
        i18n.t("chart.invest.premium"),
        i18n.t("chart.invest.welcome"),
        i18n.t("chart.invest.special"),
        i18n.t("chart.accountValue")
      ],
      textStyle: { color: T.labelStrong, fontSize: 12 }
    },
    grid: [
      { left: 8, right: 14, top: 34, height: "65%", containLabel: true },
      { left: 8, right: 14, top: "78%", height: "16%", containLabel: true }
    ],
    xAxis: [
      {
        type: "category",
        gridIndex: 0,
        data: ages,
        axisLine: { lineStyle: { color: T.line } },
        axisTick: { show: false },
        axisLabel: { show: false }
      },
      {
        type: "category",
        gridIndex: 1,
        data: ages,
        axisLine: { lineStyle: { color: T.line } },
        axisTick: { show: false },
        axisLabel: {
          color: T.label,
          fontSize: 11.5,
          interval: Math.max(1, Math.floor(ages.length / 9))
        }
      }
    ],
    // Use separate hidden scales: bars show annual additions; the line shows
    // the larger projected account value without flattening the bars.
    yAxis: [
      { type: "value", gridIndex: 1, show: false, max: (v: number) => v * 1.3 },
      { type: "value", gridIndex: 0, show: false, max: (v: number) => v * 1.12 }
    ],
    series: [
      {
        name: i18n.t("chart.invest.premium"),
        type: "bar",
        xAxisIndex: 1,
        yAxisIndex: 0,
        stack: "inv",
        data: prem,
        barCategoryGap: "28%",
        itemStyle: { color: "#7E93A8" }
      },
      {
        name: i18n.t("chart.invest.welcome"),
        type: "bar",
        xAxisIndex: 1,
        yAxisIndex: 0,
        stack: "inv",
        data: wel,
        itemStyle: { color: "#C29A5B" },
        markLine: {
          silent: true,
          symbol: "none",
          data: [
            {
              xAxis: input.payYears - 1,
              label: {
                formatter: i18n.t("ms.iipend"),
                color: "#A67C3D",
                fontSize: 11.5,
                fontWeight: 500,
                position: "insideEndBottom",
                rotate: 0
              },
              lineStyle: { color: "rgba(176,141,87,.5)", type: "dashed", width: 1.3 }
            }
          ]
        }
      },
      {
        name: i18n.t("chart.invest.special"),
        type: "bar",
        xAxisIndex: 1,
        yAxisIndex: 0,
        stack: "inv",
        data: spe,
        itemStyle: { color: "#DEC294", borderRadius: [4, 4, 0, 0] }
      },
      {
        name: i18n.t("chart.accountValue"),
        type: "line",
        xAxisIndex: 0,
        yAxisIndex: 1,
        data: result.rows.map((r) => r.value),
        smooth: true,
        showSymbol: false,
        lineStyle: { width: 3, color: "#0E7C6B" },
        itemStyle: { color: "#0E7C6B" },
        areaStyle: { color: "rgba(14,124,107,.08)" },
        z: 6
      }
    ]
  };
  return opt;
}

/* ============ 幕 2 · 增长路径（渐变面积 + 红利金色带） ============ */
export function pathOption(i18n: I18nCtx, result: ScenarioResult, input: CalcInput): echarts.EChartsOption {
  const ages = result.ages;
  const f = PRODUCT.funds[result.risk];
  const base = result.rows.map((r) => r.valueNoBonus);
  const band = result.rows.map((r) => Math.max(0, r.value - r.valueNoBonus));
  const gold = "#B08D57";

  const wanted = ["welcome", "supcap", "iipend"];
  const seen: Record<number, number> = {};
  const candidates = result.milestones.filter((m) => {
    if (wanted.indexOf(m.id) < 0 || seen[m.year]) return false;
    seen[m.year] = 1;
    return true;
  });

  /*
   * MarkLine labels used to have fixed offsets. That looked fine for the
   * brochure cases, but became crowded when the IIP was short or the horizon
   * was compressed. Keep labels on two readable lanes and move a label to the
   * less crowded lane when milestones are close together.
   */
  const laneLastYear = [-Infinity, -Infinity];
  const minGap = Math.max(3, Math.ceil(result.horizon / 12));
  const marks: any[] = [];
  candidates.forEach((m) => {
    const preferredLane = m.id === "iipend" ? 1 : 0;
    const alternateLane = preferredLane === 0 ? 1 : 0;
    const lane =
      m.year - laneLastYear[preferredLane] >= minGap ||
      m.year - laneLastYear[alternateLane] < minGap
        ? preferredLane
        : alternateLane;
    laneLastYear[lane] = m.year;
    const nearLeft = m.year <= Math.max(2, Math.ceil(result.horizon * 0.08));
    const nearRight = m.year >= result.horizon - Math.max(2, Math.ceil(result.horizon * 0.08));
    marks.push({
      xAxis: m.year - 1,
      label: {
        formatter: i18n.t("ms." + m.id),
        color: "#A67C3D",
        fontSize: 11,
        fontWeight: 500,
        position: lane === 0 ? "insideStartTop" : "insideStartBottom",
        offset: [nearLeft ? 12 : nearRight ? -12 : 0, lane === 0 ? -8 : 8],
        align: nearRight ? "right" : "left",
        rotate: 0
      },
      lineStyle: { color: "rgba(176,141,87,.4)", type: "dashed", width: 1.2 }
    });
  });

  return {
    tooltip: {
      ...tooltip(i18n),
      formatter: (ps: any) => {
        const i = ps[0].dataIndex;
        return (
          "<b>" +
          i18n.t("chart.age") +
          " " +
          ps[0].axisValue +
          "</b>" +
          "<br/>" +
          i18n.t("chart.withBonus") +
          "　<b>" +
          moneyFmt(i18n, result.rows[i].value) +
          "</b>" +
          "<br/>" +
          i18n.t("chart.withoutBonus") +
          "　<b>" +
          moneyFmt(i18n, base[i]) +
          "</b>" +
          "<br/><span style='color:#A67C3D'>" +
          i18n.t("delta.extra") +
          "　<b>" +
          moneyFmt(i18n, band[i]) +
          "</b></span>"
        );
      }
    },
    legend: {
      top: 0,
      left: 4,
      icon: "roundRect",
      itemWidth: 13,
      itemHeight: 5,
      itemGap: 16,
      data: [i18n.t("chart.withBonus"), i18n.t("chart.withoutBonus"), i18n.t("chart.principal")],
      textStyle: { color: T.labelStrong, fontSize: 12 }
    },
    grid: { left: 8, right: 20, top: 34, bottom: 24, containLabel: true },
    xAxis: {
      type: "category",
      data: ages,
      boundaryGap: false,
      axisLine: { lineStyle: { color: T.line } },
      axisTick: { show: false },
      axisLabel: {
        color: T.label,
        fontSize: 11.5,
        interval: Math.max(1, Math.floor(ages.length / 9))
      },
      splitLine: { show: false }
    },
    yAxis: { type: "value", show: false, max: (v: number) => v * 1.12 },
    series: [
      {
        name: i18n.t("chart.withoutBonus"),
        type: "line",
        stack: "d",
        smooth: true,
        showSymbol: false,
        data: base,
        lineStyle: { width: 1.5, color: "rgba(23,25,28,.28)", type: "dashed" },
        itemStyle: { color: "rgba(23,25,28,.28)" },
        areaStyle: { color: "rgba(255,255,255,0)" },
        markLine: { silent: true, symbol: "none", data: marks }
      },
      {
        name: i18n.t("chart.withBonus"),
        type: "line",
        stack: "d",
        smooth: true,
        showSymbol: false,
        data: band,
        lineStyle: { width: 3.2, color: f.color },
        itemStyle: { color: f.color },
        areaStyle: { color: grad(gold, "4a", "08") },
        z: 5
      },
      {
        name: i18n.t("chart.principal"),
        type: "line",
        smooth: true,
        showSymbol: false,
        data: result.rows.map((r) => r.cumPremium),
        lineStyle: { width: 1.4, color: "rgba(23,25,28,.2)", type: "dashed" },
        itemStyle: { color: "rgba(23,25,28,.2)" }
      }
    ]
  };
}

/* ============ 幕 3 · 价值换算（横向对比条） ============ */
export function valueBarsOption(i18n: I18nCtx, result: ScenarioResult, input: CalcInput): echarts.EChartsOption {
  const v = result.endValue;
  const edu = PRODUCT.translators.edu.unitCost;
  const home = PRODUCT.translators.home.unitCost;
  const annual = result.payout.annual;
  const nEdu = v / edu;
  const nHome = v / home;
  const nRet = input.payoutYears;

  const cats = [
    i18n.t("value.bar.retire"),
    i18n.t("value.bar.edu"),
    i18n.t("value.bar.home"),
    i18n.t("value.bar.total")
  ];
  const vals = [annual, edu, home, v];
  const labels = [
    i18n.t("value.mult.retire", { n: i18n.fmtNum(nRet, 0) }),
    i18n.t("value.mult.edu", { n: i18n.fmtNum(nEdu, 1) }),
    i18n.t("value.mult.home", { n: i18n.fmtNum(nHome, 1) }),
    moneyFmt(i18n, v)
  ];
  const colors = [
    "rgba(23,25,28,.14)",
    "rgba(23,25,28,.14)",
    "rgba(23,25,28,.14)",
    "#B08D57"
  ];

  return {
    tooltip: {
      trigger: "item",
      backgroundColor: T.tipBg,
      borderWidth: 1,
      borderColor: T.tipBorder,
      padding: [10, 14],
      extraCssText: "border-radius:14px;box-shadow:0 8px 32px rgba(23,25,28,.10);",
      textStyle: { color: T.tipInk, fontSize: 12.5 },
      formatter: (p: any) => "<b>" + p.name + "</b><br/>" + moneyFmt(i18n, p.value)
    },
    grid: { left: 8, right: 158, top: 14, bottom: 10, containLabel: true },
    xAxis: { type: "value", show: false },
    yAxis: {
      type: "category",
      data: cats,
      inverse: false,
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: T.labelStrong, fontSize: 13.5, margin: 16 }
    },
    series: [
      {
        type: "bar",
        barWidth: "52%",
        data: vals.map((x, i) => ({
          value: x,
          itemStyle: { color: colors[i], borderRadius: [0, 8, 8, 0] }
        })),
        label: {
          show: true,
          position: "right",
          distance: 12,
          color: "#A67C3D",
          fontSize: 13,
          fontWeight: 600,
          formatter: (p: any) => labels[p.dataIndex]
        },
        animationDuration: 700
      }
    ]
  };
}

/* ============ 幕 4 · 股债环形图 ============ */
export function ringOption(i18n: I18nCtx, fundKey: RiskKey, highlighted: boolean): echarts.EChartsOption {
  const f = PRODUCT.funds[fundKey];
  const stock = Math.round(f.stock * 100);
  return {
    series: [
      {
        type: "pie",
        radius: ["64%", "88%"],
        center: ["50%", "50%"],
        silent: true,
        label: { show: false },
        labelLine: { show: false },
        data: [
          { value: stock, itemStyle: { color: f.color } },
          { value: 100 - stock, itemStyle: { color: "rgba(23,25,28,.07)" } }
        ]
      }
    ],
    graphic: [
      {
        type: "text",
        left: "center",
        top: "40%",
        style: {
          text: stock + "%",
          fontSize: 25,
          fontWeight: 650,
          fill: highlighted ? "#A67C3D" : "#17191C",
          textAlign: "center"
        }
      },
      {
        type: "text",
        left: "center",
        top: "60%",
        style: {
          text: i18n.t("fund.stock"),
          fontSize: 11.5,
          fill: "rgba(23,25,28,.42)",
          textAlign: "center"
        }
      }
    ]
  };
}

/* ============ 幕 5 · 三档结果（横向条） ============ */
export function summaryBarsOption(
  i18n: I18nCtx,
  scenarios: Record<RiskKey, ScenarioResult>,
  input: CalcInput
): echarts.EChartsOption {
  const order: RiskKey[] = ["agg", "bal", "cons"];
  const cats: string[] = [];
  const vals: number[] = [];
  const cols: string[] = [];
  const sel: boolean[] = [];
  order.forEach((k) => {
    cats.push(i18n.t("fund." + k));
    vals.push(scenarios[k].endValue);
    cols.push(PRODUCT.funds[k].color);
    sel.push(k === input.risk);
  });

  return {
    tooltip: {
      trigger: "item",
      backgroundColor: T.tipBg,
      borderWidth: 1,
      borderColor: T.tipBorder,
      padding: [10, 14],
      extraCssText: "border-radius:14px;box-shadow:0 8px 32px rgba(23,25,28,.10);",
      textStyle: { color: T.tipInk, fontSize: 12.5 },
      formatter: (p: any) => "<b>" + p.name + "</b><br/>" + moneyFmt(i18n, p.value)
    },
    grid: { left: 8, right: 130, top: 12, bottom: 8, containLabel: true },
    xAxis: { type: "value", show: false },
    yAxis: {
      type: "category",
      data: cats,
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: {
        color: T.labelStrong,
        fontSize: 12.5,
        margin: 14,
        formatter: (v: string) => (v.length > 9 ? v.slice(0, 8) + "…" : v)
      }
    },
    series: [
      {
        type: "bar",
        barWidth: "50%",
        data: vals.map((x, i) => ({
          value: x,
          itemStyle: {
            color: sel[i] ? cols[i] : "rgba(23,25,28,.1)",
            borderRadius: [0, 8, 8, 0]
          }
        })),
        label: {
          show: true,
          position: "right",
          distance: 12,
          color: "#A67C3D",
          fontSize: 13.5,
          fontWeight: 600,
          formatter: (p: any) => moneyFmt(i18n, p.value)
        },
        animationDuration: 700
      }
    ]
  };
}
