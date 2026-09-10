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
  const segments = get('segments')

  // If version is present, it must start with '1.'
  if (isNonEmptyString(version)) {
    return version.startsWith('1.')
  }

  // If no version, check for valid segments structure
  if (Array.isArray(segments) && segments.length > 0) {
    const firstSegment = segments[0]

    if (isObject(firstSegment)) {
      const getSegment = createCaseInsensitiveGetter(firstSegment)
      return (
        typeof getSegment('startTime') === 'number' &&
        typeof getSegment('speaker') === 'string' &&
        typeof getSegment('body') === 'string'
      )
    }
  }

  return false
}
