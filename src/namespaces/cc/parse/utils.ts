import type { ParsePartialUtil } from '../../../common/types.js'
import {
  isObject,
  parseSingularOf,
  parseString,
  retrieveRdfResourceOrText,
  trimObject,
} from '../../../common/utils.js'
import type { CcNs } from '../common/types.js'

export const retrieveItemOrFeed: ParsePartialUtil<CcNs.ItemOrFeed> = (value) => {
  if (!isObject(value)) {
    return
  }

  const result = {
    license: parseSingularOf(value['cc:license'], (value) =>
      retrieveRdfResourceOrText(value, parseString),
    ),
    morePermissions: parseSingularOf(value['cc:morepermissions'], (value) =>
      retrieveRdfResourceOrText(value, parseString),
    ),
    attributionName: parseSingularOf(value['cc:attributionname'], (value) =>
      retrieveRdfResourceOrText(value, parseString),
    ),
    attributionURL: parseSingularOf(value['cc:attributionurl'], (value) =>
      retrieveRdfResourceOrText(value, parseString),
    ),
    useGuidelines: parseSingularOf(value['cc:useguidelines'], (value) =>
      retrieveRdfResourceOrText(value, parseString),
    ),
    permits: parseSingularOf(value['cc:permits'], (value) =>
      retrieveRdfResourceOrText(value, parseString),
    ),
    requires: parseSingularOf(value['cc:requires'], (value) =>
      retrieveRdfResourceOrText(value, parseString),
    ),
    prohibits: parseSingularOf(value['cc:prohibits'], (value) =>
      retrieveRdfResourceOrText(value, parseString),
    ),
    jurisdiction: parseSingularOf(value['cc:jurisdiction'], (value) =>
      retrieveRdfResourceOrText(value, parseString),
    ),
    legalcode: parseSingularOf(value['cc:legalcode'], (value) =>
      retrieveRdfResourceOrText(value, parseString),
    ),
    deprecatedOn: parseSingularOf(value['cc:deprecatedon'], (value) =>
      retrieveRdfResourceOrText(value, parseString),
    ),
  }

  return trimObject(result)
}
