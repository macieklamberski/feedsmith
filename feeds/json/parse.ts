import type { ParseLevel } from '../../common/types'
import { parseFeed } from './utils'
import { feed } from './schemas'
import type { Feed } from './types'

export type Options = {
  level: ParseLevel
}

export type Parse = (value: unknown, options?: Options) => Feed | undefined

export const parse: Parse = (value, options) => {
  const level: ParseLevel = options?.level || 'coerce'

  // TODO:
  // - Ability to define and parse specified additional fields in feed and item.
  //   extraFeedFields?: Array<string>
  //   extraItemFields?: Array<string>
  // - In strict mode, author should also be converted to authors.

  if (level === 'strict') {
    return feed.parse(value)
  }

  const parsedFeed = parseFeed(value, level)

  return parsedFeed ? feed.parse(parsedFeed) : undefined
}
