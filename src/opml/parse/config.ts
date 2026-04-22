import { XMLParser } from 'fast-xml-parser'
import { parserConfig } from '../../common/config.js'

export const stopNodes = [
  'opml.head.title',
  'opml.head.datecreated',
  'opml.head.datemodified',
  'opml.head.ownername',
  'opml.head.owneremail',
  'opml.head.ownerid',
  'opml.head.docs',
  'opml.head.expansionstate',
  'opml.head.vertscrollstate',
  'opml.head.windowtop',
  'opml.head.windowleft',
  'opml.head.windowbottom',
  'opml.head.windowright',
  // Not a stop node because it supports recursive nesting that requires parser traversal.
  // '*.outline',
  // Not a stop node because *.X.Y wildcard patterns don't work in fast-xml-parser
  // (the part after *. is matched against a single tag name, not a path).
  // '*.outline.outline',
]

export const parser = new XMLParser({
  ...parserConfig,
  stopNodes,
})
