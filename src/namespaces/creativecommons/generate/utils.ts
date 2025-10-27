import type { GenerateUtil } from '../../../common/types.js'
import { generateCdataString, isObject, trimObject } from '../../../common/utils.js'
import type { CreativecommonsNs } from '../common/types.js'

export const generateFeed: GenerateUtil<CreativecommonsNs.Feed> = (feed) => {
  if (!isObject(feed)) {
    return
  }

  const value = {
    'creativeCommons:license': generateCdataString(feed.license),
  }

  return trimObject(value)
}
