import { describe, expect, it } from 'bun:test'
import {
  generateEvent,
  generateExchangeRate,
  generateInterestRate,
  generateItem,
  generateNews,
  generateObservation,
  generateObservationPeriod,
  generateOtherStatistic,
  generatePaper,
  generatePerson,
  generateResource,
  generateRole,
  generateSpeech,
  generateStatistics,
  generateTransaction,
  generateValue,
} from './utils.js'

describe('generateResource', () => {
  it('should generate resource with all properties', () => {
    const value = {
      title: 'Staff Working Paper 2022-25',
      link: 'https://example.com/swp2022-25.pdf',
      description: 'Foreign Exchange Interventions',
    }
    const expected = {
      'cb:title': 'Staff Working Paper 2022-25',
      'cb:link': 'https://example.com/swp2022-25.pdf',
      'cb:description': 'Foreign Exchange Interventions',
    }

    expect(generateResource(value)).toEqual(expected)
  })

  it('should generate resource with only link', () => {
    const value = {
      link: 'https://example.com/swp2022-25.pdf',
    }
    const expected = {
      'cb:link': 'https://example.com/swp2022-25.pdf',
    }

    expect(generateResource(value)).toEqual(expected)
  })

  it('should wrap text with special characters in CDATA', () => {
    const value = {
      title: 'Inflation & Growth',
    }
    const expected = {
      'cb:title': { '#cdata': 'Inflation & Growth' },
    }

    expect(generateResource(value)).toEqual(expected)
  })

  it('should handle empty strings', () => {
    const value = {
      title: '',
      link: 'https://example.com/swp2022-25.pdf',
    }
    const expected = {
      'cb:link': 'https://example.com/swp2022-25.pdf',
    }

    expect(generateResource(value)).toEqual(expected)
  })

  it('should handle whitespace-only strings', () => {
    const value = {
      title: '   ',
      link: '\t\n',
    }

    expect(generateResource(value)).toBeUndefined()
  })

  it('should handle empty object', () => {
    expect(generateResource({})).toBeUndefined()
  })

  it('should handle non-object inputs', () => {
    // @ts-expect-error: This is for testing purposes.
    expect(generateResource('string')).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generateResource(123)).toBeUndefined()
    expect(generateResource(undefined)).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generateResource(null)).toBeUndefined()
  })
})

describe('generateRole', () => {
  it('should generate role with all properties', () => {
    const value = {
      jobTitle: 'Deputy Governor',
      affiliation: 'Bank of Japan',
      body: 'Bank of Japan',
    }
    const expected = {
      'cb:jobTitle': 'Deputy Governor',
      'cb:affiliation': 'Bank of Japan',
      'cb:body': 'Bank of Japan',
    }

    expect(generateRole(value)).toEqual(expected)
  })

  it('should handle empty object', () => {
    expect(generateRole({})).toBeUndefined()
  })

  it('should handle non-object inputs', () => {
    // @ts-expect-error: This is for testing purposes.
    expect(generateRole('string')).toBeUndefined()
    expect(generateRole(undefined)).toBeUndefined()
  })
})

describe('generatePerson', () => {
  it('should generate person with all properties', () => {
    const value = {
      type: 'Author',
      givenName: 'Toshiro',
      surname: 'Muto',
      personalTitle: 'Mr',
      nameAsWritten: 'Toshiro Muto',
      role: {
        jobTitle: 'Deputy Governor',
        affiliation: 'Bank of Japan',
      },
    }
    const expected = {
      '@type': 'Author',
      'cb:givenName': 'Toshiro',
      'cb:surname': 'Muto',
      'cb:personalTitle': 'Mr',
      'cb:nameAsWritten': 'Toshiro Muto',
      'cb:role': {
        'cb:jobTitle': 'Deputy Governor',
        'cb:affiliation': 'Bank of Japan',
      },
    }

    expect(generatePerson(value)).toEqual(expected)
  })

  it('should generate person with only nameAsWritten', () => {
    const value = {
      nameAsWritten: 'Thomas J. Carter',
    }
    const expected = {
      'cb:nameAsWritten': 'Thomas J. Carter',
    }

    expect(generatePerson(value)).toEqual(expected)
  })

  it('should handle empty object', () => {
    expect(generatePerson({})).toBeUndefined()
  })

  it('should handle non-object inputs', () => {
    // @ts-expect-error: This is for testing purposes.
    expect(generatePerson('string')).toBeUndefined()
    expect(generatePerson(undefined)).toBeUndefined()
  })
})

