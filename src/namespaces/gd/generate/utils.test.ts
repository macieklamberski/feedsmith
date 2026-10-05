import { describe, expect, it } from 'bun:test'
import {
  generateComments,
  generateCountry,
  generateEmail,
  generateEntry,
  generateEntryLink,
  generateExtendedProperty,
  generateFeed,
  generateFeedLink,
  generateGeoPt,
  generateIm,
  generateImage,
  generateMoney,
  generateName,
  generateOrganization,
  generateOriginalEvent,
  generatePerson,
  generatePhoneNumber,
  generatePhoneticName,
  generatePostalAddress,
  generateRating,
  generateRecurrenceException,
  generateReminder,
  generateStructuredPostalAddress,
  generateWhen,
  generateWhere,
  generateWho,
} from './utils.js'

describe('generateImage', () => {
  it('should generate image with all properties', () => {
    const value = {
      src: 'https://example.com/img/b16-rounded.gif',
      rel: 'http://schemas.google.com/g/2005#thumbnail',
      width: 16,
      height: 16,
    }
    const expected = {
      '@src': 'https://example.com/img/b16-rounded.gif',
      '@rel': 'http://schemas.google.com/g/2005#thumbnail',
      '@width': 16,
      '@height': 16,
    }

    expect(generateImage(value)).toEqual(expected)
  })

  it('should generate image with only src', () => {
    const value = {
      src: 'https://example.com/img/avatar.png',
    }
    const expected = {
      '@src': 'https://example.com/img/avatar.png',
    }

    expect(generateImage(value)).toEqual(expected)
  })

  it('should handle empty strings', () => {
    const value = {
      src: '',
      rel: 'http://schemas.google.com/g/2005#thumbnail',
    }
    const expected = {
      '@rel': 'http://schemas.google.com/g/2005#thumbnail',
    }

    expect(generateImage(value)).toEqual(expected)
  })

  it('should handle whitespace-only strings', () => {
    const value = {
      src: '   ',
      rel: '\t\n',
    }

    expect(generateImage(value)).toBeUndefined()
  })

  it('should handle empty object', () => {
    expect(generateImage({})).toBeUndefined()
  })

  it('should handle non-object inputs', () => {
    // @ts-expect-error: This is for testing purposes.
    expect(generateImage('string')).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generateImage(123)).toBeUndefined()
    expect(generateImage(undefined)).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generateImage(null)).toBeUndefined()
  })
})

describe('generateFeedLink', () => {
  it('should generate feed link with all attributes', () => {
    const value = {
      href: 'https://example.com/Jo/posts/MyFirstPost/comments',
      rel: 'http://example.com/schemas/2007#comments',
      readOnly: true,
      countHint: 10,
    }
    const expected = {
      '@href': 'https://example.com/Jo/posts/MyFirstPost/comments',
      '@rel': 'http://example.com/schemas/2007#comments',
      '@readOnly': true,
      '@countHint': 10,
    }

    expect(generateFeedLink(value)).toEqual(expected)
  })

  it('should generate feed link with embedded Atom feed', () => {
    const value = {
      feed: {
        id: 'cid:1',
        title: { value: 'List' },
        updated: new Date('2006-01-01T00:00:00Z'),
      },
    }
    const expected = {
      feed: {
        '@xmlns': 'http://www.w3.org/2005/Atom',
        id: 'cid:1',
        title: { '#text': 'List' },
        updated: '2006-01-01T00:00:00.000Z',
      },
    }

    expect(generateFeedLink(value)).toEqual(expected)
  })

  it('should handle empty object', () => {
    expect(generateFeedLink({})).toBeUndefined()
  })

  it('should handle non-object inputs', () => {
    // @ts-expect-error: This is for testing purposes.
    expect(generateFeedLink('string')).toBeUndefined()
    expect(generateFeedLink(undefined)).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generateFeedLink(null)).toBeUndefined()
  })
})

