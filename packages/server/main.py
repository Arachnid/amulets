#!/usr/bin/env python3
# coding=utf-8

from binascii import hexlify
from io import BytesIO
from flask import Flask, abort, jsonify, render_template, send_file
from hashlib import sha256
from markupsafe import Markup
import re
from web3.auto.infura import w3

from cron import cron
import imagegen
from utils import get_amulet_data, load_contract, RARITIES, tr_whitespace


contract = load_contract(w3, 'Amulet')
visible_whitespace = str.maketrans(' \n\t', '·⏎⇥')

app = Flask(__name__)
app.add_url_rule('/cron', 'cron', cron)


@app.template_filter()
def mdescape(s):
    return Markup(re.sub("([]*_#=`~<>+.()\\&_[-])", r"\\\1", s))


@app.route('/token/<string:tokenhash>.json')
def metadata(tokenhash):
    tokenid = int(tokenhash, 16)
    if tokenid > (1 << 256) - 1:
        abort(404)
    amulet = get_amulet_data(contract, tokenid)
    if not amulet:
        abort(404)
    if amulet.score == 0:
        return mysteriousAmuletResponse(tokenhash, amulet)
    else:
        return amuletResponse(tokenhash, amulet)


def make_color(hue, sat, val):
    color = colorsys.hsv_to_rgb(hue / 255, sat / 255, val / 255)
    return '#%.2x%.2x%.2x' % tuple(int(c * 255) for c in color)


@app.route('/token/<string:tokenhash>.png')
def tokenimage(tokenhash):
    tokenid = int(tokenhash, 16)
    if tokenid > (1 << 256) - 1:
        abort(404)
    amulet = get_amulet_data(contract, tokenid)
    if amulet.amulet:
        img = imagegen.render(amulet.amulet)
        buf = BytesIO()
        img.save(buf, 'PNG')
        buf.seek(0)
        return send_file(buf, mimetype='image/png')
    else:
        return send_file('static/mysterious-amulet.png', mimetype='image/png')


def has_antics(text):
    # Multiple consecutive spaces, whitespace at end of string,
    # or whitespace other than space and newline
    return re.search(' {2,}|\s$|[^\S\n ]', text) is not None


def mysteriousAmuletResponse(tokenhash, info):
    return jsonify({
        'name': 'A mysterious amulet',
        'description': "DO NOT BUY THIS AMULET UNLESS YOU KNOW WHAT IT SAYS.\n\nA mysterious amulet someone claims to have found. Nothing is known about it until they choose to reveal it to the world.",
        'image': "https://at.amulet.garden/token/%s.png" % tokenhash,
        'attributes': [
            {
                'value': 'Mysterious',
            },
        ],
    })


def amuletResponse(tokenhash, info):
    args = {
        'info': info,
        'length': len(info.amulet.encode('utf-8')),
        'rarity': RARITIES.get(info.score, "Beyond Mythic"),
    }
    attributes = [
        {
            'trait_type': 'Score',
            'display_type': 'number',
            'value': info.score,
        }, {
            'trait_type': 'Rarity',
            'value': args['rarity'],
        }, {
            'trait_type': 'Length',
            'display_type': 'number',
            'value': args['length'],
        }, {
            'value': 'Revealed',
        }, {
            'trait_type': 'Hidden Whitespace',
            'value': 'Yes' if has_antics(info.amulet) else 'No',
        }
    ]
    return jsonify({
        'name': info.title,
        'description': render_template('amulet.md', **args),
        'poem': info.amulet,
        'image': "https://at.amulet.garden/token/%s.png" % tokenhash,
        'attributes': attributes,
    })


if __name__ == '__main__':
    app.run(host='127.0.0.1', port=8080, debug=True)
