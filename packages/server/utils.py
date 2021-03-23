from collections import namedtuple
import json
import pylru
import time
from web3.auto import w3


RARITIES = {
    4: 'common',
    5: 'uncommon',
    6: 'rare',
    7: 'epic',
    8: 'legendary',
    9: 'mythic'
}
CACHE_SIZE = 65536
MYSTERIOUS_CACHE_DURATION = 60
KNOWN_CACHE_DURATION = 86400


amulet_cache = pylru.lrucache(CACHE_SIZE)
AmuletInfo = namedtuple('AmuletInfo', ['id', 'owner', 'score', 'title', 'amulet', 'offsetUrl'])


def load_contract(name):
    with open('contracts/%s.json' % (name,)) as f:
        abi = json.load(f)['abi']
    with open('contracts/%s.address' % (name,)) as f:
        address = f.read()
    return w3.eth.contract(abi=abi, address=address)


def get_amulet_data(contract, tokenid):
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