describe('generateEntryLink', () => {
  it('should generate entry link with all attributes', () => {
    const value = {
      href: 'https://example.com/jo/contacts/Jo',
      rel: 'alternate',
      readOnly: false,
    }
    const expected = {
      '@href': 'https://example.com/jo/contacts/Jo',
      '@rel': 'alternate',
      '@readOnly': false,
    }

    expect(generateEntryLink(value)).toEqual(expected)
  })

  it('should generate entry link with embedded Atom entry and its gd properties', () => {
    const value = {
      href: 'https://example.com/jo/contacts/Jo',
      entry: {
        id: 'https://example.com/jo/contacts/Jo',
        title: { value: 'Jo March' },
        updated: new Date('2006-01-01T00:00:00Z'),
        gd: {
          emails: [{ address: 'jo@example.com' }],
        },
      },
    }
    const expected = {
      '@href': 'https://example.com/jo/contacts/Jo',
      entry: {
        id: 'https://example.com/jo/contacts/Jo',
        title: { '#text': 'Jo March' },
        updated: '2006-01-01T00:00:00.000Z',
        'gd:email': [{ '@address': 'jo@example.com' }],
      },
    }

    expect(generateEntryLink(value)).toEqual(expected)
  })

  it('should handle empty object', () => {
    expect(generateEntryLink({})).toBeUndefined()
  })

  it('should handle non-object inputs', () => {
    // @ts-expect-error: This is for testing purposes.
    expect(generateEntryLink('string')).toBeUndefined()
    expect(generateEntryLink(undefined)).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generateEntryLink(null)).toBeUndefined()
  })
})

describe('generateComments', () => {
  it('should generate comments with all properties', () => {
    const value = {
      rel: 'http://schemas.google.com/g/2005#reviews',
      feedLink: {
        href: 'https://example.com/restaurants/432432/reviews',
        countHint: 25,
      },
    }
    const expected = {
      '@rel': 'http://schemas.google.com/g/2005#reviews',
      'gd:feedLink': {
        '@href': 'https://example.com/restaurants/432432/reviews',
        '@countHint': 25,
      },
    }

    expect(generateComments(value)).toEqual(expected)
  })

  it('should handle empty object', () => {
    expect(generateComments({})).toBeUndefined()
  })

  it('should handle non-object inputs', () => {
    // @ts-expect-error: This is for testing purposes.
    expect(generateComments('string')).toBeUndefined()
    expect(generateComments(undefined)).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generateComments(null)).toBeUndefined()
  })
})

describe('generateEmail', () => {
  it('should generate email with all properties', () => {
    const value = {
      address: 'fubar@example.com',
      displayName: 'Foo Bar',
      label: 'Personal',
      rel: 'http://schemas.google.com/g/2005#home',
      primary: true,
    }
    const expected = {
      '@address': 'fubar@example.com',
      '@displayName': 'Foo Bar',
      '@label': 'Personal',
      '@rel': 'http://schemas.google.com/g/2005#home',
      '@primary': true,
    }

    expect(generateEmail(value)).toEqual(expected)
  })

  it('should generate email with only address', () => {
    const value = {
      address: 'foo@example.com',
    }
    const expected = {
      '@address': 'foo@example.com',
    }

    expect(generateEmail(value)).toEqual(expected)
  })

  it('should handle empty object', () => {
    expect(generateEmail({})).toBeUndefined()
  })

  it('should handle non-object inputs', () => {
    // @ts-expect-error: This is for testing purposes.
    expect(generateEmail('string')).toBeUndefined()
    expect(generateEmail(undefined)).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generateEmail(null)).toBeUndefined()
  })
})

