// #region reference
export namespace SourceNs {
  export type Account = {
    service?: string // Required in spec.
    value?: string
  }

  export type Likes = {
    server?: string // Required in spec.
  }

  export type Archive = {
    url?: string // Required in spec.
    startDay?: string // Required in spec.
    endDay?: string
    filename?: string
  }

  export type SubscriptionList = {
    url?: string // Required in spec.
    value?: string
  }

  export type Feed = {
    accounts?: Array<Account>
    likes?: Likes
    archive?: Archive
    subscriptionLists?: Array<SubscriptionList>
    cloud?: string
    blogroll?: string
    self?: string
  }

  export type Item = {
    markdown?: string
    outlines?: Array<string>
    localTime?: string
    linkFull?: string
  }
}
// #endregion reference
