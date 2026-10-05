import { isPlainObject, trimObject } from 'trousse'
import type { DateLike, GenerateUtil } from '../../../common/types.js'
import {
  generateCdataString,
  generateNumber,
  generatePlainString,
  generateRfc3339Date,
  trimArray,
} from '../../../common/utils.js'
import type { CbNs } from '../common/types.js'

export const generateResource: GenerateUtil<CbNs.Resource> = (resource) => {
  if (!isPlainObject(resource)) {
    return
  }

  const value = {
    'cb:title': generateCdataString(resource.title),
    'cb:link': generateCdataString(resource.link),
    'cb:description': generateCdataString(resource.description),
  }

  return trimObject(value)
}

export const generateRole: GenerateUtil<CbNs.Role> = (role) => {
  if (!isPlainObject(role)) {
    return
  }

  const value = {
    'cb:jobTitle': generateCdataString(role.jobTitle),
    'cb:affiliation': generateCdataString(role.affiliation),
    'cb:body': generateCdataString(role.body),
  }

  return trimObject(value)
}

export const generatePerson: GenerateUtil<CbNs.Person> = (person) => {
  if (!isPlainObject(person)) {
    return
  }

  const value = {
    '@type': generatePlainString(person.type),
    'cb:givenName': generateCdataString(person.givenName),
    'cb:surname': generateCdataString(person.surname),
    'cb:personalTitle': generateCdataString(person.personalTitle),
    'cb:nameAsWritten': generateCdataString(person.nameAsWritten),
    'cb:role': generateRole(person.role),
  }

  return trimObject(value)
}

export const generateEvent: GenerateUtil<CbNs.Event<DateLike>> = (event) => {
  if (!isPlainObject(event)) {
    return
  }

  const value = {
    'cb:simpleTitle': generateCdataString(event.simpleTitle),
    'cb:occurrenceDate': generateRfc3339Date(event.occurrenceDate),
    'cb:institutionAbbrev': generateCdataString(event.institutionAbbrev),
    'cb:audience': generateCdataString(event.audience),
    'cb:keyword': trimArray(event.keywords, generateCdataString),
    'cb:resource': trimArray(event.resources, generateResource),
    'cb:person': trimArray(event.persons, generatePerson),
    'cb:venue': generateCdataString(event.venue),
    'cb:locationAsWritten': generateCdataString(event.locationAsWritten),
    'cb:locationCountry': generateCdataString(event.locationCountry),
    'cb:locationState': generateCdataString(event.locationState),
    'cb:locationCity': generateCdataString(event.locationCity),
    'cb:eventDateEnd': generateRfc3339Date(event.eventDateEnd),
  }

  return trimObject(value)
}

export const generateNews: GenerateUtil<CbNs.News<DateLike>> = (news) => {
  if (!isPlainObject(news)) {
    return
  }

  const value = {
    'cb:simpleTitle': generateCdataString(news.simpleTitle),
    'cb:occurrenceDate': generateRfc3339Date(news.occurrenceDate),
    'cb:institutionAbbrev': generateCdataString(news.institutionAbbrev),
    'cb:keyword': trimArray(news.keywords, generateCdataString),
    'cb:resource': trimArray(news.resources, generateResource),
    'cb:person': trimArray(news.persons, generatePerson),
  }

  return trimObject(value)
}

export const generatePaper: GenerateUtil<CbNs.Paper<DateLike>> = (paper) => {
  if (!isPlainObject(paper)) {
    return
  }

  const value = {
    'cb:simpleTitle': generateCdataString(paper.simpleTitle),
    'cb:occurrenceDate': generateRfc3339Date(paper.occurrenceDate),
    'cb:institutionAbbrev': generateCdataString(paper.institutionAbbrev),
    'cb:keyword': trimArray(paper.keywords, generateCdataString),
    'cb:resource': trimArray(paper.resources, generateResource),
    'cb:person': trimArray(paper.persons, generatePerson),
    'cb:byline': generateCdataString(paper.byline),
    'cb:publicationDate': generateCdataString(paper.publicationDate),
    'cb:publication': generateCdataString(paper.publication),
    'cb:issue': generateCdataString(paper.issue),
    'cb:JELCode': trimArray(paper.jelCodes, generateCdataString),
  }

  return trimObject(value)
}

export const generateSpeech: GenerateUtil<CbNs.Speech<DateLike>> = (speech) => {
  if (!isPlainObject(speech)) {
    return
  }

  const value = {
    'cb:simpleTitle': generateCdataString(speech.simpleTitle),
    'cb:occurrenceDate': generateRfc3339Date(speech.occurrenceDate),
    'cb:institutionAbbrev': generateCdataString(speech.institutionAbbrev),
    'cb:audience': generateCdataString(speech.audience),
    'cb:keyword': trimArray(speech.keywords, generateCdataString),
    'cb:resource': trimArray(speech.resources, generateResource),
    'cb:person': trimArray(speech.persons, generatePerson),
    'cb:venue': generateCdataString(speech.venue),
    'cb:locationAsWritten': generateCdataString(speech.locationAsWritten),
    'cb:locationCountry': generateCdataString(speech.locationCountry),
    'cb:locationState': generateCdataString(speech.locationState),
    'cb:locationCity': generateCdataString(speech.locationCity),
  }

  return trimObject(value)
}

