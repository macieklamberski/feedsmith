import { isPlainObject, trimObject } from 'trousse'
import type { ParseUtilPartial } from '../../../common/types.js'
import { parseSingularOf, parseString, retrieveRdfResourceOrText } from '../../../common/utils.js'
import type { AnnotateNs } from '../common/types.js'

export const retrieveItem: ParseUtilPartial<AnnotateNs.Item> = (value) => {
  if (!isPlainObject(value)) {
    return
  }

  const item = {
    reference: parseSingularOf(value['annotate:reference'], (value) =>
      retrieveRdfResourceOrText(value, parseString),
    ),
  }

  return trimObject(item)
}
