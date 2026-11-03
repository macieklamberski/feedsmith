import { isPlainObject, trimObject } from 'trousse'
import type { DateLike, GenerateUtil } from '../../../common/types.js'
import { generateCdataString } from '../../../common/utils.js'
import { generateEntry as generateAtomEntry } from '../../../feeds/atom/generate/utils.js'
import type { ActivityNs } from '../common/types.js'

export const generatePerson: GenerateUtil<ActivityNs.Person> = (person) => {
  if (!isPlainObject(person)) {
    return
  }

  const value = {
    'activity:object-type': generateCdataString(person.objectType),
  }

  return trimObject(value)
}

export const generateItem: GenerateUtil<ActivityNs.Item> = (item) => {
  if (!isPlainObject(item)) {
    return
  }

  const value = {
    'activity:verb': generateCdataString(item.verb),
    'activity:object-type': generateCdataString(item.objectType),
  }

  return trimObject(value)
}

export const generateEntry: GenerateUtil<ActivityNs.Entry<DateLike>> = (entry) => {
  if (!isPlainObject(entry)) {
    return
  }

  const value = {
    'activity:verb': generateCdataString(entry.verb),
    'activity:object-type': generateCdataString(entry.objectType),
    'activity:object': generateAtomEntry(entry.object),
    'activity:target': generateAtomEntry(entry.target),
  }

  return trimObject(value)
}
