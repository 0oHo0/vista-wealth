# AIA Pro Achiever 3.0 · 客户方案演示（v3）

面向 **iPad 横屏现场演示**的分幕式（scene-based）客户演示前端。
产品为 **友邦成就一生 3.0 计划 / AIA Pro Achiever 3.0**（新加坡期缴保费投资联结保险计划，ILP）。

**v3 = React 组件化重写**：Vite + React 18 + TypeScript + Tailwind CSS + shadcn/ui 组件基件 +
Magic UI NumberTicker（数字滚动）+ Framer Motion（场景切换/入场动效）+ ECharts（浅色 TradingView 质感图表）。
视觉基调为浅色 Apple / Wealthfront 财富管理风。构建产物仍是**纯静态文件**，PWA 离线与单文件导出均保留。

---

## 设计范式：不是仪表盘，是分幕叙事

一幕只讲一个结论，跟着销售话术推进，共 **6 幕**：

| # | 幕 | 讲什么 | 核心可视化 |
|---|---|---|---|
| 0 | 封面 | 客户是谁、目标是多少 | NumberTicker 目标大数字 + 迷你面积图 |
| 1 | 投入与红利 | 本金只在前几年投入，红利是 AIA 额外注入 | 三层堆叠柱 + 资金等式 + 机制 chips |
| 2 | 增长路径 | 钱怎么长起来、红利帮了多少 | 渐变面积图（金色红利带）+ 人生时间线 |
| 3 | 价值换算 | 这笔钱能换到什么 | 横向对比条（首付 / 学费 / 退休现金流） |
| 4 | 风险匹配 | 三档组合怎么选 | 股债环形图卡 + 点击切档 |
| 5 | 专属方案 | 一页纸方案 | 三档横条对比 + 灵活权益 + 下一步 |

**参数不暴露给客户**：年龄 / 保费 / 回报率等调节全部收进「顾问控制台」（右侧深色浮层，默认关闭，`C` 键切换）。

---

## 开发与构建

```bash
npm install        # 安装依赖
npm run dev        # 本地开发（热更新）
npm run build      # 产出 dist/（GitHub Pages / PWA 用）
npm run build:single  # 产出 dist-single/index.html（单文件离线版）
npm run preview    # 本地预览 dist/
```

> 注意：多文件版 `dist/` 必须走 HTTP（PWA / Pages），直接双击会被 ES Module CORS 拦截；
> `file://` 双击场景请用 `dist-single/index.html`（全部内联，双击即开）。

---

## 操作

| 操作 | 效果 |
|---|---|
| `←` `→` / 空格 | 上一幕 / 下一幕 |
| 左右滑动 | 翻页（iPad） |
| 点击底部圆点 | 跳到指定幕 |
| `C` | 开/关顾问控制台 |
| `F` | 全屏 |
| `P` | 打印 / 导出方案（第 5 幕，浅色打印样式） |
| `Home` / `End` | 封面 / 方案 |
| 第 4 幕点基金卡 | 切换当前方案档位 |

---

## 测算引擎（可插拔）

`src/lib/model.ts` 是唯一算钱的地方，对外契约固定：
`project(input)` / `allScenarios(input)` / `annuity(v, r, n)` / `bonusSplit(...)`。

- 当前是「手册条款直译」占位模型 + **锚定校准**：参数与手册案例（致文 / 露娜）完全一致时，
  终值自动对齐手册官方数字（S$1,061,100 / S$2,352,000 / S$361,400），参数一动锚定即失效。
- **拿到官方计算公式后**：只需替换 `series()` 内部实现，并把 `ASSUME.USE_ANCHORS` 设为 `false`，
  UI / 图表 / 演示流程完全不用动。

产品数值（费率 / 红利 / 案例 / 基金组合）集中在 `src/lib/product.ts`；界面文案在 `src/lib/i18n.tsx`。

---

## iPad 部署

见 `DEPLOY-IPAD.md`：方案 A = PWA（HTTPS 托管 + Safari 添加到主屏幕，离线全屏）；
方案 B = `dist-single/index.html` 单文件（AirDrop / U 盘直开）。
改动发布后把 `public/sw.js` 顶部 `CACHE` 版本号 +1。
