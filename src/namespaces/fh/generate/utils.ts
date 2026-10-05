import { isPlainObject, trimObject } from 'trousse'
import type { GenerateUtil } from '../../../common/types.js'
import { generateBoolean, generateCdataString } from '../../../common/utils.js'
import type { FhNs } from '../common/types.js'

// An empty string makes the builder write the empty element RFC 5005 defines.
const generateFlag = (value: boolean | undefined): '' | undefined => {
  if (value === true) {
    return ''
  }
}

export const generateFeed: GenerateUtil<FhNs.Feed> = (feed) => {
  if (!isPlainObject(feed)) {
    return
  }

  const value = {
    'fh:complete': generateFlag(feed.complete),
    'fh:archive': generateFlag(feed.archive),
    'fh:incremental': generateBoolean(feed.incremental),
    'fh:prev': generateCdataString(feed.prev),
  }

  return trimObject(value)
}
