import type { GenerateUtil } from '../../../common/types.js'
import { generateCdataString, isObject, trimObject } from '../../../common/utils.js'
import type { BlogChannelNs } from '../common/types.js'

export const generateFeed: GenerateUtil<BlogChannelNs.Feed> = (feed) => {
  if (!isObject(feed)) {
    return
  }

  const value = {
    'blogChannel:blogRoll': generateCdataString(feed.blogRoll),
    'blogChannel:blink': generateCdataString(feed.blink),
    'blogChannel:mySubscriptions': generateCdataString(feed.mySubscriptions),
  }

  return trimObject(value)
}
