import { isPlainObject } from 'trousse'
import type { GenerateUtil } from '../../../common/types.js'
import { generatePlainString, generateRdfResource, trimObject } from '../../../common/utils.js'
import type { AdminNs } from '../common/types.js'

export const generateFeed: GenerateUtil<AdminNs.Feed> = (feed) => {
  if (!isPlainObject(feed)) {
    return
  }

  const value = {
    'admin:errorReportsTo': generateRdfResource(feed.errorReportsTo, generatePlainString),
    'admin:generatorAgent': generateRdfResource(feed.generatorAgent, generatePlainString),
  }

  return trimObject(value)
}
