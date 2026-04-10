import { XMLParser } from 'fast-xml-parser'
import { Expression } from 'path-expression-matcher'
import {
  namespacePrefixes,
  namespaceStopNodes,
  namespaceUris,
  parserConfig,
} from '../../../common/config.js'
import { createNamespaceNormalizator, expandStopNodes } from '../../../common/utils.js'

// These elements can appear both inside <channel> and as direct children of
// <rss> in malformed feeds, so stop nodes are generated for both paths.
const sharedStopNodes = [
  'image.description',
  'image.height',
  'image.link',
  'image.title',
  'image.url',
  'image.width',
  'textinput.title',
  'textinput.description',
  'textinput.name',
  'textinput.link',
  'item.title',
  'item.link',
  'item.description',
  // INFO: Added support for nested *.name under author to support cases as
  // described here: https://github.com/macieklamberski/feedsmith/issues/22.
  'item.author.name',
  'item.category',
  'item.comments',
  'item.enclosure',
  'item.guid',
  'item.pubdate',
  'item.source',
]

export const stopNodes = [
  ...expandStopNodes(namespaceStopNodes, ['rss.channel', 'rss.channel.item', 'rss', 'rss.item']),
  'rss.channel.title',
  'rss.channel.link',
  'rss.channel.description',
  'rss.channel.language',
  'rss.channel.copyright',
  'rss.channel.managingeditor',
  'rss.channel.webmaster',
  'rss.channel.pubdate',
  'rss.channel.lastbuilddate',
  'rss.channel.category',
  'rss.channel.generator',
  'rss.channel.docs',
  'rss.channel.cloud',
  'rss.channel.ttl',
  'rss.channel.rating',
  'rss.channel.skiphours.hour',
  'rss.channel.skipdays.day',
  ...sharedStopNodes.map((node) => `rss.channel.${node}`),
  ...sharedStopNodes.map((node) => `rss.${node}`),
]

// Pre-construct Expression objects once at module load to avoid re-parsing
// stop node strings on every XMLParser.parse() call.
const stopNodeExpressions = stopNodes.map((node) => new Expression(node))

export const parser = new XMLParser({
  ...parserConfig,
  stopNodes: stopNodeExpressions,
})

export const normalizeNamespaces = createNamespaceNormalizator(namespaceUris, namespacePrefixes)
