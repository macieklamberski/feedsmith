import { XMLParser } from 'fast-xml-parser'
import { parserConfig } from '../../../common/config.js'

export const stopNodes = [
  'rss.channel.title',
  'rss.channel.link',
  'rss.channel.description',
  'rss.channel.language',
  'rss.channel.copyright',
  'rss.channel.managingeditor',
  'rss.channel.webmaster',
  'rss.channel.pubdate',
  'rss.channel.lastbuilddate',
  'rss.channel.author',
  'rss.channel.category',
  'rss.channel.generator',
  'rss.channel.docs',
  'rss.channel.cloud',
  'rss.channel.ttl',
  'rss.channel.image.description',
  'rss.channel.image.height',
  'rss.channel.image.link',
  'rss.channel.image.title',
  'rss.channel.image.url',
  'rss.channel.image.width',
  'rss.channel.rating',
  'rss.channel.textinput.title',
  'rss.channel.textinput.description',
  'rss.channel.textinput.name',
  'rss.channel.textinput.link',
  'rss.channel.skiphours.hour',
  'rss.channel.skipdays.day',
  'rss.channel.item.title',
  'rss.channel.item.link',
  'rss.channel.item.description',
  // INFO: Added support for nested *.name under author to support cases as
  // described here: https://github.com/macieklamberski/feedsmith/issues/22.
  'rss.channel.item.author.name',
  'rss.channel.item.category',
  'rss.channel.item.comments',
  'rss.channel.item.enclosure',
  'rss.channel.item.guid',
  'rss.channel.item.pubdate',
  'rss.channel.item.source',
  // TODO: What about the namespaces?
]

export const parser = new XMLParser({
  ...parserConfig,
  stopNodes,
})
