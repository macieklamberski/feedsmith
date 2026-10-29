import { isPlainObject, trimObject } from 'trousse'
import type { GenerateUtil } from '../../../common/types.js'
import { generateCdataString } from '../../../common/utils.js'
import type { PhotoNs } from '../common/types.js'

export const generateItem: GenerateUtil<PhotoNs.Item> = (item) => {
  if (!isPlainObject(item)) {
    return
  }

  const value = {
    'photo:thumbnail': generateCdataString(item.thumbnail),
    'photo:imgsrc': generateCdataString(item.imgsrc),
  }

  return trimObject(value)
}
