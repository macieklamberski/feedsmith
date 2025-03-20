import type { ParseFunction } from '../../common/types'
import { hasAnyProps, isObject, parseString } from '../../common/utils'
import type { Item } from './types'

export const retrieveItem: ParseFunction<Item> = (value) => {
  if (!isObject(value)) {
    return
  }

  const channel = {
    encoded: parseString(value['content:encoded']?.['#text']),
  }

  if (hasAnyProps(channel, ['encoded'])) {
    return channel
  }
}
