import type { ParsePartialUtil } from '../../../common/types.js'
import {
  isObject,
  parseArrayOf,
  parseSingularOf,
  parseString,
  trimObject,
} from '../../../common/utils.js'
import type { PscNs } from '../common/types.js'

export const parseChapter: ParsePartialUtil<PscNs.Chapter> = (value) => {
  if (!isObject(value)) {
    return
  }

  const chapter = {
    start: parseSingularOf(value['@start'], parseString),
    title: parseSingularOf(value['@title'], parseString),
    href: parseSingularOf(value['@href'], parseString),
    image: parseSingularOf(value['@image'], parseString),
  }

  return trimObject(chapter)
}

export const parseChapters: ParsePartialUtil<Array<PscNs.Chapter>> = (value) => {
  return parseArrayOf(value?.['psc:chapter'], parseChapter)
}

export const retrieveItem: ParsePartialUtil<PscNs.Item> = (value) => {
  if (!isObject(value)) {
    return
  }

  const item = {
    chapters: parseSingularOf(value['psc:chapters'], parseChapters),
  }

  return trimObject(item)
}