describe('generateExtendedProperty', () => {
  it('should generate extended property with all properties', () => {
    const value = {
      name: 'http://www.example.com/schemas/2007#mycal.id',
      value: '1234',
      realm: 'example.com',
    }
    const expected = {
      '@name': 'http://www.example.com/schemas/2007#mycal.id',
      '@value': '1234',
      '@realm': 'example.com',
    }

    expect(generateExtendedProperty(value)).toEqual(expected)
  })

  it('should generate extended property with name and value', () => {
    const value = {
      name: 'blogger.itemClass',
      value: 'pid-982403090',
    }
    const expected = {
      '@name': 'blogger.itemClass',
      '@value': 'pid-982403090',
    }

    expect(generateExtendedProperty(value)).toEqual(expected)
  })

  it('should write child XML raw', () => {
    // Constructed specimen: no sampled feed carries child XML in gd:extendedProperty.
    const value = {
      name: 'com.example',
      xml: '<some_xml attr="a &amp; b">AT&amp;T <b>bold</b></some_xml>',
    }
    const expected = {
      '@name': 'com.example',
      '#text': '<some_xml attr="a &amp; b">AT&amp;T <b>bold</b></some_xml>\n',
    }

    expect(generateExtendedProperty(value)).toEqual(expected)
  })

  it('should skip child XML that is not well-formed', () => {
    const value = {
      name: 'com.example',
      xml: '<some_xml>unclosed',
    }
    const expected = {
      '@name': 'com.example',
    }

    expect(generateExtendedProperty(value)).toEqual(expected)
  })

  it('should skip child XML with an entity XML cannot resolve', () => {
    const value = {
      name: 'com.example',
      xml: '<some_xml>a&nbsp;b</some_xml>',
    }
    const expected = {
      '@name': 'com.example',
    }

    expect(generateExtendedProperty(value)).toEqual(expected)
  })

  it('should keep a carriage return in child XML as a character reference', () => {
    const value = {
      name: 'com.example',
      xml: '<some_xml>a\rb</some_xml>',
    }
    const expected = {
      '@name': 'com.example',
      '#text': '<some_xml>a&#13;b</some_xml>\n',
    }

    expect(generateExtendedProperty(value)).toEqual(expected)
  })

  it('should write value and skip child XML when both are set', () => {
    const value = {
      name: 'com.example',
      value: 'pid-1',
      xml: '<some_xml>value</some_xml>',
    }
    const expected = {
      '@name': 'com.example',
      '@value': 'pid-1',
    }

    expect(generateExtendedProperty(value)).toEqual(expected)
  })

  it('should escape special characters in attributes', () => {
    const value = {
      name: 'blogger.itemClass',
      value: 'pid-1 & "pid-2"',
    }
    const expected = {
      '@name': 'blogger.itemClass',
      '@value': 'pid-1 &amp; &quot;pid-2&quot;',
    }

    expect(generateExtendedProperty(value)).toEqual(expected)
  })

  it('should handle whitespace-only strings', () => {
    const value = {
      name: '   ',
      value: '\t\n',
    }

    expect(generateExtendedProperty(value)).toBeUndefined()
  })

  it('should handle empty object', () => {
    expect(generateExtendedProperty({})).toBeUndefined()
  })

  it('should handle non-object inputs', () => {
    // @ts-expect-error: This is for testing purposes.
    expect(generateExtendedProperty('string')).toBeUndefined()
    expect(generateExtendedProperty(undefined)).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generateExtendedProperty(null)).toBeUndefined()
  })
})

describe('generateGeoPt', () => {
  it('should generate geo point with all properties', () => {
    const value = {
      lat: 27.98778,
      lon: 86.94444,
      elev: 8850,
      label: 'Summit',
      time: new Date('2005-06-06T17:00:00Z'),
    }
    const expected = {
      '@lat': 27.98778,
      '@lon': 86.94444,
      '@elev': 8850,
      '@label': 'Summit',
      '@time': '2005-06-06T17:00:00.000Z',
    }

    expect(generateGeoPt(value)).toEqual(expected)
  })

  it('should handle empty object', () => {
    expect(generateGeoPt({})).toBeUndefined()
  })

  it('should handle non-object inputs', () => {
    // @ts-expect-error: This is for testing purposes.
    expect(generateGeoPt('string')).toBeUndefined()
    expect(generateGeoPt(undefined)).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generateGeoPt(null)).toBeUndefined()
  })
})

describe('generateIm', () => {
  it('should generate IM with all properties', () => {
    const value = {
      address: 'foo@example.com',
      label: 'Work',
      rel: 'http://schemas.google.com/g/2005#home',
      protocol: 'http://schemas.google.com/g/2005#MSN',
      primary: true,
    }
    const expected = {
      '@address': 'foo@example.com',
      '@label': 'Work',
      '@rel': 'http://schemas.google.com/g/2005#home',
      '@protocol': 'http://schemas.google.com/g/2005#MSN',
      '@primary': true,
    }

    expect(generateIm(value)).toEqual(expected)
  })

  it('should handle empty object', () => {
    expect(generateIm({})).toBeUndefined()
  })

  it('should handle non-object inputs', () => {
    // @ts-expect-error: This is for testing purposes.
    expect(generateIm('string')).toBeUndefined()
    expect(generateIm(undefined)).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generateIm(null)).toBeUndefined()
  })
})

describe('generateMoney', () => {
  it('should generate money with all properties', () => {
    const value = {
      amount: 650,
      currencyCode: 'EUR',
    }
    const expected = {
      '@amount': 650,
      '@currencyCode': 'EUR',
    }

    expect(generateMoney(value)).toEqual(expected)
  })

  it('should handle empty object', () => {
    expect(generateMoney({})).toBeUndefined()
  })

  it('should handle non-object inputs', () => {
    // @ts-expect-error: This is for testing purposes.
    expect(generateMoney('string')).toBeUndefined()
    expect(generateMoney(undefined)).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generateMoney(null)).toBeUndefined()
  })
})

