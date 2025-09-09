import type { ParsePartialFunction } from '../../../common/types.js'
import {
  isObject,
  parseArrayOf,
  parseSingularOf,
  parseString,
  retrieveText,
  trimObject,
} from '../../../common/utils.js'
import type { Chapter, Item } from '../common/types.js'

export const parseChapter: ParsePartialFunction<Chapter> = (value) => {
  if (!isObject(value)) {
    return
  }

  const chapter = {
    start: parseString(value['@start']),
    title: parseSingularOf(value['@title'], (value) => parseString(value)),
    href: parseSingularOf(value['@href'], (value) => parseString(value)),
    image: parseSingularOf(value['@image'], (value) => parseString(value)),
  }

  if (!chapter.start) {
    return
  }

  return trimObject(chapter)
}

export const retrieveItem: ParsePartialFunction<Item> = (value) => {
  if (!isObject(value)) {
    return
  }

  const item = {
    chapters: parseSingularOf(value['psc:chapters'], (chapters) => {
      if (!isObject(chapters)) {
        return
      }

      return parseArrayOf(chapters['psc:chapter'], parseChapter)
    }),
  }

  return trimObject(item)
}
