import type { DateLike } from '../../../common/types.js'

// #region reference
export namespace RawVoiceNs {
  export type Rating = {
    value?: string
    tv?: string
    movie?: string
  }

  export type LiveStream<TDate extends DateLike> = {
    url?: string
    schedule?: TDate
    duration?: string
    type?: string
  }

  export type Poster = {
    url?: string
  }

  export type AlternateEnclosure = {
    src?: string
    type?: string
    length?: number
  }

  export type Subscribe = Record<string, string>

  export type Metamark = {
    type?: string
    link?: string
    position?: number
    duration?: number
    value?: string
  }

  export type Donate = {
    href?: string // Required in spec.
    value?: string
  }

  export type Feed<TDate extends DateLike> = {
    rating?: Rating
    liveEmbed?: string
    flashLiveStream?: LiveStream<TDate>
    httpLiveStream?: LiveStream<TDate>
    shoutcastLiveStream?: LiveStream<TDate>
    liveStream?: LiveStream<TDate>
    location?: string
    frequency?: string
    mycast?: boolean
    subscribe?: Subscribe
    donate?: Donate
  }

  export type Item = {
    poster?: Poster
    isHd?: boolean
    embed?: string
    webm?: AlternateEnclosure
    mp4?: AlternateEnclosure
    metamarks?: Array<Metamark>
  }
}
// #endregion reference