describe('generatePhoneticName', () => {
  it('should generate phonetic name with all properties', () => {
    const value = {
      value: 'Smith',
      yomi: 'smɪð',
    }
    const expected = {
      '@yomi': 'smɪð',
      '#text': 'Smith',
    }

    expect(generatePhoneticName(value)).toEqual(expected)
  })

  it('should generate phonetic name with only value', () => {
    expect(generatePhoneticName({ value: 'Smith' })).toEqual({ '#text': 'Smith' })
  })

  it('should wrap special characters in CDATA', () => {
    expect(generatePhoneticName({ value: 'Smith & Sons' })).toEqual({ '#cdata': 'Smith & Sons' })
  })

  it('should handle empty object', () => {
    expect(generatePhoneticName({})).toBeUndefined()
  })

  it('should handle non-object inputs', () => {
    // @ts-expect-error: This is for testing purposes.
    expect(generatePhoneticName('string')).toBeUndefined()
    expect(generatePhoneticName(undefined)).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generatePhoneticName(null)).toBeUndefined()
  })
})

describe('generateName', () => {
  it('should generate name with all properties', () => {
    const value = {
      givenName: { value: 'Winston', yomi: 'dʒon' },
      additionalName: { value: 'Leonard' },
      familyName: { value: 'Spencer-Churchill' },
      namePrefix: 'Sir',
      nameSuffix: 'OG',
      fullName: 'Sir Winston Leonard Spencer-Churchill, OG',
    }
    const expected = {
      'gd:givenName': { '@yomi': 'dʒon', '#text': 'Winston' },
      'gd:additionalName': { '#text': 'Leonard' },
      'gd:familyName': { '#text': 'Spencer-Churchill' },
      'gd:namePrefix': 'Sir',
      'gd:nameSuffix': 'OG',
      'gd:fullName': 'Sir Winston Leonard Spencer-Churchill, OG',
    }

    expect(generateName(value)).toEqual(expected)
  })

  it('should handle empty strings', () => {
    const value = {
      namePrefix: '',
      fullName: 'Elizabeth Bennet',
    }
    const expected = {
      'gd:fullName': 'Elizabeth Bennet',
    }

    expect(generateName(value)).toEqual(expected)
  })

  it('should handle empty object', () => {
    expect(generateName({})).toBeUndefined()
  })

  it('should handle non-object inputs', () => {
    // @ts-expect-error: This is for testing purposes.
    expect(generateName('string')).toBeUndefined()
    expect(generateName(undefined)).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generateName(null)).toBeUndefined()
  })
})

describe('generateReminder', () => {
  it('should generate reminder with all properties', () => {
    const value = {
      absoluteTime: new Date('2005-06-07T00:55:00Z'),
      method: 'email',
      days: 1,
      hours: 2,
      minutes: 15,
    }
    const expected = {
      '@absoluteTime': '2005-06-07T00:55:00.000Z',
      '@method': 'email',
      '@days': 1,
      '@hours': 2,
      '@minutes': 15,
    }

    expect(generateReminder(value)).toEqual(expected)
  })

  it('should handle empty object', () => {
    expect(generateReminder({})).toBeUndefined()
  })

  it('should handle non-object inputs', () => {
    // @ts-expect-error: This is for testing purposes.
    expect(generateReminder('string')).toBeUndefined()
    expect(generateReminder(undefined)).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generateReminder(null)).toBeUndefined()
  })
})

describe('generateWhen', () => {
  it('should generate when with all properties', () => {
    const value = {
      startTime: new Date('2005-06-07T01:00:00Z'),
      endTime: new Date('2005-06-07T02:00:00Z'),
      valueString: 'This weekend',
      reminders: [{ minutes: 15 }],
    }
    const expected = {
      '@startTime': '2005-06-07T01:00:00.000Z',
      '@endTime': '2005-06-07T02:00:00.000Z',
      '@valueString': 'This weekend',
      'gd:reminder': [{ '@minutes': 15 }],
    }

    expect(generateWhen(value)).toEqual(expected)
  })

  it('should keep date-only times as dates', () => {
    const value = {
      startTime: '2005-06-06',
      endTime: '2005-06-08',
    }
    const expected = {
      '@startTime': '2005-06-06',
      '@endTime': '2005-06-08',
    }

    expect(generateWhen(value)).toEqual(expected)
  })

  it('should handle empty object', () => {
    expect(generateWhen({})).toBeUndefined()
  })

  it('should handle non-object inputs', () => {
    // @ts-expect-error: This is for testing purposes.
    expect(generateWhen('string')).toBeUndefined()
    expect(generateWhen(undefined)).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generateWhen(null)).toBeUndefined()
  })
})

