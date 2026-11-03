import { isPlainObject, trimObject } from 'trousse'
import type { GenerateUtil } from '../../../common/types.js'
import { generatePlainString, trimArray } from '../../../common/utils.js'
import type { PscNs } from '../common/types.js'

export const generateChapter: GenerateUtil<PscNs.Chapter> = (chapter) => {
  if (!isPlainObject(chapter)) {
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

export const generateChapters: GenerateUtil<PscNs.Chapters> = (chapters) => {
  if (!isPlainObject(chapters)) {
    return
  }

  const value = {
    '@version': generatePlainString(chapters.version),
    'psc:chapter': trimArray(chapters.items, generateChapter),
  }

  return trimObject(value)
}

export const generateItem: GenerateUtil<PscNs.Item> = (item) => {
  if (!isPlainObject(item)) {
    return
  }

  return trimObject({
    'psc:chapters': generateChapters(item.chapters),
  })
}
