import { isPlainObject, trimObject } from 'trousse'
import type { DateAny, ParseUtilPartial } from '../../../common/types.js'
import { parseSingularOf, parseString, retrieveText } from '../../../common/utils.js'
import type { ParseUtilPartial as AtomParseUtilPartial } from '../../../feeds/atom/common/types.js'
import { parseEntry as parseAtomEntry } from '../../../feeds/atom/parse/utils.js'
import type { ActivityNs } from '../common/types.js'

export const retrievePerson: ParseUtilPartial<ActivityNs.Person> = (value) => {
  if (!isPlainObject(value)) {
    return
  }

  const person = {
    objectType: parseSingularOf(value['activity:object-type'], (value) =>
      parseString(retrieveText(value)),
    ),
  }

  return trimObject(person)
}

export const retrieveItem: ParseUtilPartial<ActivityNs.Item> = (value) => {
  if (!isPlainObject(value)) {
    return
  }

  const item = {
    verb: parseSingularOf(value['activity:verb'], (value) => parseString(retrieveText(value))),
    objectType: parseSingularOf(value['activity:object-type'], (value) =>
      parseString(retrieveText(value)),
    ),
  }

  return trimObject(item)
}

export const retrieveEntry: AtomParseUtilPartial<ActivityNs.Entry<DateAny>> = (value, options) => {
  if (!isPlainObject(value)) {
    return
  }

  const entry = {
    verb: parseSingularOf(value['activity:verb'], (value) => parseString(retrieveText(value))),
    objectType: parseSingularOf(value['activity:object-type'], (value) =>
      parseString(retrieveText(value)),
    ),
    object: parseSingularOf(value['activity:object'], (value) => parseAtomEntry(value, options)),
    target: parseSingularOf(value['activity:target'], (value) => parseAtomEntry(value, options)),
  }

  return trimObject(entry)
}
