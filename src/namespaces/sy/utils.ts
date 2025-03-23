import type { ParseFunction } from '../../common/types'
import { hasAnyProps, isObject, parseNumber, parseString } from '../../common/utils'
import type { Feed } from './types'

export const parseFeed: ParseFunction<Feed> = (value) => {
  if (!isObject(value)) {
    return
  }

  const feed = {
    updatePeriod: parseString(value['sy:updateperiod']?.['#text']),
    updateFrequency: parseNumber(value['sy:updatefrequency']?.['#text']),
    updateBase: parseString(value['sy:updatebase']?.['#text']),
  }

  if (hasAnyProps(feed, Object.keys(feed) as Array<keyof Feed>)) {
    return feed
  }
}
