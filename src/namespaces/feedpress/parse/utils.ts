import type { ParsePartialUtil } from '../../../common/types.js'
import {
  isObject,
  parseSingularOf,
  parseString,
  retrieveText,
  trimObject,
} from '../../../common/utils.js'
import type { FeedpressNs } from '../common/types.js'

export const retrieveFeed: ParsePartialUtil<FeedpressNs.Feed> = (value) => {
  if (!isObject(value)) {
    return
  }

  const feed = {
    link: parseSingularOf(value['feedpress:link'], (value) => parseString(retrieveText(value))),
    newsletterId: parseSingularOf(value['feedpress:newsletterid'], (value) =>
      parseString(retrieveText(value)),
    ),
    locale: parseSingularOf(value['feedpress:locale'], (value) => parseString(retrieveText(value))),
    podcastId: parseSingularOf(value['feedpress:podcastid'], (value) =>
      parseString(retrieveText(value)),
    ),
    cssFile: parseSingularOf(value['feedpress:cssfile'], (value) =>
      parseString(retrieveText(value)),
    ),
  }

  return trimObject(feed)
}
