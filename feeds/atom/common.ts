import { XMLParser } from 'fast-xml-parser'

export const arrayTags = ['link', 'author', 'contributor', 'category']

export const parser = new XMLParser({
  alwaysCreateTextNode: true,
  ignoreAttributes: false,
  attributeNamePrefix: '@',
  parseTagValue: false,
  parseAttributeValue: false,
  transformTagName: (name) => name.toLowerCase(),
  transformAttributeName: (name) => name.toLowerCase(),
  isArray: (name) => arrayTags.includes(name),
})
