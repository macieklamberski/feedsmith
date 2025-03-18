import { XMLParser } from 'fast-xml-parser'

export const arrayTags = ['link', 'author', 'contributor', 'category']

export const stopNodes = ['feed.entry.content']

export const parser = new XMLParser({
  alwaysCreateTextNode: true,
  ignoreAttributes: false,
  attributeNamePrefix: '@',
  parseTagValue: false,
  parseAttributeValue: false,
  stopNodes,
  transformTagName: (name) => name.toLowerCase(),
  transformAttributeName: (name) => name.toLowerCase(),
  isArray: (name) => arrayTags.includes(name),
})
