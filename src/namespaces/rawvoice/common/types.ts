import type { Requirable, Strict } from '../../../common/types.js'

// #region reference
export namespace RawVoiceNs {
  export type Rating = {
    value?: string
    tv?: string
    movie?: string
  }

  export type LiveStream<TDate, TStrict extends boolean = false> = Strict<
    {
      url?: string
      schedule: Requirable<TDate> // Required in spec.
      duration: Requirable<string> // Required in spec.
      type?: string
    },
    TStrict
  >

  export type Poster<TStrict extends boolean = false> = Strict<
    {
      url: Requirable<string> // Required in spec.
    },
    TStrict
  >

  export type AlternateEnclosure<TStrict extends boolean = false> = Strict<
    {
      src: Requirable<string> // Required in spec.
      type?: string
      length?: number
    },
    TStrict
  >

  export type Subscribe = Record<string, string>

  export type Metamark = {
    type?: string
    link?: string
    position?: number
    duration?: number
    value?: string
  }

  export type Donate<TStrict extends boolean = false> = Strict<
    {
      href: Requirable<string> // Required in spec.
      value?: string
    },
    TStrict
  >

  export type Feed<TDate, TStrict extends boolean = false> = {
    rating?: Rating
    liveEmbed?: string
    flashLiveStream?: LiveStream<TDate, TStrict>
    httpLiveStream?: LiveStream<TDate, TStrict>
    shoutcastLiveStream?: LiveStream<TDate, TStrict>
    liveStream?: LiveStream<TDate, TStrict>
    location?: string
    frequency?: string
    mycast?: boolean
    subscribe?: Subscribe
    donate?: Donate<TStrict>
  }

  export type Item<TStrict extends boolean = false> = {
    poster?: Poster<TStrict>
    isHd?: boolean
    embed?: string
    webm?: AlternateEnclosure<TStrict>
    mp4?: AlternateEnclosure<TStrict>
    metamarks?: Array<Metamark>
  }
}
// #endregion reference
