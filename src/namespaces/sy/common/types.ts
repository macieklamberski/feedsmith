import type { DateLike } from '../../../common/types.js'

// #region reference
export namespace Sy {
  export type Feed<TDate extends DateLike> = {
    updatePeriod?: string
    updateFrequency?: number
    updateBase?: TDate
  }
}
// #endregion reference
