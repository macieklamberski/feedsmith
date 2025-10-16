import type { ParsePartialUtil } from '../../../common/types.js'
import {
  isObject,
  parseSingularOf,
  parseString,
  retrieveText,
  trimObject,
} from '../../../common/utils.js'
import type { Feed } from '../common/types.js'

export const retrieveFeed: ParsePartialUtil<Feed> = (value) => {
  if (!isObject(value)) {
    return
  }

  const feed = {
    limit: parseSingularOf(value['spotify:limit'], (value) => parseString(retrieveText(value))),
    countryOfOrigin: parseSingularOf(value['spotify:countryoforigin'], (value) =>
      parseString(retrieveText(value)),
    ),
  }

  return trimObject(feed)
}
