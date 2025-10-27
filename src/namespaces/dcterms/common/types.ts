import type { DateLike } from '../../../common/types.js'

// #region reference
export namespace DctermsNs {
  export type ItemOrFeed<TDate extends DateLike> = {
    abstracts?: Array<string>
    accessRights?: Array<string>
    accrualMethods?: Array<string>
    accrualPeriodicities?: Array<string>
    accrualPolicies?: Array<string>
    alternatives?: Array<string>
    audiences?: Array<string>
    availables?: Array<TDate>
    bibliographicCitations?: Array<string>
    conformsTos?: Array<string>
    contributors?: Array<string>
    coverages?: Array<string>
    createds?: Array<TDate>
    creators?: Array<string>
    dates?: Array<TDate>
    dateAccepteds?: Array<TDate>
    dateCopyrighteds?: Array<TDate>
    dateSubmitteds?: Array<TDate>
    descriptions?: Array<string>
    educationLevels?: Array<string>
    extents?: Array<string>
    formats?: Array<string>
    hasFormats?: Array<string>
    hasParts?: Array<string>
    hasVersions?: Array<string>
    identifiers?: Array<string>
    instructionalMethods?: Array<string>
    isFormatOfs?: Array<string>
    isPartOfs?: Array<string>
    isReferencedBys?: Array<string>
    isReplacedBys?: Array<string>
    isRequiredBys?: Array<string>
    issueds?: Array<TDate>
    isVersionOfs?: Array<string>
    languages?: Array<string>
    licenses?: Array<string>
    mediators?: Array<string>
    mediums?: Array<string>
    modifieds?: Array<TDate>
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
    valids?: Array<TDate>

    /** @deprecated Use `abstracts` (array) instead. Dublin Core Terms fields are repeatable. */
    abstract?: string
    /** @deprecated Use `accrualMethods` (array) instead. Dublin Core Terms fields are repeatable. */
    accrualMethod?: string
    /** @deprecated Use `accrualPeriodicities` (array) instead. Dublin Core Terms fields are repeatable. */
    accrualPeriodicity?: string
    /** @deprecated Use `accrualPolicies` (array) instead. Dublin Core Terms fields are repeatable. */
    accrualPolicy?: string
    /** @deprecated Use `alternatives` (array) instead. Dublin Core Terms fields are repeatable. */
    alternative?: string
    /** @deprecated Use `audiences` (array) instead. Dublin Core Terms fields are repeatable. */
    audience?: string
    /** @deprecated Use `availables` (array) instead. Dublin Core Terms fields are repeatable. */
    available?: TDate
    /** @deprecated Use `bibliographicCitations` (array) instead. Dublin Core Terms fields are repeatable. */
    bibliographicCitation?: string
    /** @deprecated Use `conformsTos` (array) instead. Dublin Core Terms fields are repeatable. */
    conformsTo?: string
    /** @deprecated Use `contributors` (array) instead. Dublin Core Terms fields are repeatable. */
    contributor?: string
    /** @deprecated Use `coverages` (array) instead. Dublin Core Terms fields are repeatable. */
    coverage?: string
    /** @deprecated Use `createds` (array) instead. Dublin Core Terms fields are repeatable. */
    created?: TDate
    /** @deprecated Use `creators` (array) instead. Dublin Core Terms fields are repeatable. */
    creator?: string
    /** @deprecated Use `dates` (array) instead. Dublin Core Terms fields are repeatable. */
    date?: TDate
    /** @deprecated Use `dateAccepteds` (array) instead. Dublin Core Terms fields are repeatable. */
    dateAccepted?: TDate
    /** @deprecated Use `dateCopyrighteds` (array) instead. Dublin Core Terms fields are repeatable. */
    dateCopyrighted?: TDate
    /** @deprecated Use `dateSubmitteds` (array) instead. Dublin Core Terms fields are repeatable. */
    dateSubmitted?: TDate
    /** @deprecated Use `descriptions` (array) instead. Dublin Core Terms fields are repeatable. */
    description?: string
    /** @deprecated Use `educationLevels` (array) instead. Dublin Core Terms fields are repeatable. */
    educationLevel?: string
    /** @deprecated Use `extents` (array) instead. Dublin Core Terms fields are repeatable. */
    extent?: string
    /** @deprecated Use `formats` (array) instead. Dublin Core Terms fields are repeatable. */
    format?: string
    /** @deprecated Use `hasFormats` (array) instead. Dublin Core Terms fields are repeatable. */
    hasFormat?: string
    /** @deprecated Use `hasParts` (array) instead. Dublin Core Terms fields are repeatable. */
    hasPart?: string
    /** @deprecated Use `hasVersions` (array) instead. Dublin Core Terms fields are repeatable. */
    hasVersion?: string
    /** @deprecated Use `identifiers` (array) instead. Dublin Core Terms fields are repeatable. */
    identifier?: string
    /** @deprecated Use `instructionalMethods` (array) instead. Dublin Core Terms fields are repeatable. */
    instructionalMethod?: string
    /** @deprecated Use `isFormatOfs` (array) instead. Dublin Core Terms fields are repeatable. */
    isFormatOf?: string
    /** @deprecated Use `isPartOfs` (array) instead. Dublin Core Terms fields are repeatable. */
    isPartOf?: string
    /** @deprecated Use `isReferencedBys` (array) instead. Dublin Core Terms fields are repeatable. */
    isReferencedBy?: string
    /** @deprecated Use `isReplacedBys` (array) instead. Dublin Core Terms fields are repeatable. */
    isReplacedBy?: string
    /** @deprecated Use `isRequiredBys` (array) instead. Dublin Core Terms fields are repeatable. */
    isRequiredBy?: string
    /** @deprecated Use `issueds` (array) instead. Dublin Core Terms fields are repeatable. */
    issued?: TDate
    /** @deprecated Use `isVersionOfs` (array) instead. Dublin Core Terms fields are repeatable. */
    isVersionOf?: string
    /** @deprecated Use `languages` (array) instead. Dublin Core Terms fields are repeatable. */
    language?: string
    /** @deprecated Use `licenses` (array) instead. Dublin Core Terms fields are repeatable. */
    license?: string
    /** @deprecated Use `mediators` (array) instead. Dublin Core Terms fields are repeatable. */
    mediator?: string
    /** @deprecated Use `mediums` (array) instead. Dublin Core Terms fields are repeatable. */
    medium?: string
    /** @deprecated Use `modifieds` (array) instead. Dublin Core Terms fields are repeatable. */
    modified?: TDate
    /** @deprecated Use `provenances` (array) instead. Dublin Core Terms fields are repeatable. */
    provenance?: string
    /** @deprecated Use `publishers` (array) instead. Dublin Core Terms fields are repeatable. */
    publisher?: string
    /** @deprecated Use `relations` (array) instead. Dublin Core Terms fields are repeatable. */
    relation?: string
    /** @deprecated Use `rightsHolders` (array) instead. Dublin Core Terms fields are repeatable. */
    rightsHolder?: string
    /** @deprecated Use `sources` (array) instead. Dublin Core Terms fields are repeatable. */
    source?: string
    /** @deprecated Use `spatials` (array) instead. Dublin Core Terms fields are repeatable. */
    spatial?: string
    /** @deprecated Use `subjects` (array) instead. Dublin Core Terms fields are repeatable. */
    subject?: string
    /** @deprecated Use `temporals` (array) instead. Dublin Core Terms fields are repeatable. */
    temporal?: string
    /** @deprecated Use `titles` (array) instead. Dublin Core Terms fields are repeatable. */
    title?: string
    /** @deprecated Use `types` (array) instead. Dublin Core Terms fields are repeatable. */
    type?: string
    /** @deprecated Use `valids` (array) instead. Dublin Core Terms fields are repeatable. */
    valid?: TDate
  }
}
// #endregion reference