describe('generateWhere', () => {
  it('should generate where with all properties', () => {
    const value = {
      rel: 'http://schemas.google.com/g/2005#event',
      label: 'Mountain View Location (main)',
      valueString: "Joe's Pub",
      entryLink: { href: 'https://example.com/10018/JoesPub' },
    }
    const expected = {
      '@rel': 'http://schemas.google.com/g/2005#event',
      '@label': 'Mountain View Location (main)',
      '@valueString': "Joe's Pub",
      'gd:entryLink': { '@href': 'https://example.com/10018/JoesPub' },
    }

    expect(generateWhere(value)).toEqual(expected)
  })

  it('should handle empty object', () => {
    expect(generateWhere({})).toBeUndefined()
  })

  it('should handle non-object inputs', () => {
    // @ts-expect-error: This is for testing purposes.
    expect(generateWhere('string')).toBeUndefined()
    expect(generateWhere(undefined)).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generateWhere(null)).toBeUndefined()
  })
})

describe('generateWho', () => {
  it('should generate who with all properties', () => {
    const value = {
      rel: 'http://schemas.google.com/g/2005#event.attendee',
      email: 'jo@example.com',
      valueString: 'Jo',
      attendeeStatus: 'http://schemas.google.com/g/2005#event.tentative',
      attendeeType: 'http://schemas.google.com/g/2005#event.required',
      entryLink: { href: 'https://example.com/jo/contacts/Jo' },
    }
    const expected = {
      '@rel': 'http://schemas.google.com/g/2005#event.attendee',
      '@email': 'jo@example.com',
      '@valueString': 'Jo',
      'gd:attendeeStatus': { '@value': 'http://schemas.google.com/g/2005#event.tentative' },
      'gd:attendeeType': { '@value': 'http://schemas.google.com/g/2005#event.required' },
      'gd:entryLink': { '@href': 'https://example.com/jo/contacts/Jo' },
    }

    expect(generateWho(value)).toEqual(expected)
  })

  it('should handle whitespace-only enum values', () => {
    const value = {
      email: 'jo@example.com',
      attendeeStatus: '   ',
    }
    const expected = {
      '@email': 'jo@example.com',
    }

    expect(generateWho(value)).toEqual(expected)
  })

  it('should handle empty object', () => {
    expect(generateWho({})).toBeUndefined()
  })

  it('should handle non-object inputs', () => {
    // @ts-expect-error: This is for testing purposes.
    expect(generateWho('string')).toBeUndefined()
    expect(generateWho(undefined)).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generateWho(null)).toBeUndefined()
  })
})

describe('generateOrganization', () => {
  it('should generate organization with all properties', () => {
    const value = {
      label: 'Work',
      rel: 'http://schemas.google.com/g/2005#work',
      primary: true,
      orgDepartment: 'Software Development',
      orgJobDescription: 'Writes documentation',
      orgName: { value: 'Example, Inc.', yomi: 'ekusanpuru' },
      orgSymbol: 'EXMP',
      orgTitle: 'Tech Writer',
      where: { valueString: 'Building 40' },
    }
    const expected = {
      '@label': 'Work',
      '@rel': 'http://schemas.google.com/g/2005#work',
      '@primary': true,
      'gd:orgDepartment': 'Software Development',
      'gd:orgJobDescription': 'Writes documentation',
      'gd:orgName': { '@yomi': 'ekusanpuru', '#text': 'Example, Inc.' },
      'gd:orgSymbol': 'EXMP',
      'gd:orgTitle': 'Tech Writer',
      'gd:where': { '@valueString': 'Building 40' },
    }

    expect(generateOrganization(value)).toEqual(expected)
  })

  it('should wrap special characters in CDATA', () => {
    const value = {
      orgTitle: 'President & CEO',
    }
    const expected = {
      'gd:orgTitle': { '#cdata': 'President & CEO' },
    }

    expect(generateOrganization(value)).toEqual(expected)
  })

  it('should handle empty object', () => {
    expect(generateOrganization({})).toBeUndefined()
  })

  it('should handle non-object inputs', () => {
    // @ts-expect-error: This is for testing purposes.
    expect(generateOrganization('string')).toBeUndefined()
    expect(generateOrganization(undefined)).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generateOrganization(null)).toBeUndefined()
  })
})

