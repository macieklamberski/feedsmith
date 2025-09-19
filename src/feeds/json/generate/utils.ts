import type { DateLike } from '../../../common/types.js'
import { generateRfc3339Date, trimArray, trimObject } from '../../../common/utils.js'
import type { GenerateUtil } from '../../atom/common/types.js'
import type { Feed, Item } from '../common/types.js'

export const generateItem: GenerateUtil<Item<DateLike>> = (item) => {
  const value = {
    ...item,
    date_published: generateRfc3339Date(item?.date_published),
    date_modified: generateRfc3339Date(item?.date_modified),
  }

  return trimObject(value)
}

export const generateFeed: GenerateUtil<Feed<DateLike>> = (feed) => {
  const value = {
    version: 'https://jsonfeed.org/version/1.1',
    ...feed,
    items: trimArray(feed?.items, generateItem),
  }

  return trimObject(value)
}
