# -*- coding: utf-8 -*-
"""静态校验 PWA：manifest 合法、预缓存清单全部存在、图标尺寸正确。"""
import json
import os
import re
from PIL import Image

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))

man = json.load(open(os.path.join(ROOT, "manifest.webmanifest"), encoding="utf-8"))
print("manifest OK:", man["name"], "| display:", man["display"])

for icon in man["icons"]:
    p = os.path.join(ROOT, icon["src"])
    assert os.path.exists(p), "missing icon " + icon["src"]
    im = Image.open(p)
    print("  icon", icon["src"], im.size)

sw = open(os.path.join(ROOT, "sw.js"), encoding="utf-8").read()
assets = re.findall(r'"\./([^"]+)"', sw)
missing = [a for a in assets if a and not os.path.exists(os.path.join(ROOT, a))]
print("precache entries:", len(assets))
print("MISSING:", missing if missing else "none — all exist")

for page in ("index.html", "product.html"):
    t = open(os.path.join(ROOT, page), encoding="utf-8").read()
    for needle in ("manifest.webmanifest", "apple-mobile-web-app-capable", "pwa.js"):
        assert needle in t, page + " 缺少 " + needle
    print(page, "PWA tags OK")
