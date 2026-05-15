import type { DateLike } from '../../../common/types.js'
import { generateRfc3339Date, isObject, trimArray, trimObject } from '../../../common/utils.js'
import type { GenerateUtil, JsonFeed } from '../common/types.js'

export const generateItem: GenerateUtil<JsonFeed.Item<DateLike>> = (item) => {
  const value = {
    ...item,
    date_published: generateRfc3339Date(item?.date_published),
    date_modified: generateRfc3339Date(item?.date_modified),
  }

  return trimObject(value)
}

export const generateFeed: GenerateUtil<JsonFeed.Feed<DateLike>> = (feed) => {
  if (!isObject(feed)) {
    return
  }

  const value = {
    ...feed,
    items: trimArray(feed?.items, generateItem),
  }

  const trimmed = trimObject(value)

  if (!trimmed) {
    return
  }

  return {
    version: 'https://jsonfeed.org/version/1.1',
    ...trimmed,
  }
}
