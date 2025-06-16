import type { GenerateFunction } from '../../../common/types.js'
import { generateRfc3339Date, isObject, trimObject } from '../../../common/utils.js'
import type { Feed } from '../common/types.js'

export const generateFeed: GenerateFunction<Feed<Date>> = (feed) => {
  if (!isObject(feed)) {
    return
  }

  return trimObject({
    'sy:updatePeriod': feed.updatePeriod,
    'sy:updateFrequency': feed.updateFrequency,
    'sy:updateBase': generateRfc3339Date(feed.updateBase),
  })
}
