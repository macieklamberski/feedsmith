// #region reference
export namespace SpotifyNs {
  export type Limit = {
    recentCount?: number
  }

  export type Partner = {
    id?: string // Required in spec.
  }

  export type Sandbox = {
    enabled?: boolean // Required in spec.
  }

  export type FeedAccess = {
    partner?: Partner
    sandbox?: Sandbox
  }

  export type Entitlement = {
    name?: string // Required in spec.
  }

  export type ItemAccess = {
    entitlement?: Entitlement
  }

  export type Feed = {
    limit?: Limit
    countryOfOrigin?: string
    access?: FeedAccess
  }

  export type Item = {
    access?: ItemAccess
  }
}
// #endregion reference
