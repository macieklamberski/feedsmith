import { locales } from '../../../common/config.js'
import { detectAtomFeed } from '../../../index.js'
import { parser } from './config.js'
import type { Feed } from './types.js'
import { retrieveFeed } from './utils.js'

export const parse = (value: unknown): Feed => {
  if (!detectAtomFeed(value)) {
    throw new Error(locales.invalid)
  }

  const object = parser.parse(value)
  const parsed = retrieveFeed(object)

  if (!parsed) {
    throw new Error(locales.invalid)
  }

  return parsed
}
