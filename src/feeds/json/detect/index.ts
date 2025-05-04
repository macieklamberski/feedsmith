import { isObject } from '../../../common/utils.js'

export const detect = (value: unknown): value is object => {
  return isObject(value)
}
