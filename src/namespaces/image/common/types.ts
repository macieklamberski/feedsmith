import type { Requirable, Strict } from '../../../common/types.js'
import type { DcNs } from '../../dc/common/types.js'

// #region reference
export namespace ImageNs {
  export type Image<TDate, TStrict extends boolean = false> = Strict<
    {
      about: Requirable<string> // Required in spec
      resource?: string
      width?: number
      height?: number
      dc?: DcNs.ItemOrFeed<TDate>
    },
    TStrict
  >

  export type Favicon<TDate> = {
    about?: string
    size?: string
    dc?: DcNs.ItemOrFeed<TDate>
  }

  export type Feed<TDate> = {
    favicon?: Favicon<TDate>
  }

  export type Item<TDate, TStrict extends boolean = false> = {
    item?: Image<TDate, TStrict>
    favicon?: Favicon<TDate>
  }
}
// #endregion reference
