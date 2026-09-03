# Vista Wealth · 投资储蓄计划客户演示前端

面向 **iPad 横屏客户演示**的双语（中/EN）静态前端，无构建步骤、无外部网络依赖（ECharts 已本地化，可完全离线使用）。

## 页面

| 文件 | 用途 |
|---|---|
| `index.html` | 财富规划器：年龄/年投入/缴费期/风险档/领取年限全部可拖动，三档（4%/6%/8%）收益曲线、本金收益构成、股债配置、逐年利益表、保单事件时间轴实时联动 |
| `product.html` | 产品介绍页：Hero、六大亮点、三类风险组合、客户案例曲线、灵活保障、合规免责声明 |

## 三种打开方式

1. **本机直接看**：双击 `index.html` 即可（纯静态，无需服务器）。
2. **iPad 横屏演示（推荐）**：电脑与 iPad 连同一 Wi-Fi，在项目目录执行
   ```powershell
   python -m http.server 8765 --bind 0.0.0.0
   ```
   iPad Safari 访问 `http://192.168.1.6:8765/`（IP 以电脑实际局域网地址为准），横屏锁定后添加到主屏幕即全屏演示。
   - 若 iPad 打不开：Windows 防火墙需允许 Python 的 8765 端口入站（专用网络）。
3. **完全离线带走**：整个 `wealth-plan` 文件夹拷到 U 盘/iPad（如用 Documents 类 App 本地起服务），因 ECharts 已在 `assets/vendor/` 内，无网也能跑。

## 文件结构

```
wealth-plan/
├── index.html          # 规划器页
├── product.html        # 产品介绍页
└── assets/
    ├── styles.css      # 设计系统 + iPad 横屏/高度自适应
    ├── i18n.js         # 中英字典、切换（localStorage 记忆）、货币/数字格式化
    ├── app.js          # 规划器：测算模型 + ECharts 联动
    ├── product.js      # 产品页图表
    └── vendor/echarts.min.js  # ECharts 5.5.1（本地，离线可用）
```

## 测算模型口径（示意，可在 `app.js` 顶部 CONFIG 调整）

- 三档假定毛回报：保守 4% / 平衡 6% / 进取 8%；净回报 = 毛回报 − 1.45% 年度基金管理费。
- 年初投入（保费＋红利），年末按净回报增值。
- 迎新红利（前 3 个保单年度）按缴费期取：10 年 10%/13%/15%，15 年 15%/20%/25%，20 年 20%/25%/30%。
- 特别红利：第 10–20 保单年度每年 +5% 年缴保费（条款简化模型）。
- 退休后按所选年限做等额年金测算（账户继续按同档净回报增值）。
- 资产配置：保守 股30/债70，平衡 股40/债60，进取 股90/债10（取自产品手册示例）。
- 产品页案例曲线终点锚定手册示例值（S$361,400 / S$1,061,100），中间年度按真实年金累积形状归一化，仅作示意。

> 所有数字均为假设演示，非保证收益，页面已内置合规提示文案；正式对客须替换为经合规审核的利益演示口径。

## 常用自定义位置

- 回报率、费率、红利规则、三档配色：`app.js` 顶部 `CONFIG`
- 中英全部文案：`i18n.js` 的 `DICT`
- 主色/圆角/间距/各断点尺寸：`styles.css` 顶部 `:root` 变量与 `@media` 块
- 产品名「Vista Wealth / 远景成长」：两个 HTML 顶部导航与 `product.html` Hero

## 适配说明

- 主场景为 iPad 横屏：11"（1194×834）与 12.9"（1366×1024）均一屏展示全部模块；
  CSS 在 `max-height:900px` 自动紧凑化，`max-width:900px` 自动堆叠兜底竖屏/窄窗。
- 触控滑块热区加大（24–28px），适合手指在屏幕上直接拖动给客户演示。

## 在线访问与换设备开发（GitHub）

仓库：https://github.com/0oHo0/vista-wealth

**首次开启在线访问（只需一次，约 10 秒）**：仓库页 Settings → Pages →
Source 选「Deploy from a branch」→ Branch 选 `main` / 根目录 `/ (root)` → Save。
约 1 分钟后线上地址为：

- 规划器：https://0oho0.github.io/vista-wealth/index.html
- 产品页：https://0oho0.github.io/vista-wealth/product.html

之后**每次 `git push` 到 main，Pages 自动更新**，无需再设置。PWA 缓存策略会让已安装到主屏的 iPad 在第二次打开时拿到新版本；改动较大时把 `sw.js` 的 `CACHE` 版本号 +1 可强制立即刷新。

**换一台电脑继续开发**：
```bash
git clone https://github.com/0oHo0/vista-wealth.git
cd vista-wealth
python -m http.server 8765        # 本地预览：http://127.0.0.1:8765/index.html
```

**日常改动提交流程**：
```bash
# 1. 若改过结构/脚本，重新生成单文件离线版
python tools/build_standalone.py
# 2. 提交并推送（Pages 会自动部署）
git add -A
git commit -m "描述本次改动"
git push
```

> 纯静态站点，无构建步骤、无 npm 依赖；唯一的"构建"是把多文件内联成 `standalone.html` 的脚本，不跑也不影响线上双页版。
