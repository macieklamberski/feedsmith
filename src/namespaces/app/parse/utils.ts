import { isPlainObject, trimObject } from 'trousse'
import type { DateAny, ParseMainOptions, ParseUtilPartial } from '../../../common/types.js'
import {
  parseArrayOf,
  parseDate,
  parseSingularOf,
  parseString,
  parseYesNoBoolean,
  retrieveText,
} from '../../../common/utils.js'
import { parseText } from '../../../feeds/atom/parse/utils.js'
import type { AppNs } from '../common/types.js'

export const parseControl: ParseUtilPartial<AppNs.Control> = (value) => {
  if (!isPlainObject(value)) {
    return
  }

  const control = {
    draft: parseSingularOf(value['app:draft'], (value) => parseYesNoBoolean(retrieveText(value))),
  }

  return trimObject(control)
}

export const parseCategory: ParseUtilPartial<AppNs.Category> = (value) => {
  if (!isPlainObject(value)) {
    return
  }

  const category = {
    term: parseString(value['@term']),
    scheme: parseString(value['@scheme']),
    label: parseString(value['@label']),
  }

  return trimObject(category)
}

export const parseCategories: ParseUtilPartial<AppNs.Categories> = (value) => {
  if (!isPlainObject(value)) {
    return
  }

  const categories = {
    href: parseString(value['@href']),
    fixed: parseYesNoBoolean(value['@fixed']),
    scheme: parseString(value['@scheme']),
    categories: parseArrayOf(value.category, parseCategory),
  }

  return trimObject(categories)
}

// Atom is the primary namespace of an Atom feed, so its elements inside the collection arrive
// unprefixed.
export const parseCollection: ParseUtilPartial<AppNs.Collection> = (value) => {
  if (!isPlainObject(value)) {
    return
  }

  const collection = {
    href: parseString(value['@href']),
    title: parseSingularOf(value.title, parseText),
    accepts: parseArrayOf(value['app:accept'], (value) => {
      const text = retrieveText(value)

      // RFC 5023 §8.3.4: an empty app:accept means the collection accepts no new entries.
      if (typeof text === 'string' && text.trim() === '') {
        return ''
      }

      return parseString(text)
    }),
    categories: parseArrayOf(value['app:categories'], parseCategories),
  }

  return trimObject(collection)
}

export const retrieveEntry: ParseUtilPartial<AppNs.Entry<DateAny>, ParseMainOptions<DateAny>> = (
  value,
  options,
) => {
  if (!isPlainObject(value)) {
    return
  }

  const entry = {
    edited: parseSingularOf(value['app:edited'], (value) =>
      parseDate(retrieveText(value), options?.parseDateFn),
    ),
    control: parseSingularOf(value['app:control'], parseControl),
  }

  return trimObject(entry)
}

export const retrieveFeed: ParseUtilPartial<AppNs.Feed> = (value) => {
  if (!isPlainObject(value)) {
    return
  }

  const feed = {
    collections: parseArrayOf(value['app:collection'], parseCollection),
  }

  return trimObject(feed)
}
