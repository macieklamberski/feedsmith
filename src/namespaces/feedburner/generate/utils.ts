import { isNonEmptyString, isPlainObject, trimObject } from 'trousse'
import type { GenerateUtil } from '../../../common/types.js'
import {
  generateCdataString,
  generatePlainString,
  generateTextOrCdataString,
  trimArray,
} from '../../../common/utils.js'
import type { FeedBurnerNs } from '../common/types.js'

export const generateInfo: GenerateUtil<string> = (info) => {
  if (!isNonEmptyString(info)) {
    return
  }

  return {
    '@uri': generatePlainString(info),
  }
}

export const generateFeedFlare: GenerateUtil<FeedBurnerNs.FeedFlare> = (feedFlare) => {
  if (!isPlainObject(feedFlare)) {
    return
  }

  const value = {
    '@href': generatePlainString(feedFlare.href),
    '@src': generatePlainString(feedFlare.src),
    ...generateTextOrCdataString(feedFlare.value),
  }

  return trimObject(value)
}

export const generateItem: GenerateUtil<FeedBurnerNs.Item> = (item) => {
  if (!isPlainObject(item)) {
    return
  }

  const value = {
    'feedburner:origLink': generateCdataString(item.origLink),
    'feedburner:origEnclosureLink': generateCdataString(item.origEnclosureLink),
    'feedburner:awareness': generateCdataString(item.awareness),
  }

  return trimObject(value)
}

export const generateFeed: GenerateUtil<FeedBurnerNs.Feed> = (feed) => {
  if (!isPlainObject(feed)) {
    return
  }

  const value = {
    'feedburner:info': generateInfo(feed.info),
    'feedburner:feedFlare': trimArray(feed.feedFlares, generateFeedFlare),
    'feedburner:browserFriendly': generateCdataString(feed.browserFriendly),
    'feedburner:emailServiceId': generateCdataString(feed.emailServiceId),
    'feedburner:feedburnerHostname': generateCdataString(feed.feedburnerHostname),
    'feedburner:awareness': generateCdataString(feed.awareness),
  }

  return trimObject(value)
}
