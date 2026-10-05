import { isPlainObject, trimObject } from 'trousse'
import type { ParseUtilPartial, Unreliable } from '../../../common/types.js'
import {
  parseArrayOf,
  parseSingular,
  parseSingularOf,
  parseString,
  retrieveRdfResourceOrText,
  retrieveText,
} from '../../../common/utils.js'
import type { TaxoNs } from '../common/types.js'

export const parseTopics: ParseUtilPartial<Array<string>> = (value) => {
  if (!isPlainObject(value)) {
    return
  }

  const bag = parseSingular(value.bag as Unreliable)

  return parseArrayOf(bag?.li, (value) => retrieveRdfResourceOrText(value, parseString))
}

export const parseTopic: ParseUtilPartial<TaxoNs.Topic> = (value) => {
  if (!isPlainObject(value)) {
    return
  }

  const topic = {
    about: parseString(value['@about']) ?? parseString(value['@rdf:about']),
    link: parseSingularOf(value['taxo:link'], (value) => parseString(retrieveText(value))),
    topics: parseSingularOf(value['taxo:topics'], parseTopics),
  }

  return trimObject(topic)
}

export const retrieveItemOrFeed: ParseUtilPartial<TaxoNs.ItemOrFeed> = (value) => {
  if (!isPlainObject(value)) {
    return
  }

  const itemOrFeed = {
    topics: parseSingularOf(value['taxo:topics'], parseTopics),
  }

  return trimObject(itemOrFeed)
}

// The taxo:topic elements sit at the root, beside the channel, not inside it.
export const retrieveFeed: ParseUtilPartial<TaxoNs.Feed> = (value) => {
  if (!isPlainObject(value)) {
    return
  }

  const feed = {
    ...retrieveItemOrFeed(parseSingular(value.channel as Unreliable)),
    topicDefinitions: parseArrayOf(value['taxo:topic'], parseTopic),
  }

  return trimObject(feed)
}
