import { locales } from '../../../common/config.js'
import type { DeepPartial, ParseOptions } from '../../../common/types.js'
import { parseJsonObject } from '../../../common/utils.js'
import { detectJsonFeed } from '../../../index.js'
import type { Json } from '../common/types.js'
import { parseFeed } from './utils.js'

export const parse = (value: unknown, options?: ParseOptions): DeepPartial<Json.Feed<string>> => {
  const json = parseJsonObject(value)

  if (!detectJsonFeed(json)) {
    throw new Error(locales.invalidFeedFormat)
  }

  const parsed = parseFeed(json, options)

  if (!parsed) {
    throw new Error(locales.invalidFeedFormat)
  }

  return parsed
}