export const generateValue: GenerateUtil<CbNs.Value> = (value) => {
  if (!isPlainObject(value)) {
    return
  }

  const generated = {
    '@frequency': generatePlainString(value.frequency),
    '@decimals': generateNumber(value.decimals),
    '@unit_mult': generateNumber(value.unitMult),
    '@units': generatePlainString(value.units),
    '#text': generateNumber(value.value),
  }

  return trimObject(generated)
}

export const generateObservation: GenerateUtil<CbNs.Observation> = (observation) => {
  if (!isPlainObject(observation)) {
    return
  }

  const value = {
    'cb:value': generateNumber(observation.value),
    'cb:unit': generateCdataString(observation.unit),
    'cb:unit_mult': generateNumber(observation.unitMult),
    'cb:decimals': generateNumber(observation.decimals),
  }

  return trimObject(value)
}

export const generateObservationPeriod: GenerateUtil<CbNs.ObservationPeriod> = (
  observationPeriod,
) => {
  if (!isPlainObject(observationPeriod)) {
    return
  }

  const value = {
    'cb:frequency': generateCdataString(observationPeriod.frequency),
    'cb:period': generateCdataString(observationPeriod.period),
  }

  return trimObject(value)
}

export const generateExchangeRate: GenerateUtil<CbNs.ExchangeRate> = (exchangeRate) => {
  if (!isPlainObject(exchangeRate)) {
    return
  }

  const value = {
    'cb:value': generateValue(exchangeRate.value),
    'cb:observation': generateObservation(exchangeRate.observation),
    'cb:baseCurrency': generateCdataString(exchangeRate.baseCurrency),
    'cb:targetCurrency': generateCdataString(exchangeRate.targetCurrency),
    'cb:rateType': generateCdataString(exchangeRate.rateType),
    'cb:observationPeriod': generateObservationPeriod(exchangeRate.observationPeriod),
  }

  return trimObject(value)
}

export const generateInterestRate: GenerateUtil<CbNs.InterestRate> = (interestRate) => {
  if (!isPlainObject(interestRate)) {
    return
  }

  const value = {
    'cb:value': generateValue(interestRate.value),
    'cb:observation': generateObservation(interestRate.observation),
    'cb:rateName': generateCdataString(interestRate.rateName),
    'cb:rateType': generateCdataString(interestRate.rateType),
    'cb:observationPeriod': generateObservationPeriod(interestRate.observationPeriod),
  }

  return trimObject(value)
}

export const generateTransaction: GenerateUtil<CbNs.Transaction> = (transaction) => {
  if (!isPlainObject(transaction)) {
    return
  }

  const value = {
    'cb:value': generateValue(transaction.value),
    'cb:observation': generateObservation(transaction.observation),
    'cb:transactionName': generateCdataString(transaction.transactionName),
    'cb:transactionType': generateCdataString(transaction.transactionType),
    'cb:observationPeriod': generateObservationPeriod(transaction.observationPeriod),
    'cb:transactionTerm': generateCdataString(transaction.transactionTerm),
  }

  return trimObject(value)
}

export const generateOtherStatistic: GenerateUtil<CbNs.OtherStatistic> = (otherStatistic) => {
  if (!isPlainObject(otherStatistic)) {
    return
  }

  const value = {
    'cb:value': generateValue(otherStatistic.value),
    'cb:observation': generateObservation(otherStatistic.observation),
    'cb:publicationDate': generateCdataString(otherStatistic.publicationDate),
    'cb:topic': generateCdataString(otherStatistic.topic),
    'cb:coverage': generateCdataString(otherStatistic.coverage),
    'cb:observationPeriod': generateObservationPeriod(otherStatistic.observationPeriod),
    'cb:dataType': generateCdataString(otherStatistic.dataType),
  }

  return trimObject(value)
}

export const generateStatistics: GenerateUtil<CbNs.Statistics> = (statistics) => {
  if (!isPlainObject(statistics)) {
    return
  }

  const value = {
    'cb:country': generateCdataString(statistics.country),
    'cb:institutionAbbrev': generateCdataString(statistics.institutionAbbrev),
    'cb:exchangeRate': generateExchangeRate(statistics.exchangeRate),
    'cb:interestRate': generateInterestRate(statistics.interestRate),
    'cb:transaction': generateTransaction(statistics.transaction),
    'cb:otherStatistic': generateOtherStatistic(statistics.otherStatistic),
  }

  return trimObject(value)
}

export const generateItem: GenerateUtil<CbNs.Item<DateLike>> = (item) => {
  if (!isPlainObject(item)) {
    return
  }

  const value = {
    'cb:event': generateEvent(item.event),
    'cb:news': generateNews(item.news),
    'cb:paper': generatePaper(item.paper),
    'cb:speech': generateSpeech(item.speech),
    'cb:statistics': generateStatistics(item.statistics),
  }

  return trimObject(value)
}
