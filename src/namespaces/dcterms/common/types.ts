import type { DateLike } from '../../../common/types.js'

// #region reference
export namespace DcTermsNs {
  export type ItemOrFeed<TDate extends DateLike> = {
    abstracts?: Array<string>
    accessRights?: Array<string>
    accrualMethods?: Array<string>
    accrualPeriodicities?: Array<string>
    accrualPolicies?: Array<string>
    alternatives?: Array<string>
    audiences?: Array<string>
    available?: Array<TDate>
    bibliographicCitations?: Array<string>
    conformsTo?: Array<string>
    contributors?: Array<string>
    coverages?: Array<string>
    created?: Array<TDate>
    creators?: Array<string>
    dateAccepted?: Array<TDate>
    dateCopyrighted?: Array<TDate>
    dates?: Array<TDate>
    dateSubmitted?: Array<TDate>
    descriptions?: Array<string>
    educationLevels?: Array<string>
    extents?: Array<string>
    formats?: Array<string>
    hasFormats?: Array<string>
    hasParts?: Array<string>
    hasVersions?: Array<string>
    identifiers?: Array<string>
    instructionalMethods?: Array<string>
    isFormatOf?: Array<string>
    isPartOf?: Array<string>
    isReferencedBy?: Array<string>
    isReplacedBy?: Array<string>
    isRequiredBy?: Array<string>
    issued?: Array<TDate>
    isVersionOf?: Array<string>
    languages?: Array<string>
    licenses?: Array<string>
    mediators?: Array<string>
    mediums?: Array<string>
    modified?: Array<TDate>
    provenances?: Array<string>
    publishers?: Array<string>
    references?: Array<string>
    relations?: Array<string>
    replaces?: Array<string>
    requires?: Array<string>
    rights?: Array<string>
    rightsHolders?: Array<string>
    sources?: Array<string>
    spatials?: Array<string>
    subjects?: Array<string>
    tableOfContents?: Array<string>
    temporals?: Array<string>
    titles?: Array<string>
    types?: Array<string>
    valid?: Array<TDate>
  }
}
// #endregion reference
