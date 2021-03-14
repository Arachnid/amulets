from binascii import hexlify
from collections import namedtuple
import colorsys
from flask import Flask, abort, jsonify, render_template
from hashlib import sha256
import json
from markupsafe import Markup
import os
import pylru
import re
import requests
import time
from web3.auto import w3


RARITIES = {
    4: 'Common',
    5: 'Uncommon',
    6: 'Rare',
    7: 'Epic',
    8: 'Legendary',
    9: 'Mythic'
}

CACHE_SIZE = 65536
MYSTERIOUS_CACHE_DURATION = 60
KNOWN_CACHE_DURATION = 86400
OPENSEA_DOMAIN = "testnets-api.opensea.io"


def load_contract(name):
    with open('contracts/%s.json' % (name,)) as f:
        abi = json.load(f)['abi']
    with open('contracts/%s.address' % (name,)) as f:
        address = f.read()
    return w3.eth.contract(abi=abi, address=address)


contract = load_contract('Amulet')
app = Flask(__name__)
amulet_cache = pylru.lrucache(CACHE_SIZE)
visible_whitespace = str.maketrans(' \n\t', '·⏎⇥')
AmuletInfo = namedtuple('AmuletInfo', ['id', 'owner', 'score', 'title', 'amulet', 'offsetUrl'])
last_block_scanned = None


@app.template_filter()
def mdescape(s):
    return Markup(re.sub("([]*_#=`~<>+.()\\&_[-])", r"\\\1", s))


def getAmuletData(tokenid):
    if tokenid in amulet_cache:
        expires, info = amulet_cache[tokenid]
        if expires > time.time():
            return info

    owner, blockRevealed, score = contract.functions.getData(tokenid).call()
    info = AmuletInfo(tokenid, owner, score, None, None, None)
    if blockRevealed > 0:
        events = list(contract.events.AmuletRevealed.getLogs(
            argument_filters={'tokenId': tokenid},
            fromBlock=blockRevealed,
            toBlock=blockRevealed))
        if(len(events) == 1):
            event = events[0]
            info = AmuletInfo(tokenid, owner, score, event.args.title, event.args.amulet, event.args.offsetUrl)
    amulet_cache[tokenid] = (time.time() + MYSTERIOUS_CACHE_DURATION if info.score == 0 else KNOWN_CACHE_DURATION, info)
    return info


@app.route('/cron')
def cron():
    global last_block_scanned
    current_block = w3.eth.blockNumber
    if not last_block_scanned:
        last_block_scanned = current_block - 25
    events = contract.events.AmuletRevealed.getLogs(
        fromBlock=last_block_scanned + 1,
        toBlock=current_block)
    for event in events:
        # Populate the cache
        tokenid = event.args.tokenId
        owner, blockRevealed, score = contract.functions.getData(tokenid).call()
        info = AmuletInfo(tokenid, owner, score, event.args.title, event.args.amulet, event.args.offsetUrl)
        amulet_cache[tokenid] = info

        # Poke OpenSea
        result = requests.get("https://%s/api/v1/asset/%s/%d/?force_update=true" % (OPENSEA_DOMAIN, contract.address, event.args.tokenId))
        result.raise_for_status()
        print(result.text)
    last_block_scanned = current_block
    return "OK"


@app.route('/token/0x<string:tokenhash>.json')
def metadata(tokenhash):
    tokenid = int(tokenhash, 16)
    if tokenid > (1 << 256) - 1:
        abort(404)
    amulet = getAmuletData(tokenid)
    if not amulet:
        abort(404)
    if amulet.score == 0:
        return mysteriousAmuletResponse(tokenhash, amulet)
    else:
        return amuletResponse(tokenhash, amulet)


def make_color(hue, sat, val):
    color = colorsys.hsv_to_rgb(hue / 255, sat / 255, val / 255)
    return '#%.2x%.2x%.2x' % tuple(int(c * 255) for c in color)


@app.route('/token/0x<string:tokenhash>.svg')
def tokenimage(tokenhash):
    tokenid = int(tokenhash, 16)
    if tokenid > (1 << 256) - 1:
        abort(404)
    amulet = getAmuletData(tokenid)
    h = hexlify(sha256(amulet.amulet.encode('utf-8')).digest())
    colorseed = int(tokenhash[:2], 16)
    args = {
        'info': amulet,
        'hash': h,
        'text': amulet.amulet.translate(visible_whitespace),
        'lightcolor': make_color(colorseed, 128, 128),
        'darkcolor': make_color(colorseed, 128, 192),
    }
    return render_template('amulet.svg', **args)


def mysteriousAmuletResponse(tokenhash, info):
    return jsonify({
        'name': 'A mysterious amulet',
        'description': "A mysterious amulet someone claims to have found. Nothing is known about it until they choose to reveal it to the world.",
    })


def amuletResponse(tokenhash, info):
    args = {
        'info': info,
        'length': len(info.amulet.encode('utf-8')),
        'rarity': RARITIES.get(info.score, "Beyond Mythic"),
    }
    return jsonify({
        'name': info.title,
        'description': render_template('amulet.md', **args),
        'poem': info.amulet,
        'image': "https://at.amulet.garden/token/0x%s.svg" % tokenhash,
        'attributes': [
            {
                'trait_type': 'Score',
                'value': info.score,
            }, {
                'trait_type': 'Rarity',
                'value': args['rarity']
            }, {
                'trait_type': 'Length',
                'display_type': 'number',
                'value': args['length']
            }
        ]
    })


if __name__ == '__main__':
    app.run(host='127.0.0.1', port=8080, debug=True)
