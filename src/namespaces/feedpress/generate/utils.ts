import { isPlainObject } from 'trousse'
import type { GenerateUtil } from '../../../common/types.js'
import { generateCdataString, trimObject } from '../../../common/utils.js'
import type { FeedPressNs } from '../common/types.js'

export const generateFeed: GenerateUtil<FeedPressNs.Feed> = (feed) => {
  if (!isPlainObject(feed)) {
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
