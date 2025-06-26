import type { DateLike } from '../../../common/types.js'

export type Feed<TDate extends DateLike> = {
  updatePeriod?: string
  updateFrequency?: number
  updateBase?: TDate // Date: W3C-DTF/ISO 8601.
}
