import type { ParseFunction } from '../../common/types'
import { hasAnyProps, isObject, parseString } from '../../common/utils'
import type { Item } from './types'

export const retrieveItem: ParseFunction<Item> = (value, level) => {
  if (!isObject(value)) {
    return
  }

  const channel = {
    encoded: parseString(value['content:encoded']?.['#text'], level),
  }

  if (hasAnyProps(channel, ['encoded'])) {
    return channel
  }
}
