import type { GenerateUtil } from '../../../common/types.js'
import { generateCdataString, isObject, trimObject } from '../../../common/utils.js'
import type { CcNs } from '../common/types.js'

export const generateItemOrFeed: GenerateUtil<CcNs.ItemOrFeed> = (data) => {
  if (!isObject(data)) {
    return
  }

  const value = {
    // Work Properties
    'cc:license': generateCdataString(data.license),
    'cc:morePermissions': generateCdataString(data.morePermissions),
    'cc:attributionName': generateCdataString(data.attributionName),
    'cc:attributionURL': generateCdataString(data.attributionURL),
    'cc:useGuidelines': generateCdataString(data.useGuidelines),

    // License Properties
    'cc:permits': generateCdataString(data.permits),
    'cc:requires': generateCdataString(data.requires),
    'cc:prohibits': generateCdataString(data.prohibits),
    'cc:jurisdiction': generateCdataString(data.jurisdiction),
    'cc:legalcode': generateCdataString(data.legalcode),
    'cc:deprecatedOn': generateCdataString(data.deprecatedOn),
  }

  return trimObject(value)
}
