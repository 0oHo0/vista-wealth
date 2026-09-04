# AIA Pro Achiever 3.0 · 客户方案演示

面向 **iPad 横屏现场演示**的分幕式（scene-based）客户演示前端。
产品为 **友邦成就一生 3.0 计划 / AIA Pro Achiever 3.0**（新加坡期缴保费投资联结保险计划，ILP）。

零构建、无 npm 依赖、ECharts 已本地化，可完全离线运行。

---

## 设计范式：不是仪表盘，是分幕叙事

旧版是 Dashboard（左参数栏 + 右图表 + 数据表），服务的是操作者，不像对客演示。
现版把演示拆成 **9 幕**，一幕只讲一个结论，跟着销售话术推进：

| # | 幕 | 讲什么 | 核心可视化 |
|---|---|---|---|
| 0 | 封面 | 客户是谁、目标是多少 | 目标金额大数字 |
| 1 | 您的投入 | 本金只在最初几年投入 | 缴费年期时间条 |
| 2 | 增长引擎 | 100% 即投 + 三层红利 | 四张机制卡 + 资金流等式 |
| 3 | 增长路径 | 钱怎么长起来的 | 三档增长曲线 + 关键事件标记 |
| 4 | 价值换算 | 这笔钱对生活的意义 | 目标翻译器（月现金流 / 学费 / 首付） |
| 5 | 红利差额 | AIA 额外投入了多少 | 差额面积图 |
| 6 | 风险匹配 | 三档组合怎么选 | 股债环形图 + 点击切档 |
| 7 | 灵活安心 | 异议处理 | 六张灵活/背书卡 |
| 8 | 专属方案 | 一页纸方案 | 参数 + 三档结果表 + 下一步 |

**参数不再暴露给客户**：年龄 / 保费 / 回报率等调节全部收进「顾问控制台」（右侧浮层，默认关闭，`C` 键切换）。

---

## 操作

| 操作 | 效果 |
|---|---|
| `←` `→` / 空格 | 上一幕 / 下一幕 |
| 左右滑动 | 翻页（iPad） |
| 点击底部圆点 | 跳到指定幕 |
| `C` | 开/关顾问控制台 |
| `F` | 全屏 |
| `P` | 打印 / 导出方案（自动跳到第 9 幕） |
| `Home` / `End` | 封面 / 方案 |
| 第 7 幕点基金卡 | 切换当前方案档位 |

---

## 三种打开方式

1. **直接打开**：双击 `index.html`（纯静态，无需服务器）。
2. **iPad 横屏演示（推荐）**：电脑与 iPad 同一 Wi-Fi，在项目目录执行
   ```powershell
   python -m http.server 8765 --bind 0.0.0.0
   ```
   iPad Safari 访问 `http://<电脑局域网IP>:8765/`，横屏后「添加到主屏幕」即全屏离线演示。
3. **完全离线带走**：用 `standalone.html`（单文件，1.09 MB，CSS/JS/ECharts 全内联），
   拷到 U 盘或 iPad 直接打开即可。改完代码后重新生成：
   ```bash
   python tools/build_standalone.py
   ```

---

## 文件结构

```
├── index.html              演示主页面（9 幕容器）
├── standalone.html         离线单文件版（由 tools 生成）
├── manifest.webmanifest    PWA 配置
├── sw.js                   Service Worker（离线缓存，改文件后 +1 版本号）
└── assets/
    ├── styles.css          设计系统（深色演示舞台 + iPad 横屏适配 + 打印样式）
    ├── product.config.js   【产品配置层】规则与数值：三档基金、费率、红利、手册案例
    ├── model.js            【测算引擎】唯一负责算钱的地方，可整体替换
    ├── i18n.js             中英双语字典、数字/货币格式化
    ├── charts.js           ECharts 封装（深色舞台配色）
    ├── scenes.js           分幕引擎 + 顾问控制台 + 交互
    ├── pwa.js              Service Worker 注册
    └── vendor/echarts.min.js
```

---

## 测算模型：可插拔，等你给公式

`assets/model.js` 是**唯一**负责算钱的文件。对外契约固定：

```js
MODEL.project(input)        // 单情景
MODEL.allScenarios(input)   // { cons, bal, agg }
MODEL.annuity(v, r, n)      // 等额年金
```

拿到官方计算公式后，**只替换 `series()` 内部实现**即可，UI / 图表 / 演示流程一行都不用改。

### 当前状态（占位实现）

- 口径：年初投入（保费 + 红利），年末按「假定回报 − 年度基金管理费」增值；
  费率 1.45%（第 25 年起 1.35%，取自手册露娜案例）。
- 迎新红利：前 3 个保单年度，10/15/20 年期分别为 10-13-15% / 15-20-25% / 20-25-30%
  （20 年期合计 75%，即手册所称「高达 75% 迎新红利」）。
- 特别红利：第 10–20 年度 5%，第 21 年度起 8%（须持续缴付期缴保费）。
- **锚定校准**：当参数与手册案例完全一致时，终值锚定到手册官方数字，
  保证工具输出与手册不冲突；参数一改动即自动关闭锚定，退回模型计算。

> ⚠️ 占位模型无法自行复现手册数值（8% 情景偏差约 −31%），目前靠锚定对齐。
> 待官方公式替换后，可把 `MODEL.ASSUME.USE_ANCHORS` 设为 `false`。

### 一个待确认的口径歧义

手册致文案例（10 年期）时间轴显示「第 11 年投资期结束、第 21 年起 8% 特别红利」，
与条款字面「须持续缴付期缴保费」存在歧义。
当前实现按字面处理：红利只在缴付期内发放，因此 10/15/20 年期下**不会**触发 8% 档，
对应事件节点也不展示。由 `MODEL.ASSUME.bonusesDuringPaymentOnly` 控制，官方公式确认后可翻转。

---

## 常用改动位置

| 想改什么 | 改哪里 |
|---|---|
| 回报率 / 费率 / 红利比例 / 三档股债比 | `assets/product.config.js` 的 `funds` / `fees` / `welcomeBonus` / `specialBonus` |
| 手册案例与官方锚定值 | `product.config.js` 的 `cases`（`anchors` 字段） |
| 生活单位换算系数（学费 / 首付单价） | `product.config.js` 的 `translators` |
| 中英文案 | `assets/i18n.js` 的 `DICT` |
| 配色 / 圆角 / 字号 / iPad 断点 | `assets/styles.css` 顶部 `:root` 与 `@media` |
| 测算公式 | `assets/model.js` 的 `series()` |
| 增删幕 | `index.html` 的 `.scene` + `scenes.js` 的 `TOTAL` 与对应 render 函数 |

---

## 适配

- 主场景 iPad 横屏：11"（1194×834）与 12.9"（1366×1024）均一屏一幕。
- CSS 在 `max-height:900px` / `760px` 自动紧凑化，`max-width:900px` 自动堆叠兜底竖屏。
- 第 9 幕有专门 `@media print` 样式：打印时自动转浅色、只输出方案页。

## 部署（GitHub Pages）

仓库：https://github.com/0oHo0/vista-wealth

首次开启：Settings → Pages → Source 选「Deploy from a branch」→ Branch `main` / 根目录 → Save。
之后每次 `git push` 到 main 自动更新，线上地址 `https://0oho0.github.io/vista-wealth/`。
改动较大时把 `sw.js` 的 `CACHE` 版本号 +1，可强制已安装的 iPad 立即刷新。

```bash
git add -A && git commit -m "描述改动" && git push
```
