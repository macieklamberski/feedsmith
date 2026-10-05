// #region reference
export namespace TaxoNs {
  export type Topic = {
    about?: string
    link?: string
    topics?: Array<string>
  }

  export type ItemOrFeed = {
    topics?: Array<string>
  }

  export type Feed = ItemOrFeed & {
    topicDefinitions?: Array<Topic>
  }
}
// #endregion reference
