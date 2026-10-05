import { isAnyOf, isPlainObject, trimObject } from 'trousse'
import type {
  DateAny,
  ParseMainOptions,
  ParseUtilExact,
  ParseUtilPartial,
  Unreliable,
} from '../../../common/types.js'
import {
  parseArrayOf,
  parseDate,
  parseNumber,
  parseSingularOf,
  parseString,
  parseVerbatimString,
  retrieveText,
} from '../../../common/utils.js'
import type { CbNs } from '../common/types.js'

export const parseResource: ParseUtilPartial<CbNs.Resource> = (value) => {
  if (!isPlainObject(value)) {
    return
  }

  const resource = {
    title: parseSingularOf(value['cb:title'], (value) => parseString(retrieveText(value))),
    link: parseSingularOf(value['cb:link'], (value) => parseString(retrieveText(value))),
    description: parseSingularOf(value['cb:description'], (value) =>
      parseString(retrieveText(value)),
    ),
  }

  return trimObject(resource)
}

export const parseRole: ParseUtilPartial<CbNs.Role> = (value) => {
  if (!isPlainObject(value)) {
    return
  }

  const role = {
    jobTitle: parseSingularOf(value['cb:jobtitle'], (value) => parseString(retrieveText(value))),
    affiliation: parseSingularOf(value['cb:affiliation'], (value) =>
      parseString(retrieveText(value)),
    ),
    body: parseSingularOf(value['cb:body'], (value) => parseString(retrieveText(value))),
  }

  return trimObject(role)
}

export const parsePerson: ParseUtilPartial<CbNs.Person> = (value) => {
  if (!isPlainObject(value)) {
    return
  }

  const person = {
    type: parseString(value['@type']),
    givenName: parseSingularOf(value['cb:givenname'], (value) => parseString(retrieveText(value))),
    surname: parseSingularOf(value['cb:surname'], (value) => parseString(retrieveText(value))),
    personalTitle: parseSingularOf(value['cb:personaltitle'], (value) =>
      parseString(retrieveText(value)),
    ),
    nameAsWritten: parseSingularOf(value['cb:nameaswritten'], (value) =>
      parseString(retrieveText(value)),
    ),
    role: parseSingularOf(value['cb:role'], parseRole),
  }

  return trimObject(person)
}

export const parseEvent: ParseUtilPartial<CbNs.Event<DateAny>, ParseMainOptions<DateAny>> = (
  value,
  options,
) => {
  if (!isPlainObject(value)) {
    return
  }

  const event = {
    simpleTitle: parseSingularOf(value['cb:simpletitle'], (value) =>
      parseString(retrieveText(value)),
    ),
    occurrenceDate: parseSingularOf(value['cb:occurrencedate'], (value) =>
      parseDate(retrieveText(value), options?.parseDateFn),
    ),
    institutionAbbrev: parseSingularOf(value['cb:institutionabbrev'], (value) =>
      parseString(retrieveText(value)),
    ),
    audience: parseSingularOf(value['cb:audience'], (value) => parseString(retrieveText(value))),
    keywords: parseArrayOf(value['cb:keyword'], (value) => parseString(retrieveText(value))),
    resources: parseArrayOf(value['cb:resource'], parseResource),
    persons: parseArrayOf(value['cb:person'], parsePerson),
    venue: parseSingularOf(value['cb:venue'], (value) => parseString(retrieveText(value))),
    locationAsWritten: parseSingularOf(value['cb:locationaswritten'], (value) =>
      parseString(retrieveText(value)),
    ),
    locationCountry: parseSingularOf(value['cb:locationcountry'], (value) =>
      parseString(retrieveText(value)),
    ),
    locationState: parseSingularOf(value['cb:locationstate'], (value) =>
      parseString(retrieveText(value)),
    ),
    locationCity: parseSingularOf(value['cb:locationcity'], (value) =>
      parseString(retrieveText(value)),
    ),
    eventDateEnd: parseSingularOf(value['cb:eventdateend'], (value) =>
      parseDate(retrieveText(value), options?.parseDateFn),
    ),
  }

  return trimObject(event)
}

