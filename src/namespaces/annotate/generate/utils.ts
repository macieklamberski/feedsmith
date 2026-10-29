import { isPlainObject, trimObject } from 'trousse'
import type { GenerateUtil } from '../../../common/types.js'
import { generatePlainString, generateRdfResource } from '../../../common/utils.js'
import type { AnnotateNs } from '../common/types.js'

export const generateItem: GenerateUtil<AnnotateNs.Item> = (item) => {
  if (!isPlainObject(item)) {
    return
  }

  const value = {
    'annotate:reference': generateRdfResource(item.reference, generatePlainString),
  }

  return trimObject(value)
}
