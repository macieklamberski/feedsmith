import type { DateLike } from '@/common/types.js'
import { generateRfc3339Date, trimArray, trimObject } from '@/common/utils.js'
import type { Feed, Item } from '@/feeds/json/common/types.js'

export const generateItem = (item: Item<DateLike>) => {
  const value = {
    ...item,
    date_published: item.date_published ? generateRfc3339Date(item.date_published) : undefined,
    date_modified: item.date_modified ? generateRfc3339Date(item.date_modified) : undefined,
  }

  return trimObject(value)
}

export const generateFeed = (feed: Feed<DateLike>) => {
  const value = {
    version: 'https://jsonfeed.org/version/1.1',
    ...feed,
    items: trimArray(feed.items, generateItem),
  }

  return trimObject(value)
}
