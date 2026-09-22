import { isPlainObject, trimObject } from 'trousse'
import { namespaceUris } from '../../../common/config.js'
import type { DateLike } from '../../../common/types.js'
import {
  generateBoolean,
  generateCdataString,
  generateNamespaceAttrs,
  generateNumber,
  generatePlainString,
  generateRfc822Date,
  generateTextOrCdataString,
  trimArray,
} from '../../../common/utils.js'
import {
  generateFeed as generateAcastFeed,
  generateItem as generateAcastItem,
} from '../../../namespaces/acast/generate/utils.js'
import { generateFeed as generateAdminFeed } from '../../../namespaces/admin/generate/utils.js'
import { generateEntry as generateArxivEntry } from '../../../namespaces/arxiv/generate/utils.js'
import {
  generateEntry as generateAtomEntry,
  generateFeed as generateAtomFeed,
} from '../../../namespaces/atom/generate/utils.js'
import { generateFeed as generateBlogChannelFeed } from '../../../namespaces/blogchannel/generate/utils.js'
import { generateItemOrFeed as generateCc } from '../../../namespaces/cc/generate/utils.js'
import { generateItem as generateContentItem } from '../../../namespaces/content/generate/utils.js'
import { generateItemOrFeed as generateCreativeCommonsItemOrFeed } from '../../../namespaces/creativecommons/generate/utils.js'
import { generateItemOrFeed as generateDcItemOrFeed } from '../../../namespaces/dc/generate/utils.js'
import { generateItemOrFeed as generateDcTermsItemOrFeed } from '../../../namespaces/dcterms/generate/utils.js'
import {
  generateFeed as generateFeedBurnerFeed,
  generateItem as generateFeedBurnerItem,
} from '../../../namespaces/feedburner/generate/utils.js'
import { generateFeed as generateFeedPressFeed } from '../../../namespaces/feedpress/generate/utils.js'
import { generateItemOrFeed as generateGeoItemOrFeed } from '../../../namespaces/geo/generate/utils.js'
import { generateItemOrFeed as generateGeoRssItemOrFeed } from '../../../namespaces/georss/generate/utils.js'
import {
  generateFeed as generateGooglePlayFeed,
  generateItem as generateGooglePlayItem,
} from '../../../namespaces/googleplay/generate/utils.js'
import {
  generateFeed as generateItunesFeed,
  generateItem as generateItunesItem,
} from '../../../namespaces/itunes/generate/utils.js'
import { generateItemOrFeed as generateMediaItemOrFeed } from '../../../namespaces/media/generate/utils.js'
import { generateFeed as generateOpenSearchFeed } from '../../../namespaces/opensearch/generate/utils.js'
import {
  generateFeed as generatePingbackFeed,
  generateItem as generatePingbackItem,
} from '../../../namespaces/pingback/generate/utils.js'
import {
  generateFeed as generatePodcastFeed,
  generateItem as generatePodcastItem,
} from '../../../namespaces/podcast/generate/utils.js'
import {
  generateFeed as generatePrismFeed,
  generateItem as generatePrismItem,
} from '../../../namespaces/prism/generate/utils.js'
import { generateItem as generatePscItem } from '../../../namespaces/psc/generate/utils.js'
import {
  generateFeed as generateRawVoiceFeed,
  generateItem as generateRawVoiceItem,
} from '../../../namespaces/rawvoice/generate/utils.js'
import { generateItem as generateSlashItem } from '../../../namespaces/slash/generate/utils.js'
import {
  generateFeed as generateSourceFeed,
  generateItem as generateSourceItem,
} from '../../../namespaces/source/generate/utils.js'
import {
  generateFeed as generateSpotifyFeed,
  generateItem as generateSpotifyItem,
} from '../../../namespaces/spotify/generate/utils.js'
import { generateFeed as generateSyFeed } from '../../../namespaces/sy/generate/utils.js'
import { generateItem as generateThrItem } from '../../../namespaces/thr/generate/utils.js'
import { generateItem as generateTrackbackItem } from '../../../namespaces/trackback/generate/utils.js'
import { generateItem as generateWfwItem } from '../../../namespaces/wfw/generate/utils.js'
import { generateItemOrFeed as generateXmlItemOrFeed } from '../../../namespaces/xml/generate/utils.js'
import type { GenerateUtil, RssFeed } from '../common/types.js'