describe('generateOriginalEvent', () => {
  it('should generate original event with all properties', () => {
    const value = {
      id: 'i8fl1nrv2bl57c1qgr3f0onmgg',
      href: 'https://example.com/calendar/feeds/userID/private-magicCookie/full/eventID',
      when: { startTime: new Date('2006-03-17T22:00:00Z') },
    }
    const expected = {
      '@id': 'i8fl1nrv2bl57c1qgr3f0onmgg',
      '@href': 'https://example.com/calendar/feeds/userID/private-magicCookie/full/eventID',
      'gd:when': { '@startTime': '2006-03-17T22:00:00.000Z' },
    }

    expect(generateOriginalEvent(value)).toEqual(expected)
  })

  it('should handle empty object', () => {
    expect(generateOriginalEvent({})).toBeUndefined()
  })

  it('should handle non-object inputs', () => {
    // @ts-expect-error: This is for testing purposes.
    expect(generateOriginalEvent('string')).toBeUndefined()
    expect(generateOriginalEvent(undefined)).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generateOriginalEvent(null)).toBeUndefined()
  })
})

describe('generatePhoneNumber', () => {
  it('should generate phone number with all properties', () => {
    const value = {
      value: '+1 206 555 1212',
      label: 'Personal calls only',
      rel: 'http://schemas.google.com/g/2005#mobile',
      uri: 'tel:+12065551212',
      primary: true,
    }
    const expected = {
      '@label': 'Personal calls only',
      '@rel': 'http://schemas.google.com/g/2005#mobile',
      '@uri': 'tel:+12065551212',
      '@primary': true,
      '#text': '+1 206 555 1212',
    }

    expect(generatePhoneNumber(value)).toEqual(expected)
  })

  it('should generate phone number with only value', () => {
    expect(generatePhoneNumber({ value: '(206)555-1212' })).toEqual({ '#text': '(206)555-1212' })
  })

  it('should handle empty object', () => {
    expect(generatePhoneNumber({})).toBeUndefined()
  })

  it('should handle non-object inputs', () => {
    // @ts-expect-error: This is for testing purposes.
    expect(generatePhoneNumber('string')).toBeUndefined()
    expect(generatePhoneNumber(undefined)).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generatePhoneNumber(null)).toBeUndefined()
  })
})

describe('generatePostalAddress', () => {
  it('should generate postal address with all properties', () => {
    const value = {
      value: '1600 Amphitheatre Pkwy',
      label: 'Office',
      rel: 'http://schemas.google.com/g/2005#work',
      primary: true,
    }
    const expected = {
      '@label': 'Office',
      '@rel': 'http://schemas.google.com/g/2005#work',
      '@primary': true,
      '#text': '1600 Amphitheatre Pkwy',
    }

    expect(generatePostalAddress(value)).toEqual(expected)
  })

  it('should handle empty object', () => {
    expect(generatePostalAddress({})).toBeUndefined()
  })

  it('should handle non-object inputs', () => {
    // @ts-expect-error: This is for testing purposes.
    expect(generatePostalAddress('string')).toBeUndefined()
    expect(generatePostalAddress(undefined)).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generatePostalAddress(null)).toBeUndefined()
  })
})

describe('generateRating', () => {
  it('should generate rating with all properties', () => {
    const value = {
      rel: 'http://schemas.google.com/g/2005#overall',
      value: 4,
      average: 4.65,
      min: 1,
      max: 5,
      numRaters: 200,
    }
    const expected = {
      '@rel': 'http://schemas.google.com/g/2005#overall',
      '@value': 4,
      '@average': 4.65,
      '@min': 1,
      '@max': 5,
      '@numRaters': 200,
    }

    expect(generateRating(value)).toEqual(expected)
  })

  it('should handle empty object', () => {
    expect(generateRating({})).toBeUndefined()
  })

  it('should handle non-object inputs', () => {
    // @ts-expect-error: This is for testing purposes.
    expect(generateRating('string')).toBeUndefined()
    expect(generateRating(undefined)).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generateRating(null)).toBeUndefined()
  })
})

describe('generateRecurrenceException', () => {
  it('should generate recurrence exception with all properties', () => {
    const value = {
      specialized: true,
      entryLink: { href: 'https://example.com/calendar/event/1' },
      originalEvent: { id: 'i8fl1nrv2bl57c1qgr3f0onmgg' },
    }
    const expected = {
      '@specialized': true,
      'gd:entryLink': { '@href': 'https://example.com/calendar/event/1' },
      'gd:originalEvent': { '@id': 'i8fl1nrv2bl57c1qgr3f0onmgg' },
    }

    expect(generateRecurrenceException(value)).toEqual(expected)
  })

  it('should handle empty object', () => {
    expect(generateRecurrenceException({})).toBeUndefined()
  })

  it('should handle non-object inputs', () => {
    // @ts-expect-error: This is for testing purposes.
    expect(generateRecurrenceException('string')).toBeUndefined()
    expect(generateRecurrenceException(undefined)).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generateRecurrenceException(null)).toBeUndefined()
  })
})

