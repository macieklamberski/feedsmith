import type { ParseUtilPartial } from '../../../common/types.js'
import {
  isObject,
  parseSingularOf,
  parseString,
  retrieveText,
  trimObject,
} from '../../../common/utils.js'
import type { YtNs } from '../common/types.js'

export const retrieveItem: ParseUtilPartial<YtNs.Item> = (value) => {
  if (!isObject(value)) {
    return
  }

  const item = {
    videoId: parseSingularOf(value['yt:videoid'], (value) => parseString(retrieveText(value))),
    channelId: parseSingularOf(value['yt:channelid'], (value) => parseString(retrieveText(value))),
  }

  return trimObject(item)
}

export const retrieveFeed: ParseUtilPartial<YtNs.Feed> = (value) => {
  if (!isObject(value)) {
    return
  }

  const feed = {
    channelId: parseSingularOf(value['yt:channelid'], (value) => parseString(retrieveText(value))),
    playlistId: parseSingularOf(value['yt:playlistid'], (value) =>
      parseString(retrieveText(value)),
    ),
  }

  return trimObject(feed)
}