export const generatePerson: GenerateUtil<RssFeed.Person> = (person) => {
  if (!isPlainObject(person)) {
    return
  }

  const name = generatePlainString(person.name)
  const email = generatePlainString(person.email)
  // person.link is intentionally not generated (no RSS spec support).

  if (email && name) {
    return generateCdataString(`${email} (${name})`)
  }

  if (name) {
    return generateCdataString(name)
  }

  if (email) {
    return generateCdataString(email)
  }
}

export const generateCategory: GenerateUtil<RssFeed.Category> = (category) => {
  if (!isPlainObject(category)) {
    return
  }

  const value = {
    '@domain': generatePlainString(category.domain),
    ...generateTextOrCdataString(category.name),
  }

  return trimObject(value)
}

export const generateCloud: GenerateUtil<RssFeed.Cloud> = (cloud) => {
  if (!isPlainObject(cloud)) {
    return
  }

  const value = {
    '@domain': generatePlainString(cloud.domain),
    '@port': generateNumber(cloud.port),
    '@path': generatePlainString(cloud.path),
    '@registerProcedure': generatePlainString(cloud.registerProcedure),
    '@protocol': generatePlainString(cloud.protocol),
  }

  return trimObject(value)
}

export const generateImage: GenerateUtil<RssFeed.Image> = (image) => {
  if (!isPlainObject(image)) {
    return
  }

  const value = {
    url: generateCdataString(image.url),
    title: generateCdataString(image.title),
    link: generateCdataString(image.link),
    description: generateCdataString(image.description),
    height: generateNumber(image.height),
    width: generateNumber(image.width),
    ...generateCc(image.cc),
  }

  return trimObject(value)
}

export const generateTextInput: GenerateUtil<RssFeed.TextInput> = (textInput) => {
  if (!isPlainObject(textInput)) {
    return
  }

  const value = {
    title: generateCdataString(textInput.title),
    description: generateCdataString(textInput.description),
    name: generateCdataString(textInput.name),
    link: generateCdataString(textInput.link),
  }

  return trimObject(value)
}

export const generateEnclosure: GenerateUtil<RssFeed.Enclosure> = (enclosure) => {
  if (!isPlainObject(enclosure)) {
    return
  }

  const value = {
    '@url': generatePlainString(enclosure.url),
    '@length': generateNumber(enclosure.length),
    '@type': generatePlainString(enclosure.type),
  }

  return trimObject(value)
}

export const generateSkipHours: GenerateUtil<RssFeed.SkipHours> = (skipHours) => {
  const value = {
    hour: trimArray(skipHours, generateNumber),
  }

  return trimObject(value)
}

export const generateSkipDays: GenerateUtil<RssFeed.SkipDays> = (skipDays) => {
  const value = {
    day: trimArray(skipDays, generateCdataString),
  }

  return trimObject(value)
}

export const generateGuid: GenerateUtil<RssFeed.Guid> = (guid) => {
  const value = {
    ...generateTextOrCdataString(guid?.value),
    '@isPermaLink': generateBoolean(guid?.isPermaLink),
  }

  return trimObject(value)
}

export const generateSource: GenerateUtil<RssFeed.Source> = (source) => {
  if (!isPlainObject(source)) {
    return
  }

  const value = {
    ...generateTextOrCdataString(source.title),
    '@url': generatePlainString(source.url),
  }

  return trimObject(value)
}

