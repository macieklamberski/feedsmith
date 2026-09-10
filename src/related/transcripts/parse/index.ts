import { locales } from '../../../common/config.js'
import { parseJsonObject } from '../../../common/utils.js'
import type { Transcripts } from '../common/types.js'
import { detect } from '../detect/index.js'
import { parseDocument } from './utils.js'

export const parse = (value: unknown): Transcripts.Document => {
  const json = parseJsonObject(value)

  if (!detect(json)) {
    throw new Error(locales.invalidInputTranscripts)
  }

  const parsed = parseDocument(json)

  if (!parsed) {
    throw new Error(locales.invalidInputTranscripts)
  }

  return parsed
}
