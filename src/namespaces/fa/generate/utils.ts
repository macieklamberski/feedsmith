import { isPlainObject, trimObject } from 'trousse'
import type { DateLike, GenerateUtil } from '../../../common/types.js'
import { generateNumber, generateRfc3339Date } from '../../../common/utils.js'
import type { FaNs } from '../common/types.js'

export const generateItemOrFeed: GenerateUtil<FaNs.ItemOrFeed<DateLike>> = (itemOrFeed) => {
  if (!isPlainObject(itemOrFeed)) {
    return
  }

  const value = {
    'fa:expires': generateRfc3339Date(itemOrFeed.expires),
    'fa:max-age': generateNumber(itemOrFeed.maxAge),
  }

  return trimObject(value)
}
