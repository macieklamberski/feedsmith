// #region reference
export namespace PrismNs {
  export type PlatformValue<TValue> = {
    value?: TValue
    platform?: string
  }

  export type Rating = {
    value?: string
    ratingSystem?: string
  }

  export type ItemOrFeed<TDate> = {
    publicationName?: string
    issn?: string
    eIssn?: string
    isbns?: Array<string>
    issueIdentifier?: string
    issueName?: string
    issueTeaser?: PlatformValue<string>
    issueType?: string
    doi?: string
    volume?: string
    number?: string
    edition?: string
    aggregateIssueNumber?: number
    aggregationType?: string
    coverDate?: TDate
    coverDisplayDate?: string
    publicationDates?: Array<PlatformValue<TDate>>
    publicationDisplayDates?: Array<PlatformValue<string>>
    creationDate?: TDate
    modificationDate?: TDate
    dateReceived?: TDate
    onSaleDates?: Array<PlatformValue<TDate>>
    onSaleDays?: Array<PlatformValue<string>>
    offSaleDates?: Array<PlatformValue<TDate>>
    killDate?: PlatformValue<TDate>
    copyrightYears?: Array<string>
    contentType?: string
    alternateTitles?: Array<PlatformValue<string>>
    subtitles?: Array<string>
    teasers?: Array<PlatformValue<string>>
    keywords?: Array<string>
    seriesTitle?: string
    seriesNumber?: number
    bookEditions?: Array<string>
    nationalCatalogNumber?: string
    productCodes?: Array<string>
    uspsNumber?: string
    publishingFrequency?: string
    channels?: Array<string>
    subchannel1?: string
    subchannel2?: string
    subchannel3?: string
    subchannel4?: string
    section?: string
    subsection1?: string
    subsection2?: string
    subsection3?: string
    subsection4?: string
    startingPage?: string
    endingPage?: string
    pageRange?: string
    pageCount?: number
    pageProgressionDirection?: string
    samplePageRange?: string
    corporateEntities?: Array<string>
    distributor?: string
    sellingAgencies?: Array<string>
    organizations?: Array<string>
    persons?: Array<string>
    platforms?: Array<string>
    originPlatforms?: Array<string>
    device?: string
    complianceProfile?: string
    blogTitle?: string
    blogURL?: string
    links?: Array<string>
    urls?: Array<PlatformValue<string>>
    wordCount?: number
    byteCount?: number
    ratings?: Array<Rating>
    timePeriod?: string
    versionIdentifier?: string
    tickers?: Array<string>
    academicFields?: Array<string>
    events?: Array<string>
    genres?: Array<string>
    industries?: Array<string>
    locations?: Array<string>
    objects?: Array<string>
    profession?: string
    sport?: string
    hasAlternatives?: Array<string>
    hasCorrections?: Array<PlatformValue<string>>
    hasTranslations?: Array<string>
    isAlternativeOf?: Array<string>
    isCorrectionOf?: Array<string>
    isTranslationOf?: string
    supplementTitles?: Array<string>
    supplementDisplayID?: string
    supplementStartingPage?: string
    /** @deprecated Since PRISM 3.0. Use pur:embargoDate instead. */
    embargoDate?: TDate
    /** @deprecated Since PRISM 3.0. Use pur:copyrightDate instead. */
    copyright?: string
    /** @deprecated Since PRISM 3.0. Use pur:expirationDate instead. */
    expirationDate?: TDate
    /** @deprecated Since PRISM 3.0. Use pur:rightsAgent instead. */
    rightsAgent?: string
    /** @deprecated PRISM 1.2 only. */
    category?: string
    /** @deprecated PRISM 1.2 only. */
    hasFormats?: Array<string>
    /** @deprecated PRISM 1.2 only. */
    hasParts?: Array<string>
    /** @deprecated PRISM 1.2 only. */
    hasPreviousVersion?: string
    /** @deprecated PRISM 1.2 only. */
    isFormatOf?: string
    /** @deprecated PRISM 1.2 only. */
    isPartOf?: string
    /** @deprecated PRISM 1.2 only. */
    isReferencedBy?: string
    /** @deprecated PRISM 1.2 only. */
    isRequiredBy?: string
    /** @deprecated PRISM 1.2 only. */
    isVersionOf?: string
    /** @deprecated PRISM 1.2 only. */
    objectTitles?: Array<string>
    /** @deprecated PRISM 1.2 only. */
    receptionDate?: TDate
    /** @deprecated PRISM 1.2 only. */
    references?: Array<string>
    /** @deprecated PRISM 1.2 only. */
    requires?: string
  }
}
// #endregion reference
