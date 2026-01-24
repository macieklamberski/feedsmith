import type { JsonGenerateMain } from '../../../common/types.js'
import type { Transcripts } from '../common/types.js'
import { generateDocument } from './utils.js'

export const generate: JsonGenerateMain<Transcripts.Document, Transcripts.Document<true>> = (
  value,
) => {
  return generateDocument(value as Transcripts.Document)
}
