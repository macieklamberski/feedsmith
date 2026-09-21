import { isPlainObject, trimObject } from 'trousse'
import type { ParseUtilPartial } from '../../../common/types.js'
import { parseArrayOf, parseSingularOf, parseString, retrieveText } from '../../../common/utils.js'
import type { FeedBurnerNs } from '../common/types.js'

export const parseFeedFlare: ParseUtilPartial<FeedBurnerNs.FeedFlare> = (value) => {
  if (!isPlainObject(value)) {
    return
  }

  const feedFlare = {
    href: parseString(value['@href']),
    src: parseString(value['@src']),
    value: parseString(retrieveText(value)),
  }

  return trimObject(feedFlare)
}

export const retrieveItem: ParseUtilPartial<FeedBurnerNs.Item> = (value) => {
  if (!isPlainObject(value)) {
    return
  }

  const item = {
    origLink: parseSingularOf(value['feedburner:origlink'], (value) =>
      parseString(retrieveText(value)),
    ),
    origEnclosureLink: parseSingularOf(value['feedburner:origenclosurelink'], (value) =>
      parseString(retrieveText(value)),
    ),
    awareness: parseSingularOf(value['feedburner:awareness'], (value) =>
      parseString(retrieveText(value)),
    ),
  }

  return trimObject(item)
}

export const retrieveFeed: ParseUtilPartial<FeedBurnerNs.Feed> = (value) => {
  if (!isPlainObject(value)) {
    return
  }

  const feed = {
    info: parseSingularOf(value['feedburner:info'], (value) => parseString(value?.['@uri'])),
    feedFlares: parseArrayOf(value['feedburner:feedflare'], parseFeedFlare),
    browserFriendly: parseSingularOf(value['feedburner:browserfriendly'], (value) =>
      parseString(retrieveText(value)),
    ),
    emailServiceId: parseSingularOf(value['feedburner:emailserviceid'], (value) =>
      parseString(retrieveText(value)),
    ),
    feedburnerHostname: parseSingularOf(value['feedburner:feedburnerhostname'], (value) =>
      parseString(retrieveText(value)),
    ),
    awareness: parseSingularOf(value['feedburner:awareness'], (value) =>
      parseString(retrieveText(value)),
    ),
  }

  return trimObject(feed)
}
