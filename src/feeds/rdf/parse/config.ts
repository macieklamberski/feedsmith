import { XMLParser } from 'fast-xml-parser'
import {
  namespaceContainers,
  namespacePrefixes,
  namespaceStopNodes,
  namespaceUris,
  parserConfig,
} from '../../../common/config.js'
import { createNamespaceNormalizator, createStopNodeExpressions } from '../../../common/utils.js'

const feedStopNodes = [
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

const stopNodeExpressions = createStopNodeExpressions(
  namespaceStopNodes,
  feedStopNodes,
  ['rdf:rdf.channel', 'rdf:rdf.item', 'rdf:rdf.image', 'rdf:rdf.textinput'],
  namespaceContainers,
)

export const parser = new XMLParser({
  ...parserConfig,
  stopNodes: stopNodeExpressions,
})

export const normalizeNamespaces = createNamespaceNormalizator(namespaceUris, namespacePrefixes, [
  'rdf',
  'rss',
])
