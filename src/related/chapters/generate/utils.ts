import type { GenerateUtil } from '../../../common/types.js'
import {
  generateBoolean,
  generateNumber,
  generatePlainString,
  isObject,
  trimArray,
  trimObject,
} from '../../../common/utils.js'
import type { Chapters } from '../common/types.js'

export const generateLocation: GenerateUtil<Chapters.Location> = (location) => {
  if (!isObject(location)) {
    return
  }

  const value = {
    name: generatePlainString(location.name),
    geo: generatePlainString(location.geo),
    osm: generatePlainString(location.osm),
  }

  return trimObject(value)
}

export const generateChapter: GenerateUtil<Chapters.Chapter> = (chapter) => {
  if (!isObject(chapter)) {
    return
  }

  const value = {
    startTime: generateNumber(chapter.startTime),
    title: generatePlainString(chapter.title),
    img: generatePlainString(chapter.img),
    url: generatePlainString(chapter.url),
    toc: generateBoolean(chapter.toc),
    endTime: generateNumber(chapter.endTime),
    location: generateLocation(chapter.location),
  }

  return trimObject(value)
}

export const generateDocument: GenerateUtil<Chapters.Document> = (document) => {
  if (!isObject(document)) {
    return
  }

  const value = {
    version: '1.2.0',
    chapters: trimArray(document.chapters, generateChapter),
    author: generatePlainString(document.author),
    title: generatePlainString(document.title),
    podcastName: generatePlainString(document.podcastName),
    description: generatePlainString(document.description),
    fileName: generatePlainString(document.fileName),
    waypoints: generateBoolean(document.waypoints),
  }

  return trimObject(value)
}