describe('generateEvent', () => {
  it('should generate event with all properties', () => {
    const value = {
      simpleTitle: 'Interest rate announcement',
      occurrenceDate: new Date('2026-09-02T00:00:00Z'),
      institutionAbbrev: 'BOC',
      audience: 'Economic Club of New York',
      keywords: ['monetary policy', 'interest rates'],
      resources: [{ title: 'Press release', link: 'https://example.com/press-release' }],
      persons: [{ nameAsWritten: 'Tiff Macklem' }],
      venue: 'Mariton Hotel',
      locationAsWritten: 'Rome, Italy',
      locationCountry: 'IT',
      locationState: 'Lazio',
      locationCity: 'Rome',
      eventDateEnd: new Date('2026-09-03T00:00:00Z'),
    }
    const expected = {
      'cb:simpleTitle': 'Interest rate announcement',
      'cb:occurrenceDate': '2026-09-02T00:00:00.000Z',
      'cb:institutionAbbrev': 'BOC',
      'cb:audience': 'Economic Club of New York',
      'cb:keyword': ['monetary policy', 'interest rates'],
      'cb:resource': [
        {
          'cb:title': 'Press release',
          'cb:link': 'https://example.com/press-release',
        },
      ],
      'cb:person': [{ 'cb:nameAsWritten': 'Tiff Macklem' }],
      'cb:venue': 'Mariton Hotel',
      'cb:locationAsWritten': 'Rome, Italy',
      'cb:locationCountry': 'IT',
      'cb:locationState': 'Lazio',
      'cb:locationCity': 'Rome',
      'cb:eventDateEnd': '2026-09-03T00:00:00.000Z',
    }

    expect(generateEvent(value)).toEqual(expected)
  })

  it('should generate event with only simpleTitle', () => {
    const value = {
      simpleTitle: 'Interest rate announcement',
    }
    const expected = {
      'cb:simpleTitle': 'Interest rate announcement',
    }

    expect(generateEvent(value)).toEqual(expected)
  })

  it('should handle empty object', () => {
    expect(generateEvent({})).toBeUndefined()
  })

  it('should handle non-object inputs', () => {
    // @ts-expect-error: This is for testing purposes.
    expect(generateEvent('string')).toBeUndefined()
    expect(generateEvent(undefined)).toBeUndefined()
  })
})

describe('generateNews', () => {
  it('should generate news with all properties', () => {
    const value = {
      simpleTitle: 'SNB balance sheet items end of May 2026',
      occurrenceDate: '2026-06-30T07:00:00Z',
      institutionAbbrev: 'SNB',
      keywords: ['balance sheet'],
      resources: [{ link: 'https://example.com/statpub' }],
      persons: [{ nameAsWritten: 'Petra Tschudin' }],
    }
    const expected = {
      'cb:simpleTitle': 'SNB balance sheet items end of May 2026',
      'cb:occurrenceDate': '2026-06-30T07:00:00.000Z',
      'cb:institutionAbbrev': 'SNB',
      'cb:keyword': ['balance sheet'],
      'cb:resource': [{ 'cb:link': 'https://example.com/statpub' }],
      'cb:person': [{ 'cb:nameAsWritten': 'Petra Tschudin' }],
    }

    expect(generateNews(value)).toEqual(expected)
  })

  it('should handle empty object', () => {
    expect(generateNews({})).toBeUndefined()
  })

  it('should handle non-object inputs', () => {
    // @ts-expect-error: This is for testing purposes.
    expect(generateNews('string')).toBeUndefined()
    expect(generateNews(undefined)).toBeUndefined()
  })
})

