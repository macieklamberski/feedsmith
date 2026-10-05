import { isPlainObject, trimObject } from 'trousse'
import type { GenerateUtil } from '../../../common/types.js'
import { generateCdataString, generateYesNoBoolean } from '../../../common/utils.js'
import type { CastboxNs } from '../common/types.js'

export const generateFeed: GenerateUtil<CastboxNs.Feed> = (feed) => {
  if (!isPlainObject(feed)) {
    return
  }

  const value = {
    'castbox:uid': generateCdataString(feed.uid),
    'castbox:pid': generateCdataString(feed.pid),
    'castbox:type': generateCdataString(feed.type),
  }

  return trimObject(value)
}

export const generateItem: GenerateUtil<CastboxNs.Item> = (item) => {
  if (!isPlainObject(item)) {
    return
  }

  const value = {
    'castbox:tid': generateCdataString(item.tid),
    'castbox:episode_premium': generateYesNoBoolean(item.episodePremium),
  }

  return trimObject(value)
}
