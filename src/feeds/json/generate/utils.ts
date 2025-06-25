import { trimObject } from '../../../common/utils.js'
import type { Feed, Item } from '../common/types.js'

export const generateRfc3339Date = (date: Date): string => {
  // The only difference between ISO 8601 (produced by toISOString) and RFC 3339 is that
  // RFC 3339 allows a space between date and time parts instead of 'T', but the 'T' format
  // is actually valid in RFC 3339 as well, so we can just return the ISO string.
  return date.toISOString()
}

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
