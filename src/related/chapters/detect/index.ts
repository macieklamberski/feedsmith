import {
  createCaseInsensitiveGetter,
  isNonEmptyString,
  isObject,
  parseJsonObject,
} from '../../../common/utils.js'

export const detect = (value: unknown): value is object => {
  const json = parseJsonObject(value)

  if (!isObject(json)) {
    return false
  }

  const get = createCaseInsensitiveGetter(json)
  const version = get('version')
  const chapters = get('chapters')

  // If version is present, it must start with '1.'
  if (isNonEmptyString(version)) {
    return version.startsWith('1.')
  }

  // If no version, check for valid chapters structure
  if (Array.isArray(chapters) && chapters.length > 0) {
    const firstChapter = chapters[0]

    if (isObject(firstChapter)) {
      const getChapter = createCaseInsensitiveGetter(firstChapter)
      return typeof getChapter('startTime') === 'number'
    }
  }

  return false
}
