import type { ParsePartialUtil, Unreliable } from '../../../common/types.js'
import {
  isNonEmptyString,
  isObject,
  parseSingularOf,
  parseString,
  retrieveText,
  trimObject,
} from '../../../common/utils.js'
import type { CcNs } from '../common/types.js'

/**
 * Retrieves value from either rdf:resource attribute or element text content.
 * Supports both RDF pattern (<cc:license rdf:resource="..."/>) and
 * simple pattern (<cc:license>...</cc:license>).
 */
export const retrieveValue = (value: Unreliable): string | undefined => {
  // Try parsing as direct string value first (handles simple element content)
  const directString = parseString(value)
  if (directString) {
    return directString
  }

  // Not a direct string, check if it's an object with attributes or text nodes
  if (!isObject(value)) {
    return
  }

  // Check for rdf:resource attribute (RDF/RSS 1.0 pattern)
  const resource = value['@rdf:resource']
  if (isNonEmptyString(resource)) {
    return resource
  }

  // Fall back to extracting text content (handles #text nodes, CDATA, etc.)
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
