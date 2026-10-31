# Renders icons/icon{16,32,48,128}.png. Run: python3 tools/make_icons.py
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
FONT = '/usr/share/fonts/truetype/noto/NotoSerifDisplay-BoldItalic.ttf'
S = 1024  # draw large, downscale for smooth edges


def gradient(size, a, b):
    img = Image.new('RGB', (size, size))
    px = img.load()
    for y in range(size):
        for x in range(size):
            t = (x + y) / (2 * size - 2)
            px[x, y] = tuple(round(a[i] + (b[i] - a[i]) * t) for i in range(3))
    return img


def master():
    pad = S // 8  # Chrome guideline: 96/128 artwork with transparent margin
    art = S - 2 * pad
    canvas = Image.new('RGBA', (S, S), (0, 0, 0, 0))
    mask = Image.new('L', (art, art), 0)
    ImageDraw.Draw(mask).rounded_rectangle((0, 0, art - 1, art - 1), radius=art // 4.5, fill=255)
    canvas.paste(gradient(art, (109, 74, 255), (214, 69, 143)), (pad, pad), mask)

    d = ImageDraw.Draw(canvas)
    font = ImageFont.truetype(FONT, int(art * 0.78))
    box = d.textbbox((0, 0), 'I', font=font)
    w, h = box[2] - box[0], box[3] - box[1]
    x = pad + (art - w) / 2 - box[0]
    y = pad + (art - h) / 2 - box[1] - art * 0.06
    d.text((x, y), 'I', font=font, fill='white')
    # ink underline stroke under the letter
    lw = art * 0.075
    ly = pad + art * 0.80
    d.rounded_rectangle((pad + art * 0.24, ly, pad + art * 0.76, ly + lw), radius=lw / 2, fill=(255, 255, 255, 235))
    return canvas


if __name__ == '__main__':
    big = master()
    for n in (16, 32, 48, 128):
        big.resize((n, n), Image.LANCZOS).save(ROOT / 'icons' / f'icon{n}.png')
    print('icons written')
