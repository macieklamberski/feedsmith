import type { Feed } from './types'
import { parseFeed } from './utils'

// TODO: Ability to define and parse specified additional fields in feed and item.
// This can be done as two array parameters in second "options" parameter to parse().
// - extraFeedFields?: Array<string>
// - extraItemFields?: Array<string>
export const parse = (value: unknown): Feed | undefined => {
  const parsed = parseFeed(value)

  return parsed
}