describe('generateCountry', () => {
  it('should generate country with all properties', () => {
    const value = {
      value: 'Poland',
      code: 'PL',
    }
    const expected = {
      '@code': 'PL',
      '#text': 'Poland',
    }

    expect(generateCountry(value)).toEqual(expected)
  })

  it('should handle empty object', () => {
    expect(generateCountry({})).toBeUndefined()
  })

  it('should handle non-object inputs', () => {
    // @ts-expect-error: This is for testing purposes.
    expect(generateCountry('string')).toBeUndefined()
    expect(generateCountry(undefined)).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generateCountry(null)).toBeUndefined()
  })
})

describe('generateStructuredPostalAddress', () => {
  it('should generate structured postal address with all properties', () => {
    const value = {
      rel: 'http://schemas.google.com/g/2005#work',
      mailClass: 'http://schemas.google.com/g/2005#letters',
      usage: 'http://schemas.google.com/g/2005#general',
      label: 'John at Example',
      primary: true,
      agent: 'John Doe',
      housename: 'The Pillars',
      street: '1600 Amphitheatre Parkway',
      pobox: 'PO Box 123',
      neighborhood: 'Shoreline',
      city: 'Mountain View',
      subregion: 'Santa Clara County',
      region: 'CA',
      postcode: '94043',
      country: { value: 'United States', code: 'US' },
      formattedAddress: '1600 Amphitheatre Parkway, Mountain View, CA 94043',
    }
    const expected = {
      '@rel': 'http://schemas.google.com/g/2005#work',
      '@mailClass': 'http://schemas.google.com/g/2005#letters',
      '@usage': 'http://schemas.google.com/g/2005#general',
      '@label': 'John at Example',
      '@primary': true,
      'gd:agent': 'John Doe',
      'gd:housename': 'The Pillars',
      'gd:street': '1600 Amphitheatre Parkway',
      'gd:pobox': 'PO Box 123',
      'gd:neighborhood': 'Shoreline',
      'gd:city': 'Mountain View',
      'gd:subregion': 'Santa Clara County',
      'gd:region': 'CA',
      'gd:postcode': '94043',
      'gd:country': { '@code': 'US', '#text': 'United States' },
      'gd:formattedAddress': '1600 Amphitheatre Parkway, Mountain View, CA 94043',
    }

    expect(generateStructuredPostalAddress(value)).toEqual(expected)
  })

  it('should handle empty object', () => {
    expect(generateStructuredPostalAddress({})).toBeUndefined()
  })

  it('should handle non-object inputs', () => {
    // @ts-expect-error: This is for testing purposes.
    expect(generateStructuredPostalAddress('string')).toBeUndefined()
    expect(generateStructuredPostalAddress(undefined)).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generateStructuredPostalAddress(null)).toBeUndefined()
  })
})

