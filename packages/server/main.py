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

@app.route('/token/0x<string:tokenhash>')
def token(tokenhash):
    tokenid = int(tokenhash, 16)
    owner, blockRevealed, score = contract.functions.getData(tokenid).call()
    if blockRevealed == 0:
        return mysteriousAmuletResponse(tokenid, owner)
    else:
        return amuletResponse(tokenid, owner, blockRevealed, score)


def mysteriousAmuletResponse(tokenid, owner):
    return jsonify({
        'name': 'A mysterious amulet',
        'description': "A mysterious amulet someone claims to have found. Nothing is known about it until they choose to reveal it to the world.",
    })

def amuletResponse(tokenid, owner, blockRevealed, score):
    events = list(contract.events.AmuletRevealed.getLogs(
        argument_filters={'tokenId': tokenid},
        fromBlock=blockRevealed,
        toBlock=blockRevealed))
    if(len(events) != 1):
        abort(500)
    event = events[0]
    args = {
        'owner': owner,
        'score': score,
        'length': len(event.args.amulet.encode('utf-8')),
        'rarity': RARITIES.get(score, "Beyond Mythic"),
        'event': event['args'],
    }
    return jsonify({
        'name': event.args.title,
        'description': render_template('amulet.md', **args),
        'poem': event.args.amulet,
        'attributes': [
            {
                'trait_type': 'Score',
                'value': score,
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
