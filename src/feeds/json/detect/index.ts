import { isObject } from '../../../common/utils'

export const detect = (value: unknown): value is object => {
  return isObject(value)
}
