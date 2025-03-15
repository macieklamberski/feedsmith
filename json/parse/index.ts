import type { ParseLevel } from '../../common/parse/types'
import { parseFeed } from './functions'
import { parsedFeed } from './schemas'
import type { ParsedFeed } from './types'

export type Options = {
  level: ParseLevel
}

export type Parse = (json: unknown, options?: Options) => ParsedFeed | undefined

export const parse: Parse = (json, options) => {
  const level: ParseLevel = options?.level || 'coerce'

  // TODO: Implement:
  // - Ability to define and parse specified additional attributes in feed, head, item.
  //   extraFeedAttributes?: Array<string>
  //   extraHeadAttributes?: Array<string>
  //   extraItemAttributes?: Array<string>
  // - In strict mode, author should also be converted to authors.

  if (level === 'strict') {
    return parsedFeed.parse(json)
  }

  const feed = parseFeed(json, level)

  return feed ? parsedFeed.parse(feed) : undefined
}
