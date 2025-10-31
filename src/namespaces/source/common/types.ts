// #region reference
export namespace SourceNs {
  export type Account = {
    service: string
    value?: string
  }

  export type Likes = {
    server: string
  }

  export type Archive = {
    url: string
    startDay: string
    endDay?: string
    filename?: string
  }

  export type SubscriptionList = {
    url: string
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
