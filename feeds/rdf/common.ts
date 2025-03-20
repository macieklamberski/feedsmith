import { XMLParser } from 'fast-xml-parser'

export const stopNodes = [
  // TODO: What about the namespaces?
  'rdf:rdf.channel.title',
  'rdf:rdf.channel.link',
  'rdf:rdf.channel.description',
  'rdf:rdf.image.title',
  'rdf:rdf.image.link',
  'rdf:rdf.image.url',
  'rdf:rdf.item.title',
  'rdf:rdf.item.link',
  'rdf:rdf.item.description',
  'rdf:rdf.textinput.title',
  'rdf:rdf.textinput.description',
  'rdf:rdf.textinput.name',
  'rdf:rdf.textinput.link',
]

export const parser = new XMLParser({
  processEntities: false,
  alwaysCreateTextNode: true,
  ignoreAttributes: false,
  attributeNamePrefix: '@',
  parseTagValue: false,
  parseAttributeValue: false,
  stopNodes,
  transformTagName: (name) => name.toLowerCase(),
  transformAttributeName: (name) => name.toLowerCase(),
})
