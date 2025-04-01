import { XMLParser } from 'fast-xml-parser'
import { parserConfig } from '../../../common/config.js'

export const stopNodes = [
  // TODO: What about the namespaces?
  'feed.author.name',
  'feed.author.uri',
  'feed.author.url', // Atom 0.3.
  'feed.author.email',
  'feed.category',
  'feed.contributor.name',
  'feed.contributor.uri',
  'feed.contributor.url', // Atom 0.3.
  'feed.contributor.email',
  'feed.generator',
  'feed.icon',
  'feed.id',
  'feed.link',
  'feed.logo',
  'feed.rights',
  'feed.subtitle',
  'feed.tagline', // Atom 0.3.
  'feed.title',
  'feed.updated',
  'feed.modified', // Atom 0.3.
  'feed.entry.author.name',
  'feed.entry.author.uri',
  'feed.entry.author.url', // Atom 0.3.
  'feed.entry.author.email',
  'feed.entry.category',
  'feed.entry.content',
  'feed.entry.contributor.name',
  'feed.entry.contributor.uri',
  'feed.entry.contributor.url', // Atom 0.3.
  'feed.entry.contributor.email',
  'feed.entry.id',
  'feed.entry.link',
  'feed.entry.published',
  'feed.entry.issued', // Atom 0.3.
  'feed.entry.created', // Atom 0.3.
  'feed.entry.rights',
  'feed.entry.source.author.name',
  'feed.entry.source.author.uri',
  'feed.entry.source.author.url', // Atom 0.3.
  'feed.entry.source.author.email',
  'feed.entry.source.category',
  'feed.entry.source.contributor.name',
  'feed.entry.source.contributor.uri',
  'feed.entry.source.contributor.url', // Atom 0.3.
  'feed.entry.source.contributor.email',
  'feed.entry.source.generator',
  'feed.entry.source.icon',
  'feed.entry.source.id',
  'feed.entry.source.link',
  'feed.entry.source.logo',
  'feed.entry.source.rights',
  'feed.entry.source.subtitle',
  'feed.entry.source.title,',
  'feed.entry.source.updated',
  'feed.entry.source.modified', // Atom 0.3.
  'feed.entry.summary',
  'feed.entry.title',
  'feed.entry.updated',
  'feed.entry.modified', // Atom 0.3.
]

export const parser = new XMLParser({
  ...parserConfig,
  stopNodes,
})
