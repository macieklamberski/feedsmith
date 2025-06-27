import type { GenerateFunction } from '../../../common/types.js'
import { generateString, isObject, trimObject } from '../../../common/utils.js'
import type { Feed, Item } from '../common/types.js'

export const generateItem: GenerateFunction<Item> = (item) => {
  if (!isObject(item)) {
    return
  }

  const value = {
    'yt:videoId': generateString(item.videoId),
    'yt:channelId': generateString(item.channelId),
  }

  return trimObject(value)
}

export const generateFeed: GenerateFunction<Feed> = (feed) => {
  if (!isObject(feed)) {
    return
  }

  const value = {
    'yt:channelId': generateString(feed.channelId),
    'yt:playlistId': generateString(feed.playlistId),
  }

  return trimObject(value)
}
