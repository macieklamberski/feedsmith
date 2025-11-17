import { locales } from '../../../common/config.js'
import type { DeepPartial, ParseOptions } from '../../../common/types.js'
import { detectJsonFeed } from '../../../index.js'
import type { Json } from '../common/types.js'
import { parseFeed } from './utils.js'

export const parse = (value: unknown, options?: ParseOptions): DeepPartial<Json.Feed<string>> => {
  if (!detectJsonFeed(value)) {
    throw new Error(locales.invalidFeedFormat)
  }

  const parsed = parseFeed(value, options)

  if (!parsed) {
    throw new Error(locales.invalidFeedFormat)
  }

  return parsed
}
