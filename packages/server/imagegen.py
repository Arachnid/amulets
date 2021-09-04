from binascii import hexlify
import colorsys
from PIL import Image, ImageFont, ImageDraw
from hashlib import sha256
from utils import tr_whitespace

IMAGE_WIDTH = 700
IMAGE_HEIGHT = 700
MAX_FONT_SIZE = 48
PADDING = 8
BGCOLOR = (51, 51, 51)
FONTCOLOR = (255, 255, 255)
FONT_FILE = "fonts/CrimsonText-SemiBold.ttf"


def normalise_tuple(t, scale):
    return tuple(int(x * scale) for x in t)


def get_fingerprint_colors(base):
    return (
        normalise_tuple(colorsys.hsv_to_rgb(base, 0.4, 1.0), 255), 
        normalise_tuple(colorsys.hsv_to_rgb(base, 0.4, 0.75), 255)
    )


def render_fingerprint(img, text):
    cell_size = IMAGE_WIDTH / 8
    hex_size = cell_size * 0.45
    x_shadow = 8
    y_shadow = 8
    text_hash = sha256(text.encode('utf-8')).digest()
    fg, bg = get_fingerprint_colors(text_hash[0] / 255)
    draw = ImageDraw.Draw(img)
    for i, h in enumerate(hexlify(text_hash)):
        if h != ord('8'): continue
        x, y = (i % 8 + 0.5) * cell_size, (i // 8 + 0.5) * cell_size
        draw.regular_polygon((x + x_shadow, y + y_shadow, hex_size), 6, 30, fill=bg)
        draw.regular_polygon((x, y, hex_size), 6, 30, fill=fg)


def render_text(img, text):
    font_size = MAX_FONT_SIZE
    # Sometimes the first adjustment isn't enough - so we do this in a loop.
    while font_size > 1:
        font = ImageFont.truetype(FONT_FILE, font_size)
        w, h = font.getsize_multiline(text)
        ratio = max(w / (IMAGE_WIDTH - 2 * PADDING), h / (IMAGE_HEIGHT - 2 * PADDING))
        if ratio <= 1.0:
            break
        # Scale down
        font_size = int(font_size / ratio)
    draw = ImageDraw.Draw(img)
    draw.multiline_text(((IMAGE_WIDTH - w) / 2, (IMAGE_HEIGHT - h) / 2), text, fill=FONTCOLOR, font=font, spacing=24)


def render(text):
    img = Image.new("RGB", (IMAGE_WIDTH, IMAGE_HEIGHT), BGCOLOR)
    # render_fingerprint(img, text)
    render_text(img, tr_whitespace(text))
    return img
