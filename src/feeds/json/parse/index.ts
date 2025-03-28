import { locales } from '../../../common/config'
import { detectJsonFeed } from '../../../index'
import type { Feed } from './types'
import { parseFeed } from './utils'

export const parse = (value: unknown): Feed => {
  if (!detectJsonFeed(value)) {
    throw new Error(locales.invalid)
  }

  const parsed = parseFeed(value)

  if (!parsed) {
    throw new Error(locales.invalid)
  }

  return parsed
}
