import { describe, expect, it } from 'bun:test'
import {
  parseEvent,
  parseExchangeRate,
  parseInterestRate,
  parseLegacyStatistics,
  parseNews,
  parseObservation,
  parseObservationPeriod,
  parseOtherStatistic,
  parsePaper,
  parsePerson,
  parseResource,
  parseRole,
  parseSpeech,
  parseStatistics,
  parseTransaction,
  parseValue,
  retrieveApplication,
  retrieveItem,
} from './utils.js'

describe('parseResource', () => {
  it('should parse resource with all properties', () => {
    const value = {
      'cb:title': { '#text': 'Staff Working Paper 2022-25' },
      'cb:link': { '#text': 'https://example.com/swp2022-25.pdf' },
      'cb:description': { '#text': 'Foreign Exchange Interventions' },
    }
    const expected = {
      title: 'Staff Working Paper 2022-25',
      link: 'https://example.com/swp2022-25.pdf',
      description: 'Foreign Exchange Interventions',
    }

    expect(parseResource(value)).toEqual(expected)
  })

  it('should parse resource with only link', () => {
    const value = {
      'cb:link': { '#text': 'https://example.com/swp2022-25.pdf' },
    }
    const expected = {
      link: 'https://example.com/swp2022-25.pdf',
    }

    expect(parseResource(value)).toEqual(expected)
  })

  it('should handle HTML entities in text content', () => {
    const value = {
      'cb:title': { '#text': 'Inflation &amp; Growth' },
    }
    const expected = {
      title: 'Inflation & Growth',
    }

    expect(parseResource(value)).toEqual(expected)
  })

  it('should handle CDATA sections in text content', () => {
    const value = {
      'cb:description': { '#text': '<![CDATA[Rates <b>held</b>]]>' },
    }
    const expected = {
      description: 'Rates <b>held</b>',
    }

    expect(parseResource(value)).toEqual(expected)
  })

  it('should return undefined for empty string values', () => {
    const value = {
      'cb:title': { '#text': '' },
      'cb:link': { '#text': '' },
    }

    expect(parseResource(value)).toBeUndefined()
  })

  it('should return undefined for whitespace-only values', () => {
    const value = {
      'cb:title': { '#text': '   ' },
      'cb:link': { '#text': '\n\t' },
    }

    expect(parseResource(value)).toBeUndefined()
  })

  it('should return undefined for empty object', () => {
    expect(parseResource({})).toBeUndefined()
  })

  it('should return undefined for non-object input', () => {
    expect(parseResource('string')).toBeUndefined()
    expect(parseResource(undefined)).toBeUndefined()
    expect(parseResource(null)).toBeUndefined()
    expect(parseResource([])).toBeUndefined()
  })
})

describe('parseRole', () => {
  it('should parse role with all properties', () => {
    const value = {
      'cb:jobtitle': { '#text': 'Deputy Governor' },
      'cb:affiliation': { '#text': 'Bank of Japan' },
      'cb:body': { '#text': 'Bank of Japan' },
    }
    const expected = {
      jobTitle: 'Deputy Governor',
      affiliation: 'Bank of Japan',
      body: 'Bank of Japan',
    }

    expect(parseRole(value)).toEqual(expected)
  })

  it('should parse role with only jobTitle', () => {
    const value = {
      'cb:jobtitle': { '#text': 'Member of the Governing Board' },
    }
    const expected = {
      jobTitle: 'Member of the Governing Board',
    }

    expect(parseRole(value)).toEqual(expected)
  })

  it('should return undefined for empty object', () => {
    expect(parseRole({})).toBeUndefined()
  })

  it('should return undefined for non-object input', () => {
    expect(parseRole('string')).toBeUndefined()
    expect(parseRole(undefined)).toBeUndefined()
    expect(parseRole(null)).toBeUndefined()
  })
})

