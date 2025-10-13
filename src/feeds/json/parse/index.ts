import { locales } from '../../../common/config.js'
import type { DeepPartial } from '../../../common/types.js'
import { detectJsonFeed } from '../../../index.js'
import type { Feed } from '../common/types.js'
import { parseFeed } from './utils.js'

export const parse = (value: unknown): DeepPartial<Feed<string>> => {
  if (!detectJsonFeed(value)) {
    throw new Error(locales.invalidFeedFormat)
  }

  const parsed = parseFeed(value)

  if (!parsed) {
    throw new Error(locales.invalidFeedFormat)
  }

  return parsed
}
