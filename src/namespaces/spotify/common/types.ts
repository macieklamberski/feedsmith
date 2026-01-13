import type { Requirable, Strict } from '../../../common/types.js'

// #region reference
export namespace SpotifyNs {
  export type Limit = {
    recentCount?: number
  }

  export type Partner<TStrict extends boolean = false> = Strict<
    {
      id: Requirable<string> // Required in spec.
    },
    TStrict
  >

  export type Sandbox<TStrict extends boolean = false> = Strict<
    {
      enabled: Requirable<boolean> // Required in spec.
    },
    TStrict
  >

  export type FeedAccess<TStrict extends boolean = false> = {
    partner?: Partner<TStrict>
    sandbox?: Sandbox<TStrict>
  }

  export type Entitlement<TStrict extends boolean = false> = Strict<
    {
      name: Requirable<string> // Required in spec.
    },
    TStrict
  >

  export type ItemAccess<TStrict extends boolean = false> = {
    entitlement?: Entitlement<TStrict>
  }

  export type Feed<TStrict extends boolean = false> = {
    limit?: Limit
    countryOfOrigin?: string
    access?: FeedAccess<TStrict>
  }

  export type Item<TStrict extends boolean = false> = {
    access?: ItemAccess<TStrict>
  }
}
// #endregion reference
