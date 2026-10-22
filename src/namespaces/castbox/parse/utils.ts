import { isPlainObject, trimObject } from 'trousse'
import type { ParseUtilPartial } from '../../../common/types.js'
import {
  parseSingularOf,
  parseString,
  parseYesNoBoolean,
  retrieveText,
} from '../../../common/utils.js'
import type { CastboxNs } from '../common/types.js'

export const retrieveFeed: ParseUtilPartial<CastboxNs.Feed> = (value) => {
  if (!isPlainObject(value)) {
    return
  }

  const feed = {
    uid: parseSingularOf(value['castbox:uid'], (value) => parseString(retrieveText(value))),
    pid: parseSingularOf(value['castbox:pid'], (value) => parseString(retrieveText(value))),
    type: parseSingularOf(value['castbox:type'], (value) => parseString(retrieveText(value))),
  }

  return trimObject(feed)
}

export const retrieveItem: ParseUtilPartial<CastboxNs.Item> = (value) => {
  if (!isPlainObject(value)) {
    return
  }

  const item = {
    tid: parseSingularOf(value['castbox:tid'], (value) => parseString(retrieveText(value))),
    episodePremium: parseSingularOf(value['castbox:episode_premium'], (value) =>
      parseYesNoBoolean(retrieveText(value)),
    ),
  }

  return trimObject(item)
}
