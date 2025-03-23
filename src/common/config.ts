import type { X2jOptions } from 'fast-xml-parser'

export const parserConfig: X2jOptions = {
  trimValues: false,
  processEntities: false,
  htmlEntities: false,
  parseTagValue: false,
  parseAttributeValue: false,
  alwaysCreateTextNode: true,
  ignoreAttributes: false,
  attributeNamePrefix: '@',
  transformTagName: (name) => name.toLowerCase(),
  transformAttributeName: (name) => name.toLowerCase(),
}
