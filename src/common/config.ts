import type { X2jOptions, XmlBuilderOptions } from 'fast-xml-parser'
import {
  stopNodes as acastStopNodes,
  uris as acastUris,
} from '../namespaces/acast/common/config.js'
import {
  stopNodes as adminStopNodes,
  uris as adminUris,
} from '../namespaces/admin/common/config.js'
import { stopNodes as appStopNodes, uris as appUris } from '../namespaces/app/common/config.js'
import {
  stopNodes as arxivStopNodes,
  uris as arxivUris,
} from '../namespaces/arxiv/common/config.js'
import { uris as atomUris } from '../namespaces/atom/common/config.js'
import {
  stopNodes as blogchannelStopNodes,
  uris as blogchannelUris,
} from '../namespaces/blogchannel/common/config.js'
import { stopNodes as ccStopNodes, uris as ccUris } from '../namespaces/cc/common/config.js'
import {
  stopNodes as contentStopNodes,
  uris as contentUris,
} from '../namespaces/content/common/config.js'
import {
  stopNodes as creativecommonsStopNodes,
  uris as creativecommonsUris,
} from '../namespaces/creativecommons/common/config.js'
import { stopNodes as dcStopNodes, uris as dcUris } from '../namespaces/dc/common/config.js'
import {
  stopNodes as dctermsStopNodes,
  uris as dctermsUris,
} from '../namespaces/dcterms/common/config.js'
import {
  stopNodes as feedpressStopNodes,
  uris as feedpressUris,
} from '../namespaces/feedpress/common/config.js'
import { stopNodes as geoStopNodes, uris as geoUris } from '../namespaces/geo/common/config.js'
import {
  stopNodes as georssStopNodes,
  uris as georssUris,
} from '../namespaces/georss/common/config.js'
import {
  stopNodes as googleplayStopNodes,
  uris as googleplayUris,
} from '../namespaces/googleplay/common/config.js'
import {
  stopNodes as itunesStopNodes,
  uris as itunesUris,
} from '../namespaces/itunes/common/config.js'
import {
  stopNodes as mediaStopNodes,
  uris as mediaUris,
} from '../namespaces/media/common/config.js'
import {
  stopNodes as opensearchStopNodes,
  uris as opensearchUris,
} from '../namespaces/opensearch/common/config.js'
import {
  stopNodes as pingbackStopNodes,
  uris as pingbackUris,
} from '../namespaces/pingback/common/config.js'
import {
  stopNodes as podcastStopNodes,
  uris as podcastUris,
} from '../namespaces/podcast/common/config.js'
import {
  stopNodes as prismStopNodes,
  uris as prismUris,
} from '../namespaces/prism/common/config.js'
import { uris as pscUris } from '../namespaces/psc/common/config.js'
import {
  stopNodes as rawvoiceStopNodes,
  uris as rawvoiceUris,
} from '../namespaces/rawvoice/common/config.js'
import { stopNodes as rdfStopNodes, uris as rdfUris } from '../namespaces/rdf/common/config.js'
import { uris as rssUris } from '../namespaces/rss/common/config.js'
import {
  stopNodes as slashStopNodes,
  uris as slashUris,
} from '../namespaces/slash/common/config.js'
import {
  stopNodes as sourceStopNodes,
  uris as sourceUris,
} from '../namespaces/source/common/config.js'
import {
  stopNodes as spotifyStopNodes,
  uris as spotifyUris,
} from '../namespaces/spotify/common/config.js'
import { stopNodes as syStopNodes, uris as syUris } from '../namespaces/sy/common/config.js'
import { stopNodes as thrStopNodes, uris as thrUris } from '../namespaces/thr/common/config.js'
import {
  stopNodes as trackbackStopNodes,
  uris as trackbackUris,
} from '../namespaces/trackback/common/config.js'
import { stopNodes as wfwStopNodes, uris as wfwUris } from '../namespaces/wfw/common/config.js'
import { stopNodes as ytStopNodes, uris as ytUris } from '../namespaces/yt/common/config.js'

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
  jPath: false,
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
  admin: adminUris,
  atom: atomUris,
  blogChannel: blogchannelUris,
  app: appUris,
  dc: dcUris,
  sy: syUris,
  content: contentUris,
  creativeCommons: creativecommonsUris,
  slash: slashUris,
  itunes: itunesUris,
  podcast: podcastUris,
  psc: pscUris,
  media: mediaUris,
  georss: georssUris,
  geo: geoUris,
  thr: thrUris,
  dcterms: dctermsUris,
  wfw: wfwUris,
  source: sourceUris,
  feedpress: feedpressUris,
  yt: ytUris,
  googleplay: googleplayUris,
  spotify: spotifyUris,
  rdf: rdfUris,
  rss: rssUris,
  rawvoice: rawvoiceUris,
  cc: ccUris,
  opensearch: opensearchUris,
  arxiv: arxivUris,
  pingback: pingbackUris,
  trackback: trackbackUris,
  prism: prismUris,
  acast: acastUris,
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

// Namespace elements that act as containers for other namespace elements.
// Used during stop node expansion to generate paths through these containers.
export const namespaceContainers = [
  'media:group',
  'media:content',
  'media:group.media:content',
  'media:embed',
  'podcast:liveitem',
  'itunes:owner',
]

export const namespaceStopNodes = [
  ...acastStopNodes,
  ...adminStopNodes,
  ...appStopNodes,
  ...arxivStopNodes,
  ...blogchannelStopNodes,
  ...ccStopNodes,
  ...contentStopNodes,
  ...creativecommonsStopNodes,
  ...dcStopNodes,
  ...dctermsStopNodes,
  ...feedpressStopNodes,
  ...geoStopNodes,
  ...georssStopNodes,
  ...googleplayStopNodes,
  ...itunesStopNodes,
  ...mediaStopNodes,
  ...opensearchStopNodes,
  ...pingbackStopNodes,
  ...podcastStopNodes,
  ...prismStopNodes,
  ...rawvoiceStopNodes,
  ...rdfStopNodes,
  ...slashStopNodes,
  ...sourceStopNodes,
  ...spotifyStopNodes,
  ...syStopNodes,
  ...thrStopNodes,
  ...trackbackStopNodes,
  ...wfwStopNodes,
  ...ytStopNodes,
]
