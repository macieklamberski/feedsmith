import type { GenerateUtil } from '../../../common/types.js'
import { generatePlainString, isObject, trimArray, trimObject } from '../../../common/utils.js'
import type { RdfNs } from '../common/types.js'

export const generateAbout: GenerateUtil<RdfNs.About> = (about) => {
  if (!isObject(about)) {
    return
  }

  const value = {
    '@rdf:about': generatePlainString(about.about),
  }

  return trimObject(value)
}

/** @internal General RDF element kept for potential future use when all RDF data is needed. */
export const generateElement: GenerateUtil<RdfNs.Element> = (element) => {
  if (!isObject(element)) {
    return
  }

  const type = generatePlainString(element.type)
  const value = {
    '@rdf:about': generatePlainString(element.about),
    '@rdf:resource': generatePlainString(element.resource),
    '@rdf:ID': generatePlainString(element.id),
    '@rdf:nodeID': generatePlainString(element.nodeId),
    '@rdf:parseType': generatePlainString(element.parseType),
    '@rdf:datatype': generatePlainString(element.datatype),
    'rdf:type': trimObject({ '@rdf:resource': type }),
    'rdf:value': trimArray(element.value),
  }

  return trimObject(value)
}
