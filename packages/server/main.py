from collections import namedtuple
from flask import Flask, jsonify, render_template
import json
from markupsafe import Markup
import os
import re
from web3.auto import w3


RARITIES = {
    4: 'Common',
    5: 'Uncommon',
    6: 'Rare',
    7: 'Epic',
    8: 'Legendary',
    9: 'Mythic'
}


def load_contract(name):
    with open('contracts/%s.json' % (name,)) as f:
        abi = json.load(f)['abi']
    with open('contracts/%s.address' % (name,)) as f:
        address = f.read()
    print(address)
    return w3.eth.contract(abi=abi, address=address)


contract = load_contract('Amulet')
app = Flask(__name__)


@app.template_filter()
def mdescape(s):
    return Markup(re.sub("([]*_#=`~<>+.()\\&_[-])", r"\\\1", s))


AmuletInfo = namedtuple('AmuletInfo', ['id', 'owner', 'score', 'title', 'amulet', 'offsetUrl'])


def getAmuletData(tokenid):
    owner, blockRevealed, score = contract.functions.getData(tokenid).call()
    if blockRevealed > 0:
        events = list(contract.events.AmuletRevealed.getLogs(
            argument_filters={'tokenId': tokenid},
            fromBlock=blockRevealed,
            toBlock=blockRevealed))
        if(len(events) == 1):
            event = events[0]
            return AmuletInfo(tokenid, owner, score, event.args.title, event.args.amulet, event.args.offsetUrl)
        else:
            return AmuletInfo(tokenid, owner, score, None, None, None)
        

@app.route('/token/0x<string:tokenhash>.json')
def metadata(tokenhash):
    tokenid = int(tokenhash, 16)
    amulet = getAmuletData(tokenid)
    if amulet.score == 0:
        return mysteriousAmuletResponse(amulet)
    else:
        return amuletResponse(amulet)

def mysteriousAmuletResponse(info):
    return jsonify({
        'name': 'A mysterious amulet',
        'description': "A mysterious amulet someone claims to have found. Nothing is known about it until they choose to reveal it to the world.",
    })

def amuletResponse(info):
    args = {
        'info': info,
        'length': len(info.amulet.encode('utf-8')),
        'rarity': RARITIES.get(info.score, "Beyond Mythic"),
    }
    return jsonify({
        'name': info.title,
        'description': render_template('amulet.md', **args),
        'poem': info.amulet,
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
