import type { GenerateUtil } from '../../../common/types.js'
import { generateCdataString, isObject, trimObject } from '../../../common/utils.js'
import type { Feedpress } from '../common/types.js'

export const generateFeed: GenerateUtil<Feedpress.Feed> = (feed) => {
  if (!isObject(feed)) {
    return
  }

  const value = {
    'feedpress:link': generateCdataString(feed.link),
    'feedpress:newsletterId': generateCdataString(feed.newsletterId),
    'feedpress:locale': generateCdataString(feed.locale),
    'feedpress:podcastId': generateCdataString(feed.podcastId),
    'feedpress:cssFile': generateCdataString(feed.cssFile),
  }

  return trimObject(value)
}
