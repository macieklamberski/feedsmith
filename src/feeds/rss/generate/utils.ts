import { namespaceUrls } from '../../../common/config.js'
import type { DateLike, GenerateFunction } from '../../../common/types.js'
import {
  generateBoolean,
  generateCdataString,
  generateNamespaceAttrs,
  generateNumber,
  generatePlainString,
  generateRfc822Date,
  isObject,
  trimArray,
  trimObject,
} from '../../../common/utils.js'
import {
  generateEntry as generateAtomEntry,
  generateFeed as generateAtomFeed,
} from '../../../namespaces/atom/generate/utils.js'
import { generateItem as generateContentItem } from '../../../namespaces/content/generate/utils.js'
import { generateItemOrFeed as generateDcItemOrFeed } from '../../../namespaces/dc/generate/utils.js'
import { generateItemOrFeed as generateDctermsItemOrFeed } from '../../../namespaces/dcterms/generate/utils.js'
import { generateItemOrFeed as generateGeoRssItemOrFeed } from '../../../namespaces/georss/generate/utils.js'
import {
  generateFeed as generateItunesFeed,
  generateItem as generateItunesItem,
} from '../../../namespaces/itunes/generate/utils.js'
import { generateItemOrFeed as generateMediaItemOrFeed } from '../../../namespaces/media/generate/utils.js'
import {
  generateFeed as generatePodcastFeed,
  generateItem as generatePodcastItem,
} from '../../../namespaces/podcast/generate/utils.js'
import { generateItem as generateSlashItem } from '../../../namespaces/slash/generate/utils.js'
import {
  generateFeed as generateSourceFeed,
  generateItem as generateSourceItem,
} from '../../../namespaces/source/generate/utils.js'
import { generateFeed as generateSyFeed } from '../../../namespaces/sy/generate/utils.js'
import { generateItem as generateThrItem } from '../../../namespaces/thr/generate/utils.js'
import { generateItem as generateWfwItem } from '../../../namespaces/wfw/generate/utils.js'
import type {
  Category,
  Cloud,
  Enclosure,
  Feed,
  Guid,
  Image,
  Item,
  Person,
  SkipDays,
  SkipHours,
  Source,
  TextInput,
} from '../common/types.js'

export const generatePerson: GenerateFunction<Person> = (person) => {
  return generateCdataString(person)
}

export const generateCategory: GenerateFunction<Category> = (category) => {
  if (!isObject(category)) {
    return
  }

  const value = {
    '@domain': generatePlainString(category.domain),
    '#text': generateCdataString(category.name),
  }

  return trimObject(value)
}

export const generateCloud: GenerateFunction<Cloud> = (cloud) => {
  if (!isObject(cloud)) {
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

export const generateImage: GenerateFunction<Image> = (image) => {
  if (!isObject(image)) {
    return
  }

  const value = {
    url: generateCdataString(image.url),
    title: generateCdataString(image.title),
    link: generateCdataString(image.link),
    description: generateCdataString(image.description),
    height: generateNumber(image.height),
    width: generateNumber(image.width),
  }

  return trimObject(value)
}

export const generateTextInput: GenerateFunction<TextInput> = (textInput) => {
  if (!isObject(textInput)) {
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

export const generateEnclosure: GenerateFunction<Enclosure> = (enclosure) => {
  if (!isObject(enclosure)) {
    return
  }

  const value = {
    '@url': generatePlainString(enclosure.url),
    '@length': generateNumber(enclosure.length),
    '@type': generatePlainString(enclosure.type),
  }

  return trimObject(value)
}

export const generateSkipHours: GenerateFunction<SkipHours> = (skipHours) => {
  const value = {
    hour: trimArray(skipHours, generateNumber),
  }

  return trimObject(value)
}

export const generateSkipDays: GenerateFunction<SkipDays> = (skipDays) => {
  const value = {
    day: trimArray(skipDays, generatePlainString),
  }

  return trimObject(value)
}

export const generateGuid: GenerateFunction<Guid> = (guid) => {
  const value = {
    '#text': generateCdataString(guid?.value),
    '@isPermaLink': generateBoolean(guid?.isPermaLink),
  }

  return trimObject(value)
}

export const generateSource: GenerateFunction<Source> = (source) => {
  if (!isObject(source)) {
    return
  }

  const value = {
    '#text': generateCdataString(source.title),
    '@url': generatePlainString(source.url),
  }

  return trimObject(value)
}

export const generateItem: GenerateFunction<Item<DateLike>> = (item) => {
  if (!isObject(item)) {
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
    source: generateSource(item.source),
    ...generateContentItem(item.content),
    ...generateAtomEntry(item.atom),
    ...generateDcItemOrFeed(item.dc),
    ...generateDctermsItemOrFeed(item.dcterms),
    ...generateSlashItem(item.slash),
    ...generateItunesItem(item.itunes),
    ...generatePodcastItem(item.podcast),
    ...generateMediaItemOrFeed(item.media),
    ...generateGeoRssItemOrFeed(item.georss),
    ...generateThrItem(item.thr),
    ...generateWfwItem(item.wfw),
    ...generateSourceItem(item.src),
  }

  return trimObject(value)
}

export const generateFeed: GenerateFunction<Feed<DateLike>> = (feed) => {
  if (!isObject(feed)) {
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
    ...generateDctermsItemOrFeed(feed.dcterms),
    ...generateSyFeed(feed.sy),
    ...generateItunesFeed(feed.itunes),
    ...generatePodcastFeed(feed.podcast),
    ...generateMediaItemOrFeed(feed.media),
    ...generateGeoRssItemOrFeed(feed.georss),
    ...generateSourceFeed(feed.src),
    item: trimArray(feed.items, generateItem),
  }

  const trimmedValue = trimObject(value)

  if (!trimmedValue) {
    return
  }

  return {
    rss: {
      '@version': '2.0',
      ...generateNamespaceAttrs(trimmedValue, namespaceUrls),
      channel: trimmedValue,
    },
  }
}
