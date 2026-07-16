// #region reference
export namespace BylineNs {
  export type Profile = {
    href: string
    rel?: string
  }

  export type Theme = {
    color?: string
    accent?: string
    style?: string
  }

  export type Person = {
    id?: string
    name: string
    context?: string
    urls?: Array<string>
    avatar?: string
    profiles?: Array<Profile>
    now?: string
    uses?: string
    theme?: Theme
  }

  export type Org = {
    id?: string
    name: string
    url?: string
    type?: string
    theme?: Theme
  }

  export type Author = {
    ref?: string
    person?: Person
  }

  export type Affiliation = {
    org?: string
    relationship?: string
    title?: string
  }

  export type Feed = {
    contributors?: Array<Person>
    organizations?: Array<Org>
  }

  export type Item = {
    author?: Author
    role?: string
    perspective?: string
    affiliation?: Affiliation
  }
}
// #endregion reference
