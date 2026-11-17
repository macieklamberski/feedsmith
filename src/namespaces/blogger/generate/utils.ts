import { isPlainObject, trimObject } from 'trousse'
import type { GenerateUtil } from '../../../common/types.js'
import { generateBoolean } from '../../../common/utils.js'
import type { BloggerNs } from '../common/types.js'

export const generateFeed: GenerateUtil<BloggerNs.Feed> = (feed) => {
  if (!isPlainObject(feed)) {
    return
  }

  const value = {
    'blogger:adultContent': generateBoolean(feed.adultContent),
  }

  return trimObject(value)
}
