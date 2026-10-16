import { isPlainObject, trimObject } from 'trousse'
import type { GenerateUtil } from '../../../common/types.js'
import {
  generateCdataString,
  generatePlainString,
  generateRdfResource,
  trimArray,
} from '../../../common/utils.js'
import type { ContentNs } from '../common/types.js'

export const generateContentItem: GenerateUtil<ContentNs.ContentItem> = (contentItem) => {
  if (!isPlainObject(contentItem)) {
    return
  }

  const value = {
    '@rdf:about': generatePlainString(contentItem.about),
    'content:format': generateRdfResource(contentItem.format, generatePlainString),
    'content:encoding': generateRdfResource(contentItem.encoding, generatePlainString),
    'rdf:value': generateCdataString(contentItem.value),
  }

  return trimObject(value)
}

export const generateItems: GenerateUtil<Array<ContentNs.ContentItem>> = (items) => {
  const listItems = trimArray(items, (item) => {
    return trimObject({ 'content:item': generateContentItem(item) })
  })

  if (!listItems) {
    return
  }

  return {
    'rdf:Bag': {
      'rdf:li': listItems,
    },
  }
}

export const generateItem: GenerateUtil<ContentNs.Item> = (item) => {
  if (!isPlainObject(item)) {
    return
  }

  const value = {
    'content:encoded': generateCdataString(item?.encoded),
    'content:items': generateItems(item.items),
  }

  return trimObject(value)
}

export const generateFeed: GenerateUtil<ContentNs.Feed> = (feed) => {
  if (!isPlainObject(feed)) {
    return
  }

  const value = {
    'content:items': generateItems(feed.items),
  }

  return trimObject(value)
}