describe('generatePaper', () => {
  it('should generate paper with all properties', () => {
    const value = {
      simpleTitle: 'Central bank communication',
      occurrenceDate: '2026-06-21T22:00:00Z',
      institutionAbbrev: 'SNB',
      keywords: ['Content analysis'],
      resources: [{ link: 'https://example.com/working-paper-2026-06' }],
      persons: [{ nameAsWritten: 'Thomas Lustenberger' }, { nameAsWritten: 'Enzo Rossi' }],
      byline: 'Thomas Lustenberger and Enzo Rossi',
      publicationDate: 'June 2026',
      publication: 'SNB Working Papers',
      issue: '2026-06',
      jelCodes: ['E52', 'E58'],
    }
    const expected = {
      'cb:simpleTitle': 'Central bank communication',
      'cb:occurrenceDate': '2026-06-21T22:00:00.000Z',
      'cb:institutionAbbrev': 'SNB',
      'cb:keyword': ['Content analysis'],
      'cb:resource': [{ 'cb:link': 'https://example.com/working-paper-2026-06' }],
      'cb:person': [
        { 'cb:nameAsWritten': 'Thomas Lustenberger' },
        { 'cb:nameAsWritten': 'Enzo Rossi' },
      ],
      'cb:byline': 'Thomas Lustenberger and Enzo Rossi',
      'cb:publicationDate': 'June 2026',
      'cb:publication': 'SNB Working Papers',
      'cb:issue': '2026-06',
      'cb:JELCode': ['E52', 'E58'],
    }

    expect(generatePaper(value)).toEqual(expected)
  })

  it('should skip empty jelCodes', () => {
    const value = {
      jelCodes: ['', 'E52'],
    }
    const expected = {
      'cb:JELCode': ['E52'],
    }

    expect(generatePaper(value)).toEqual(expected)
  })

  it('should handle empty object', () => {
    expect(generatePaper({})).toBeUndefined()
  })

  it('should handle non-object inputs', () => {
    // @ts-expect-error: This is for testing purposes.
    expect(generatePaper('string')).toBeUndefined()
    expect(generatePaper(undefined)).toBeUndefined()
  })
})

describe('generateSpeech', () => {
  it('should generate speech with all properties', () => {
    const value = {
      simpleTitle: 'Global developments and monetary policy',
      occurrenceDate: '2026-06-24T09:25:00Z',
      institutionAbbrev: 'SNB',
      audience: 'Finance committees',
      keywords: ['monetary policy'],
      resources: [{ link: 'https://example.com/speech' }],
      persons: [{ nameAsWritten: 'Petra Tschudin' }],
      venue: 'Finance seminar 2026',
      locationAsWritten: 'Basel, Switzerland',
      locationCountry: 'CH',
      locationState: 'Basel-Stadt',
      locationCity: 'Basel',
    }
    const expected = {
      'cb:simpleTitle': 'Global developments and monetary policy',
      'cb:occurrenceDate': '2026-06-24T09:25:00.000Z',
      'cb:institutionAbbrev': 'SNB',
      'cb:audience': 'Finance committees',
      'cb:keyword': ['monetary policy'],
      'cb:resource': [{ 'cb:link': 'https://example.com/speech' }],
      'cb:person': [{ 'cb:nameAsWritten': 'Petra Tschudin' }],
      'cb:venue': 'Finance seminar 2026',
      'cb:locationAsWritten': 'Basel, Switzerland',
      'cb:locationCountry': 'CH',
      'cb:locationState': 'Basel-Stadt',
      'cb:locationCity': 'Basel',
    }

    expect(generateSpeech(value)).toEqual(expected)
  })

  it('should handle empty object', () => {
    expect(generateSpeech({})).toBeUndefined()
  })

  it('should handle non-object inputs', () => {
    // @ts-expect-error: This is for testing purposes.
    expect(generateSpeech('string')).toBeUndefined()
    expect(generateSpeech(undefined)).toBeUndefined()
  })
})

