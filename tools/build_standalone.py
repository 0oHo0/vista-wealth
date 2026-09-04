# -*- coding: utf-8 -*-
"""
把站点打包成【单个自包含 HTML】standalone.html：
- CSS / ECharts / 配置 / i18n / 模型 / 图表 / 分幕引擎 全部内联
- 无任何外部请求，断网、U 盘、iPad 本地打开均可用
用法：python tools/build_standalone.py
"""
import os
import re

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))


def read(rel):
    with open(os.path.join(ROOT, rel), "r", encoding="utf-8") as f:
        return f.read()


def read_bin_safe(rel):
    return read(rel)


index = read("index.html")

# ---- 1) 内联样式 ----
def inline_css(m):
    href = m.group(1).split("?")[0]
    return "<style>\n" + read(href) + "\n</style>"


index = re.sub(r'<link rel="stylesheet" href="([^"]+)"[^>]*>', inline_css, index)

# ---- 2) 内联脚本 ----
def inline_js(m):
    src = m.group(1)
    # 去掉 ?v=xx
    src = src.split("?")[0]
    body = read(src)
    # 防止脚本内的 </script> 提前闭合
    body = body.replace("</script>", "<\\/script>")
    return "<script>\n" + body + "\n</script>"


index = re.sub(r'<script src="([^"]+)"></script>', inline_js, index)

# ---- 3) 单文件版不需要 manifest / service worker ----
index = re.sub(r'<link rel="manifest"[^>]*>\s*', "", index)

# ---- 4) 替换标题，便于区分 ----
index = index.replace(
    "<title>AIA Pro Achiever 3.0 · 客户方案演示</title>",
    "<title>AIA Pro Achiever 3.0 · 客户方案演示（离线单文件版）</title>",
)

dest = os.path.join(ROOT, "standalone.html")
with open(dest, "w", encoding="utf-8") as f:
    f.write(index)

size = os.path.getsize(dest)
print("standalone.html written: %.2f MB" % (size / 1024 / 1024))
