import type { DcNs } from '../../dc/common/types.js'

// #region reference
export namespace ImageNs {
  export type Image<TDate> = {
    about?: string
    resource?: string
    width?: number
    height?: number
    dc?: DcNs.ItemOrFeed<TDate>
  }

  export type Favicon<TDate> = {
    about?: string
    size?: string
    dc?: DcNs.ItemOrFeed<TDate>
  }

  export type Feed<TDate> = {
    favicon?: Favicon<TDate>
  }

  export type Item<TDate> = {
    item?: Image<TDate>
    favicon?: Favicon<TDate>
  }
}
// #endregion reference
