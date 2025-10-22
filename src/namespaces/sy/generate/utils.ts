import type { DateLike, GenerateUtil } from '../../../common/types.js'
import {
  generateCdataString,
  generateNumber,
  generateRfc3339Date,
  isObject,
  trimObject,
} from '../../../common/utils.js'
import type { Sy } from '../common/types.js'

export const generateFeed: GenerateUtil<Sy.Feed<DateLike>> = (feed) => {
  if (!isObject(feed)) {
    return
  }

  const value = {
    'sy:updatePeriod': generateCdataString(feed.updatePeriod),
    'sy:updateFrequency': generateNumber(feed.updateFrequency),
    'sy:updateBase': generateRfc3339Date(feed.updateBase),
  }

  return trimObject(value)
}
