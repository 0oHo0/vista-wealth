# -*- coding: utf-8 -*-
"""
把双页站点打包成【单个自包含 HTML】standalone.html：
- CSS / ECharts / i18n / app / product 全部内联，无任何外部请求，断网可用
- 两个页面合并进同一文档，用 #/planner、#/product 哈希路由切换
用法：python tools/build_standalone.py
"""
import os
import re

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))


def read(rel):
    with open(os.path.join(ROOT, rel), "r", encoding="utf-8") as f:
        return f.read()


def slice_between(html, start_marker, end_marker):
    s = html.index(start_marker)
    e = html.index(end_marker, s)
    return html[s:e].strip()


index = read("index.html")
product = read("product.html")
css = read(os.path.join("assets", "styles.css"))
echarts = read(os.path.join("assets", "vendor", "echarts.min.js"))
i18n = read(os.path.join("assets", "i18n.js"))
appjs = read(os.path.join("assets", "app.js"))
prodjs = read(os.path.join("assets", "product.js"))

# ---- 规划器页：nav + shell（到首个 <script> 之前）----
planner_body = slice_between(index, '<nav class="nav">', '<script src="assets/vendor')
# nav 链接改为前端路由
planner_body = planner_body.replace('href="index.html"', 'href="#/planner" data-route="planner"')
planner_body = planner_body.replace('href="product.html"', 'href="#/product" data-route="product"')

# ---- 产品页：只要 product-body（nav 共用）----
product_body = slice_between(product, '<div class="product-body">', '<script src="assets/vendor')
# 产品页内跳规划器的链接改路由；锚点 #highlights 保留
product_body = product_body.replace('href="index.html"', 'href="#/planner" data-route="planner"')

router_js = """
/* ===== 单文件版哈希路由：两页切换 + 切换后让 ECharts 重新适配尺寸 ===== */
(function () {
  function current() { return location.hash.indexOf("product") >= 0 ? "product" : "planner"; }
  function show() {
    var r = current();
    document.getElementById("routePlanner").hidden = (r !== "planner");
    document.getElementById("routeProduct").hidden = (r !== "product");
    document.querySelectorAll(".nav-link").forEach(function (a) {
      a.classList.toggle("active", a.getAttribute("data-route") === r);
    });
    window.scrollTo(0, 0);
    setTimeout(function () { window.dispatchEvent(new Event("resize")); }, 80);
  }
  document.addEventListener("click", function (e) {
    var el = e.target.closest("[data-route]");
    if (!el) return;
    e.preventDefault();
    location.hash = "#/" + el.getAttribute("data-route");
  });
  window.addEventListener("hashchange", show);
  document.addEventListener("DOMContentLoaded", show);
})();
"""

html = """<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
  <title>Vista Wealth · 投资储蓄计划演示（离线单文件版）</title>
  <meta name="apple-mobile-web-app-capable" content="yes" />
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
  <meta name="apple-mobile-web-app-title" content="Vista" />
  <style>
__CSS__
  </style>
</head>
<body>
  <div id="routePlanner">
__PLANNER__
  </div>
  <div id="routeProduct" hidden>
__PRODUCT__
  </div>
  <script>
__ECHARTS__
  </script>
  <script>
__I18N__
  </script>
  <script>
__APP__
  </script>
  <script>
__PRODJS__
  </script>
  <script>
__ROUTER__
  </script>
</body>
</html>
"""

out = (html
       .replace("__CSS__", css)
       .replace("__PLANNER__", planner_body)
       .replace("__PRODUCT__", product_body)
       .replace("__ECHARTS__", echarts)
       .replace("__I18N__", i18n)
       .replace("__APP__", appjs)
       .replace("__PRODJS__", prodjs)
       .replace("__ROUTER__", router_js))

dest = os.path.join(ROOT, "standalone.html")
with open(dest, "w", encoding="utf-8") as f:
    f.write(out)
print("standalone.html bytes:", len(out.encode("utf-8")))
