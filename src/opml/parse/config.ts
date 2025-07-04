import { parserConfig as baseParserConfig } from '../../common/config.js'

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
  '*.outline.outline',
]

export const parserConfig = { ...baseParserConfig, stopNodes }
