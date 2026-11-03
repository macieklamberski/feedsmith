import type { Requirable, Strict } from '../../../common/types.js'

// #region reference
export namespace EvNs {
  export type Item<TDate, TStrict extends boolean = false> = Strict<
    {
      startDate: Requirable<TDate> // Required in spec
      endDate?: TDate
      location?: string
      organizer?: string
      type?: string
    },
    TStrict
  >
}
// #endregion reference
