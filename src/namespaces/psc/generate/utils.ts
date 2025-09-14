import type { GenerateFunction } from '../../../common/types.js'
import { generatePlainString, isObject, trimArray, trimObject } from '../../../common/utils.js'
import type { Chapter, Item } from '../common/types.js'

export const generateChapter: GenerateFunction<Chapter> = (chapter) => {
  if (!isObject(chapter)) {
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

export const generateChapters: GenerateFunction<Array<Chapter>> = (chapters) => {
  const value = {
    'psc:chapter': trimArray(chapters, generateChapter),
  }

  return trimObject(value)
}

export const generateItem: GenerateFunction<Item> = (item) => {
  if (!isObject(item)) {
    return
  }

  return trimObject({
    'psc:chapters': generateChapters(item.chapters),
  })
}
