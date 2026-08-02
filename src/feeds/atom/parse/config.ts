import { XMLParser } from 'fast-xml-parser'
import {
  namespacePrefixes,
  namespaceStopNodes,
  namespaceUris,
  parserConfig,
} from '../../../common/config.js'
import { createNamespaceNormalizator } from '../../../common/utils.js'
import { entryPaths, feedPaths } from '../../../namespaces/atom/common/config.js'

export const stopNodes = [
  ...namespaceStopNodes,
  ...feedPaths.map((path) => `feed.${path}`),
  ...entryPaths.map((path) => `feed.entry.${path}`),
]

export const parser = new XMLParser({
  ...parserConfig,
  stopNodes,
})

export const normalizeNamespaces = createNamespaceNormalizator(namespaceUris, namespacePrefixes, [
  'atom',
])
