// #region reference
export namespace PrismNs {
  export type Feed<TDate> = {
    publicationName?: string
    issn?: string
    eIssn?: string
    isbns?: Array<string>
    issueIdentifier?: string
    issueName?: string
    issueTeaser?: string
    issueType?: string
    volume?: string
    number?: string
    edition?: string
    aggregateIssueNumber?: number
    aggregationType?: string
    coverDate?: TDate
    coverDisplayDate?: string
    publicationDates?: Array<TDate>
    publicationDisplayDates?: Array<string>
    creationDate?: TDate
    modificationDate?: TDate
    dateReceived?: TDate
    onSaleDates?: Array<TDate>
    onSaleDays?: Array<string>
    offSaleDates?: Array<TDate>
    killDate?: TDate
    copyrightYears?: Array<string>
    contentType?: string
    alternateTitles?: Array<string>
    subtitles?: Array<string>
    teasers?: Array<string>
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
    urls?: Array<string>
    byteCount?: number
    ratings?: Array<string>
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
    /** @deprecated Since PRISM 3.0. Use pur:embargoDate instead. */
    embargoDate?: TDate
    /** @deprecated Since PRISM 3.0. Use pur:copyrightDate instead. */
    copyright?: string
    /** @deprecated Since PRISM 3.0. Use pur:expirationDate instead. */
    expirationDate?: TDate
    /** @deprecated Since PRISM 3.0. Use pur:rightsAgent instead. */
    rightsAgent?: string
  }

  export type Item<TDate> = {
    publicationName?: string
    issn?: string
    eIssn?: string
    doi?: string
    urls?: Array<string>
    volume?: string
    number?: string
    edition?: string
    section?: string
    startingPage?: string
    endingPage?: string
    pageRange?: string
    pageCount?: number
    pageProgressionDirection?: string
    samplePageRange?: string
    publicationDates?: Array<TDate>
    publicationDisplayDates?: Array<string>
    creationDate?: TDate
    modificationDate?: TDate
    dateReceived?: TDate
    killDate?: TDate
    copyrightYears?: Array<string>
    contentType?: string
    genres?: Array<string>
    alternateTitles?: Array<string>
    subtitles?: Array<string>
    teasers?: Array<string>
    keywords?: Array<string>
    corporateEntities?: Array<string>
    organizations?: Array<string>
    persons?: Array<string>
    platforms?: Array<string>
    device?: string
    academicFields?: Array<string>
    events?: Array<string>
    industries?: Array<string>
    locations?: Array<string>
    objects?: Array<string>
    profession?: string
    sport?: string
    hasAlternatives?: Array<string>
    hasCorrections?: Array<string>
    hasTranslations?: Array<string>
    isAlternativeOf?: Array<string>
    isCorrectionOf?: Array<string>
    isTranslationOf?: string
    supplementTitles?: Array<string>
    supplementDisplayID?: string
    supplementStartingPage?: string
    links?: Array<string>
    wordCount?: number
    byteCount?: number
    ratings?: Array<string>
    timePeriod?: string
    versionIdentifier?: string
    tickers?: Array<string>
    /** @deprecated Since PRISM 3.0. Use pur:embargoDate instead. */
    embargoDate?: TDate
    /** @deprecated Since PRISM 3.0. Use pur:copyrightDate instead. */
    copyright?: string
    /** @deprecated Since PRISM 3.0. Use pur:expirationDate instead. */
    expirationDate?: TDate
    /** @deprecated Since PRISM 3.0. Use pur:rightsAgent instead. */
    rightsAgent?: string
  }
}
// #endregion reference
