from binascii import hexlify
import colorsys
from jinja2 import Environment, FileSystemLoader
from PIL import Image, ImageFont, ImageDraw
from hashlib import sha256


IMAGE_WIDTH = 500
IMAGE_HEIGHT = 500
MAX_FONT_SIZE = 70
PADDING = 4
FONT_FILE = "fonts/NotoSans-Regular.ttf"


env = Environment(loader=FileSystemLoader('templates'))


def normalise_tuple(t, scale):
    return tuple(int(x * scale) for x in t)


def get_fingerprint_colors(base):
    return (
        normalise_tuple(colorsys.hsv_to_rgb(base, 0.4, 1.0), 255), 
        normalise_tuple(colorsys.hsv_to_rgb(base, 0.4, 0.75), 255)
    )


# def render_fingerprint(img, text):
#     cell_size = IMAGE_WIDTH / 8
#     hex_size = cell_size * 0.45
#     x_shadow = 4
#     y_shadow = 4
#     text_hash = sha256(text.encode('utf-8')).digest()
#     fg, bg = get_fingerprint_colors(text_hash[0] / 255)
#     draw = ImageDraw.Draw(img)
#     for i, h in enumerate(hexlify(text_hash)):
#         if h != ord('8'): continue
#         x, y = (i % 8 + 0.5) * cell_size, (i // 8 + 0.5) * cell_size
#         draw.regular_polygon((x + x_shadow, y + y_shadow, hex_size), 6, 30, fill=bg)
#         draw.regular_polygon((x, y, hex_size), 6, 30, fill=fg)


def find_font_metrics(text):
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
    return (font_size, w, h)
    #draw = ImageDraw.Draw(img)
    #draw.text(((IMAGE_WIDTH - w) / 2, (IMAGE_HEIGHT - h) / 2), text, fill=(0, 0, 0), font=font)


def render(text):
    text_hash = sha256(text.encode('utf-8')).digest()
    fg, bg = get_fingerprint_colors(text_hash[0] / 255)
    font_size, w, h = find_font_metrics(text)
    return env.get_template('amulet.svg').render(
        text=text,
        hash=hexlify(text_hash),
        font_size=font_size,
        w=w,
        h=h,
        fg="#%.2x%.2x%.2x" % fg,
        bg="#%.2x%.2x%.2x" % bg,
    )
#    img = Image.new("RGB", (IMAGE_WIDTH, IMAGE_HEIGHT), (255, 255, 255))
#    render_fingerprint(img, text)
#    render_text(img, text)
#    return img
