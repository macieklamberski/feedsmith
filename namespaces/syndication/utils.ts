import type { ParseFunction } from '../../common/types'
import { hasAnyProps, isObject, parseNumber, parseString } from '../../common/utils'
import type { Channel } from './types'

export const retrieveChannel: ParseFunction<Channel> = (value, level) => {
  if (!isObject(value)) {
    return
  }

  const channel = {
    updatePeriod: parseString(value['sy:updatePeriod']?.['#text'], level),
    updateFrequency: parseNumber(value['sy:updateFrequency']?.['#text'], level),
    updateBase: parseString(value['sy:updateBase']?.['#text'], level),
  }

  if (hasAnyProps(channel, Object.keys(channel) as Array<keyof Channel>)) {
    return channel
  }
}
