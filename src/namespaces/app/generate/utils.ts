import { isPlainObject, trimObject } from 'trousse'
import type { DateLike, GenerateUtil } from '../../../common/types.js'
import {
  generateCdataString,
  generatePlainString,
  generateRfc3339Date,
  generateYesNoBoolean,
  trimArray,
} from '../../../common/utils.js'
import { generateText } from '../../../feeds/atom/generate/utils.js'
import type { AppNs } from '../common/types.js'

export const generateControl: GenerateUtil<AppNs.Control> = (control) => {
  if (!isPlainObject(control)) {
    return
  }

  const value = {
    'app:draft': generateYesNoBoolean(control.draft),
  }

  return trimObject(value)
}

export const generateCategory: GenerateUtil<AppNs.Category> = (category) => {
  if (!isPlainObject(category)) {
    return
  }

  const value = {
    '@term': generatePlainString(category.term),
    '@scheme': generatePlainString(category.scheme),
    '@label': generatePlainString(category.label),
  }

  return trimObject(value)
}

export const generateCategories: GenerateUtil<AppNs.Categories> = (categories) => {
  if (!isPlainObject(categories)) {
    return
  }

  const value = {
    '@href': generatePlainString(categories.href),
    '@fixed': generateYesNoBoolean(categories.fixed),
    '@scheme': generatePlainString(categories.scheme),
    category: trimArray(categories.categories, generateCategory),
  }

  return trimObject(value)
}

// The atom:title and atom:category children stay unprefixed: they inherit the Atom default
// namespace of the generated feed.
export const generateCollection: GenerateUtil<AppNs.Collection> = (collection) => {
  if (!isPlainObject(collection)) {
    return
  }

  const value = {
    '@href': generatePlainString(collection.href),
    title: generateText(collection.title),
    // RFC 5023 §8.3.4: an empty app:accept means the collection accepts no new entries.
    'app:accept': trimArray(collection.accepts, (accept) => {
      return accept === '' ? '' : generateCdataString(accept)
    }),
    'app:categories': trimArray(collection.categories, generateCategories),
  }

  return trimObject(value)
}

export const generateEntry: GenerateUtil<AppNs.Entry<DateLike>> = (entry) => {
  if (!isPlainObject(entry)) {
    return
  }

  const value = {
    'app:edited': generateRfc3339Date(entry.edited),
    'app:control': generateControl(entry.control),
  }

  return trimObject(value)
}

export const generateFeed: GenerateUtil<AppNs.Feed> = (feed) => {
  if (!isPlainObject(feed)) {
    return
  }

  const value = {
    'app:collection': trimArray(feed.collections, generateCollection),
  }

  return trimObject(value)
}
