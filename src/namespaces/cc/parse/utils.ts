import type { ParsePartialUtil, Unreliable } from '../../../common/types.js'
import {
  isObject,
  parseSingularOf,
  parseString,
  retrieveText,
  trimObject,
} from '../../../common/utils.js'
import type { CcNs } from '../common/types.js'

export const retrieveValue = (value: Unreliable): string | undefined => {
  if (isObject(value)) {
    const resource = parseString(value['@rdf:resource'])

    if (resource) {
      return resource
    }
  }

  return parseString(retrieveText(value))
}

export const retrieveItemOrFeed: ParsePartialUtil<CcNs.ItemOrFeed> = (value) => {
  if (!isObject(value)) {
    return
  }

  const result = {
    license: parseSingularOf(value['cc:license'], retrieveValue),
    morePermissions: parseSingularOf(value['cc:morepermissions'], retrieveValue),
    attributionName: parseSingularOf(value['cc:attributionname'], retrieveValue),
    attributionURL: parseSingularOf(value['cc:attributionurl'], retrieveValue),
    useGuidelines: parseSingularOf(value['cc:useguidelines'], retrieveValue),
    permits: parseSingularOf(value['cc:permits'], retrieveValue),
    requires: parseSingularOf(value['cc:requires'], retrieveValue),
    prohibits: parseSingularOf(value['cc:prohibits'], retrieveValue),
    jurisdiction: parseSingularOf(value['cc:jurisdiction'], retrieveValue),
    legalcode: parseSingularOf(value['cc:legalcode'], retrieveValue),
    deprecatedOn: parseSingularOf(value['cc:deprecatedon'], retrieveValue),
  }

  return trimObject(result)
}
