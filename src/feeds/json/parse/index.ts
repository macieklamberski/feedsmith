import { locales } from '../../../common/config'
import type { Feed } from './types'
import { parseFeed } from './utils'

export const parse = (value: unknown): Feed => {
  const parsed = parseFeed(value)

  if (!parsed) {
    throw new Error(locales.invalid)
  }

  return parsed
}
