import type { Requirable, Strict } from '../../../common/types.js'

// #region reference
export namespace BylineNs {
  export type Profile<TStrict extends boolean = false> = Strict<
    {
      href: Requirable<string> // Required in spec
      rel?: string
    },
    TStrict
  >

  export type Theme = {
    color?: string
    accent?: string
    style?: string
  }

  export type Person<TStrict extends boolean = false> = Strict<
    {
      id: Requirable<string> // Required in spec
      name: Requirable<string> // Required in spec
      context?: string
      urls?: Array<string>
      avatar?: string
      profiles?: Array<Profile<TStrict>>
      now?: string
      uses?: string
      theme?: Theme
    },
    TStrict
  >

  export type Org = {
    id?: string
    name?: string
    url?: string
    type?: string
    theme?: Theme
  }

  export type Author<TStrict extends boolean = false> = {
    ref?: string
    person?: Person<TStrict>
  }

  export type Affiliation = {
    org?: string
    relationship?: string
    title?: string
  }

  export type Feed<TStrict extends boolean = false> = {
    contributors?: Array<Person<TStrict>>
    organizations?: Array<Org>
  }

  export type Item<TStrict extends boolean = false> = {
    author?: Author<TStrict>
    role?: string
    perspective?: string
    affiliation?: Affiliation
  }
}
// #endregion reference
