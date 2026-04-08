import type { ParsePartialUtil } from '../../../common/types.js'
import {
  createCaseInsensitiveGetter,
  isObject,
  parseArrayOf,
  parseNumber,
  parseSingularOf,
  parseString,
  trimObject,
} from '../../../common/utils.js'
import type { Transcripts } from '../common/types.js'

export const parseSegment: ParsePartialUtil<Transcripts.Segment> = (value) => {
  if (!isObject(value)) {
    return
  }

  const get = createCaseInsensitiveGetter(value)
  const segment = {
    speaker: parseSingularOf(get('speaker'), parseString),
    startTime: parseSingularOf(get('startTime'), parseNumber),
    body: parseSingularOf(get('body'), parseString),
    endTime: parseSingularOf(get('endTime'), parseNumber),
  }

  return trimObject(segment)
}

export const parseDocument: ParsePartialUtil<Transcripts.Document> = (value) => {
  if (!isObject(value)) {
    return
  }

  const get = createCaseInsensitiveGetter(value)
  const document = {
    version: parseSingularOf(get('version'), parseString),
    segments: parseArrayOf(get('segments'), parseSegment),
  }

  return trimObject(document)
}
