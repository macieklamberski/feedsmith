import { XMLParser } from 'fast-xml-parser'
import { Expression } from 'path-expression-matcher'
import {
  namespacePrefixes,
  namespaceStopNodes,
  namespaceUris,
  parserConfig,
} from '../../../common/config.js'
import { createNamespaceNormalizator, expandStopNodes } from '../../../common/utils.js'

export const stopNodes = [
  ...expandStopNodes(namespaceStopNodes, [
    'rdf:rdf.channel',
    'rdf:rdf.item',
    'rdf:rdf.image',
    'rdf:rdf.textinput',
  ]),
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

// Pre-construct Expression objects once at module load to avoid re-parsing
// stop node strings on every XMLParser.parse() call.
const stopNodeExpressions = stopNodes.map((node) => new Expression(node))

export const parser = new XMLParser({
  ...parserConfig,
  stopNodes: stopNodeExpressions,
})

export const normalizeNamespaces = createNamespaceNormalizator(namespaceUris, namespacePrefixes, [
  'rdf',
  'rss',
])
