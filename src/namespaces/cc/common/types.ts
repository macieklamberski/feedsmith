// #region reference
export namespace CcNs {
  export type ItemOrFeed = {
    license?: string
    morePermissions?: string
    attributionName?: string
    attributionURL?: string
    useGuidelines?: string
    permits?: string
    requires?: string
    prohibits?: string
    jurisdiction?: string
    legalcode?: string
    deprecatedOn?: string
  }

  export type License = {
    about?: string
    permits?: Array<string>
    requires?: Array<string>
    prohibits?: Array<string>
    jurisdiction?: string
    legalcode?: string
    deprecatedOn?: string
  }

  export type Feed = ItemOrFeed & {
    licenses?: Array<License>
  }
}
// #endregion reference
