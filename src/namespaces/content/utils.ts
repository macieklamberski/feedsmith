import type { ParseFunction } from '../../common/types'
import { hasAnyProps, isObject, omitUndefinedFromObject, parseString } from '../../common/utils'
import type { Item } from './types'

export const parseItem: ParseFunction<Item> = (value) => {
  if (!isObject(value)) {
    return
  }

  const channel = omitUndefinedFromObject({
    encoded: parseString(value['content:encoded']?.['#text']),
  })

  if (hasAnyProps(channel, ['encoded'])) {
    return channel
  }
}
