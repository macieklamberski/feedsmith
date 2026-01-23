import { locales } from '../../../common/config.js'
import { parseJsonObject } from '../../../common/utils.js'
import { detectChapters } from '../../../index.js'
import type { Chapters } from '../common/types.js'
import { parseDocument } from './utils.js'

export const parse = (value: unknown): Chapters.Document => {
  const json = parseJsonObject(value)

  if (!detectChapters(json)) {
    throw new Error(locales.invalidInputChapters)
  }

  const parsed = parseDocument(json)

  if (!parsed) {
    throw new Error(locales.invalidInputChapters)
  }

  return parsed
}
