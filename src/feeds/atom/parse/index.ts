import { locales } from '../../../common/config'
import { detectAtomFeed } from '../../../index'
import { parser } from './config'
import type { Feed } from './types'
import { retrieveFeed } from './utils'

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