describe('generatePerson', () => {
  it('should generate person image', () => {
    const value = {
      image: {
        src: 'https://example.com/img/b16-rounded.gif',
        rel: 'http://schemas.google.com/g/2005#thumbnail',
        width: 16,
        height: 16,
      },
    }
    const expected = {
      'gd:image': {
        '@src': 'https://example.com/img/b16-rounded.gif',
        '@rel': 'http://schemas.google.com/g/2005#thumbnail',
        '@width': 16,
        '@height': 16,
      },
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
    // @ts-expect-error: This is for testing purposes.
    expect(generatePerson(null)).toBeUndefined()
  })
})

describe('generateEntry', () => {
  it('should generate entry with all properties', () => {
    const value = {
      comments: { feedLink: { href: 'https://example.com/posts/1/comments' } },
      deleted: true,
      emails: [{ address: 'liz@example.com' }],
      eventStatus: 'http://schemas.google.com/g/2005#event.confirmed',
      extendedProperties: [{ name: 'blogger.itemClass', value: 'pid-982403090' }],
      geoPt: { lat: 40.75, lon: -74 },
      ims: [{ address: 'liz@example.com' }],
      money: { amount: 650, currencyCode: 'EUR' },
      name: { fullName: 'Elizabeth Bennet' },
      organizations: [{ orgTitle: 'Tech Writer' }],
      originalEvent: { id: 'i8fl1nrv2bl57c1qgr3f0onmgg' },
      phoneNumbers: [{ value: '(206)555-1212' }],
      postalAddresses: [{ value: '800 Main Street' }],
      rating: { value: 4, min: 1, max: 5 },
      recurrence: 'RRULE:FREQ=DAILY;UNTIL=20060321T220000Z',
      recurrenceExceptions: [{ specialized: true }],
      resourceId: '9749638',
      structuredPostalAddresses: [{ city: 'Mountain View' }],
      transparency: 'http://schemas.google.com/g/2005#event.opaque',
      visibility: 'http://schemas.google.com/g/2005#event.public',
      whens: [{ startTime: '2005-06-06' }],
      wheres: [{ valueString: 'Building 41, Room X' }],
      whos: [{ email: 'jo@example.com' }],
    }
    const expected = {
      'gd:comments': { 'gd:feedLink': { '@href': 'https://example.com/posts/1/comments' } },
      'gd:deleted': '',
      'gd:email': [{ '@address': 'liz@example.com' }],
      'gd:eventStatus': { '@value': 'http://schemas.google.com/g/2005#event.confirmed' },
      'gd:extendedProperty': [{ '@name': 'blogger.itemClass', '@value': 'pid-982403090' }],
      'gd:geoPt': { '@lat': 40.75, '@lon': -74 },
      'gd:im': [{ '@address': 'liz@example.com' }],
      'gd:money': { '@amount': 650, '@currencyCode': 'EUR' },
      'gd:name': { 'gd:fullName': 'Elizabeth Bennet' },
      'gd:organization': [{ 'gd:orgTitle': 'Tech Writer' }],
      'gd:originalEvent': { '@id': 'i8fl1nrv2bl57c1qgr3f0onmgg' },
      'gd:phoneNumber': [{ '#text': '(206)555-1212' }],
      'gd:postalAddress': [{ '#text': '800 Main Street' }],
      'gd:rating': { '@value': 4, '@min': 1, '@max': 5 },
      'gd:recurrence': 'RRULE:FREQ=DAILY;UNTIL=20060321T220000Z',
      'gd:recurrenceException': [{ '@specialized': true }],
      'gd:resourceId': '9749638',
      'gd:structuredPostalAddress': [{ 'gd:city': 'Mountain View' }],
      'gd:transparency': { '@value': 'http://schemas.google.com/g/2005#event.opaque' },
      'gd:visibility': { '@value': 'http://schemas.google.com/g/2005#event.public' },
      'gd:when': [{ '@startTime': '2005-06-06' }],
      'gd:where': [{ '@valueString': 'Building 41, Room X' }],
      'gd:who': [{ '@email': 'jo@example.com' }],
    }

    expect(generateEntry(value)).toEqual(expected)
  })

  it('should generate Blogger comment extended properties', () => {
    const value = {
      extendedProperties: [
        { name: 'blogger.itemClass', value: 'pid-982403090' },
        { name: 'blogger.displayTime', value: 'September 11, 2012 7:48 AM' },
      ],
    }
    const expected = {
      'gd:extendedProperty': [
        { '@name': 'blogger.itemClass', '@value': 'pid-982403090' },
        { '@name': 'blogger.displayTime', '@value': 'September 11, 2012 7:48 AM' },
      ],
    }

    expect(generateEntry(value)).toEqual(expected)
  })

  it('should skip deleted when false', () => {
    const value = {
      deleted: false,
      resourceId: '9749638',
    }
    const expected = {
      'gd:resourceId': '9749638',
    }

    expect(generateEntry(value)).toEqual(expected)
  })

  it('should handle empty object', () => {
    expect(generateEntry({})).toBeUndefined()
  })

  it('should handle non-object inputs', () => {
    // @ts-expect-error: This is for testing purposes.
    expect(generateEntry('string')).toBeUndefined()
    expect(generateEntry(undefined)).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generateEntry(null)).toBeUndefined()
  })
})

describe('generateFeed', () => {
  it('should generate feed-level where', () => {
    const value = {
      wheres: [{ valueString: 'Google Cafeteria (Building 40)' }],
    }
    const expected = {
      'gd:where': [{ '@valueString': 'Google Cafeteria (Building 40)' }],
    }

    expect(generateFeed(value)).toEqual(expected)
  })

  it('should handle empty object', () => {
    expect(generateFeed({})).toBeUndefined()
  })

  it('should handle non-object inputs', () => {
    // @ts-expect-error: This is for testing purposes.
    expect(generateFeed('string')).toBeUndefined()
    expect(generateFeed(undefined)).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generateFeed(null)).toBeUndefined()
  })
})
