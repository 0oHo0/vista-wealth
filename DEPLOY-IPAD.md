# iPad 离线部署指南（不依赖电脑、不依赖内网）

本项目提供两种"装进 iPad 直接演示"的方式。**推荐方案 A（PWA）**：像原生 App 一样有桌面图标、全屏、第一次联网打开后永久离线可用；**方案 B（单文件）**：一个 HTML 文件走天下，完全不经过任何服务器。

---

## 方案 A：PWA 安装到主屏幕（推荐，体验最接近 App）

原理：站点先放到一个 **HTTPS 静态托管**（免费），iPad Safari 打开一次后，Service Worker（`sw.js`）会把全部页面、脚本、ECharts、图标缓存到 iPad，此后**断网/飞行模式也能全屏运行**。

### 第 1 步：把 wealth-plan 目录发布到公网（三选一，约 2 分钟）

**方式 1：Netlify Drop（最快，不用装任何东西）**
1. 电脑浏览器打开 https://app.netlify.com/drop
2. 把整个 `wealth-plan` **文件夹**拖进网页虚线框
3. 几秒后得到一个 `https://xxxx.netlify.app` 地址，即部署完成
4. （可选）注册免费账号可固定站点名、后续拖拽同一站点即可更新

**方式 2：Cloudflare Pages / Vercel**：同样支持拖拽或连接 Git 仓库，均为免费 HTTPS。

**方式 3：GitHub Pages**：新建仓库上传全部文件 → Settings → Pages → 选分支根目录发布，得到 `https://用户名.github.io/仓库名/`。

> 注意：必须保持本项目的**目录结构**（`assets/`、`sw.js`、`manifest.webmanifest` 与两个 html 同级），Service Worker 才能完整缓存。

### 第 2 步：iPad 安装

1. iPad 上**必须用 Safari**（iOS 版 Chrome 不支持 PWA 安装与离线）
2. 打开上一步得到的 https 地址，把规划器页、产品页各点一次（确保缓存完成）
3. 点顶部栏「分享」图标（方框向上箭头）→ 「添加到主屏幕」→ 命名为 Vista → 「添加」
4. 桌面出现金色 V 图标。**从主屏图标进入**即为全屏无地址栏模式，横屏锁定后即可对客演示
5. 验证离线：开启飞行模式，再点图标——两页、图表、中英切换全部可用即成功

### 更新已发布版本
- 重新拖拽/推送文件到托管平台；iPad 端刷新两次（SW 采用后台更新，第二次进入为新版）
- 若改动较大，把 `sw.js` 顶部 `CACHE = "vista-wealth-v1"` 的版本号 +1，可强制所有设备立即换缓存

---

## 方案 B：单文件版（零部署、零网络，适合微信/AirDrop 直发）

已生成 **`standalone.html`**（约 1.1MB，CSS/JS/ECharts 全部内联，实测外部请求数为 0）。

### 传到 iPad 并打开
1. 电脑通过 AirDrop / 微信文件传输助手 / 邮件，把 `standalone.html` 发到 iPad，选择「存储到"文件"」
2. iPad 安装免费 App **Documents by Readdle**（或 Koder、Textastic 任一支持本地 HTML 的 App）
3. 在 Documents 里找到该文件并打开 → 它会用内置浏览器渲染，飞行模式也能完整交互
4. 也可以在 iPad 的 a-Shell（免费终端 App）里进入文件目录执行 `python3 -m http.server 8080`，Safari 开 `http://127.0.0.1:8080/standalone.html`

> 说明：iOS 自带"文件"App 直接点 HTML 只能做受限的快速预览，无法保证本地脚本交互，所以需要上面这类容器 App；这是 iOS 的系统限制，与本项目代码无关。
> 单文件版两页通过 `#/planner`、`#/product` 哈希切换，顶部导航直接可用。

### 重新生成单文件
改了源码后，在项目目录执行：
```powershell
python tools/build_standalone.py
```
即按最新源码重新内联生成 `standalone.html`。

---

## 方案 C：本机/内网静态服务（原有方式，备查）

```powershell
cd wealth-plan
python -m http.server 8765 --bind 0.0.0.0
```
同 Wi-Fi 下 iPad Safari 访问 `http://电脑IP:8765/`。此方式**依赖电脑与网络**，不属于离线部署。

---

## 交付清单对照

| 文件 | 作用 |
|---|---|
| `index.html` / `product.html` | PWA 双页（方案 A、C 使用） |
| `manifest.webmanifest` | 安装名称、图标、全屏、主题色 |
| `sw.js` | 离线缓存清单与策略（cache-first + 后台更新） |
| `assets/pwa.js` | 自动注册 SW（file:// 下自动跳过，不报错） |
| `assets/icons/` | 主屏图标 180/192/512 与 favicon |
| `standalone.html` | 单文件离线版（方案 B 使用，构建产物） |
| `tools/build_standalone.py` | 单文件构建脚本 |
| `tools/make_icons.py` | 图标生成脚本（改品牌时重跑） |