describe('generateValue', () => {
  it('should generate value with all properties', () => {
    const value = {
      value: 241.6,
      frequency: 'weekly',
      decimals: 3,
      unitMult: 9,
      units: 'USD',
    }
    const expected = {
      '@frequency': 'weekly',
      '@decimals': 3,
      '@unit_mult': 9,
      '@units': 'USD',
      '#text': 241.6,
    }

    expect(generateValue(value)).toEqual(expected)
  })

  it('should generate value with only value', () => {
    const value = {
      value: 0.919,
    }
    const expected = {
      '#text': 0.919,
    }

    expect(generateValue(value)).toEqual(expected)
  })

  it('should handle empty object', () => {
    expect(generateValue({})).toBeUndefined()
  })

  it('should handle non-object inputs', () => {
    // @ts-expect-error: This is for testing purposes.
    expect(generateValue('string')).toBeUndefined()
    expect(generateValue(undefined)).toBeUndefined()
  })
})

describe('generateObservation', () => {
  it('should generate observation with all properties', () => {
    const value = {
      value: 0.9227,
      unit: 'CHF',
      unitMult: 0,
      decimals: 4,
    }
    const expected = {
      'cb:value': 0.9227,
      'cb:unit': 'CHF',
      'cb:unit_mult': 0,
      'cb:decimals': 4,
    }

    expect(generateObservation(value)).toEqual(expected)
  })

  it('should handle empty object', () => {
    expect(generateObservation({})).toBeUndefined()
  })

  it('should handle non-object inputs', () => {
    // @ts-expect-error: This is for testing purposes.
    expect(generateObservation('string')).toBeUndefined()
    expect(generateObservation(undefined)).toBeUndefined()
  })
})

describe('generateObservationPeriod', () => {
  it('should generate frequency and period as child elements', () => {
    const value = {
      frequency: 'daily',
      period: '2026-07-17',
    }
    const expected = {
      'cb:frequency': 'daily',
      'cb:period': '2026-07-17',
    }

    expect(generateObservationPeriod(value)).toEqual(expected)
  })

  it('should handle empty object', () => {
    expect(generateObservationPeriod({})).toBeUndefined()
  })

  it('should handle non-object inputs', () => {
    // @ts-expect-error: This is for testing purposes.
    expect(generateObservationPeriod('string')).toBeUndefined()
    expect(generateObservationPeriod(undefined)).toBeUndefined()
  })
})

describe('generateExchangeRate', () => {
  it('should generate exchange rate with all properties', () => {
    const value = {
      value: { value: 0.919, frequency: 'daily', decimals: 4 },
      observation: { value: 0.9227, unit: 'CHF', decimals: 4 },
      baseCurrency: 'CHF',
      targetCurrency: 'EUR',
      rateType: 'Daily rates (11:00)',
      observationPeriod: { frequency: 'daily', period: '2026-07-17' },
    }
    const expected = {
      'cb:value': { '@frequency': 'daily', '@decimals': 4, '#text': 0.919 },
      'cb:observation': { 'cb:value': 0.9227, 'cb:unit': 'CHF', 'cb:decimals': 4 },
      'cb:baseCurrency': { '#text': 'CHF' },
      'cb:targetCurrency': 'EUR',
      'cb:rateType': 'Daily rates (11:00)',
      'cb:observationPeriod': { 'cb:frequency': 'daily', 'cb:period': '2026-07-17' },
    }

    expect(generateExchangeRate(value)).toEqual(expected)
  })

  it('should generate baseCurrency unit_mult as an attribute', () => {
    const value = {
      baseCurrency: 'JPY',
      baseCurrencyUnitMult: 2,
    }
    const expected = {
      'cb:baseCurrency': { '@unit_mult': 2, '#text': 'JPY' },
    }

    expect(generateExchangeRate(value)).toEqual(expected)
  })

  it('should not generate baseCurrency with only baseCurrencyUnitMult', () => {
    const value = {
      baseCurrencyUnitMult: 2,
      targetCurrency: 'CHF',
    }
    const expected = {
      'cb:targetCurrency': 'CHF',
    }

    expect(generateExchangeRate(value)).toEqual(expected)
  })

  it('should handle empty object', () => {
    expect(generateExchangeRate({})).toBeUndefined()
  })

  it('should handle non-object inputs', () => {
    // @ts-expect-error: This is for testing purposes.
    expect(generateExchangeRate('string')).toBeUndefined()
    expect(generateExchangeRate(undefined)).toBeUndefined()
  })
})

