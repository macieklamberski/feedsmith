import type { Requirable, Strict } from '../../../common/types.js'

// #region reference
export namespace FeedBurnerNs {
  export type FeedFlare<TStrict extends boolean = false> = Strict<
    {
      href: Requirable<string> // Required in spec
      src: Requirable<string> // Required in spec
      value?: string
    },
    TStrict
  >

  export type Feed<TStrict extends boolean = false> = {
    info?: string
    feedFlares?: Array<FeedFlare<TStrict>>
    browserFriendly?: string
    emailServiceId?: string
    feedburnerHostname?: string
    awareness?: string
  }

  export type Item = {
    origLink?: string
    origEnclosureLink?: string
  }
}
// #endregion reference
