import { isNonEmptyString } from '../../../common/utils.js'

export const detect = (value: unknown): value is string => {
  if (!isNonEmptyString(value)) {
    return false
  }

  const hasFeedElement = /(?:^|[\s>])<(?:\w+:)?feed[\s>]/im.test(value)

  if (!hasFeedElement) {
    return false
  }

  const hasAtomNamespace = value.includes('http://www.w3.org/2005/Atom')
  const hasAtomElements = /(<(?:\w+:)?(entry|title|link|id|updated|summary)[\s>])/i.test(value)

  return hasAtomNamespace || hasAtomElements
}
