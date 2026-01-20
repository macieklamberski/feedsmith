import { locales } from '../../../common/config.js'
import type { ParseOptions } from '../../../common/types.js'
import { parseJsonObject } from '../../../common/utils.js'
import { detectJsonFeed } from '../../../index.js'
import type { ExtraFieldNames, Json } from '../common/types.js'
import { parseFeed } from './utils.js'

export const parse = <TExtra extends ExtraFieldNames = []>(
  value: unknown,
  options?: ParseOptions & { extraFields?: TExtra },
): Json.Feed<string, false, TExtra> => {
  const json = parseJsonObject(value)

  if (!detectJsonFeed(json)) {
    throw new Error(locales.invalidFeedFormat)
  }

  const parsed = parseFeed(json, options)

  if (!parsed) {
    throw new Error(locales.invalidFeedFormat)
  }

  return parsed as Json.Feed<string, false, TExtra>
}
