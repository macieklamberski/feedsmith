import type { X2jOptions, XmlBuilderOptions } from 'fast-xml-parser'

export const parserConfig: X2jOptions = {
  trimValues: false,
  processEntities: false,
  htmlEntities: false,
  parseTagValue: false,
  parseAttributeValue: false,
  alwaysCreateTextNode: false,
  ignoreAttributes: false,
  ignorePiTags: true,
  ignoreDeclaration: true,
  attributeNamePrefix: '@',
  transformTagName: (name) => name.toLowerCase(),
  transformAttributeName: (name) => name.toLowerCase(),
}

export const builderConfig: XmlBuilderOptions = {
  processEntities: true,
  ignoreAttributes: false,
  suppressEmptyNode: true,
  suppressBooleanAttributes: false,
  attributeNamePrefix: '@',
  format: true,
  cdataPropName: '#cdata',
}

export const locales = {
  unrecognizedFeedFormat: 'Unrecognized feed format',
  invalidFeedFormat: 'Invalid feed format',
  invalidOpmlFormat: 'Invalid OPML format',
  invalidInputOpml: 'Invalid input OPML',
  invalidInputAtom: 'Invalid input Atom',
  invalidInputRss: 'Invalid input RSS',
}

export const namespaceUris = {
  atom: [
    'http://www.w3.org/2005/Atom', // Official URI.
    'https://www.w3.org/2005/Atom',
    'http://www.w3.org/2005/Atom/',
    'https://www.w3.org/2005/Atom/',
  ],
  dc: [
    'http://purl.org/dc/elements/1.1/', // Official URI.
    'https://purl.org/dc/elements/1.1/',
    'http://purl.org/dc/elements/1.1',
    'https://purl.org/dc/elements/1.1',
  ],
  sy: [
    'http://purl.org/rss/1.0/modules/syndication/', // Official URI.
    'https://purl.org/rss/1.0/modules/syndication/',
    'http://purl.org/rss/1.0/modules/syndication',
    'https://purl.org/rss/1.0/modules/syndication',
  ],
  content: [
    'http://purl.org/rss/1.0/modules/content/', // Official URI.
    'https://purl.org/rss/1.0/modules/content/',
    'http://purl.org/rss/1.0/modules/content',
    'https://purl.org/rss/1.0/modules/content',
  ],
  slash: [
    'http://purl.org/rss/1.0/modules/slash/', // Official URI.
    'https://purl.org/rss/1.0/modules/slash/',
    'http://purl.org/rss/1.0/modules/slash',
    'https://purl.org/rss/1.0/modules/slash',
  ],
  itunes: [
    'http://www.itunes.com/dtds/podcast-1.0.dtd', // Official URI.
    'https://www.itunes.com/dtds/podcast-1.0.dtd',
  ],
  podcast: [
    'https://podcastindex.org/namespace/1.0', // Official URI.
    'http://podcastindex.org/namespace/1.0',
    'https://podcastindex.org/namespace/1.0/',
    'http://podcastindex.org/namespace/1.0/',
  ],
  psc: [
    'http://podlove.org/simple-chapters', // Official URI.
    'https://podlove.org/simple-chapters',
    'http://podlove.org/simple-chapters/',
    'https://podlove.org/simple-chapters/',
  ],
  media: [
    'http://search.yahoo.com/mrss/', // Official URI.
    'https://search.yahoo.com/mrss/',
    'http://search.yahoo.com/mrss',
    'https://search.yahoo.com/mrss',
    'http://video.search.yahoo.com/mrss',
    'http://video.search.yahoo.com/mrss/',
    'https://video.search.yahoo.com/mrss',
    'https://video.search.yahoo.com/mrss/',
    'http://www.rssboard.org/media-rss',
    'http://www.rssboard.org/media-rss/',
    'https://www.rssboard.org/media-rss',
    'https://www.rssboard.org/media-rss/',
  ],
  georss: [
    'http://www.georss.org/georss', // Official URI.
    'http://www.georss.org/georss/',
    'https://www.georss.org/georss',
    'https://www.georss.org/georss/',
  ],
  thr: [
    'http://purl.org/syndication/thread/1.0', // Official URI.
    'https://purl.org/syndication/thread/1.0',
    'http://purl.org/syndication/thread/1.0/',
    'https://purl.org/syndication/thread/1.0/',
  ],
  dcterms: [
    'http://purl.org/dc/terms/', // Official URI.
    'https://purl.org/dc/terms/',
    'http://purl.org/dc/terms',
    'https://purl.org/dc/terms',
  ],
  wfw: [
    'http://wellformedweb.org/CommentAPI/', // Official URI.
    'https://wellformedweb.org/CommentAPI/',
    'http://wellformedweb.org/CommentAPI',
    'https://wellformedweb.org/CommentAPI',
  ],
  source: [
    'http://source.scripting.com/', // Official URI.
    'https://source.scripting.com/',
    'http://source.scripting.com',
    'https://source.scripting.com',
  ],
  yt: [
    'http://www.youtube.com/xml/schemas/2015', // Official URI.
    'https://www.youtube.com/xml/schemas/2015',
    'http://www.youtube.com/xml/schemas/2015/',
    'https://www.youtube.com/xml/schemas/2015/',
  ],
  rdf: [
    'http://www.w3.org/1999/02/22-rdf-syntax-ns#', // Official URI.
    'https://www.w3.org/1999/02/22-rdf-syntax-ns#',
  ],
  rawvoice: [
    'https://blubrry.com/developer/rawvoice-rss', // Official URI.
    'http://blubrry.com/developer/rawvoice-rss',
    'https://blubrry.com/developer/rawvoice-rss/',
    'http://blubrry.com/developer/rawvoice-rss/',
    'http://www.rawvoice.com/rawvoiceRssModule',
    'https://www.rawvoice.com/rawvoiceRssModule',
    'http://www.rawvoice.com/rawvoiceRssModule/',
    'https://www.rawvoice.com/rawvoiceRssModule/',
  ],
}
