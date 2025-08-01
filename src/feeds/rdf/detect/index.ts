import { isNonEmptyString } from '@/common/utils.js'

export const detect = (value: unknown): value is string => {
  if (!isNonEmptyString(value)) {
    return false
  }

  const hasRdfElement = /(?:^|\s|>)\s*<(?:\w+:)?rdf[\s>]/im.test(value)

  if (!hasRdfElement) {
    return false
  }

  const hasRdfNamespace = value.includes('http://www.w3.org/1999/02/22-rdf-syntax-ns#')
  const hasRssNamespace = value.includes('http://purl.org/rss/1.0/')
  const hasRdfElements = /(<(?:\w+:)?(channel|item|title|link|description)[\s>])/i.test(value)

  return hasRdfNamespace || hasRssNamespace || hasRdfElements
}
