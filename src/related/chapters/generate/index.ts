import type { JsonGenerateMain } from '../../../common/types.js'
import type { Chapters } from '../common/types.js'
import { generateDocument } from './utils.js'

export const generate: JsonGenerateMain<Chapters.Document, Chapters.Document<true>> = (value) => {
  return generateDocument(value as Chapters.Document)
}