export const parseNews: ParseUtilPartial<CbNs.News<DateAny>, ParseMainOptions<DateAny>> = (
  value,
  options,
) => {
  if (!isPlainObject(value)) {
    return
  }

  const news = {
    simpleTitle: parseSingularOf(value['cb:simpletitle'], (value) =>
      parseString(retrieveText(value)),
    ),
    occurrenceDate: parseSingularOf(value['cb:occurrencedate'], (value) =>
      parseDate(retrieveText(value), options?.parseDateFn),
    ),
    institutionAbbrev: parseSingularOf(value['cb:institutionabbrev'], (value) =>
      parseString(retrieveText(value)),
    ),
    keywords: parseArrayOf(value['cb:keyword'], (value) => parseString(retrieveText(value))),
    resources: parseArrayOf(value['cb:resource'], parseResource),
    persons: parseArrayOf(value['cb:person'], parsePerson),
  }

  return trimObject(news)
}

export const parsePaper: ParseUtilPartial<CbNs.Paper<DateAny>, ParseMainOptions<DateAny>> = (
  value,
  options,
) => {
  if (!isPlainObject(value)) {
    return
  }

  const paper = {
    simpleTitle: parseSingularOf(value['cb:simpletitle'], (value) =>
      parseString(retrieveText(value)),
    ),
    occurrenceDate: parseSingularOf(value['cb:occurrencedate'], (value) =>
      parseDate(retrieveText(value), options?.parseDateFn),
    ),
    institutionAbbrev: parseSingularOf(value['cb:institutionabbrev'], (value) =>
      parseString(retrieveText(value)),
    ),
    keywords: parseArrayOf(value['cb:keyword'], (value) => parseString(retrieveText(value))),
    resources: parseArrayOf(value['cb:resource'], parseResource),
    persons: parseArrayOf(value['cb:person'], parsePerson),
    byline: parseSingularOf(value['cb:byline'], (value) => parseString(retrieveText(value))),
    publicationDate: parseSingularOf(value['cb:publicationdate'], (value) =>
      parseString(retrieveText(value)),
    ),
    publication: parseSingularOf(value['cb:publication'], (value) =>
      parseString(retrieveText(value)),
    ),
    issue: parseSingularOf(value['cb:issue'], (value) => parseString(retrieveText(value))),
    jelCodes: parseArrayOf(value['cb:jelcode'], (value) => parseString(retrieveText(value))),
  }

  return trimObject(paper)
}

export const parseSpeech: ParseUtilPartial<CbNs.Speech<DateAny>, ParseMainOptions<DateAny>> = (
  value,
  options,
) => {
  if (!isPlainObject(value)) {
    return
  }

  const speech = {
    simpleTitle: parseSingularOf(value['cb:simpletitle'], (value) =>
      parseString(retrieveText(value)),
    ),
    occurrenceDate: parseSingularOf(value['cb:occurrencedate'], (value) =>
      parseDate(retrieveText(value), options?.parseDateFn),
    ),
    institutionAbbrev: parseSingularOf(value['cb:institutionabbrev'], (value) =>
      parseString(retrieveText(value)),
    ),
    audience: parseSingularOf(value['cb:audience'], (value) => parseString(retrieveText(value))),
    keywords: parseArrayOf(value['cb:keyword'], (value) => parseString(retrieveText(value))),
    resources: parseArrayOf(value['cb:resource'], parseResource),
    persons: parseArrayOf(value['cb:person'], parsePerson),
    venue: parseSingularOf(value['cb:venue'], (value) => parseString(retrieveText(value))),
    locationAsWritten: parseSingularOf(value['cb:locationaswritten'], (value) =>
      parseString(retrieveText(value)),
    ),
    locationCountry: parseSingularOf(value['cb:locationcountry'], (value) =>
      parseString(retrieveText(value)),
    ),
    locationState: parseSingularOf(value['cb:locationstate'], (value) =>
      parseString(retrieveText(value)),
    ),
    locationCity: parseSingularOf(value['cb:locationcity'], (value) =>
      parseString(retrieveText(value)),
    ),
  }

  return trimObject(speech)
}

export const parseValue: ParseUtilPartial<CbNs.Value> = (value) => {
  if (!isPlainObject(value)) {
    return
  }

  const parsed = {
    value: parseNumber(retrieveText(value)),
    frequency: parseString(value['@frequency']),
    decimals: parseNumber(value['@decimals']),
    unitMult: parseNumber(value['@unit_mult']),
    units: parseString(value['@units']),
  }

  return trimObject(parsed)
}

