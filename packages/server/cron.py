from flask import abort, request
from google.cloud import datastore
import requests
import time
import tweepy
from web3.auto.infura import w3

from utils import load_contract, AmuletInfo, RARITIES, amulet_cache, KNOWN_CACHE_DURATION, tr_whitespace


OPENSEA_DOMAIN = "api.opensea.io"
DEPLOY_BLOCK = 12107104

contract = load_contract(w3, 'Amulet')
client = datastore.Client()
status_key = client.key('Status', '1')


def cron():
    status = client.get(status_key)
    if not status:
        status = datastore.Entity(status_key)
        status.update({'block': DEPLOY_BLOCK})

    if not request.headers.get('X-Appengine-Cron'):
       abort(403)

    current_block = w3.eth.blockNumber
    last_block_scanned = status['block']
    events = contract.events.AmuletRevealed.getLogs(
        fromBlock=last_block_scanned + 1,
        toBlock=current_block)
    for event in events:
        # Populate the cache
        tokenid = event.args.tokenId
        owner, blockRevealed, score = contract.functions.getData(tokenid).call()
        info = AmuletInfo(tokenid, owner, score, event.args.title, tr_whitespace(event.args.amulet), event.args.offsetUrl)
        amulet_cache[tokenid] = (time.time() + KNOWN_CACHE_DURATION, info)

        poke_opensea(info)
        send_tweet(info)
    status.update({'block': current_block})
    client.put(status)
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
