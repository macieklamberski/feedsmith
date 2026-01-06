import type { DateLike } from '../../../common/types.js'

// #region reference
export namespace DcTermsNs {
  export type ItemOrFeed<TDate extends DateLike> = {
    abstracts?: Array<string>
    accrualMethods?: Array<string>
    accrualPeriodicities?: Array<string>
    accrualPolicies?: Array<string>
    alternatives?: Array<string>
    audiences?: Array<string>
    bibliographicCitations?: Array<string>
    contributors?: Array<string>
    coverages?: Array<string>
    creators?: Array<string>
    dates?: Array<TDate>
    descriptions?: Array<string>
    educationLevels?: Array<string>
    extents?: Array<string>
    formats?: Array<string>
    hasFormats?: Array<string>
    hasParts?: Array<string>
    hasVersions?: Array<string>
    identifiers?: Array<string>
    instructionalMethods?: Array<string>
    languages?: Array<string>
    licenses?: Array<string>
    mediators?: Array<string>
    mediums?: Array<string>
    provenances?: Array<string>
    publishers?: Array<string>
    relations?: Array<string>
    rightsHolders?: Array<string>
    sources?: Array<string>
    spatials?: Array<string>
    subjects?: Array<string>
    temporals?: Array<string>
    titles?: Array<string>
    types?: Array<string>

    /** @deprecated Use `abstracts` (array) instead. Dublin Core Terms fields are repeatable. */
    abstract?: string
    /** @deprecated This field type will be changed to array in the next major version of the package. Dublin Core Terms fields are repeatable. */
    accessRights?: string
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
    /** @deprecated This field type will be changed to array in the next major version of the package. Dublin Core Terms fields are repeatable. */
    available?: TDate
    /** @deprecated Use `bibliographicCitations` (array) instead. Dublin Core Terms fields are repeatable. */
    bibliographicCitation?: string
    /** @deprecated This field type will be changed to array in the next major version of the package. Dublin Core Terms fields are repeatable. */
    conformsTo?: string
    /** @deprecated Use `contributors` (array) instead. Dublin Core Terms fields are repeatable. */
    contributor?: string
    /** @deprecated Use `coverages` (array) instead. Dublin Core Terms fields are repeatable. */
    coverage?: string
    /** @deprecated This field type will be changed to array in the next major version of the package. Dublin Core Terms fields are repeatable. */
    created?: TDate
    /** @deprecated Use `creators` (array) instead. Dublin Core Terms fields are repeatable. */
    creator?: string
    /** @deprecated Use `dates` (array) instead. Dublin Core Terms fields are repeatable. */
    date?: TDate
    /** @deprecated This field type will be changed to array in the next major version of the package. Dublin Core Terms fields are repeatable. */
    dateAccepted?: TDate
    /** @deprecated This field type will be changed to array in the next major version of the package. Dublin Core Terms fields are repeatable. */
    dateCopyrighted?: TDate
    /** @deprecated This field type will be changed to array in the next major version of the package. Dublin Core Terms fields are repeatable. */
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
    /** @deprecated This field type will be changed to array in the next major version of the package. Dublin Core Terms fields are repeatable. */
    isFormatOf?: string
    /** @deprecated This field type will be changed to array in the next major version of the package. Dublin Core Terms fields are repeatable. */
    isPartOf?: string
    /** @deprecated This field type will be changed to array in the next major version of the package. Dublin Core Terms fields are repeatable. */
    isReferencedBy?: string
    /** @deprecated This field type will be changed to array in the next major version of the package. Dublin Core Terms fields are repeatable. */
    isReplacedBy?: string
    /** @deprecated This field type will be changed to array in the next major version of the package. Dublin Core Terms fields are repeatable. */
    isRequiredBy?: string
    /** @deprecated This field type will be changed to array in the next major version of the package. Dublin Core Terms fields are repeatable. */
    issued?: TDate
    /** @deprecated This field type will be changed to array in the next major version of the package. Dublin Core Terms fields are repeatable. */
    isVersionOf?: string
    /** @deprecated Use `languages` (array) instead. Dublin Core Terms fields are repeatable. */
    language?: string
    /** @deprecated Use `licenses` (array) instead. Dublin Core Terms fields are repeatable. */
    license?: string
    /** @deprecated Use `mediators` (array) instead. Dublin Core Terms fields are repeatable. */
    mediator?: string
    /** @deprecated Use `mediums` (array) instead. Dublin Core Terms fields are repeatable. */
    medium?: string
    /** @deprecated This field type will be changed to array in the next major version of the package. Dublin Core Terms fields are repeatable. */
    modified?: TDate
    /** @deprecated Use `provenances` (array) instead. Dublin Core Terms fields are repeatable. */
    provenance?: string
    /** @deprecated Use `publishers` (array) instead. Dublin Core Terms fields are repeatable. */
    publisher?: string
    /** @deprecated This field type will be changed to array in the next major version of the package. Dublin Core Terms fields are repeatable. */
    references?: string
    /** @deprecated Use `relations` (array) instead. Dublin Core Terms fields are repeatable. */
    relation?: string
    /** @deprecated This field type will be changed to array in the next major version of the package. Dublin Core Terms fields are repeatable. */
    replaces?: string
    /** @deprecated This field type will be changed to array in the next major version of the package. Dublin Core Terms fields are repeatable. */
    requires?: string
    /** @deprecated This field type will be changed to array in the next major version of the package. Dublin Core Terms fields are repeatable. */
    rights?: string
    /** @deprecated Use `rightsHolders` (array) instead. Dublin Core Terms fields are repeatable. */
    rightsHolder?: string
    /** @deprecated Use `sources` (array) instead. Dublin Core Terms fields are repeatable. */
    source?: string
    /** @deprecated Use `spatials` (array) instead. Dublin Core Terms fields are repeatable. */
    spatial?: string
    /** @deprecated Use `subjects` (array) instead. Dublin Core Terms fields are repeatable. */
    subject?: string
    /** @deprecated This field type will be changed to array in the next major version of the package. Dublin Core Terms fields are repeatable. */
    tableOfContents?: string
    /** @deprecated Use `temporals` (array) instead. Dublin Core Terms fields are repeatable. */
    temporal?: string
    /** @deprecated Use `titles` (array) instead. Dublin Core Terms fields are repeatable. */
    title?: string
    /** @deprecated Use `types` (array) instead. Dublin Core Terms fields are repeatable. */
    type?: string
    /** @deprecated This field type will be changed to array in the next major version of the package. Dublin Core Terms fields are repeatable. */
    valid?: TDate
  }
}
// #endregion reference