export const parseObservation: ParseUtilPartial<CbNs.Observation> = (value) => {
  if (!isPlainObject(value)) {
    return
  }

  const observation = {
    value: parseSingularOf(value['cb:value'], (value) => parseNumber(retrieveText(value))),
    unit: parseSingularOf(value['cb:unit'], (value) => parseString(retrieveText(value))),
    unitMult: parseSingularOf(value['cb:unit_mult'], (value) => parseNumber(retrieveText(value))),
    decimals: parseSingularOf(value['cb:decimals'], (value) => parseNumber(retrieveText(value))),
  }

  return trimObject(observation)
}

export const parseObservationPeriod: ParseUtilPartial<CbNs.ObservationPeriod> = (value) => {
  if (!isPlainObject(value)) {
    return
  }

  // Federal Reserve feeds on the 1.1 URI write the frequency as an attribute and the period as
  // the element's text, where RSS-CB 1.2 writes both as child elements.
  const observationPeriod = {
    frequency:
      parseSingularOf(value['cb:frequency'], (value) => parseString(retrieveText(value))) ??
      parseString(value['@frequency']),
    period:
      parseSingularOf(value['cb:period'], (value) => parseString(retrieveText(value))) ??
      parseString(value['#text']),
  }

  return trimObject(observationPeriod)
}

export const parseExchangeRate: ParseUtilPartial<CbNs.ExchangeRate> = (value) => {
  if (!isPlainObject(value)) {
    return
  }

  const exchangeRate = {
    value: parseSingularOf(value['cb:value'], parseValue),
    observation: parseSingularOf(value['cb:observation'], parseObservation),
    baseCurrency: parseSingularOf(value['cb:basecurrency'], (value) =>
      parseString(retrieveText(value)),
    ),
    baseCurrencyUnitMult: parseSingularOf(value['cb:basecurrency'], (value) =>
      parseNumber(value?.['@unit_mult']),
    ),
    targetCurrency: parseSingularOf(value['cb:targetcurrency'], (value) =>
      parseString(retrieveText(value)),
    ),
    rateType: parseSingularOf(value['cb:ratetype'], (value) => parseString(retrieveText(value))),
    observationPeriod: parseSingularOf(value['cb:observationperiod'], parseObservationPeriod),
  }

  return trimObject(exchangeRate)
}

export const parseInterestRate: ParseUtilPartial<CbNs.InterestRate> = (value) => {
  if (!isPlainObject(value)) {
    return
  }

  const interestRate = {
    value: parseSingularOf(value['cb:value'], parseValue),
    observation: parseSingularOf(value['cb:observation'], parseObservation),
    rateName: parseSingularOf(value['cb:ratename'], (value) => parseString(retrieveText(value))),
    rateType: parseSingularOf(value['cb:ratetype'], (value) => parseString(retrieveText(value))),
    observationPeriod: parseSingularOf(value['cb:observationperiod'], parseObservationPeriod),
  }

  return trimObject(interestRate)
}

export const parseTransaction: ParseUtilPartial<CbNs.Transaction> = (value) => {
  if (!isPlainObject(value)) {
    return
  }

  const transaction = {
    value: parseSingularOf(value['cb:value'], parseValue),
    observation: parseSingularOf(value['cb:observation'], parseObservation),
    transactionName: parseSingularOf(value['cb:transactionname'], (value) =>
      parseString(retrieveText(value)),
    ),
    transactionType: parseSingularOf(value['cb:transactiontype'], (value) =>
      parseString(retrieveText(value)),
    ),
    observationPeriod: parseSingularOf(value['cb:observationperiod'], parseObservationPeriod),
    transactionTerm: parseSingularOf(value['cb:transactionterm'], (value) =>
      parseString(retrieveText(value)),
    ),
  }

  return trimObject(transaction)
}

