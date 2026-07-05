import type { Requirable, Strict } from '../../../common/types.js'

// #region reference
export namespace SourceNs {
  export type Account<TStrict extends boolean = false> = Strict<
    {
      service: Requirable<string> // Required in spec.
      value?: string
    },
    TStrict
  >

  export type Likes<TStrict extends boolean = false> = Strict<
    {
      server: Requirable<string> // Required in spec.
    },
    TStrict
  >

  export type Archive<TStrict extends boolean = false> = Strict<
    {
      url: Requirable<string> // Required in spec.
      startDay: Requirable<string> // Required in spec.
      endDay?: string
      filename?: string
    },
    TStrict
  >

  export type SubscriptionList<TStrict extends boolean = false> = Strict<
    {
      url: Requirable<string> // Required in spec.
      value?: string
    },
    TStrict
  >

  export type InReplyTo<TStrict extends boolean = false> = Strict<
    {
      value: Requirable<string> // Required in spec.
      isPermaLink?: boolean
    },
    TStrict
  >

  export type Feed<TStrict extends boolean = false> = {
    accounts?: Array<Account<TStrict>>
    likes?: Likes<TStrict>
    archive?: Archive<TStrict>
    subscriptionLists?: Array<SubscriptionList<TStrict>>
    cloud?: string
    blogroll?: string
    self?: string
    localTime?: string
  }

  export type Item<TStrict extends boolean = false> = {
    markdown?: string
    outlines?: Array<string>
    linkFull?: string
    inReplyTo?: InReplyTo<TStrict>
  }
}
// #endregion reference
