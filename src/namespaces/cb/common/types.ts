// #region reference
export namespace CbNs {
  export type Resource = {
    title?: string
    link?: string
    description?: string
  }

  export type Role = {
    jobTitle?: string
    affiliation?: string
    /** @deprecated Replaced by affiliation in RSS-CB 1.2. */
    body?: string
  }

  export type Person = {
    /** @deprecated Defined by RSS-CB 1.1 only. */
    type?: string
    givenName?: string
    surname?: string
    personalTitle?: string
    nameAsWritten?: string
    role?: Role
  }

  export type Event<TDate> = {
    simpleTitle?: string
    occurrenceDate?: TDate
    institutionAbbrev?: string
    audience?: string
    keywords?: Array<string>
    resources?: Array<Resource>
    persons?: Array<Person>
    venue?: string
    locationAsWritten?: string
    locationCountry?: string
    locationState?: string
    locationCity?: string
    eventDateEnd?: TDate
  }

  export type News<TDate> = {
    simpleTitle?: string
    occurrenceDate?: TDate
    institutionAbbrev?: string
    keywords?: Array<string>
    resources?: Array<Resource>
    persons?: Array<Person>
  }

  export type Paper<TDate> = {
    simpleTitle?: string
    occurrenceDate?: TDate
    institutionAbbrev?: string
    keywords?: Array<string>
    resources?: Array<Resource>
    persons?: Array<Person>
    byline?: string
    publicationDate?: string
    publication?: string
    issue?: string
    jelCodes?: Array<string>
  }

  export type Speech<TDate> = {
    simpleTitle?: string
    occurrenceDate?: TDate
    institutionAbbrev?: string
    audience?: string
    keywords?: Array<string>
    resources?: Array<Resource>
    persons?: Array<Person>
    venue?: string
    locationAsWritten?: string
    locationCountry?: string
    locationState?: string
    locationCity?: string
  }

  export type Value = {
    value?: number
    frequency?: string
    decimals?: number
    unitMult?: number
    units?: string
  }

  export type Observation = {
    value?: number
    unit?: string
    unitMult?: number
    decimals?: number
  }

  export type ObservationPeriod = {
    frequency?: string
    period?: string
  }

  export type ExchangeRate = {
    /** @deprecated RSS-CB 1.1 syntax. RSS-CB 1.2 uses observation and observationPeriod. */
    value?: Value
    observation?: Observation
    baseCurrency?: string
    /** @deprecated RSS-CB 1.0 and 1.1 syntax. RSS-CB 1.2 uses observation.unitMult. */
    baseCurrencyUnitMult?: number
    targetCurrency?: string
    rateType?: string
    observationPeriod?: ObservationPeriod
  }

  export type InterestRate = {
    /** @deprecated RSS-CB 1.1 syntax. RSS-CB 1.2 uses observation and observationPeriod. */
    value?: Value
    observation?: Observation
    rateName?: string
    rateType?: string
    observationPeriod?: ObservationPeriod
  }

  export type Transaction = {
    /** @deprecated RSS-CB 1.1 syntax. RSS-CB 1.2 uses observation and observationPeriod. */
    value?: Value
    observation?: Observation
    transactionName?: string
    transactionType?: string
    observationPeriod?: ObservationPeriod
    transactionTerm?: string
  }

  export type OtherStatistic = {
    /** @deprecated RSS-CB 1.1 syntax. RSS-CB 1.2 uses observation and observationPeriod. */
    value?: Value
    observation?: Observation
    /** @deprecated Defined by RSS-CB 1.1 only. */
    publicationDate?: string
    topic?: string
    coverage?: string
    observationPeriod?: ObservationPeriod
    dataType?: string
  }

  export type Statistics = {
    country?: string
    institutionAbbrev?: string
    exchangeRate?: ExchangeRate
    interestRate?: InterestRate
    transaction?: Transaction
    otherStatistic?: OtherStatistic
  }

  export type Item<TDate> = {
    event?: Event<TDate>
    news?: News<TDate>
    paper?: Paper<TDate>
    speech?: Speech<TDate>
    statistics?: Statistics
    custom?: string
  }
}
// #endregion reference