describe('generateInterestRate', () => {
  it('should generate interest rate with all properties', () => {
    const value = {
      value: { value: 6.3, frequency: 'daily business', decimals: 2 },
      observation: { value: 0.337, unit: 'percent', decimals: 3 },
      rateName: 'R10',
      rateType: 'Spot interest rate for 10-year maturities',
      observationPeriod: { frequency: 'daily', period: '2026-07-01' },
    }
    const expected = {
      'cb:value': { '@frequency': 'daily business', '@decimals': 2, '#text': 6.3 },
      'cb:observation': { 'cb:value': 0.337, 'cb:unit': 'percent', 'cb:decimals': 3 },
      'cb:rateName': 'R10',
      'cb:rateType': 'Spot interest rate for 10-year maturities',
      'cb:observationPeriod': { 'cb:frequency': 'daily', 'cb:period': '2026-07-01' },
    }

    expect(generateInterestRate(value)).toEqual(expected)
  })

  it('should handle empty object', () => {
    expect(generateInterestRate({})).toBeUndefined()
  })

  it('should handle non-object inputs', () => {
    // @ts-expect-error: This is for testing purposes.
    expect(generateInterestRate('string')).toBeUndefined()
    expect(generateInterestRate(undefined)).toBeUndefined()
  })
})

describe('generateTransaction', () => {
  it('should generate transaction with all properties', () => {
    const value = {
      value: { value: 1.781, unitMult: 9, decimals: 3 },
      observation: { value: 1.781, unit: 'USD', unitMult: 9, decimals: 3 },
      transactionName: 'couponPurchase',
      transactionType: 'permanent open market operations',
      observationPeriod: { frequency: 'quarterly', period: 'Q4 2008' },
      transactionTerm: '1day',
    }
    const expected = {
      'cb:value': { '@decimals': 3, '@unit_mult': 9, '#text': 1.781 },
      'cb:observation': {
        'cb:value': 1.781,
        'cb:unit': 'USD',
        'cb:unit_mult': 9,
        'cb:decimals': 3,
      },
      'cb:transactionName': 'couponPurchase',
      'cb:transactionType': 'permanent open market operations',
      'cb:observationPeriod': { 'cb:frequency': 'quarterly', 'cb:period': 'Q4 2008' },
      'cb:transactionTerm': '1day',
    }

    expect(generateTransaction(value)).toEqual(expected)
  })

  it('should handle empty object', () => {
    expect(generateTransaction({})).toBeUndefined()
  })

  it('should handle non-object inputs', () => {
    // @ts-expect-error: This is for testing purposes.
    expect(generateTransaction('string')).toBeUndefined()
    expect(generateTransaction(undefined)).toBeUndefined()
  })
})

describe('generateOtherStatistic', () => {
  it('should generate other statistic with all properties', () => {
    const value = {
      value: { value: 7.84, decimals: 4, unitMult: 1, units: 'Currency' },
      observation: { value: 241.6, unit: 'USD', unitMult: 9, decimals: 1 },
      publicationDate: 'Spring, 2007',
      topic: 'H10',
      coverage: 'Hong Kong Dollar',
      observationPeriod: { frequency: 'business', period: '2026-06-22' },
      dataType: 'seasonally adjusted index',
    }
    const expected = {
      'cb:value': { '@decimals': 4, '@unit_mult': 1, '@units': 'Currency', '#text': 7.84 },
      'cb:observation': {
        'cb:value': 241.6,
        'cb:unit': 'USD',
        'cb:unit_mult': 9,
        'cb:decimals': 1,
      },
      'cb:publicationDate': 'Spring, 2007',
      'cb:topic': 'H10',
      'cb:coverage': 'Hong Kong Dollar',
      'cb:observationPeriod': { 'cb:frequency': 'business', 'cb:period': '2026-06-22' },
      'cb:dataType': 'seasonally adjusted index',
    }

    expect(generateOtherStatistic(value)).toEqual(expected)
  })

  it('should handle empty object', () => {
    expect(generateOtherStatistic({})).toBeUndefined()
  })

  it('should handle non-object inputs', () => {
    // @ts-expect-error: This is for testing purposes.
    expect(generateOtherStatistic('string')).toBeUndefined()
    expect(generateOtherStatistic(undefined)).toBeUndefined()
  })
})

