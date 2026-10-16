import { isPlainObject, trimObject } from 'trousse'
import type { ParseUtilPartial } from '../../../common/types.js'
import {
  parseArrayOf,
  parseSingular,
  parseSingularOf,
  parseString,
  retrieveRdfResourceOrText,
  retrieveText,
} from '../../../common/utils.js'
import type { ContentNs } from '../common/types.js'

// The spec names the RDF parts only with the rdf prefix. RDF feeds read rdf as the primary
// namespace, so there they arrive unprefixed and the RDF parser passes an empty rdfPrefix.
type ParseOptions = {
  rdfPrefix?: string
}

export const parseContentItem: ParseUtilPartial<ContentNs.ContentItem, ParseOptions> = (
  value,
  options,
) => {
  if (!isPlainObject(value)) {
    return
  }

  const rdf = options?.rdfPrefix ?? 'rdf:'
  const contentItem = {
    about: parseString(value[`@${rdf}about`]),
    format: parseSingularOf(value['content:format'], (value) => {
      return retrieveRdfResourceOrText(value, parseString)
    }),
    encoding: parseSingularOf(value['content:encoding'], (value) => {
      return retrieveRdfResourceOrText(value, parseString)
    }),
    value: parseSingularOf(value[`${rdf}value`], (value) => {
      return parseString(retrieveText(value))
    }),
  }

  return trimObject(contentItem)
}

export const parseItems: ParseUtilPartial<Array<ContentNs.ContentItem>, ParseOptions> = (
  value,
  options,
) => {
  if (!isPlainObject(value)) {
    return
  }

  const rdf = options?.rdfPrefix ?? 'rdf:'
  const bag = parseSingular(value[`${rdf}bag`])

  if (!isPlainObject(bag)) {
    return
  }

  return parseArrayOf(bag[`${rdf}li`], (value) => {
    return parseSingularOf(value?.['content:item'], (value) => parseContentItem(value, options))
  })
}

export const retrieveItem: ParseUtilPartial<ContentNs.Item, ParseOptions> = (value, options) => {
  if (!isPlainObject(value)) {
    return
  }

  const item = {
    encoded: parseSingularOf(value['content:encoded'], (value) => parseString(retrieveText(value))),
    items: parseSingularOf(value['content:items'], (value) => parseItems(value, options)),
  }

  return trimObject(item)
}

export const retrieveFeed: ParseUtilPartial<ContentNs.Feed, ParseOptions> = (value, options) => {
  if (!isPlainObject(value)) {
    return
  }

  const feed = {
    items: parseSingularOf(value['content:items'], (value) => parseItems(value, options)),
  }

  return trimObject(feed)
}
