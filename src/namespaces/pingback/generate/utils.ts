import type { GenerateUtil } from '../../../common/types.js'
import { generateCdataString, isObject, trimObject } from '../../../common/utils.js'
import type { PingbackNs } from '../common/types.js'

export const generateItem: GenerateUtil<PingbackNs.Item> = (item) => {
  if (!isObject(item)) {
    return
  }

  const value = {
    'pingback:server': generateCdataString(item.server),
    'pingback:target': generateCdataString(item.target),
  }

  return trimObject(value)
}

export const generateFeed: GenerateUtil<PingbackNs.Feed> = (feed) => {
  if (!isObject(feed)) {
    return
  }

  const value = {
    'pingback:to': generateCdataString(feed.to),
  }

  return trimObject(value)
}
