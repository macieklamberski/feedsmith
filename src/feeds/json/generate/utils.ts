import { generateRfc3339Date, trimObject } from '@/common/utils.js'
import type { Feed, Item } from '@/feeds/json/common/types.js'

export const generateItem = (item: Item<Date>) => {
  const value = {
    ...item,
    date_published: item.date_published ? generateRfc3339Date(item.date_published) : undefined,
    date_modified: item.date_modified ? generateRfc3339Date(item.date_modified) : undefined,
  }

  return trimObject(value)
}

export const generateFeed = (feed: Feed<Date>) => {
  return {
    version: 'https://jsonfeed.org/version/1.1',
    ...feed,
    items: feed.items.map(generateItem),
  }
}
