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
import {
  generateFeed as generateItunesFeed,
  generateItem as generateItunesItem,
} from '../../../namespaces/itunes/generate/utils.js'
import { generateItem as generateSlashItem } from '../../../namespaces/slash/generate/utils.js'
import { generateFeed as generateSyFeed } from '../../../namespaces/sy/generate/utils.js'
import { generateItem as generateThrItem } from '../../../namespaces/thr/generate/utils.js'
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

  return trimObject({
    '@domain': category.domain,
    '#text': category.name,
  })
}

export const generateCloud: GenerateFunction<Cloud> = (cloud) => {
  if (!isObject(cloud)) {
    return
  }

  return trimObject({
    '@domain': cloud.domain,
    '@port': cloud.port,
    '@path': cloud.path,
    '@registerProcedure': cloud.registerProcedure,
    '@protocol': cloud.protocol,
  })
}

export const generateImage: GenerateFunction<Image> = (image) => {
  if (!isObject(image)) {
    return
  }

  return trimObject(image)
}

export const generateTextInput: GenerateFunction<TextInput> = (textInput) => {
  if (!isObject(textInput)) {
    return
  }

  return trimObject(textInput)
}

export const generateEnclosure: GenerateFunction<Enclosure> = (enclosure) => {
  if (!isObject(enclosure)) {
    return
  }

  return trimObject({
    '@url': enclosure.url,
    '@length': enclosure.length,
    '@type': enclosure.type,
  })
}

export const generateSkipHours: GenerateFunction<SkipHours> = (skipHours) => {
  return trimObject({
    hour: trimArray(skipHours),
  })
}

export const generateSkipDays: GenerateFunction<SkipDays> = (skipDays) => {
  return trimObject({
    day: trimArray(skipDays),
  })
}

export const generateGuid: GenerateFunction<Guid> = (guid) => {
  return trimObject({
    '#text': guid?.value,
    '@isPermaLink': guid?.isPermaLink,
  })
}

export const generateSource: GenerateFunction<Source> = (source) => {
  if (!isObject(source)) {
    return
  }

  return trimObject({
    '#text': source.title,
    '@url': source.url,
  })
}

export const generateItem: GenerateFunction<Item<Date>> = (item) => {
  if (!isObject(item)) {
    return
  }

  return trimObject({
    title: item.title,
    link: item.link,
    description: item.description,
    author: trimArray(item.authors?.map(generatePerson)),
    category: trimArray(item.categories?.map(generateCategory)),
    comments: item.comments,
    enclosure: generateEnclosure(item.enclosure),
    guid: generateGuid(item.guid),
    pubDate: item.pubDate,
    source: generateSource(item.source),
    ...generateContentItem(item.content),
    ...generateAtomEntry(item.atom),
    ...generateDcItemOrFeed(item.dc),
    ...generateSlashItem(item.slash),
    ...generateItunesItem(item.itunes),
    // TODO: Add support for podcast namespace here.
    // TODO: Add support for media namespace here.
    // TODO: Add support for georss namespace here.
    ...generateThrItem(item.thr),
  })
}

export const generateFeed: GenerateFunction<Feed<Date>> = (feed) => {
  if (!isObject(feed)) {
    return
  }

  const channel = trimObject({
    title: feed.title,
    link: feed.link,
    description: feed.description,
    language: feed.language,
    copyright: feed.copyright,
    managingEditor: generatePerson(feed.managingEditor),
    webMaster: generatePerson(feed.webMaster),
    pubDate: generateRfc822Date(feed.pubDate),
    lastBuildDate: generateRfc822Date(feed.lastBuildDate),
    category: trimArray(feed.categories?.map(generateCategory)),
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
    ...generateSyFeed(feed.sy),
    ...generateItunesFeed(feed.itunes),
    // TODO: Add support for podcast namespace here.
    // TODO: Add support for media namespace here.
    // TODO: Add support for georss namespace here.
    item: trimArray(feed.items?.map(generateItem)),
  })

  if (!channel) {
    return
  }

  return {
    rss: {
      '@version': '2.0',
      ...generateNamespaceAttrs(channel),
      channel,
    },
  }
}
