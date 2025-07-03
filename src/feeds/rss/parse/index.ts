import { XMLParser } from 'fast-xml-parser'
import { locales, namespaceUrls } from '../../../common/config.js'
import type { DeepPartial } from '../../../common/types.js'
import { createNamespaceNormalizators } from '../../../common/utils.js'
import { detectRssFeed } from '../../../index.js'
import type { Feed } from '../common/types.js'
import { parserConfig } from './config.js'
import { retrieveFeed } from './utils.js'

export const parse = (value: unknown): DeepPartial<Feed<string>> => {
  if (!detectRssFeed(value)) {
    throw new Error(locales.invalid)
  }

  const parser = new XMLParser({
    ...parserConfig,
    ...createNamespaceNormalizators(namespaceUrls),
  })

  const object = parser.parse(value)
  const parsed = retrieveFeed(object)

  if (!parsed) {
    throw new Error(locales.invalid)
  }

  return parsed
}
