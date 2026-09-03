# -*- coding: utf-8 -*-
"""生成 PWA / Apple 主屏图标：深青墨渐变底 + 金色 V。"""
import os
from PIL import Image, ImageDraw, ImageFont

OUT = os.path.join(os.path.dirname(__file__), "..", "assets", "icons")
os.makedirs(OUT, exist_ok=True)

TOP = (15, 76, 92)      # #0f4c5c
BOTTOM = (10, 54, 66)   # #0a3642
GOLD = (200, 162, 75)   # #c8a24b

FONT_CANDIDATES = [
    r"C:\Windows\Fonts\segoeuib.ttf",
    r"C:\Windows\Fonts\arialbd.ttf",
    r"C:\Windows\Fonts\timesbd.ttf",
]


def gradient_bg(size):
    img = Image.new("RGB", (size, size))
    px = img.load()
    for y in range(size):
        t = y / (size - 1)
        r = int(TOP[0] + (BOTTOM[0] - TOP[0]) * t)
        g = int(TOP[1] + (BOTTOM[1] - TOP[1]) * t)
        b = int(TOP[2] + (BOTTOM[2] - TOP[2]) * t)
        for x in range(size):
            px[x, y] = (r, g, b)
    return img


def render(size, rounded=False):
    S = size * 4  # 超采样抗锯齿
    img = gradient_bg(S)
    d = ImageDraw.Draw(img)
    font = None
    for fp in FONT_CANDIDATES:
        if os.path.exists(fp):
            font = ImageFont.truetype(fp, int(S * 0.58))
            break
    if font is None:
        font = ImageFont.load_default()
    text = "V"
    bb = d.textbbox((0, 0), text, font=font)
    tw, th = bb[2] - bb[0], bb[3] - bb[1]
    d.text(((S - tw) / 2 - bb[0], (S - th) / 2 - bb[1] - S * 0.02),
           text, font=font, fill=GOLD)
    img = img.resize((size, size), Image.LANCZOS)
    if rounded:  # apple-touch-icon 由系统裁圆角，这里保持全幅；favicon 加圆角
        mask = Image.new("L", (size, size), 0)
        md = ImageDraw.Draw(mask)
        md.rounded_rectangle([0, 0, size - 1, size - 1], radius=int(size * 0.22), fill=255)
        out = Image.new("RGBA", (size, size), (0, 0, 0, 0))
        out.paste(img, (0, 0), mask)
        return out
    return img


for sz, name, rounded in [
    (512, "icon-512.png", False),
    (192, "icon-192.png", False),
    (180, "apple-touch-icon.png", False),
    (48, "favicon-48.png", True),
]:
    render(sz, rounded).save(os.path.join(OUT, name))
    print("saved", name, sz)
print("done")
