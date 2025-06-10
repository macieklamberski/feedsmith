import { createCaseInsensitiveGetter, isNonEmptyString, isObject } from '../../../common/utils.js'

export const detect = (value: unknown): value is object => {
  if (!isObject(value)) {
    return false
  }

  const get = createCaseInsensitiveGetter(value)
  const version = get('version')

  if (isNonEmptyString(version)) {
    return version.includes('jsonfeed.org/version/')
  }

  const hasTitle = isNonEmptyString(get('title'))
  const hasItems = Array.isArray(get('items'))
  const hasJsonFeedProps = !!(get('home_page_url') || get('feed_url') || get('authors'))

  return hasTitle && (hasItems || hasJsonFeedProps)
}