export const generateItem: GenerateUtil<RssFeed.Item<DateLike>> = (item) => {
  if (!isPlainObject(item)) {
    return
  }

  const value = {
    title: generateCdataString(item.title),
    link: generateCdataString(item.link),
    description: generateCdataString(item.description),
    author: trimArray(item.authors, generatePerson),
    category: trimArray(item.categories, generateCategory),
    comments: generateCdataString(item.comments),
    enclosure: trimArray(item.enclosures, generateEnclosure),
    guid: generateGuid(item.guid),
    pubDate: generateRfc822Date(item.pubDate),
    expirationDate: generateRfc822Date(item.expirationDate),
    source: generateSource(item.source),
    ...generateAtomEntry(item.atom),
    ...generateDcItemOrFeed(item.dc),
    ...generateDcTermsItemOrFeed(item.dcterms),
    ...generateContentItem(item.content),
    ...generateSlashItem(item.slash),
    ...generateItunesItem(item.itunes),
    ...generatePodcastItem(item.podcast),
    ...generatePscItem(item.psc),
    ...generateMediaItemOrFeed(item.media),
    ...generateGooglePlayItem(item.googleplay),
    ...generateSpotifyItem(item.spotify),
    ...generateAcastItem(item.acast),
    ...generateRawVoiceItem(item.rawvoice),
    ...generateFeedBurnerItem(item.feedburner),
    ...generateArxivEntry(item.arxiv),
    ...generatePrismItem(item.prism),
    ...generateCc(item.cc),
    ...generateCreativeCommonsItemOrFeed(item.creativeCommons),
    ...generateThrItem(item.thr),
    ...generateWfwItem(item.wfw),
    ...generatePingbackItem(item.pingback),
    ...generateTrackbackItem(item.trackback),
    ...generateSourceItem(item.sourceNs),
    ...generateGeoItemOrFeed(item.geo),
    ...generateGeoRssItemOrFeed(item.georss),
    ...generateXmlItemOrFeed(item.xml),
  }

  return trimObject(value)
}

export const generateFeed: GenerateUtil<RssFeed.Feed<DateLike>> = (feed) => {
  if (!isPlainObject(feed)) {
    return
  }

  const value = {
    title: generateCdataString(feed.title),
    link: generateCdataString(feed.link),
    description: generateCdataString(feed.description),
    language: generateCdataString(feed.language),
    copyright: generateCdataString(feed.copyright),
    managingEditor: generatePerson(feed.managingEditor),
    webMaster: generatePerson(feed.webMaster),
    pubDate: generateRfc822Date(feed.pubDate),
    lastBuildDate: generateRfc822Date(feed.lastBuildDate),
    category: trimArray(feed.categories, generateCategory),
    generator: generateCdataString(feed.generator),
    docs: generateCdataString(feed.docs),
    cloud: generateCloud(feed.cloud),
    ttl: generateNumber(feed.ttl),
    image: generateImage(feed.image),
    rating: generateCdataString(feed.rating),
    textInput: generateTextInput(feed.textInput),
    skipHours: generateSkipHours(feed.skipHours),
    skipDays: generateSkipDays(feed.skipDays),
    ...generateAtomFeed(feed.atom),
    ...generateDcItemOrFeed(feed.dc),
    ...generateDcTermsItemOrFeed(feed.dcterms),
    ...generateSyFeed(feed.sy),
    ...generateItunesFeed(feed.itunes),
    ...generatePodcastFeed(feed.podcast),
    ...generateMediaItemOrFeed(feed.media),
    ...generateGooglePlayFeed(feed.googleplay),
    ...generateSpotifyFeed(feed.spotify),
    ...generateAcastFeed(feed.acast),
    ...generateRawVoiceFeed(feed.rawvoice),
    ...generateFeedBurnerFeed(feed.feedburner),
    ...generateFeedPressFeed(feed.feedpress),
    ...generateOpenSearchFeed(feed.opensearch),
    ...generatePrismFeed(feed.prism),
    ...generateCc(feed.cc),
    ...generateCreativeCommonsItemOrFeed(feed.creativeCommons),
    ...generateAdminFeed(feed.admin),
    ...generatePingbackFeed(feed.pingback),
    ...generateSourceFeed(feed.sourceNs),
    ...generateBlogChannelFeed(feed.blogChannel),
    ...generateGeoItemOrFeed(feed.geo),
    ...generateGeoRssItemOrFeed(feed.georss),
    item: trimArray(feed.items, generateItem),
  }

  const trimmedValue = trimObject(value)

  if (!trimmedValue) {
    return
  }

  return {
    rss: {
      '@version': '2.0',
      ...generateNamespaceAttrs(trimmedValue, namespaceUris),
      ...generateXmlItemOrFeed(feed.xml),
      channel: trimmedValue,
    },
  }
}
