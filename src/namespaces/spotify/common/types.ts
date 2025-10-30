// #region reference
export namespace SpotifyNs {
  export type Limit = {
    recentCount?: number
  }

  export type Partner = {
    id: string
  }

  export type Sandbox = {
    enabled: boolean
  }

  export type FeedAccess = {
    partner?: Partner
    sandbox?: Sandbox
  }

  export type Entitlement = {
    name: string
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
