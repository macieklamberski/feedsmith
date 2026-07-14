import { isPlainObject } from 'trousse'
import type { GenerateUtil } from '../../../common/types.js'
import { generateCdataString, trimObject } from '../../../common/utils.js'
import type { BlogChannelNs } from '../common/types.js'

export const generateFeed: GenerateUtil<BlogChannelNs.Feed> = (feed) => {
  if (!isPlainObject(feed)) {
    return
  }

  const value = {
    'blogChannel:blogRoll': generateCdataString(feed.blogRoll),
    'blogChannel:blink': generateCdataString(feed.blink),
    'blogChannel:mySubscriptions': generateCdataString(feed.mySubscriptions),
  }

  return trimObject(value)
}
