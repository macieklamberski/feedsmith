import type { ParseUtilPartial } from '../../../common/types.js'
import {
  isObject,
  parseSingularOf,
  parseString,
  retrieveRdfResourceOrText,
  trimObject,
} from '../../../common/utils.js'
import type { PingbackNs } from '../common/types.js'

export const retrieveItem: ParseUtilPartial<PingbackNs.Item> = (value) => {
  if (!isObject(value)) {
    return
  }

  const item = {
    server: parseSingularOf(value['pingback:server'], (value) =>
      retrieveRdfResourceOrText(value, parseString),
    ),
    target: parseSingularOf(value['pingback:target'], (value) =>
      retrieveRdfResourceOrText(value, parseString),
    ),
  }

  return trimObject(item)
}

export const retrieveFeed: ParseUtilPartial<PingbackNs.Feed> = (value) => {
  if (!isObject(value)) {
    return
  }

  const feed = {
    to: parseSingularOf(value['pingback:to'], (value) =>
      retrieveRdfResourceOrText(value, parseString),
    ),
  }

  return trimObject(feed)
}
