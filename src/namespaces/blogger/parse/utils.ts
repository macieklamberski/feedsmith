import { isPlainObject, trimObject } from 'trousse'
import type { ParseUtilPartial } from '../../../common/types.js'
import { parseBoolean, parseSingularOf, retrieveText } from '../../../common/utils.js'
import type { BloggerNs } from '../common/types.js'

export const retrieveFeed: ParseUtilPartial<BloggerNs.Feed> = (value) => {
  if (!isPlainObject(value)) {
    return
  }

  const feed = {
    adultContent: parseSingularOf(value['blogger:adultcontent'], (value) => {
      return parseBoolean(retrieveText(value))
    }),
  }

  return trimObject(feed)
}