export const parseOtherStatistic: ParseUtilPartial<CbNs.OtherStatistic> = (value) => {
  if (!isPlainObject(value)) {
    return
  }

  const otherStatistic = {
    value: parseSingularOf(value['cb:value'], parseValue),
    observation: parseSingularOf(value['cb:observation'], parseObservation),
    publicationDate: parseSingularOf(value['cb:publicationdate'], (value) =>
      parseString(retrieveText(value)),
    ),
    topic: parseSingularOf(value['cb:topic'], (value) => parseString(retrieveText(value))),
    coverage: parseSingularOf(value['cb:coverage'], (value) => parseString(retrieveText(value))),
    observationPeriod: parseSingularOf(value['cb:observationperiod'], parseObservationPeriod),
    dataType: parseSingularOf(value['cb:datatype'], (value) => parseString(retrieveText(value))),
  }

  return trimObject(otherStatistic)
}

export const parseStatistics: ParseUtilPartial<CbNs.Statistics> = (value) => {
  if (!isPlainObject(value)) {
    return
  }

  const statistics = {
    country: parseSingularOf(value['cb:country'], (value) => parseString(retrieveText(value))),
    institutionAbbrev: parseSingularOf(value['cb:institutionabbrev'], (value) =>
      parseString(retrieveText(value)),
    ),
    exchangeRate: parseSingularOf(value['cb:exchangerate'], parseExchangeRate),
    interestRate: parseSingularOf(value['cb:interestrate'], parseInterestRate),
    transaction: parseSingularOf(value['cb:transaction'], parseTransaction),
    otherStatistic: parseSingularOf(value['cb:otherstatistic'], parseOtherStatistic),
  }

  return trimObject(statistics)
}

const exchangeRateKeys = ['cb:basecurrency', 'cb:targetcurrency']
const interestRateKeys = ['cb:ratename']
const transactionKeys = ['cb:transactionname', 'cb:transactiontype', 'cb:transactionterm']
const otherStatisticKeys = ['cb:topic', 'cb:coverage']

// RSS-CB 1.0 has no statistics subtype element, so the subtype is told by the elements that only
// it defines. cb:value and cb:rateType go with whichever subtype is found.
export const parseLegacyStatistics: ParseUtilPartial<CbNs.Statistics> = (value) => {
  if (!isPlainObject(value)) {
    return
  }

  const hasAnyKey = (keys: Array<string>) => {
    return keys.some((key) => key in value)
  }

  const statistics = {
    country: parseSingularOf(value['cb:country'], (value) => parseString(retrieveText(value))),
    institutionAbbrev: parseSingularOf(value['cb:institutionabbrev'], (value) =>
      parseString(retrieveText(value)),
    ),
    exchangeRate: hasAnyKey(exchangeRateKeys) ? parseExchangeRate(value) : undefined,
    interestRate: hasAnyKey(interestRateKeys) ? parseInterestRate(value) : undefined,
    transaction: hasAnyKey(transactionKeys) ? parseTransaction(value) : undefined,
    otherStatistic: hasAnyKey(otherStatisticKeys) ? parseOtherStatistic(value) : undefined,
  }

  return trimObject(statistics)
}

// RSS-CB 1.0 names the application type in cb:application and writes its elements directly under
// the item, with the names RSS-CB 1.1 nests under the application element.
export const retrieveApplication = <R>(
  value: Unreliable,
  name: string,
  parse: ParseUtilExact<R>,
  parseFlat: ParseUtilExact<R> = parse,
): R | undefined => {
  const nested = parseSingularOf(value?.[`cb:${name}`], parse)

  if (nested) {
    return nested
  }

  const application = parseSingularOf(value?.['cb:application'], (value) => {
    return parseString(retrieveText(value))
  })

  if (!application || !isAnyOf(application, [name])) {
    return
  }

  return parseFlat(value)
}

export const retrieveItem: ParseUtilPartial<CbNs.Item<DateAny>, ParseMainOptions<DateAny>> = (
  value,
  options,
) => {
  if (!isPlainObject(value)) {
    return
  }

  const item = {
    event: retrieveApplication(value, 'event', (value) => parseEvent(value, options)),
    news: retrieveApplication(value, 'news', (value) => parseNews(value, options)),
    paper: retrieveApplication(value, 'paper', (value) => parsePaper(value, options)),
    speech: retrieveApplication(value, 'speech', (value) => parseSpeech(value, options)),
    statistics: retrieveApplication(value, 'statistics', parseStatistics, parseLegacyStatistics),
    custom: parseSingularOf(value['cb:custom'], (value) =>
      parseVerbatimString(retrieveText(value)),
    ),
  }

  return trimObject(item)
}
