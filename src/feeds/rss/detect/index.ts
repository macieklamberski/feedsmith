import { isNonEmptyString } from '@/common/utils.js'

export const detect = (value: unknown): value is string => {
  if (!isNonEmptyString(value)) {
    return false
  }

  const hasRssElement = /(?:^|\s|>)\s*<(?:\w+:)?rss[\s>]/im.test(value)

  if (!hasRssElement) {
    return false
  }

  const hasVersionAttribute = /version\s*=\s*["'][^"']*["']/i.test(value)
  const hasRssElements = /(<(channel|item|title|link|description|pubDate|guid)[\s>])/i.test(value)

  return hasVersionAttribute || hasRssElements
}