describe('parsePerson', () => {
  it('should parse person with all properties', () => {
    const value = {
      '@type': 'Author',
      'cb:givenname': { '#text': 'Toshiro' },
      'cb:surname': { '#text': 'Muto' },
      'cb:personaltitle': { '#text': 'Mr' },
      'cb:nameaswritten': { '#text': 'Toshiro Muto' },
      'cb:role': {
        'cb:jobtitle': { '#text': 'Deputy Governor' },
        'cb:affiliation': { '#text': 'Bank of Japan' },
      },
    }
    const expected = {
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

    expect(parsePerson(value)).toEqual(expected)
  })

  it('should parse person with only nameAsWritten', () => {
    const value = {
      'cb:nameaswritten': { '#text': 'Thomas J. Carter' },
    }
    const expected = {
      nameAsWritten: 'Thomas J. Carter',
    }

    expect(parsePerson(value)).toEqual(expected)
  })

  it('should return undefined for empty object', () => {
    expect(parsePerson({})).toBeUndefined()
  })

  it('should return undefined for non-object input', () => {
    expect(parsePerson('string')).toBeUndefined()
    expect(parsePerson(undefined)).toBeUndefined()
    expect(parsePerson(null)).toBeUndefined()
  })
})

describe('parseEvent', () => {
  it('should parse event with all properties', () => {
    const value = {
      'cb:simpletitle': { '#text': 'Interest rate announcement' },
      'cb:occurrencedate': { '#text': '2026-09-02' },
      'cb:institutionabbrev': { '#text': 'BOC' },
      'cb:audience': { '#text': 'Economic Club of New York' },
      'cb:keyword': [{ '#text': 'monetary policy' }, { '#text': 'interest rates' }],
      'cb:resource': {
        'cb:title': { '#text': 'Press release' },
        'cb:link': { '#text': 'https://example.com/press-release' },
      },
      'cb:person': {
        'cb:nameaswritten': { '#text': 'Tiff Macklem' },
      },
      'cb:venue': { '#text': 'Mariton Hotel' },
      'cb:locationaswritten': { '#text': 'Rome, Italy' },
      'cb:locationcountry': { '#text': 'IT' },
      'cb:locationstate': { '#text': 'Lazio' },
      'cb:locationcity': { '#text': 'Rome' },
      'cb:eventdateend': { '#text': '2026-09-03' },
    }
    const expected = {
      simpleTitle: 'Interest rate announcement',
      occurrenceDate: '2026-09-02',
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
      eventDateEnd: '2026-09-03',
    }

    expect(parseEvent(value)).toEqual(expected)
  })

  it('should parse event with only simpleTitle and occurrenceDate', () => {
    const value = {
      'cb:simpletitle': { '#text': 'Interest rate announcement' },
      'cb:occurrencedate': { '#text': '2026-09-02' },
    }
    const expected = {
      simpleTitle: 'Interest rate announcement',
      occurrenceDate: '2026-09-02',
    }

    expect(parseEvent(value)).toEqual(expected)
  })

  it('should parse dates with custom parseDateFn', () => {
    const value = {
      'cb:occurrencedate': { '#text': '2026-09-02' },
      'cb:eventdateend': { '#text': '2026-09-03' },
    }
    const expected = {
      occurrenceDate: new Date('2026-09-02'),
      eventDateEnd: new Date('2026-09-03'),
    }

    expect(parseEvent(value, { parseDateFn: (raw) => new Date(raw) })).toEqual(expected)
  })

  it('should return undefined for empty object', () => {
    expect(parseEvent({})).toBeUndefined()
  })

  it('should return undefined for non-object input', () => {
    expect(parseEvent('string')).toBeUndefined()
    expect(parseEvent(undefined)).toBeUndefined()
    expect(parseEvent(null)).toBeUndefined()
  })
})

describe('parseNews', () => {
  it('should parse news with all properties', () => {
    const value = {
      'cb:simpletitle': { '#text': 'SNB balance sheet items end of May 2026' },
      'cb:occurrencedate': { '#text': '2026-06-30T07:00:00Z' },
      'cb:institutionabbrev': { '#text': 'SNB' },
      'cb:keyword': { '#text': 'balance sheet' },
      'cb:resource': {
        'cb:title': { '#text': 'SNB balance sheet items end of May 2026' },
        'cb:link': { '#text': 'https://example.com/statpub' },
      },
      'cb:person': {
        'cb:nameaswritten': { '#text': 'Petra Tschudin' },
      },
    }
    const expected = {
      simpleTitle: 'SNB balance sheet items end of May 2026',
      occurrenceDate: '2026-06-30T07:00:00Z',
      institutionAbbrev: 'SNB',
      keywords: ['balance sheet'],
      resources: [
        {
          title: 'SNB balance sheet items end of May 2026',
          link: 'https://example.com/statpub',
        },
      ],
      persons: [{ nameAsWritten: 'Petra Tschudin' }],
    }

    expect(parseNews(value)).toEqual(expected)
  })

  it('should parse news with only simpleTitle', () => {
    const value = {
      'cb:simpletitle': { '#text': 'Senior Loan Officer Survey' },
    }
    const expected = {
      simpleTitle: 'Senior Loan Officer Survey',
    }

    expect(parseNews(value)).toEqual(expected)
  })

  it('should return undefined for empty object', () => {
    expect(parseNews({})).toBeUndefined()
  })

  it('should return undefined for non-object input', () => {
    expect(parseNews('string')).toBeUndefined()
    expect(parseNews(undefined)).toBeUndefined()
    expect(parseNews(null)).toBeUndefined()
  })
})

describe('parsePaper', () => {
  it('should parse paper with all properties', () => {
    const value = {
      'cb:simpletitle': { '#text': 'Central bank communication' },
      'cb:occurrencedate': { '#text': '2026-06-21T22:00:00Z' },
      'cb:institutionabbrev': { '#text': 'SNB' },
      'cb:keyword': [{ '#text': 'Content analysis' }, { '#text': 'Language complexity' }],
      'cb:resource': {
        'cb:title': { '#text': 'Working paper 2026-06' },
        'cb:link': { '#text': 'https://example.com/working-paper-2026-06' },
      },
      'cb:person': [
        { 'cb:nameaswritten': { '#text': 'Thomas Lustenberger' } },
        { 'cb:nameaswritten': { '#text': 'Enzo Rossi' } },
      ],
      'cb:byline': { '#text': 'Thomas Lustenberger and Enzo Rossi' },
      'cb:publicationdate': { '#text': 'June 2026' },
      'cb:publication': { '#text': 'SNB Working Papers' },
      'cb:issue': { '#text': '2026-06' },
      'cb:jelcode': [{ '#text': 'E52' }, { '#text': 'E58' }],
    }
    const expected = {
      simpleTitle: 'Central bank communication',
      occurrenceDate: '2026-06-21T22:00:00Z',
      institutionAbbrev: 'SNB',
      keywords: ['Content analysis', 'Language complexity'],
      resources: [
        {
          title: 'Working paper 2026-06',
          link: 'https://example.com/working-paper-2026-06',
        },
      ],
      persons: [{ nameAsWritten: 'Thomas Lustenberger' }, { nameAsWritten: 'Enzo Rossi' }],
      byline: 'Thomas Lustenberger and Enzo Rossi',
      publicationDate: 'June 2026',
      publication: 'SNB Working Papers',
      issue: '2026-06',
      jelCodes: ['E52', 'E58'],
    }

    expect(parsePaper(value)).toEqual(expected)
  })

  it('should parse paper with only jelCodes', () => {
    const value = {
      'cb:jelcode': { '#text': 'E52' },
    }
    const expected = {
      jelCodes: ['E52'],
    }

    expect(parsePaper(value)).toEqual(expected)
  })

  it('should keep publicationDate as free text', () => {
    const value = {
      'cb:publicationdate': { '#text': 'Spring, 2007' },
    }
    const expected = {
      publicationDate: 'Spring, 2007',
    }

    expect(parsePaper(value, { parseDateFn: (raw) => new Date(raw) })).toEqual(expected)
  })

  it('should return undefined for empty object', () => {
    expect(parsePaper({})).toBeUndefined()
  })

  it('should return undefined for non-object input', () => {
    expect(parsePaper('string')).toBeUndefined()
    expect(parsePaper(undefined)).toBeUndefined()
    expect(parsePaper(null)).toBeUndefined()
  })
})

describe('parseSpeech', () => {
  it('should parse speech with all properties', () => {
    const value = {
      'cb:simpletitle': { '#text': 'Global developments and monetary policy' },
      'cb:occurrencedate': { '#text': '2026-06-24T09:25:00Z' },
      'cb:institutionabbrev': { '#text': 'SNB' },
      'cb:audience': { '#text': 'Finance committees' },
      'cb:keyword': { '#text': 'monetary policy' },
      'cb:resource': {
        'cb:title': { '#text': 'Speech text' },
        'cb:link': { '#text': 'https://example.com/speech' },
      },
      'cb:person': {
        'cb:nameaswritten': { '#text': 'Petra Tschudin' },
        'cb:role': {
          'cb:jobtitle': { '#text': 'Member of the Governing Board' },
        },
      },
      'cb:venue': { '#text': 'Finance seminar 2026' },
      'cb:locationaswritten': { '#text': 'Basel, Switzerland' },
      'cb:locationcountry': { '#text': 'CH' },
      'cb:locationstate': { '#text': 'Basel-Stadt' },
      'cb:locationcity': { '#text': 'Basel' },
    }
    const expected = {
      simpleTitle: 'Global developments and monetary policy',
      occurrenceDate: '2026-06-24T09:25:00Z',
      institutionAbbrev: 'SNB',
      audience: 'Finance committees',
      keywords: ['monetary policy'],
      resources: [{ title: 'Speech text', link: 'https://example.com/speech' }],
      persons: [
        {
          nameAsWritten: 'Petra Tschudin',
          role: { jobTitle: 'Member of the Governing Board' },
        },
      ],
      venue: 'Finance seminar 2026',
      locationAsWritten: 'Basel, Switzerland',
      locationCountry: 'CH',
      locationState: 'Basel-Stadt',
      locationCity: 'Basel',
    }

    expect(parseSpeech(value)).toEqual(expected)
  })

  it('should parse speech with only venue', () => {
    const value = {
      'cb:venue': { '#text': 'Mariton Hotel, La Paz, Bolivia' },
    }
    const expected = {
      venue: 'Mariton Hotel, La Paz, Bolivia',
    }

    expect(parseSpeech(value)).toEqual(expected)
  })

  it('should return undefined for empty object', () => {
    expect(parseSpeech({})).toBeUndefined()
  })

  it('should return undefined for non-object input', () => {
    expect(parseSpeech('string')).toBeUndefined()
    expect(parseSpeech(undefined)).toBeUndefined()
    expect(parseSpeech(null)).toBeUndefined()
  })
})

describe('parseValue', () => {
  it('should parse value with all properties', () => {
    const value = {
      '@frequency': 'weekly',
      '@decimals': '3',
      '@unit_mult': '9',
      '@units': 'USD',
      '#text': '241.6',
    }
    const expected = {
      value: 241.6,
      frequency: 'weekly',
      decimals: 3,
      unitMult: 9,
      units: 'USD',
    }

    expect(parseValue(value)).toEqual(expected)
  })

  it('should parse value with frequency and decimals', () => {
    const value = {
      '@frequency': 'daily',
      '@decimals': '4',
      '#text': '0.9190',
    }
    const expected = {
      value: 0.919,
      frequency: 'daily',
      decimals: 4,
    }

    expect(parseValue(value)).toEqual(expected)
  })

  it('should return undefined for empty object', () => {
    expect(parseValue({})).toBeUndefined()
  })

  it('should return undefined for non-object input', () => {
    expect(parseValue('string')).toBeUndefined()
    expect(parseValue(undefined)).toBeUndefined()
    expect(parseValue(null)).toBeUndefined()
  })
})

describe('parseObservation', () => {
  it('should parse observation with all properties', () => {
    const value = {
      'cb:value': { '#text': '0.9227' },
      'cb:unit': { '#text': 'CHF' },
      'cb:unit_mult': { '#text': '1' },
      'cb:decimals': { '#text': '4' },
    }
    const expected = {
      value: 0.9227,
      unit: 'CHF',
      unitMult: 1,
      decimals: 4,
    }

    expect(parseObservation(value)).toEqual(expected)
  })

  it('should parse observation with only value', () => {
    const value = {
      'cb:value': { '#text': '-1.23' },
    }
    const expected = {
      value: -1.23,
    }

    expect(parseObservation(value)).toEqual(expected)
  })

  it('should return undefined for empty object', () => {
    expect(parseObservation({})).toBeUndefined()
  })

  it('should return undefined for non-object input', () => {
    expect(parseObservation('string')).toBeUndefined()
    expect(parseObservation(undefined)).toBeUndefined()
    expect(parseObservation(null)).toBeUndefined()
  })
})

describe('parseObservationPeriod', () => {
  it('should parse frequency and period from child elements', () => {
    const value = {
      'cb:frequency': { '#text': 'daily' },
      'cb:period': { '#text': '2026-07-17' },
    }
    const expected = {
      frequency: 'daily',
      period: '2026-07-17',
    }

    expect(parseObservationPeriod(value)).toEqual(expected)
  })

  it('should parse frequency from attribute and period from text', () => {
    const value = {
      '@frequency': 'business',
      '#text': '2026-06-22',
    }
    const expected = {
      frequency: 'business',
      period: '2026-06-22',
    }

    expect(parseObservationPeriod(value)).toEqual(expected)
  })

  it('should prefer child elements when both forms are present', () => {
    const value = {
      '@frequency': 'business',
      'cb:frequency': { '#text': 'daily' },
      'cb:period': { '#text': '2026-07-17' },
    }
    const expected = {
      frequency: 'daily',
      period: '2026-07-17',
    }

    expect(parseObservationPeriod(value)).toEqual(expected)
  })

  it('should fall back to the attribute when the child frequency is empty', () => {
    const value = {
      '@frequency': 'business',
      'cb:frequency': { '#text': '' },
    }
    const expected = {
      frequency: 'business',
    }

    expect(parseObservationPeriod(value)).toEqual(expected)
  })

  it('should return undefined for empty object', () => {
    expect(parseObservationPeriod({})).toBeUndefined()
  })

  it('should return undefined for non-object input', () => {
    expect(parseObservationPeriod('string')).toBeUndefined()
    expect(parseObservationPeriod(undefined)).toBeUndefined()
    expect(parseObservationPeriod(null)).toBeUndefined()
  })
})

describe('parseExchangeRate', () => {
  it('should parse exchange rate in RSS-CB 1.2 form', () => {
    const value = {
      'cb:observation': {
        'cb:value': { '#text': '0.9227' },
        'cb:unit': { '#text': 'CHF' },
        'cb:decimals': { '#text': '4' },
      },
      'cb:basecurrency': { '#text': 'CHF' },
      'cb:targetcurrency': { '#text': 'EUR' },
      'cb:ratetype': { '#text': 'Daily rates (11:00)' },
      'cb:observationperiod': {
        'cb:frequency': { '#text': 'daily' },
        'cb:period': { '#text': '2026-07-17' },
      },
    }
    const expected = {
      observation: { value: 0.9227, unit: 'CHF', decimals: 4 },
      baseCurrency: 'CHF',
      targetCurrency: 'EUR',
      rateType: 'Daily rates (11:00)',
      observationPeriod: { frequency: 'daily', period: '2026-07-17' },
    }

    expect(parseExchangeRate(value)).toEqual(expected)
  })

  it('should parse exchange rate in RSS-CB 1.1 form', () => {
    const value = {
      'cb:value': { '@frequency': 'daily', '@decimals': '4', '#text': '0.9190' },
      'cb:basecurrency': { '@unit_mult': '0', '#text': 'EUR' },
      'cb:targetcurrency': { '#text': 'CHF' },
      'cb:ratetype': { '#text': 'Reference rate' },
    }
    const expected = {
      value: { value: 0.919, frequency: 'daily', decimals: 4 },
      baseCurrency: 'EUR',
      baseCurrencyUnitMult: 0,
      targetCurrency: 'CHF',
      rateType: 'Reference rate',
    }

    expect(parseExchangeRate(value)).toEqual(expected)
  })

  it('should parse baseCurrency unit_mult', () => {
    const value = {
      'cb:basecurrency': { '@unit_mult': '2', '#text': 'JPY' },
    }
    const expected = {
      baseCurrency: 'JPY',
      baseCurrencyUnitMult: 2,
    }

    expect(parseExchangeRate(value)).toEqual(expected)
  })

  it('should return undefined for empty object', () => {
    expect(parseExchangeRate({})).toBeUndefined()
  })

  it('should return undefined for non-object input', () => {
    expect(parseExchangeRate('string')).toBeUndefined()
    expect(parseExchangeRate(undefined)).toBeUndefined()
    expect(parseExchangeRate(null)).toBeUndefined()
  })
})

describe('parseInterestRate', () => {
  it('should parse interest rate with all properties', () => {
    const value = {
      'cb:value': { '@frequency': 'daily business', '@decimals': '2', '#text': '6.30' },
      'cb:observation': {
        'cb:value': { '#text': '0.337' },
        'cb:unit': { '#text': 'percent' },
        'cb:decimals': { '#text': '3' },
      },
      'cb:ratename': { '#text': 'R10' },
      'cb:ratetype': { '#text': 'Spot interest rate for 10-year maturities' },
      'cb:observationperiod': {
        'cb:frequency': { '#text': 'daily' },
        'cb:period': { '#text': '2026-07-01' },
      },
    }
    const expected = {
      value: { value: 6.3, frequency: 'daily business', decimals: 2 },
      observation: { value: 0.337, unit: 'percent', decimals: 3 },
      rateName: 'R10',
      rateType: 'Spot interest rate for 10-year maturities',
      observationPeriod: { frequency: 'daily', period: '2026-07-01' },
    }

    expect(parseInterestRate(value)).toEqual(expected)
  })

  it('should parse interest rate with only rateName', () => {
    const value = {
      'cb:ratename': { '#text': 'FedFunds' },
    }
    const expected = {
      rateName: 'FedFunds',
    }

    expect(parseInterestRate(value)).toEqual(expected)
  })

  it('should return undefined for empty object', () => {
    expect(parseInterestRate({})).toBeUndefined()
  })

  it('should return undefined for non-object input', () => {
    expect(parseInterestRate('string')).toBeUndefined()
    expect(parseInterestRate(undefined)).toBeUndefined()
    expect(parseInterestRate(null)).toBeUndefined()
  })
})

describe('parseTransaction', () => {
  it('should parse transaction with all properties', () => {
    const value = {
      'cb:value': { '@unit_mult': '9', '@decimals': '3', '#text': '1.781' },
      'cb:observation': {
        'cb:value': { '#text': '1.781' },
        'cb:unit': { '#text': 'USD' },
        'cb:unit_mult': { '#text': '9' },
        'cb:decimals': { '#text': '3' },
      },
      'cb:transactionname': { '#text': 'couponPurchase' },
      'cb:transactiontype': { '#text': 'permanent open market operations' },
      'cb:observationperiod': {
        'cb:frequency': { '#text': 'quarterly' },
        'cb:period': { '#text': 'Q4 2008' },
      },
      'cb:transactionterm': { '#text': '1day' },
    }
    const expected = {
      value: { value: 1.781, unitMult: 9, decimals: 3 },
      observation: { value: 1.781, unit: 'USD', unitMult: 9, decimals: 3 },
      transactionName: 'couponPurchase',
      transactionType: 'permanent open market operations',
      observationPeriod: { frequency: 'quarterly', period: 'Q4 2008' },
      transactionTerm: '1day',
    }

    expect(parseTransaction(value)).toEqual(expected)
  })

  it('should parse transaction with only transactionName', () => {
    const value = {
      'cb:transactionname': { '#text': 'couponPurchase' },
    }
    const expected = {
      transactionName: 'couponPurchase',
    }

    expect(parseTransaction(value)).toEqual(expected)
  })

  it('should return undefined for empty object', () => {
    expect(parseTransaction({})).toBeUndefined()
  })

  it('should return undefined for non-object input', () => {
    expect(parseTransaction('string')).toBeUndefined()
    expect(parseTransaction(undefined)).toBeUndefined()
    expect(parseTransaction(null)).toBeUndefined()
  })
})

describe('parseOtherStatistic', () => {
  it('should parse other statistic with all properties', () => {
    const value = {
      'cb:value': {
        '@decimals': '4',
        '@unit_mult': '1',
        '@units': 'Currency',
        '#text': '7.8400',
      },
      'cb:observation': {
        'cb:value': { '#text': '241.6' },
        'cb:unit': { '#text': 'USD' },
        'cb:unit_mult': { '#text': '9' },
        'cb:decimals': { '#text': '1' },
      },
      'cb:publicationdate': { '#text': 'Spring, 2007' },
      'cb:topic': { '#text': 'H10' },
      'cb:coverage': { '#text': 'Hong Kong Dollar' },
      'cb:observationperiod': { '@frequency': 'business', '#text': '2026-06-22' },
      'cb:datatype': { '#text': 'seasonally adjusted index' },
    }
    const expected = {
      value: { value: 7.84, decimals: 4, unitMult: 1, units: 'Currency' },
      observation: { value: 241.6, unit: 'USD', unitMult: 9, decimals: 1 },
      publicationDate: 'Spring, 2007',
      topic: 'H10',
      coverage: 'Hong Kong Dollar',
      observationPeriod: { frequency: 'business', period: '2026-06-22' },
      dataType: 'seasonally adjusted index',
    }

    expect(parseOtherStatistic(value)).toEqual(expected)
  })

  it('should parse other statistic with only topic', () => {
    const value = {
      'cb:topic': { '#text': 'CP' },
    }
    const expected = {
      topic: 'CP',
    }

    expect(parseOtherStatistic(value)).toEqual(expected)
  })

  it('should return undefined for empty object', () => {
    expect(parseOtherStatistic({})).toBeUndefined()
  })

  it('should return undefined for non-object input', () => {
    expect(parseOtherStatistic('string')).toBeUndefined()
    expect(parseOtherStatistic(undefined)).toBeUndefined()
    expect(parseOtherStatistic(null)).toBeUndefined()
  })
})

describe('parseStatistics', () => {
  it('should parse statistics with all properties', () => {
    const value = {
      'cb:country': { '#text': 'CH' },
      'cb:institutionabbrev': { '#text': 'SNB' },
      'cb:exchangerate': { 'cb:basecurrency': { '#text': 'CHF' } },
      'cb:interestrate': { 'cb:ratename': { '#text': 'SARON' } },
      'cb:transaction': { 'cb:transactionname': { '#text': 'couponPurchase' } },
      'cb:otherstatistic': { 'cb:topic': { '#text': 'H10' } },
    }
    const expected = {
      country: 'CH',
      institutionAbbrev: 'SNB',
      exchangeRate: { baseCurrency: 'CHF' },
      interestRate: { rateName: 'SARON' },
      transaction: { transactionName: 'couponPurchase' },
      otherStatistic: { topic: 'H10' },
    }

    expect(parseStatistics(value)).toEqual(expected)
  })

  it('should parse statistics with only country', () => {
    const value = {
      'cb:country': { '#text': 'MX' },
    }
    const expected = {
      country: 'MX',
    }

    expect(parseStatistics(value)).toEqual(expected)
  })

  it('should return undefined for empty object', () => {
    expect(parseStatistics({})).toBeUndefined()
  })

  it('should return undefined for non-object input', () => {
    expect(parseStatistics('string')).toBeUndefined()
    expect(parseStatistics(undefined)).toBeUndefined()
    expect(parseStatistics(null)).toBeUndefined()
  })
})

describe('parseLegacyStatistics', () => {
  // Constructed specimens: no census feed writes the RSS-CB 1.0 layout.
  it('should read an exchange rate from flat elements', () => {
    const value = {
      'cb:country': { '#text': 'DZ' },
      'cb:institutionabbrev': { '#text': 'BA' },
      'cb:basecurrency': { '#text': 'CNY' },
      'cb:targetcurrency': { '#text': 'CHF' },
      'cb:value': { '@frequency': 'daily', '@decimals': '4', '#text': '1.1240' },
      'cb:ratetype': { '#text': 'noon buying' },
    }
    const expected = {
      country: 'DZ',
      institutionAbbrev: 'BA',
      exchangeRate: {
        value: { value: 1.124, frequency: 'daily', decimals: 4 },
        baseCurrency: 'CNY',
        targetCurrency: 'CHF',
        rateType: 'noon buying',
      },
    }

    expect(parseLegacyStatistics(value)).toEqual(expected)
  })

  it('should read an interest rate from flat elements', () => {
    const value = {
      'cb:ratename': { '#text': 'FedFunds' },
      'cb:value': { '@frequency': 'daily', '@decimals': '2', '#text': '5.33' },
    }
    const expected = {
      interestRate: {
        value: { value: 5.33, frequency: 'daily', decimals: 2 },
        rateName: 'FedFunds',
      },
    }

    expect(parseLegacyStatistics(value)).toEqual(expected)
  })

  it('should read a transaction from flat elements', () => {
    const value = {
      'cb:transactionname': { '#text': 'couponPurchase' },
      'cb:transactiontype': { '#text': 'permanent open market operations' },
      'cb:transactionterm': { '#text': '1day' },
      'cb:value': { '@unit_mult': '9', '@decimals': '3', '#text': '1.781' },
    }
    const expected = {
      transaction: {
        value: { value: 1.781, unitMult: 9, decimals: 3 },
        transactionName: 'couponPurchase',
        transactionType: 'permanent open market operations',
        transactionTerm: '1day',
      },
    }

    expect(parseLegacyStatistics(value)).toEqual(expected)
  })

  it('should read another statistic from flat elements', () => {
    const value = {
      'cb:topic': { '#text': 'CP' },
      'cb:coverage': { '#text': 'Manufacturing' },
      'cb:value': {
        '@frequency': 'weekly',
        '@unit_mult': '9',
        '@units': 'USD',
        '@decimals': '3',
        '#text': '241.6',
      },
    }
    const expected = {
      otherStatistic: {
        value: { value: 241.6, frequency: 'weekly', unitMult: 9, units: 'USD', decimals: 3 },
        topic: 'CP',
        coverage: 'Manufacturing',
      },
    }

    expect(parseLegacyStatistics(value)).toEqual(expected)
  })

  it('should drop a value with no subtype element', () => {
    const value = {
      'cb:country': { '#text': 'DZ' },
      'cb:value': { '@decimals': '4', '#text': '1.1240' },
    }
    const expected = {
      country: 'DZ',
    }

    expect(parseLegacyStatistics(value)).toEqual(expected)
  })

  it('should return undefined for empty object', () => {
    expect(parseLegacyStatistics({})).toBeUndefined()
  })

  it('should return undefined for non-object input', () => {
    expect(parseLegacyStatistics('string')).toBeUndefined()
    expect(parseLegacyStatistics(undefined)).toBeUndefined()
    expect(parseLegacyStatistics(null)).toBeUndefined()
  })
})

describe('retrieveApplication', () => {
  // Constructed specimens: no census feed writes the RSS-CB 1.0 layout.
  it('should read the nested application element', () => {
    const value = {
      'cb:news': { 'cb:simpletitle': { '#text': 'Nested title' } },
    }
    const expected = {
      simpleTitle: 'Nested title',
    }

    expect(retrieveApplication(value, 'news', parseNews)).toEqual(expected)
  })

  it('should read flat elements named by cb:application', () => {
    const value = {
      'cb:application': { '#text': 'speech' },
      'cb:simpletitle': { '#text': 'Flat title' },
      'cb:venue': { '#text': 'Mariton Hotel, La Paz, Bolivia' },
    }
    const expected = {
      simpleTitle: 'Flat title',
      venue: 'Mariton Hotel, La Paz, Bolivia',
    }

    expect(retrieveApplication(value, 'speech', parseSpeech)).toEqual(expected)
  })

  it('should match cb:application in any case', () => {
    const value = {
      'cb:application': { '#text': 'Speech' },
      'cb:simpletitle': { '#text': 'Flat title' },
    }
    const expected = {
      simpleTitle: 'Flat title',
    }

    expect(retrieveApplication(value, 'speech', parseSpeech)).toEqual(expected)
  })

  it('should prefer the nested element over flat elements', () => {
    const value = {
      'cb:application': { '#text': 'news' },
      'cb:simpletitle': { '#text': 'Flat title' },
      'cb:news': { 'cb:simpletitle': { '#text': 'Nested title' } },
    }
    const expected = {
      simpleTitle: 'Nested title',
    }

    expect(retrieveApplication(value, 'news', parseNews)).toEqual(expected)
  })

  it('should fall back to flat elements when the nested element is empty', () => {
    const value = {
      'cb:application': { '#text': 'news' },
      'cb:simpletitle': { '#text': 'Flat title' },
      'cb:news': { 'cb:simpletitle': { '#text': '' } },
    }
    const expected = {
      simpleTitle: 'Flat title',
    }

    expect(retrieveApplication(value, 'news', parseNews)).toEqual(expected)
  })

  it('should use the flat parser when one is given', () => {
    const value = {
      'cb:application': { '#text': 'statistics' },
      'cb:ratename': { '#text': 'FedFunds' },
    }
    const expected = {
      interestRate: { rateName: 'FedFunds' },
    }

    expect(
      retrieveApplication(value, 'statistics', parseStatistics, parseLegacyStatistics),
    ).toEqual(expected)
  })

  it('should ignore flat elements when cb:application names another type', () => {
    const value = {
      'cb:application': { '#text': 'paper' },
      'cb:simpletitle': { '#text': 'Flat title' },
    }

    expect(retrieveApplication(value, 'news', parseNews)).toBeUndefined()
  })

  it('should ignore flat elements without cb:application', () => {
    const value = {
      'cb:simpletitle': { '#text': 'Flat title' },
    }

    expect(retrieveApplication(value, 'news', parseNews)).toBeUndefined()
  })

  it('should return undefined for non-object input', () => {
    expect(retrieveApplication(undefined, 'news', parseNews)).toBeUndefined()
    expect(retrieveApplication('string', 'news', parseNews)).toBeUndefined()
  })
})

describe('retrieveItem', () => {
  it('should parse item with all application types', () => {
    const value = {
      'cb:event': { 'cb:simpletitle': { '#text': 'Rate announcement' } },
      'cb:news': { 'cb:simpletitle': { '#text': 'Balance sheet items' } },
      'cb:paper': { 'cb:simpletitle': { '#text': 'Working paper' } },
      'cb:speech': { 'cb:simpletitle': { '#text': 'Opening remarks' } },
      'cb:statistics': { 'cb:country': { '#text': 'CH' } },
    }
    const expected = {
      event: { simpleTitle: 'Rate announcement' },
      news: { simpleTitle: 'Balance sheet items' },
      paper: { simpleTitle: 'Working paper' },
      speech: { simpleTitle: 'Opening remarks' },
      statistics: { country: 'CH' },
    }

    expect(retrieveItem(value)).toEqual(expected)
  })

  it('should parse item with only news', () => {
    const value = {
      'cb:news': {
        'cb:simpletitle': { '#text': 'Term PRA operation' },
        'cb:occurrencedate': { '#text': '2009-12-31' },
      },
    }
    const expected = {
      news: {
        simpleTitle: 'Term PRA operation',
        occurrenceDate: '2009-12-31',
      },
    }

    expect(retrieveItem(value)).toEqual(expected)
  })

  it('should pass parseDateFn to nested dates', () => {
    const value = {
      'cb:speech': { 'cb:occurrencedate': { '#text': '2026-06-24T09:25:00Z' } },
    }
    const expected = {
      speech: { occurrenceDate: new Date('2026-06-24T09:25:00Z') },
    }

    expect(retrieveItem(value, { parseDateFn: (raw) => new Date(raw) })).toEqual(expected)
  })

  it('should use first application element when repeated', () => {
    const value = {
      'cb:news': [
        { 'cb:simpletitle': { '#text': 'First' } },
        { 'cb:simpletitle': { '#text': 'Second' } },
      ],
    }
    const expected = {
      news: { simpleTitle: 'First' },
    }

    expect(retrieveItem(value)).toEqual(expected)
  })

  it('should parse RSS-CB 1.0 flat elements into the application type', () => {
    // Constructed specimen: no census feed writes the RSS-CB 1.0 layout.
    const value = {
      'cb:application': { '#text': 'paper' },
      'cb:simpletitle': { '#text': 'Financial discussion paper' },
      'cb:occurrencedate': { '#text': '2006-12-19' },
      'cb:byline': { '#text': 'Gonzalez, Arturo and di Taranto, Mario' },
      'cb:jelcode': { '#text': 'E11' },
    }
    const expected = {
      paper: {
        simpleTitle: 'Financial discussion paper',
        occurrenceDate: '2006-12-19',
        byline: 'Gonzalez, Arturo and di Taranto, Mario',
        jelCodes: ['E11'],
      },
    }

    expect(retrieveItem(value)).toEqual(expected)
  })

  it('should parse custom child XML verbatim', () => {
    // Constructed specimen: no census feed writes cb:custom.
    const value = {
      'cb:custom': {
        '@rdf:parsetype': 'Resource',
        '#text': '<onecb:contact>Paul Roberts &amp; team</onecb:contact>',
      },
    }
    const expected = {
      custom: '<onecb:contact>Paul Roberts &amp; team</onecb:contact>',
    }

    expect(retrieveItem(value)).toEqual(expected)
  })

  it('should handle HTML entities in text content', () => {
    const value = {
      'cb:news': { 'cb:simpletitle': { '#text': 'Rates &amp; liquidity' } },
    }
    const expected = {
      news: { simpleTitle: 'Rates & liquidity' },
    }

    expect(retrieveItem(value)).toEqual(expected)
  })

  it('should handle CDATA sections in text content', () => {
    const value = {
      'cb:news': { 'cb:simpletitle': { '#text': '<![CDATA[Rates <em>held</em>]]>' } },
    }
    const expected = {
      news: { simpleTitle: 'Rates <em>held</em>' },
    }

    expect(retrieveItem(value)).toEqual(expected)
  })

  it('should return undefined for empty string values', () => {
    const value = {
      'cb:news': { 'cb:simpletitle': { '#text': '' } },
    }

    expect(retrieveItem(value)).toBeUndefined()
  })

  it('should return undefined for whitespace-only values', () => {
    const value = {
      'cb:news': { 'cb:simpletitle': { '#text': '   ' } },
    }

    expect(retrieveItem(value)).toBeUndefined()
  })

  it('should return undefined for empty object', () => {
    expect(retrieveItem({})).toBeUndefined()
  })

  it('should return undefined for non-object input', () => {
    expect(retrieveItem('string')).toBeUndefined()
    expect(retrieveItem(undefined)).toBeUndefined()
    expect(retrieveItem(null)).toBeUndefined()
    expect(retrieveItem([])).toBeUndefined()
  })
})
