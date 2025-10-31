import type { ParsePartialUtil } from '../../../common/types.js'
import {
  isObject,
  parseSingularOf,
  parseString,
  retrieveText,
  trimObject,
} from '../../../common/utils.js'
import type { PingbackNs } from '../common/types.js'

export const retrieveItem: ParsePartialUtil<PingbackNs.Item> = (value) => {
  if (!isObject(value)) {
    return
  }

  const item = {
    server: parseSingularOf(value['pingback:server'], (value) => parseString(retrieveText(value))),
    target: parseSingularOf(value['pingback:target'], (value) => parseString(retrieveText(value))),
  }

  return trimObject(item)
}

export const retrieveFeed: ParsePartialUtil<PingbackNs.Feed> = (value) => {
  if (!isObject(value)) {
    return
  }

  const feed = {
    to: parseSingularOf(value['pingback:to'], (value) => parseString(retrieveText(value))),
  }

  return trimObject(feed)
}
