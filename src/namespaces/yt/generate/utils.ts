import type { GenerateUtil } from '../../../common/types.js'
import { generateCdataString, isObject, trimObject } from '../../../common/utils.js'
import type { YtNs } from '../common/types.js'

export const generateItem: GenerateUtil<YtNs.Item> = (item) => {
  if (!isObject(item)) {
    return
  }

  const value = {
    'yt:videoId': generateCdataString(item.videoId),
    'yt:channelId': generateCdataString(item.channelId),
  }

  return trimObject(value)
}

export const generateFeed: GenerateUtil<YtNs.Feed> = (feed) => {
  if (!isObject(feed)) {
    return
  }

  const value = {
    'yt:channelId': generateCdataString(feed.channelId),
    'yt:playlistId': generateCdataString(feed.playlistId),
  }

  return trimObject(value)
}
