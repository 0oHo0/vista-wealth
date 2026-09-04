# iPad 离线部署指南（不依赖电脑、不依赖内网）

本项目提供两种"装进 iPad 直接演示"的方式。**推荐方案 A（PWA）**：像原生 App 一样有桌面图标、全屏、第一次联网打开后永久离线可用；**方案 B（单文件）**：一个 HTML 文件走天下，完全不经过任何服务器。

---

## 方案 A：PWA 安装到主屏幕（推荐，体验最接近 App）

原理：站点先放到一个 **HTTPS 静态托管**（免费），iPad Safari 打开一次后，Service Worker（`public/sw.js`，构建时进入 `dist/`）会把全部页面、脚本、ECharts、图标缓存到 iPad，此后**断网/飞行模式也能全屏运行**。

### 第 1 步：把 `dist/` 目录发布到公网（三选一，约 2 分钟）

**方式 1：Netlify Drop（最快，不用装任何东西）**
1. 本地先 `npm run build` 生成 `dist/`
2. 电脑浏览器打开 https://app.netlify.com/drop
3. 把整个 `dist` **文件夹**拖进网页虚线框
4. 几秒后得到一个 `https://xxxx.netlify.app` 地址，即部署完成
5. （可选）注册免费账号可固定站点名、后续拖拽同一站点即可更新

**方式 2：Cloudflare Pages / Vercel**：同样支持拖拽或连接 Git 仓库，均为免费 HTTPS。

**方式 3：GitHub Pages**：推送仓库 → `npm run build` → 把 `dist/` 发布到 Pages 分支（或用 CI），得到 `https://用户名.github.io/仓库名/`。

> 注意：必须保持 `dist/` 的**目录结构**（`index.html`、`assets/`、`icons/`、`sw.js`、`manifest.webmanifest` 同级），Service Worker 才能完整缓存。
> 不要把 `dist/index.html` 直接双击打开——多文件版必须走 HTTP；`file://` 场景见方案 B。

### 第 2 步：iPad 安装

1. iPad 上**必须用 Safari**（iOS 版 Chrome 不支持 PWA 安装与离线）
2. 打开上一步得到的 https 地址（会自动注册 Service Worker）
3. 点顶部栏「分享」图标（方框向上箭头）→ 「添加到主屏幕」→ 「添加」
4. **从主屏图标进入**即为全屏无地址栏模式，横屏锁定后即可对客演示
5. 验证离线：开启飞行模式，再点图标——六幕、图表、中英切换全部可用即成功

### 更新已发布版本
- 重新构建并推送/拖拽到托管平台；iPad 端刷新两次（导航请求 network-first，第二次进入即为新版）
- 若改动较大，把 `public/sw.js` 顶部 `CACHE = "pro-achiever-v20"` 的版本号 +1，可强制所有设备立即换缓存

---

## 方案 B：单文件版（零部署、零网络，适合微信/AirDrop 直发）

执行 `npm run build:single` 生成 **`dist-single/index.html`**（约 1.4MB，React/CSS/ECharts 全部内联，`file://` 双击即开）。

### 传到 iPad 并打开
1. 电脑通过 AirDrop / 微信文件传输助手 / 邮件，把 `dist-single/index.html` 发到 iPad，选择「存储到"文件"」
2. iPad 安装免费 App **Documents by Readdle**（或 Koder、Textastic 任一支持本地 HTML 的 App）
3. 在 Documents 里找到该文件并打开 → 内置浏览器渲染，飞行模式也能完整交互
4. 也可以在 iPad 的 a-Shell（免费终端 App）里进入文件目录执行 `python3 -m http.server 8080`，Safari 开 `http://127.0.0.1:8080/index.html`

> 说明：iOS 自带"文件"App 直接点 HTML 只能做受限的快速预览，无法保证本地脚本交互，所以需要上面这类容器 App；这是 iOS 的系统限制，与本项目代码无关。

### 重新生成单文件
改了源码后，在项目目录执行：
```bash
npm run build:single
```

---

## 方案 C：本机/内网静态服务（备查）

```bash
npm run build && npm run preview   # 或: cd dist && python -m http.server 8765
```
同 Wi-Fi 下 iPad Safari 访问 `http://电脑IP:端口/`。此方式**依赖电脑与网络**，不属于离线部署。

---

## 交付清单对照

| 文件/目录 | 作用 |
|---|---|
| `src/` | React 源码（scenes / components / lib） |
| `public/` | manifest、sw.js、图标（构建时拷贝进 dist） |
| `dist/` | 多文件构建产物（方案 A、C 使用） |
| `dist-single/index.html` | 单文件离线版（方案 B 使用，构建产物） |
| `index.html`（根目录） | Vite 入口模板 |
