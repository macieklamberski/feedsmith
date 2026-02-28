import type { DateAny } from '../../../common/types.js'
import {
  detectNamespaces,
  isObject,
  parseArrayOf,
  parseBoolean,
  parseDate,
  parseNumber,
  parseSingular,
  parseSingularOf,
  parseString,
  retrieveText,
  trimArray,
  trimObject,
} from '../../../common/utils.js'
import {
  retrieveFeed as retrieveAcastFeed,
  retrieveItem as retrieveAcastItem,
} from '../../../namespaces/acast/parse/utils.js'
import { retrieveFeed as retrieveAdminFeed } from '../../../namespaces/admin/parse/utils.js'
import {
  retrieveEntry as retrieveAtomEntry,
  retrieveFeed as retrieveAtomFeed,
} from '../../../namespaces/atom/parse/utils.js'
import { retrieveFeed as retrieveBlogChannelFeed } from '../../../namespaces/blogchannel/parse/utils.js'
import { retrieveItemOrFeed as retrieveCc } from '../../../namespaces/cc/parse/utils.js'
import { retrieveItem as retrieveContentItem } from '../../../namespaces/content/parse/utils.js'
import { retrieveItemOrFeed as retrieveCreativeCommonsItemOrFeed } from '../../../namespaces/creativecommons/parse/utils.js'
import { retrieveItemOrFeed as retrieveDcItemOrFeed } from '../../../namespaces/dc/parse/utils.js'
import { retrieveItemOrFeed as retrieveDcTermsItemOrFeed } from '../../../namespaces/dcterms/parse/utils.js'
import { retrieveFeed as retrieveFeedPressFeed } from '../../../namespaces/feedpress/parse/utils.js'
import { retrieveItem as retrieveGItem } from '../../../namespaces/g/parse/utils.js'
import { retrieveItemOrFeed as retrieveGeoItemOrFeed } from '../../../namespaces/geo/parse/utils.js'
import { retrieveItemOrFeed as retrieveGeoRssItemOrFeed } from '../../../namespaces/georss/parse/utils.js'
import {
  retrieveFeed as retrieveGooglePlayFeed,
  retrieveItem as retrieveGooglePlayItem,
} from '../../../namespaces/googleplay/parse/utils.js'
import {
  retrieveFeed as retrieveItunesFeed,
  retrieveItem as retrieveItunesItem,
} from '../../../namespaces/itunes/parse/utils.js'
import { retrieveItemOrFeed as retrieveMediaItemOrFeed } from '../../../namespaces/media/parse/utils.js'
import { retrieveFeed as retrieveOpenSearchFeed } from '../../../namespaces/opensearch/parse/utils.js'
import {
  retrieveFeed as retrievePingbackFeed,
  retrieveItem as retrievePingbackItem,
} from '../../../namespaces/pingback/parse/utils.js'
import {
  retrieveFeed as retrievePodcastFeed,
  retrieveItem as retrievePodcastItem,
} from '../../../namespaces/podcast/parse/utils.js'
import {
  retrieveFeed as retrievePrismFeed,
  retrieveItem as retrievePrismItem,
} from '../../../namespaces/prism/parse/utils.js'
import { retrieveItem as retrievePscItem } from '../../../namespaces/psc/parse/utils.js'
import {
  retrieveFeed as retrieveRawVoiceFeed,
  retrieveItem as retrieveRawVoiceItem,
} from '../../../namespaces/rawvoice/parse/utils.js'
import { retrieveItem as retrieveSlashItem } from '../../../namespaces/slash/parse/utils.js'
import {
  retrieveFeed as retrieveSourceFeed,
  retrieveItem as retrieveSourceItem,
} from '../../../namespaces/source/parse/utils.js'
import {
  retrieveFeed as retrieveSpotifyFeed,
  retrieveItem as retrieveSpotifyItem,
} from '../../../namespaces/spotify/parse/utils.js'
import { retrieveFeed as retrieveSyFeed } from '../../../namespaces/sy/parse/utils.js'
import { retrieveItem as retrieveThrItem } from '../../../namespaces/thr/parse/utils.js'
import { retrieveItem as retrieveTrackbackItem } from '../../../namespaces/trackback/parse/utils.js'
import { retrieveItem as retrieveWfwItem } from '../../../namespaces/wfw/parse/utils.js'
import { retrieveItemOrFeed as retrieveXmlItemOrFeed } from '../../../namespaces/xml/parse/utils.js'
import type { ParseUtilPartial, Rss } from '../common/types.js'

