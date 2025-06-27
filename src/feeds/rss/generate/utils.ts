import type { GenerateFunction } from '../../../common/types.js'
import {
  generateNamespaceAttrs,
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
  return person
}

export const generateCategory: GenerateFunction<Category> = (category) => {
  if (!isObject(category)) {
    return
  }

  const value = {
    '@domain': category.domain,
    '#text': category.name,
  }

  return trimObject(value)
}

export const generateCloud: GenerateFunction<Cloud> = (cloud) => {
  if (!isObject(cloud)) {
    return
  }

  const value = {
    '@domain': cloud.domain,
    '@port': cloud.port,
    '@path': cloud.path,
    '@registerProcedure': cloud.registerProcedure,
    '@protocol': cloud.protocol,
  }

  return trimObject(value)
}

export const generateImage: GenerateFunction<Image> = (image) => {
  if (!isObject(image)) {
    return
  }

  const value = image

  return trimObject(value)
}

export const generateTextInput: GenerateFunction<TextInput> = (textInput) => {
  if (!isObject(textInput)) {
    return
  }

  const value = textInput

  return trimObject(value)
}

export const generateEnclosure: GenerateFunction<Enclosure> = (enclosure) => {
  if (!isObject(enclosure)) {
    return
  }

  const value = {
    '@url': enclosure.url,
    '@length': enclosure.length,
    '@type': enclosure.type,
  }

  return trimObject(value)
}

export const generateSkipHours: GenerateFunction<SkipHours> = (skipHours) => {
  const value = {
    hour: trimArray(skipHours),
  }

  return trimObject(value)
}

export const generateSkipDays: GenerateFunction<SkipDays> = (skipDays) => {
  const value = {
    day: trimArray(skipDays),
  }

  return trimObject(value)
}

export const generateGuid: GenerateFunction<Guid> = (guid) => {
  const value = {
    '#text': guid?.value,
    '@isPermaLink': guid?.isPermaLink,
  }

  return trimObject(value)
}

export const generateSource: GenerateFunction<Source> = (source) => {
  if (!isObject(source)) {
    return
  }

  const value = {
    '#text': source.title,
    '@url': source.url,
  }

  return trimObject(value)
}

export const generateItem: GenerateFunction<Item<Date>> = (item) => {
  if (!isObject(item)) {
    return
  }

  const value = {
    title: item.title,
    link: item.link,
    description: item.description,
    author: trimArray(item.authors, generatePerson),
    category: trimArray(item.categories, generateCategory),
    comments: item.comments,
    enclosure: generateEnclosure(item.enclosure),
    guid: generateGuid(item.guid),
    pubDate: item.pubDate,
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
  }

  return trimObject(value)
}

export const generateFeed: GenerateFunction<Feed<Date>> = (feed) => {
  if (!isObject(feed)) {
    return
  }

  const value = {
    title: feed.title,
    link: feed.link,
    description: feed.description,
    language: feed.language,
    copyright: feed.copyright,
    managingEditor: generatePerson(feed.managingEditor),
    webMaster: generatePerson(feed.webMaster),
    pubDate: generateRfc822Date(feed.pubDate),
    lastBuildDate: generateRfc822Date(feed.lastBuildDate),
    category: trimArray(feed.categories, generateCategory),
    generator: feed.generator,
    docs: feed.docs,
    cloud: generateCloud(feed.cloud),
    ttl: feed.ttl,
    image: generateImage(feed.image),
    rating: feed.rating,
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
    item: trimArray(feed.items, generateItem),
  }

  const trimmedValue = trimObject(value)

  if (!trimmedValue) {
    return
  }

  return {
    rss: {
      '@version': '2.0',
      ...generateNamespaceAttrs(trimmedValue),
      channel: trimmedValue,
    },
  }
}
