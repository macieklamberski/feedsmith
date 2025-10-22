import type { DateLike } from '../../../common/types.js'

// #region reference
export namespace SyNs {
  export type Feed<TDate extends DateLike> = {
    updatePeriod?: string
    updateFrequency?: number
    updateBase?: TDate
  }
}
// #endregion reference
