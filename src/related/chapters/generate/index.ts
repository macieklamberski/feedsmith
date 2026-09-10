import type { GenerateMainJson } from '../../../common/types.js'
import type { Chapters } from '../common/types.js'
import { generateDocument } from './utils.js'

export const generate: GenerateMainJson<Chapters.Document, Chapters.Document<true>> = (value) => {
  return generateDocument(value as Chapters.Document)
}
