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

export const namespaceUrls = {
  atom: 'http://www.w3.org/2005/Atom',
  dc: 'http://purl.org/dc/elements/1.1/',
  sy: 'http://purl.org/rss/1.0/modules/syndication/',
  content: 'http://purl.org/rss/1.0/modules/content/',
  slash: 'http://purl.org/rss/1.0/modules/slash/',
  itunes: 'http://www.itunes.com/dtds/podcast-1.0.dtd',
  podcast: 'https://podcastindex.org/namespace/1.0',
  psc: 'http://podlove.org/simple-chapters',
  media: 'http://search.yahoo.com/mrss/',
  georss: 'http://www.georss.org/georss/',
  thr: 'http://purl.org/syndication/thread/1.0',
  dcterms: 'http://purl.org/dc/terms/',
  wfw: 'http://wellformedweb.org/CommentAPI/',
  source: 'http://source.scripting.com/',
  yt: 'http://www.youtube.com/xml/schemas/2015',
  rdf: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
}
