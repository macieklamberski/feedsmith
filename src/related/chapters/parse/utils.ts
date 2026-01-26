import type { ParsePartialUtil } from '../../../common/types.js'
import {
  createCaseInsensitiveGetter,
  isObject,
  parseArrayOf,
  parseBoolean,
  parseNumber,
  parseSingularOf,
  parseString,
  trimObject,
} from '../../../common/utils.js'
import type { Chapters } from '../common/types.js'

export const parseLocation: ParsePartialUtil<Chapters.Location> = (value) => {
  if (!isObject(value)) {
    return
  }

  const get = createCaseInsensitiveGetter(value)
  const location = {
    name: parseSingularOf(get('name'), parseString),
    geo: parseSingularOf(get('geo'), parseString),
    osm: parseSingularOf(get('osm'), parseString),
  }

  return trimObject(location)
}

export const parseChapter: ParsePartialUtil<Chapters.Chapter> = (value) => {
  if (!isObject(value)) {
    return
  }

  const get = createCaseInsensitiveGetter(value)
  const chapter = {
    startTime: parseSingularOf(get('startTime'), parseNumber),
    title: parseSingularOf(get('title'), parseString),
    img: parseSingularOf(get('img'), parseString),
    url: parseSingularOf(get('url'), parseString),
    toc: parseSingularOf(get('toc'), parseBoolean),
    endTime: parseSingularOf(get('endTime'), parseNumber),
    location: parseSingularOf(get('location'), parseLocation),
  }

  return trimObject(chapter)
}

export const parseDocument: ParsePartialUtil<Chapters.Document> = (value) => {
  if (!isObject(value)) {
    return
  }

  const get = createCaseInsensitiveGetter(value)
  const document = {
    chapters: parseArrayOf(get('chapters'), parseChapter),
    author: parseSingularOf(get('author'), parseString),
    title: parseSingularOf(get('title'), parseString),
    podcastName: parseSingularOf(get('podcastName'), parseString),
    description: parseSingularOf(get('description'), parseString),
    fileName: parseSingularOf(get('fileName'), parseString),
    waypoints: parseSingularOf(get('waypoints'), parseBoolean),
  }

  return trimObject(document)
}
