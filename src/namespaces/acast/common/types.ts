// #region reference
export namespace AcastNs {
  export type Signature = {
    key?: string
    algorithm?: string
    value?: string
  }

  export type Network = {
    id?: string
    slug?: string
    value?: string
  }

  export type Feed = {
    showId?: string
    showUrl?: string
    signature?: Signature
    settings?: string
    network?: Network
    importedFeed?: string
  }

  export type Item = {
    episodeId?: string
    showId?: string
    episodeUrl?: string
    settings?: string
  }
}
// #endregion reference
