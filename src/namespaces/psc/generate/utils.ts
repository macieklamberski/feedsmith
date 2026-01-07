import type { GenerateUtil } from '../../../common/types.js'
import { generatePlainString, isObject, trimArray, trimObject } from '../../../common/utils.js'
import type { PscNs } from '../common/types.js'

export const generateChapter: GenerateUtil<PscNs.Chapter> = (chapter) => {
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

export const generateChapters: GenerateUtil<Array<PscNs.Chapter>> = (chapters) => {
  const value = {
    'psc:chapter': trimArray(chapters, generateChapter),
  }

  return trimObject(value)
}

export const generateItem: GenerateUtil<PscNs.Item> = (item) => {
  if (!isObject(item)) {
    return
  }

  return trimObject({
    'psc:chapters': generateChapters(item.chapters),
  })
}
