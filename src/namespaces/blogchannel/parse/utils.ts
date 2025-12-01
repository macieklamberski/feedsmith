import type { ParsePartialUtil } from '../../../common/types.js'
import {
  isObject,
  parseSingularOf,
  parseString,
  retrieveText,
  trimObject,
} from '../../../common/utils.js'
import type { BlogChannelNs } from '../common/types.js'

export const retrieveFeed: ParsePartialUtil<BlogChannelNs.Feed> = (value) => {
  if (!isObject(value)) {
    return
  }

  const feed = {
    blogRoll: parseSingularOf(value['blogchannel:blogroll'], (value) =>
      parseString(retrieveText(value)),
    ),
    blink: parseSingularOf(value['blogchannel:blink'], (value) => parseString(retrieveText(value))),
    mySubscriptions: parseSingularOf(value['blogchannel:mysubscriptions'], (value) =>
      parseString(retrieveText(value)),
    ),
  }

  return trimObject(feed)
}