export const parsePerson: ParseUtilPartial<Rss.Person> = (value) => {
  return parseSingularOf(value?.name ?? value, (value) => parseString(retrieveText(value)))
}

export const parseCategory: ParseUtilPartial<Rss.Category> = (value) => {
  const category = {
    name: parseString(retrieveText(value)),
    domain: parseString(value?.['@domain']),
  }

  return trimObject(category)
}

export const parseCloud: ParseUtilPartial<Rss.Cloud> = (value) => {
  if (!isObject(value)) {
    return
  }

  const cloud = {
    domain: parseString(value['@domain']),
    port: parseNumber(value['@port']),
    path: parseString(value['@path']),
    registerProcedure: parseString(value['@registerprocedure']),
    protocol: parseString(value['@protocol']),
  }

  return trimObject(cloud)
}

export const parseImage: ParseUtilPartial<Rss.Image> = (value) => {
  if (!isObject(value)) {
    return
  }

  const image = {
    url: parseSingularOf(value.url, (value) => parseString(retrieveText(value))),
    title: parseSingularOf(value.title, (value) => parseString(retrieveText(value))),
    link: parseSingularOf(value.link, (value) => parseString(retrieveText(value))),
    description: parseSingularOf(value.description, (value) => parseString(retrieveText(value))),
    height: parseSingularOf(value.height, (value) => parseNumber(retrieveText(value))),
    width: parseSingularOf(value.width, (value) => parseNumber(retrieveText(value))),
  }

  return trimObject(image)
}

export const parseTextInput: ParseUtilPartial<Rss.TextInput> = (value) => {
  if (!isObject(value)) {
    return
  }

  const textInput = {
    title: parseSingularOf(value.title, (value) => parseString(retrieveText(value))),
    description: parseSingularOf(value.description, (value) => parseString(retrieveText(value))),
    name: parseSingularOf(value.name, (value) => parseString(retrieveText(value))),
    link: parseSingularOf(value.link, (value) => parseString(retrieveText(value))),
  }

  return trimObject(textInput)
}

export const parseSkipHours: ParseUtilPartial<Array<number>> = (value) => {
  return trimArray(value?.hour, (value) => parseNumber(retrieveText(value)))
}

export const parseSkipDays: ParseUtilPartial<Array<string>> = (value) => {
  return trimArray(value?.day, (value) => parseString(retrieveText(value)))
}

export const parseEnclosure: ParseUtilPartial<Rss.Enclosure> = (value) => {
  if (!isObject(value)) {
    return
  }

  const enclosure = {
    url: parseString(value['@url']),
    length: parseNumber(value['@length']),
    type: parseString(value['@type']),
  }

  return trimObject(enclosure)
}

export const parseGuid: ParseUtilPartial<Rss.Guid> = (value) => {
  const source = {
    value: parseString(retrieveText(value)),
    isPermaLink: parseBoolean(value?.['@ispermalink']),
  }

  return trimObject(source)
}

export const parseSource: ParseUtilPartial<Rss.Source> = (value) => {
  const source = {
    title: parseString(retrieveText(value)),
    url: parseString(value?.['@url']),
  }

  return trimObject(source)
}

