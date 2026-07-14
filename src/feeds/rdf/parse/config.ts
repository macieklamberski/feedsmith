import { XMLParser } from 'fast-xml-parser'
import {
  namespacePrefixes,
  namespaceStopNodes,
  namespaceUris,
  parserConfig,
} from '../../../common/config.js'
import { createNamespaceNormalizator } from '../../../common/utils.js'

export const stopNodes = [
  ...namespaceStopNodes,
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
  ...parserConfig,
  stopNodes,
})

export const normalizeNamespaces = createNamespaceNormalizator(namespaceUris, namespacePrefixes, [
  'rdf',
  'rss',
])
