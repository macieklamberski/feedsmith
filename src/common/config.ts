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
  unrecognized: 'Unrecognized feed format',
  invalid: 'Invalid feed format',
}

export const namespaceUrls = {
  atom: 'http://www.w3.org/2005/Atom',
  content: 'http://purl.org/rss/1.0/modules/content/',
  dc: 'http://purl.org/dc/elements/1.1/',
  dcterms: 'http://purl.org/dc/terms/',
  georss: 'http://www.georss.org/georss/',
  itunes: 'http://www.itunes.com/dtds/podcast-1.0.dtd',
  media: 'http://search.yahoo.com/mrss/',
  podcast: 'https://podcastindex.org/namespace/1.0',
  psc: 'http://podlove.org/simple-chapters',
  rdf: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
  slash: 'http://purl.org/rss/1.0/modules/slash/',
  source: 'http://source.scripting.com/',
  sy: 'http://purl.org/rss/1.0/modules/syndication/',
  thr: 'http://purl.org/syndication/thread/1.0',
  wfw: 'http://wellformedweb.org/CommentAPI/',
  yt: 'http://www.youtube.com/xml/schemas/2015',
}
