import { isNonEmptyString, isObject, parseJsonObject } from '../../../common/utils.js'
import { createCaseInsensitiveGetter } from '../parse/utils.js'

export const detect = (value: unknown): value is object => {
  const json = parseJsonObject(value)

  if (!isObject(json)) {
    return false
  }

  const get = createCaseInsensitiveGetter(json)
  const version = get('version')

  if (isNonEmptyString(version)) {
    return version.includes('jsonfeed.org/version/')
  }

  const hasTitle = isNonEmptyString(get('title'))
  const hasItems = Array.isArray(get('items'))
  const hasJsonFeedProps = !!(get('home_page_url') || get('feed_url') || get('authors'))

  return hasTitle && (hasItems || hasJsonFeedProps)
}
