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
    'http://www.w3.org/2005/Atom', // Official URI (Atom 1.0).
    'https://www.w3.org/2005/Atom',
    'http://www.w3.org/2005/Atom/',
    'https://www.w3.org/2005/Atom/',
    'http://purl.org/atom/ns#', // Official URI (Atom 0.3).
    'https://purl.org/atom/ns#',
  ],
  dc: [
    'http://purl.org/dc/elements/1.1/', // Official URI.
    'https://purl.org/dc/elements/1.1/',
    'http://purl.org/dc/elements/1.1',
    'https://purl.org/dc/elements/1.1',
    'http://dublincore.org/documents/dcmi-namespace/',
    'https://dublincore.org/documents/dcmi-namespace/',
    'http://dublincore.org/documents/dcmi-namespace',
    'https://dublincore.org/documents/dcmi-namespace',
    'http://purl.org/dc/elements/1.0/',
    'https://purl.org/dc/elements/1.0/',
    'http://purl.org/dc/elements/1.0',
    'https://purl.org/dc/elements/1.0',
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
  creativeCommons: [
    'http://backend.userland.com/creativeCommonsRssModule', // Official URI.
    'https://backend.userland.com/creativeCommonsRssModule',
    'http://backend.userland.com/creativeCommonsRssModule/',
    'https://backend.userland.com/creativeCommonsRssModule/',
    'http://cyber.law.harvard.edu/rss/creativeCommonsRssModule.html',
    'https://cyber.law.harvard.edu/rss/creativeCommonsRssModule.html',
    'http://cyber.law.harvard.edu/rss/creativeCommonsRssModule',
    'https://cyber.law.harvard.edu/rss/creativeCommonsRssModule',
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
    'https://github.com/Podcastindex-org/podcast-namespace/blob/main/docs/1.0.md',
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
    'http://search.yahoo.com/searchmonkey/media/',
    'https://search.yahoo.com/searchmonkey/media/',
    'http://search.yahoo.com/searchmonkey/media',
    'https://search.yahoo.com/searchmonkey/media',
    'http://tools.search.yahoo.com/mrss/',
    'https://tools.search.yahoo.com/mrss/',
    'http://tools.search.yahoo.com/mrss',
    'https://tools.search.yahoo.com/mrss',
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
    'http://purl.org/rss/1.0/modules/threading/',
    'https://purl.org/rss/1.0/modules/threading/',
    'http://purl.org/rss/1.0/modules/threading',
    'https://purl.org/rss/1.0/modules/threading',
  ],
  dcterms: [
    'http://purl.org/dc/terms/', // Official URI.
    'https://purl.org/dc/terms/',
    'http://purl.org/dc/terms',
    'https://purl.org/dc/terms',
    'http://dublincore.org/documents/dcmi-terms/',
    'https://dublincore.org/documents/dcmi-terms/',
    'http://dublincore.org/documents/dcmi-terms',
    'https://dublincore.org/documents/dcmi-terms',
    'http://dublincore.org/specifications/dublin-core/dcmi-terms/',
    'https://dublincore.org/specifications/dublin-core/dcmi-terms/',
    'http://dublincore.org/specifications/dublin-core/dcmi-terms',
    'https://dublincore.org/specifications/dublin-core/dcmi-terms',
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
  feedpress: [
    'https://feed.press/xmlns', // Official URI.
    'http://feed.press/xmlns',
    'https://feed.press/xmlns/',
    'http://feed.press/xmlns/',
    'https://feedpress.com/xmlns',
    'http://feedpress.com/xmlns',
    'https://feedpress.com/xmlns/',
    'http://feedpress.com/xmlns/',
    'http://feedpress.it/xmlns',
    'https://feedpress.it/xmlns',
    'http://feedpress.it/xmlns/',
    'https://feedpress.it/xmlns/',
  ],
  yt: [
    'http://www.youtube.com/xml/schemas/2015', // Official URI.
    'https://www.youtube.com/xml/schemas/2015',
    'http://www.youtube.com/xml/schemas/2015/',
    'https://www.youtube.com/xml/schemas/2015/',
  ],
  spotify: [
    'http://www.spotify.com/ns/rss', // Official URI.
    'https://www.spotify.com/ns/rss',
    'http://www.spotify.com/ns/rss/',
    'https://www.spotify.com/ns/rss/',
  ],
  rdf: [
    'http://www.w3.org/1999/02/22-rdf-syntax-ns#', // Official URI.
    'https://www.w3.org/1999/02/22-rdf-syntax-ns#',
  ],
  rawvoice: [
    'http://www.rawvoice.com/rawvoiceRssModule/', // Official URI.
    'https://www.rawvoice.com/rawvoiceRssModule/',
    'http://www.rawvoice.com/rawvoiceRssModule',
    'https://www.rawvoice.com/rawvoiceRssModule',
    'https://blubrry.com/developer/rawvoice-rss',
    'http://blubrry.com/developer/rawvoice-rss',
    'https://blubrry.com/developer/rawvoice-rss/',
    'http://blubrry.com/developer/rawvoice-rss/',
  ],
  cc: [
    'http://creativecommons.org/ns#', // Official URI.
    'https://creativecommons.org/ns#',
    'http://web.resource.org/cc/',
    'https://web.resource.org/cc/',
    'http://web.resource.org/cc',
    'https://web.resource.org/cc',
  ],
  pingback: [
    'http://madskills.com/public/xml/rss/module/pingback/', // Official URI.
    'https://madskills.com/public/xml/rss/module/pingback/',
    'http://madskills.com/public/xml/rss/module/pingback',
    'https://madskills.com/public/xml/rss/module/pingback',
  ],
  trackback: [
    'http://madskills.com/public/xml/rss/module/trackback/', // Official URI.
    'https://madskills.com/public/xml/rss/module/trackback/',
    'http://madskills.com/public/xml/rss/module/trackback',
    'https://madskills.com/public/xml/rss/module/trackback',
  ],
}

export const namespacePrefixes = Object.entries(namespaceUris).reduce(
  (prefixes, [prefix, uris]) => {
    for (const uri of uris) {
      const normalizedUri = uri.toLowerCase()
      prefixes[normalizedUri] = prefix.toLowerCase()
    }

    return prefixes
  },
  {} as Record<string, string>,
)
