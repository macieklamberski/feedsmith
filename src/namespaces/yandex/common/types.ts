// #region reference
export namespace YandexNs {
  export type Logo = {
    type?: string
    value?: string
  }

  export type Analytics = {
    type?: string
    id?: string
    params?: string
    url?: string
  }

  export type AdNetwork = {
    type?: string
    id?: string
    turboAdId?: string
    value?: string
  }

  export type RelatedLink = {
    url?: string
    img?: string
    value?: string
  }

  export type Related = {
    type?: string
    links?: Array<RelatedLink>
  }

  export type CommentText = {
    origin?: string
    originName?: string
    logo?: string
    anchor?: string
    value?: string
  }

  export type OfficialComment = {
    commentText?: CommentText
    bindTos?: Array<string>
  }

  export type Feed = {
    logos?: Array<Logo>
    /** @deprecated Defined only by older Yandex Turbo pages requirements. */
    analytics?: Array<Analytics>
    /** @deprecated Defined only by older Yandex Turbo pages requirements. */
    adNetworks?: Array<AdNetwork>
  }

  export type Item = {
    fullText?: string
    genre?: string
    themeTags?: Array<string>
    /** @deprecated Defined only by older Yandex News requirements. */
    related?: Related
    /** @deprecated Defined only by older Yandex News requirements. */
    online?: string
    /** @deprecated Defined only by older Yandex News requirements. */
    tags?: Array<string>
    /** @deprecated Defined only by older Yandex News requirements. */
    officialComment?: OfficialComment
  }
}
// #endregion reference
