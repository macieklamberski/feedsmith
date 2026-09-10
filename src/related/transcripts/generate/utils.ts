import type { GenerateUtil } from '../../../common/types.js'
import {
  generateNumber,
  generatePlainString,
  isObject,
  trimArray,
  trimObject,
} from '../../../common/utils.js'
import type { Transcripts } from '../common/types.js'

export const generateSegment: GenerateUtil<Transcripts.Segment> = (segment) => {
  if (!isObject(segment)) {
    return
  }

  const value = {
    speaker: generatePlainString(segment.speaker),
    startTime: generateNumber(segment.startTime),
    body: generatePlainString(segment.body),
    endTime: generateNumber(segment.endTime),
  }

  return trimObject(value)
}

export const generateDocument: GenerateUtil<Transcripts.Document> = (document) => {
  if (!isObject(document)) {
    return
  }

  const value = {
    version: '1.0.0',
    segments: trimArray(document.segments, generateSegment),
  }

  return trimObject(value)
}
