import { XMLParser } from 'fast-xml-parser'
import { arrayTags as arrayTagsAtom } from '../atom/common'

export const arrayTags = [
  'item',
  'category',
  'author',
  'hour',
  'day',
  ...arrayTagsAtom.map((tag) => `atom:${tag}`),
]

export const parser = new XMLParser({
  alwaysCreateTextNode: true,
  ignoreAttributes: false,
  attributeNamePrefix: '',
  parseTagValue: false,
  parseAttributeValue: false,
  transformTagName: (tagName) => tagName.toLowerCase(),
  isArray: (name) => arrayTags.includes(name),
})
