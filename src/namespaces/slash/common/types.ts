import type { AnyOf } from '../../../common/types.js'

export type HitParade = Array<number>

export type Item = AnyOf<{
  section?: string
  department?: string
  comments?: number
  hit_parade?: HitParade
}>
