import { isPlainObject, trimObject } from 'trousse'
import type { DateAny, ParseMainOptions, ParseUtilPartial } from '../../../common/types.js'
import { parseNumber, parseSingularOf, parseString, retrieveText } from '../../../common/utils.js'
import { retrieveItemOrFeed as retrieveDcItemOrFeed } from '../../dc/parse/utils.js'
import type { ImageNs } from '../common/types.js'

export const parseImage: ParseUtilPartial<ImageNs.Image<DateAny>, ParseMainOptions<DateAny>> = (
  value,
  options,
) => {
  if (!isPlainObject(value)) {
    return
  }

  const image = {
    about: parseString(value['@about']) ?? parseString(value['@rdf:about']),
    resource: parseString(value['@resource']) ?? parseString(value['@rdf:resource']),
    width: parseSingularOf(value['image:width'], (value) => parseNumber(retrieveText(value))),
    height: parseSingularOf(value['image:height'], (value) => parseNumber(retrieveText(value))),
    dc: retrieveDcItemOrFeed(value, options),
  }

  return trimObject(image)
}

export const parseFavicon: ParseUtilPartial<ImageNs.Favicon<DateAny>, ParseMainOptions<DateAny>> = (
  value,
  options,
) => {
  if (!isPlainObject(value)) {
    return
  }

  const favicon = {
    about: parseString(value['@about']) ?? parseString(value['@rdf:about']),
    size: parseString(value['@image:size']),
    dc: retrieveDcItemOrFeed(value, options),
  }

  return trimObject(favicon)
}

export const retrieveFeed: ParseUtilPartial<ImageNs.Feed<DateAny>, ParseMainOptions<DateAny>> = (
  value,
  options,
) => {
  if (!isPlainObject(value)) {
    return
  }

  const feed = {
    favicon: parseSingularOf(value['image:favicon'], (value) => parseFavicon(value, options)),
  }

  return trimObject(feed)
}

export const retrieveItem: ParseUtilPartial<ImageNs.Item<DateAny>, ParseMainOptions<DateAny>> = (
  value,
  options,
) => {
  if (!isPlainObject(value)) {
    return
  }

  const item = {
    item: parseSingularOf(value['image:item'], (value) => parseImage(value, options)),
    favicon: parseSingularOf(value['image:favicon'], (value) => parseFavicon(value, options)),
  }

  return trimObject(item)
}
