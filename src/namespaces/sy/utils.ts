import type { ParseFunction } from '../../common/types.js'
import { isObject, parseNumber, parseString, retrieveText, trimObject } from '../../common/utils.js'
import type { Feed } from './types.js'

export const parseFeed: ParseFunction<Feed> = (value) => {
  if (!isObject(value)) {
    return
  }

  const feed = trimObject({
    updatePeriod: parseString(retrieveText(value['sy:updateperiod'])),
    updateFrequency: parseNumber(retrieveText(value['sy:updatefrequency'])),
    updateBase: parseString(retrieveText(value['sy:updatebase'])),
  })

  return feed
}
