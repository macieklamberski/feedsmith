import type { GenerateFunction } from '../../../common/types.js'
import {
  generatePlainString,
  isNonEmptyString,
  isObject,
  trimArray,
  trimObject,
} from '../../../common/utils.js'
import type { Chapter, Item } from '../common/types.js'

export const generateChapter: GenerateFunction<Chapter> = (chapter) => {
  if (!isObject(chapter) || !isNonEmptyString(chapter.start)) {
    return
  }

  const value = {
    '@start': generatePlainString(chapter.start),
    '@title': generatePlainString(chapter.title),
    '@href': generatePlainString(chapter.href),
    '@image': generatePlainString(chapter.image),
  }

  return trimObject(value)
}

export const generateItem: GenerateFunction<Item> = (item) => {
  if (!isObject(item)) {
    return
  }

  const chapters = trimArray(item.chapters, generateChapter)
  if (!chapters || chapters.length === 0) {
    return
  }

  return trimObject({
    'psc:chapters': {
      'psc:chapter': chapters,
    },
  })
}
