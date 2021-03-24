from flask import abort, request
import requests
import time
import tweepy
from web3.auto import w3

from utils import load_contract, AmuletInfo, RARITIES, amulet_cache, KNOWN_CACHE_DURATION


OPENSEA_DOMAIN = "api.opensea.io"


contract = load_contract('Amulet')
last_block_scanned = None


def cron():
    if not request.headers.get('X-Appengine-Cron'):
        abort(403)

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
        amulet_cache[tokenid] = (time.time() + KNOWN_CACHE_DURATION, info)

        poke_opensea(info)
        send_tweet(info)
    last_block_scanned = current_block
    return "OK"


def poke_opensea(info):
    result = requests.get("https://%s/api/v1/asset/%s/%d/?force_update=true" % (OPENSEA_DOMAIN, contract.address, info.id))
    if result.status_code == 404: return
    result.raise_for_status()


def send_tweet(info):
    import twitter_credentials
    twitter_auth = tweepy.OAuthHandler(twitter_credentials.CONSUMER_KEY, twitter_credentials.CONSUMER_SECRET)
    twitter_auth.set_access_token(twitter_credentials.ACCESS_TOKEN, twitter_credentials.ACCESS_TOKEN_SECRET)
    tweeter = tweepy.API(twitter_auth)
    tweeter.update_status('%s\n\n - A %s amulet titled "%s" https://opensea.io/assets/%s/%d' % (info.amulet, RARITIES.get(info.score, "beyond mythic").upper(), info.title, contract.address, info.id))
