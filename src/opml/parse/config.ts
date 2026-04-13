import { XMLParser } from 'fast-xml-parser'
import { Expression } from 'path-expression-matcher'
import { parserConfig } from '../../common/config.js'

export const stopNodes = [
  'opml.head.title',
  'opml.head.dateCreated',
  'opml.head.dateModified',
  'opml.head.ownerName',
  'opml.head.ownerEmail',
  'opml.head.ownerId',
  'opml.head.docs',
  'opml.head.expansionState',
  'opml.head.vertScrollState',
  'opml.head.windowTop',
  'opml.head.windowLeft',
  'opml.head.windowBottom',
  'opml.head.windowRight',
  // Not a stop node because it supports recursive nesting that requires parser traversal.
  // '*.outline',
  // Not a stop node because *.X.Y wildcard patterns don't work in fast-xml-parser
  // (the part after *. is matched against a single tag name, not a path).
  // '*.outline.outline',
]

export const parser = new XMLParser({
  ...parserConfig,
  stopNodes: stopNodes.map((node) => new Expression(node)),
})