export const parseItem: ParseUtilPartial<Rss.Item<DateAny>> = (value, options) => {
  if (!isObject(value)) {
    return
  }

  const namespaces = detectNamespaces(value)
  const item = {
    title: parseSingularOf(value.title, (value) => parseString(retrieveText(value))),
    link: parseSingularOf(value.link, (value) => parseString(retrieveText(value))),
    description: parseSingularOf(value.description, (value) => parseString(retrieveText(value))),
    authors: parseArrayOf(value.author, parsePerson),
    categories: parseArrayOf(value.category, parseCategory),
    comments: parseSingularOf(value.comments, (value) => parseString(retrieveText(value))),
    enclosures: parseArrayOf(value.enclosure, parseEnclosure),
    guid: parseSingularOf(value.guid, parseGuid),
    pubDate: parseSingularOf(value.pubdate, (value) =>
      parseDate(retrieveText(value), options?.parseDateFn),
    ),
    source: parseSingularOf(value.source, parseSource),
    atom: namespaces.has('atom') ? retrieveAtomEntry(value, options) : undefined,
    cc: namespaces.has('cc') ? retrieveCc(value) : undefined,
    dc: namespaces.has('dc') ? retrieveDcItemOrFeed(value, options) : undefined,
    content: namespaces.has('content') ? retrieveContentItem(value) : undefined,
    creativeCommons: namespaces.has('creativecommons')
      ? retrieveCreativeCommonsItemOrFeed(value)
      : undefined,
    slash: namespaces.has('slash') ? retrieveSlashItem(value) : undefined,
    itunes: namespaces.has('itunes') ? retrieveItunesItem(value) : undefined,
    podcast: namespaces.has('podcast') ? retrievePodcastItem(value) : undefined,
    psc: namespaces.has('psc') ? retrievePscItem(value) : undefined,
    googleplay: namespaces.has('googleplay') ? retrieveGooglePlayItem(value) : undefined,
    media: namespaces.has('media') ? retrieveMediaItemOrFeed(value) : undefined,
    georss: namespaces.has('georss') ? retrieveGeoRssItemOrFeed(value) : undefined,
    geo: namespaces.has('geo') ? retrieveGeoItemOrFeed(value) : undefined,
    thr: namespaces.has('thr') ? retrieveThrItem(value) : undefined,
    dcterms: namespaces.has('dcterms') ? retrieveDcTermsItemOrFeed(value, options) : undefined,
    prism: namespaces.has('prism') ? retrievePrismItem(value, options) : undefined,
    wfw: namespaces.has('wfw') ? retrieveWfwItem(value) : undefined,
    sourceNs: namespaces.has('source') ? retrieveSourceItem(value) : undefined,
    rawvoice: namespaces.has('rawvoice') ? retrieveRawVoiceItem(value) : undefined,
    spotify: namespaces.has('spotify') ? retrieveSpotifyItem(value) : undefined,
    pingback: namespaces.has('pingback') ? retrievePingbackItem(value) : undefined,
    trackback: namespaces.has('trackback') ? retrieveTrackbackItem(value) : undefined,
    acast: namespaces.has('acast') ? retrieveAcastItem(value) : undefined,
    g: namespaces.has('g') ? retrieveGItem(value) : undefined,
    xml: retrieveXmlItemOrFeed(value),
  }

  return trimObject(item)
}

