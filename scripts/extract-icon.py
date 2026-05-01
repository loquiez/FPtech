"""Extract just the FP heart icon from public/fptech-logo.png and produce a
square, padded PNG suitable for use as a favicon at apps/web/app/icon.png.

The source logo is the FP heart on the left + "TECH" wordmark on the right,
on a transparent background. We crop the left ~38% (covers the icon, drops
the wordmark), then tighten to the non-transparent bounding box and pad to
a centered square.
"""
from PIL import Image
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "apps" / "web" / "public" / "fptech-logo.png"
DST = ROOT / "apps" / "web" / "app" / "icon.png"

img = Image.open(SRC).convert("RGBA")
w, h = img.size

# Step 1: take left ~38% — drops the "TECH" wordmark cleanly.
left = img.crop((0, 0, int(w * 0.38), h))

# Step 2: tighten to non-transparent content.
bbox = left.getbbox()
if not bbox:
    raise SystemExit("logo has no non-transparent content in the left region")
icon = left.crop(bbox)

# Step 3: pad to a centered square. Browsers downscale the entire canvas
# into a tiny 16x16 slot — without breathing room around the glyph the
# heart's outer curves visibly clip the edges in the tab bar.
PADDING = 0.35  # fraction of the longest side, on each axis
iw, ih = icon.size
side = int(round(max(iw, ih) * (1 + PADDING * 2)))
canvas = Image.new("RGBA", (side, side), (0, 0, 0, 0))
canvas.paste(icon, ((side - iw) // 2, (side - ih) // 2), icon)

# Step 4: downscale slightly so the output isn't bigger than needed.
TARGET = 512
if side > TARGET:
    canvas = canvas.resize((TARGET, TARGET), Image.LANCZOS)

canvas.save(DST, format="PNG", optimize=True)
print(f"wrote {DST} ({canvas.size[0]}x{canvas.size[1]})")
