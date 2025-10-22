import type { ParsePartialUtil } from '../../../common/types.js'
import {
  isObject,
  parseArrayOf,
  parseSingularOf,
  parseString,
  trimObject,
} from '../../../common/utils.js'
import type { Psc } from '../common/types.js'

export const parseChapter: ParsePartialUtil<Psc.Chapter> = (value) => {
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

export const parseChapters: ParsePartialUtil<Array<Psc.Chapter>> = (value) => {
  return parseArrayOf(value?.['psc:chapter'], parseChapter)
}

export const retrieveItem: ParsePartialUtil<Psc.Item> = (value) => {
  if (!isObject(value)) {
    return
  }

  const item = {
    chapters: parseSingularOf(value['psc:chapters'], parseChapters),
  }

  return trimObject(item)
}
