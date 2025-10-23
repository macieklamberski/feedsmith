import type { ParsePartialUtil } from '../../../common/types.js'
import {
  isObject,
  parseSingularOf,
  parseString,
  retrieveText,
  trimObject,
} from '../../../common/utils.js'
import type { CcNs } from '../common/types.js'

export const retrieveItemOrFeed: ParsePartialUtil<CcNs.ItemOrFeed> = (value) => {
  if (!isObject(value)) {
    return
  }

  const result = {
    // Work Properties
    license: parseSingularOf(value['cc:license'], (value) => parseString(retrieveText(value))),
    morePermissions: parseSingularOf(value['cc:morepermissions'], (value) =>
      parseString(retrieveText(value)),
    ),
    attributionName: parseSingularOf(value['cc:attributionname'], (value) =>
      parseString(retrieveText(value)),
    ),
    attributionURL: parseSingularOf(value['cc:attributionurl'], (value) =>
      parseString(retrieveText(value)),
    ),
    useGuidelines: parseSingularOf(value['cc:useguidelines'], (value) =>
      parseString(retrieveText(value)),
    ),

    // License Properties
    permits: parseSingularOf(value['cc:permits'], (value) => parseString(retrieveText(value))),
    requires: parseSingularOf(value['cc:requires'], (value) => parseString(retrieveText(value))),
    prohibits: parseSingularOf(value['cc:prohibits'], (value) => parseString(retrieveText(value))),
    jurisdiction: parseSingularOf(value['cc:jurisdiction'], (value) =>
      parseString(retrieveText(value)),
    ),
    legalcode: parseSingularOf(value['cc:legalcode'], (value) => parseString(retrieveText(value))),
    deprecatedOn: parseSingularOf(value['cc:deprecatedon'], (value) =>
      parseString(retrieveText(value)),
    ),
  }

  return trimObject(result)
}
