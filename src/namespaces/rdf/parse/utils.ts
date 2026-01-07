import type { ParsePartialUtil } from '../../../common/types.js'
import {
  isObject,
  parseArrayOf,
  parseSingularOf,
  parseString,
  retrieveRdfResourceOrText,
  retrieveText,
  trimObject,
} from '../../../common/utils.js'
import type { RdfNs } from '../common/types.js'

export const retrieveAbout: ParsePartialUtil<RdfNs.About> = (value) => {
  if (!isObject(value)) {
    return
  }

  const about = {
    about: parseString(value['@about']) ?? parseString(value['@rdf:about']),
  }

  return trimObject(about)
}

/** @internal General RDF element kept for potential future use when all RDF data is needed. */
export const retrieveElement: ParsePartialUtil<RdfNs.Element> = (value) => {
  if (!isObject(value)) {
    return
  }

  const element = {
    about: parseString(value['@about']) ?? parseString(value['@rdf:about']),
    resource: parseString(value['@resource']) ?? parseString(value['@rdf:resource']),
    id: parseString(value['@id']) ?? parseString(value['@rdf:id']),
    nodeId: parseString(value['@nodeid']) ?? parseString(value['@rdf:nodeid']),
    parseType: parseString(value['@parsetype']) ?? parseString(value['@rdf:parsetype']),
    datatype: parseString(value['@datatype']) ?? parseString(value['@rdf:datatype']),
    type: parseSingularOf(value.type ?? value['rdf:type'], (value) =>
      retrieveRdfResourceOrText(value, parseString),
    ),
    value: parseArrayOf(value.value ?? value['rdf:value'], (value) => retrieveText(value)),
  }

  return trimObject(element)
}
