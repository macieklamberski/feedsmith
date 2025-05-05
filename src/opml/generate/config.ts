import { XMLBuilder } from 'fast-xml-parser'

export const builder = new XMLBuilder({
  processEntities: true,
  ignoreAttributes: false,
  suppressEmptyNode: true,
  suppressBooleanAttributes: false,
  attributeNamePrefix: '@',
  format: true,
})
