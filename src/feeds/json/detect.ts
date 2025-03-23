import { isObject } from '../../common/utils'

export type Detect = (value: unknown) => boolean

export const detect: Detect = (value): value is object => {
  return isObject(value)
}