export const parseFeed: ParseUtilPartial<Rss.Feed<DateAny>> = (value, options) => {
  const channel = parseSingular(value?.channel)

  if (!isObject(channel)) {
    return
  }
  const namespaces = detectNamespaces(channel)
  const feed = {
    title: parseSingularOf(channel.title, (value) => parseString(retrieveText(value))),
    link: parseSingularOf(channel.link, (value) => parseString(retrieveText(value))),
    description: parseSingularOf(channel.description, (value) => parseString(retrieveText(value))),
    language: parseSingularOf(channel.language, (value) => parseString(retrieveText(value))),
    copyright: parseSingularOf(channel.copyright, (value) => parseString(retrieveText(value))),
    managingEditor: parseSingularOf(channel.managingeditor, parsePerson),
    webMaster: parseSingularOf(channel.webmaster, parsePerson),
    pubDate: parseSingularOf(channel.pubdate, (value) =>
      parseDate(retrieveText(value), options?.parseDateFn),
    ),
    lastBuildDate: parseSingularOf(channel.lastbuilddate, (value) =>
      parseDate(retrieveText(value), options?.parseDateFn),
    ),
    categories: parseArrayOf(channel.category, parseCategory),
    generator: parseSingularOf(channel.generator, (value) => parseString(retrieveText(value))),
    docs: parseSingularOf(channel.docs, (value) => parseString(retrieveText(value))),
    cloud: parseSingularOf(channel.cloud, parseCloud),
    ttl: parseSingularOf(channel.ttl, (value) => parseNumber(retrieveText(value))),
    image: parseSingularOf(channel.image, parseImage),
    rating: parseSingularOf(channel.rating, (value) => parseString(retrieveText(value))),
    textInput: parseSingularOf(channel.textinput, parseTextInput),
    skipHours: parseSingularOf(channel.skiphours, parseSkipHours),
    skipDays: parseSingularOf(channel.skipdays, parseSkipDays),
    items: parseArrayOf(channel.item, (value) => parseItem(value, options), options?.maxItems),
    atom: namespaces.has('atom') ? retrieveAtomFeed(channel, options) : undefined,
    cc: namespaces.has('cc') ? retrieveCc(channel) : undefined,
    dc: namespaces.has('dc') ? retrieveDcItemOrFeed(channel, options) : undefined,
    sy: namespaces.has('sy') ? retrieveSyFeed(channel, options) : undefined,
    itunes: namespaces.has('itunes') ? retrieveItunesFeed(channel) : undefined,
    podcast: namespaces.has('podcast') ? retrievePodcastFeed(channel, options) : undefined,
    googleplay: namespaces.has('googleplay') ? retrieveGooglePlayFeed(channel) : undefined,
    media: namespaces.has('media') ? retrieveMediaItemOrFeed(channel) : undefined,
    georss: namespaces.has('georss') ? retrieveGeoRssItemOrFeed(channel) : undefined,
    geo: namespaces.has('geo') ? retrieveGeoItemOrFeed(channel) : undefined,
    dcterms: namespaces.has('dcterms') ? retrieveDcTermsItemOrFeed(channel, options) : undefined,
    prism: namespaces.has('prism') ? retrievePrismFeed(channel, options) : undefined,
    creativeCommons: namespaces.has('creativecommons')
      ? retrieveCreativeCommonsItemOrFeed(channel)
      : undefined,
    feedpress: namespaces.has('feedpress') ? retrieveFeedPressFeed(channel) : undefined,
    opensearch: namespaces.has('opensearch') ? retrieveOpenSearchFeed(channel) : undefined,
    admin: namespaces.has('admin') ? retrieveAdminFeed(channel) : undefined,
    sourceNs: namespaces.has('source') ? retrieveSourceFeed(channel) : undefined,
    blogChannel: namespaces.has('blogchannel') ? retrieveBlogChannelFeed(channel) : undefined,
    rawvoice: namespaces.has('rawvoice') ? retrieveRawVoiceFeed(channel, options) : undefined,
    spotify: namespaces.has('spotify') ? retrieveSpotifyFeed(channel) : undefined,
    pingback: namespaces.has('pingback') ? retrievePingbackFeed(channel) : undefined,
    acast: namespaces.has('acast') ? retrieveAcastFeed(channel) : undefined,
    xml: retrieveXmlItemOrFeed(value),
  }

  return trimObject(feed)
}

export const retrieveFeed: ParseUtilPartial<Rss.Feed<DateAny>> = (value, options) => {
  return parseSingularOf(value?.rss, (value) => parseFeed(value, options))
}