describe('generateStatistics', () => {
  it('should generate statistics with all properties', () => {
    const value = {
      country: 'CH',
      institutionAbbrev: 'SNB',
      exchangeRate: { baseCurrency: 'CHF' },
      interestRate: { rateName: 'SARON' },
      transaction: { transactionName: 'couponPurchase' },
      otherStatistic: { topic: 'H10' },
    }
    const expected = {
      'cb:country': 'CH',
      'cb:institutionAbbrev': 'SNB',
      'cb:exchangeRate': { 'cb:baseCurrency': { '#text': 'CHF' } },
      'cb:interestRate': { 'cb:rateName': 'SARON' },
      'cb:transaction': { 'cb:transactionName': 'couponPurchase' },
      'cb:otherStatistic': { 'cb:topic': 'H10' },
    }

    expect(generateStatistics(value)).toEqual(expected)
  })

  it('should handle empty object', () => {
    expect(generateStatistics({})).toBeUndefined()
  })

  it('should handle non-object inputs', () => {
    // @ts-expect-error: This is for testing purposes.
    expect(generateStatistics('string')).toBeUndefined()
    expect(generateStatistics(undefined)).toBeUndefined()
  })
})

describe('generateItem', () => {
  it('should generate item with all application types', () => {
    const value = {
      event: { simpleTitle: 'Rate announcement' },
      news: { simpleTitle: 'Balance sheet items' },
      paper: { simpleTitle: 'Working paper' },
      speech: { simpleTitle: 'Opening remarks' },
      statistics: { country: 'CH' },
    }
    const expected = {
      'cb:event': { 'cb:simpleTitle': 'Rate announcement' },
      'cb:news': { 'cb:simpleTitle': 'Balance sheet items' },
      'cb:paper': { 'cb:simpleTitle': 'Working paper' },
      'cb:speech': { 'cb:simpleTitle': 'Opening remarks' },
      'cb:statistics': { 'cb:country': 'CH' },
    }

    expect(generateItem(value)).toEqual(expected)
  })

  it('should generate item with only news', () => {
    const value = {
      news: { simpleTitle: 'Term PRA operation', occurrenceDate: '2009-12-31' },
    }
    const expected = {
      'cb:news': {
        'cb:simpleTitle': 'Term PRA operation',
        'cb:occurrenceDate': '2009-12-31T00:00:00.000Z',
      },
    }

    expect(generateItem(value)).toEqual(expected)
  })

  it('should write custom child XML raw', () => {
    // Constructed specimen: no census feed writes cb:custom.
    const value = {
      custom: '<contact>Paul Roberts &amp; team</contact>',
    }
    const expected = {
      'cb:custom': '<contact>Paul Roberts &amp; team</contact>\n',
    }

    expect(generateItem(value)).toEqual(expected)
  })

  it('should skip custom child XML that is not well-formed', () => {
    const value = {
      custom: '<contact>unclosed',
    }

    expect(generateItem(value)).toBeUndefined()
  })

  it('should skip custom child XML with an entity XML cannot resolve', () => {
    const value = {
      custom: '<contact>Paul&nbsp;Roberts</contact>',
    }

    expect(generateItem(value)).toBeUndefined()
  })

  it('should keep a carriage return in custom child XML as a character reference', () => {
    const value = {
      custom: '<contact>a\rb</contact>',
    }
    const expected = {
      'cb:custom': '<contact>a&#13;b</contact>\n',
    }

    expect(generateItem(value)).toEqual(expected)
  })

  it('should handle empty strings', () => {
    const value = {
      news: { simpleTitle: '' },
    }

    expect(generateItem(value)).toBeUndefined()
  })

  it('should handle whitespace-only strings', () => {
    const value = {
      news: { simpleTitle: '   ' },
    }

    expect(generateItem(value)).toBeUndefined()
  })

  it('should handle empty object', () => {
    expect(generateItem({})).toBeUndefined()
  })

  it('should handle non-object inputs', () => {
    // @ts-expect-error: This is for testing purposes.
    expect(generateItem('string')).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generateItem(123)).toBeUndefined()
    expect(generateItem(undefined)).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generateItem(null)).toBeUndefined()
  })
})
