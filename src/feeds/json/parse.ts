import type { Feed } from './types'
import { parseFeed } from './utils'

// TODO: Ability to define and parse specified additional fields in feed and item.
// This can be done as two array parameters in second "options" parameter to parse().
// - extraFeedFields?: Array<string>
// - extraItemFields?: Array<string>
export type Parse = (value: unknown) => Feed | undefined

export const parse: Parse = (value) => {
  const parsed = parseFeed(value)

  return parsed
}
