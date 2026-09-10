import { isNonEmptyString } from '../../../common/utils.js'

const rssElementRegex = /(?:^|[\s>])<(?:\w+:)?rss[\s>]/im
const versionAttributeRegex = /version\s*=\s*["'][^"']*["']/i
const rssElementsRegex = /(<(channel|item|title|link|description|pubDate|guid)[\s>])/i

export const detect = (value: unknown): value is string => {
  if (!isNonEmptyString(value)) {
    return false
  }

  const hasRssElement = rssElementRegex.test(value)

  if (!hasRssElement) {
    return false
  }

  const hasVersionAttribute = versionAttributeRegex.test(value)
  const hasRssElements = rssElementsRegex.test(value)

  return hasVersionAttribute || hasRssElements
}
