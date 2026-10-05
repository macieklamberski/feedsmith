import { describe, expect, it } from 'bun:test'
import {
  parseComments,
  parseCountry,
  parseEmail,
  parseEntryLink,
  parseExtendedProperty,
  parseFeedLink,
  parseGeoPt,
  parseIm,
  parseImage,
  parseMoney,
  parseName,
  parseOrganization,
  parseOriginalEvent,
  parsePhoneNumber,
  parsePhoneticName,
  parsePostalAddress,
  parseRating,
  parseRecurrenceException,
  parseReminder,
  parseStructuredPostalAddress,
  parseWhen,
  parseWhere,
  parseWho,
  retrieveEntry,
  retrieveFeed,
  retrievePerson,
} from './utils.js'

describe('parseImage', () => {
  it('should parse image with all properties', () => {
    const value = {
      '@rel': 'http://schemas.google.com/g/2005#thumbnail',
      '@width': '16',
      '@height': '16',
      '@src': 'https://example.com/img/b16-rounded.gif',
    }
    const expected = {
      src: 'https://example.com/img/b16-rounded.gif',
      rel: 'http://schemas.google.com/g/2005#thumbnail',
      width: 16,
      height: 16,
    }

    expect(parseImage(value)).toEqual(expected)
  })

  it('should parse image with only src', () => {
    const value = {
      '@src': 'https://example.com/img/avatar.png',
    }
    const expected = {
      src: 'https://example.com/img/avatar.png',
    }

    expect(parseImage(value)).toEqual(expected)
  })

  it('should skip non-numeric width and height', () => {
    const value = {
      '@src': 'https://example.com/img/avatar.png',
      '@width': 'wide',
      '@height': '',
    }
    const expected = {
      src: 'https://example.com/img/avatar.png',
    }

    expect(parseImage(value)).toEqual(expected)
  })

  it('should return undefined for empty object', () => {
    expect(parseImage({})).toBeUndefined()
  })

  it('should return undefined for non-object input', () => {
    expect(parseImage('string')).toBeUndefined()
    expect(parseImage(undefined)).toBeUndefined()
    expect(parseImage(null)).toBeUndefined()
  })
})

describe('parseFeedLink', () => {
  it('should parse feed link with all attributes', () => {
    const value = {
      '@href': 'https://example.com/Jo/posts/MyFirstPost/comments',
      '@rel': 'http://example.com/schemas/2007#comments',
      '@readonly': 'true',
      '@counthint': '10',
    }
    const expected = {
      href: 'https://example.com/Jo/posts/MyFirstPost/comments',
      rel: 'http://example.com/schemas/2007#comments',
      readOnly: true,
      countHint: 10,
    }

    expect(parseFeedLink(value)).toEqual(expected)
  })

  it('should parse feed link with embedded Atom feed', () => {
    const value = {
      feed: {
        id: { '#text': 'cid:1' },
        entry: [
          { id: { '#text': 'cid:1.1' }, content: { '#text': 'list item 1' } },
          { id: { '#text': 'cid:1.2' }, content: { '#text': 'list item 2' } },
        ],
      },
    }
    const expected = {
      feed: {
        id: 'cid:1',
        entries: [
          { id: 'cid:1.1', content: { value: 'list item 1' } },
          { id: 'cid:1.2', content: { value: 'list item 2' } },
        ],
      },
    }

    expect(parseFeedLink(value)).toEqual(expected)
  })

  it('should return undefined for empty object', () => {
    expect(parseFeedLink({})).toBeUndefined()
  })

  it('should return undefined for non-object input', () => {
    expect(parseFeedLink('string')).toBeUndefined()
    expect(parseFeedLink(undefined)).toBeUndefined()
    expect(parseFeedLink(null)).toBeUndefined()
  })
})

describe('parseEntryLink', () => {
  it('should parse entry link with all attributes', () => {
    const value = {
      '@href': 'https://example.com/jo/contacts/Jo',
      '@rel': 'alternate',
      '@readonly': 'false',
    }
    const expected = {
      href: 'https://example.com/jo/contacts/Jo',
      rel: 'alternate',
      readOnly: false,
    }

    expect(parseEntryLink(value)).toEqual(expected)
  })

  it('should parse entry link with embedded Atom entry and its gd properties', () => {
    const value = {
      '@href': 'https://example.com/jo/contacts/Jo',
      entry: {
        id: { '#text': 'https://example.com/jo/contacts/Jo' },
        title: { '#text': 'Jo March' },
        'gd:email': { '@address': 'jo@example.com' },
      },
    }
    const expected = {
      href: 'https://example.com/jo/contacts/Jo',
      entry: {
        id: 'https://example.com/jo/contacts/Jo',
        title: { value: 'Jo March' },
        gd: {
          emails: [{ address: 'jo@example.com' }],
        },
      },
    }

    expect(parseEntryLink(value)).toEqual(expected)
  })

  it('should return undefined for empty object', () => {
    expect(parseEntryLink({})).toBeUndefined()
  })

  it('should return undefined for non-object input', () => {
    expect(parseEntryLink('string')).toBeUndefined()
    expect(parseEntryLink(undefined)).toBeUndefined()
    expect(parseEntryLink(null)).toBeUndefined()
  })
})

describe('parseComments', () => {
  it('should parse comments with all properties', () => {
    const value = {
      '@rel': 'http://schemas.google.com/g/2005#reviews',
      'gd:feedlink': {
        '@href': 'https://example.com/restaurants/432432/reviews',
        '@counthint': '25',
      },
    }
    const expected = {
      rel: 'http://schemas.google.com/g/2005#reviews',
      feedLink: {
        href: 'https://example.com/restaurants/432432/reviews',
        countHint: 25,
      },
    }

    expect(parseComments(value)).toEqual(expected)
  })

  it('should parse comments with only feed link', () => {
    const value = {
      'gd:feedlink': {
        '@href': 'https://example.com/Jo/posts/MyFirstPost/comments',
      },
    }
    const expected = {
      feedLink: {
        href: 'https://example.com/Jo/posts/MyFirstPost/comments',
      },
    }

    expect(parseComments(value)).toEqual(expected)
  })

  it('should return undefined for empty object', () => {
    expect(parseComments({})).toBeUndefined()
  })

  it('should return undefined for non-object input', () => {
    expect(parseComments('string')).toBeUndefined()
    expect(parseComments(undefined)).toBeUndefined()
    expect(parseComments(null)).toBeUndefined()
  })
})

describe('parseEmail', () => {
  it('should parse email with all properties', () => {
    const value = {
      '@address': 'fubar@example.com',
      '@displayname': 'Foo Bar',
      '@label': 'Personal',
      '@rel': 'http://schemas.google.com/g/2005#home',
      '@primary': 'true',
    }
    const expected = {
      address: 'fubar@example.com',
      displayName: 'Foo Bar',
      label: 'Personal',
      rel: 'http://schemas.google.com/g/2005#home',
      primary: true,
    }

    expect(parseEmail(value)).toEqual(expected)
  })

  it('should parse email with only address', () => {
    const value = {
      '@address': 'foo@example.com',
    }
    const expected = {
      address: 'foo@example.com',
    }

    expect(parseEmail(value)).toEqual(expected)
  })

  it('should return undefined for empty object', () => {
    expect(parseEmail({})).toBeUndefined()
  })

  it('should return undefined for non-object input', () => {
    expect(parseEmail('string')).toBeUndefined()
    expect(parseEmail(undefined)).toBeUndefined()
    expect(parseEmail(null)).toBeUndefined()
  })
})

describe('parseExtendedProperty', () => {
  it('should parse extended property with all properties', () => {
    const value = {
      '@name': 'http://www.example.com/schemas/2007#mycal.id',
      '@value': '1234',
      '@realm': 'example.com',
    }
    const expected = {
      name: 'http://www.example.com/schemas/2007#mycal.id',
      value: '1234',
      realm: 'example.com',
    }

    expect(parseExtendedProperty(value)).toEqual(expected)
  })

  it('should parse extended property with name and value', () => {
    const value = {
      '@name': 'blogger.displayTime',
      '@value': 'September 11, 2012 7:48 AM',
    }
    const expected = {
      name: 'blogger.displayTime',
      value: 'September 11, 2012 7:48 AM',
    }

    expect(parseExtendedProperty(value)).toEqual(expected)
  })

  it('should keep child XML raw', () => {
    // Constructed specimen: no sampled feed carries child XML in gd:extendedProperty.
    const value = {
      '@name': 'com.example',
      '#text': '<some_xml attr="a &amp; b">AT&amp;T <b>bold</b></some_xml>',
    }
    const expected = {
      name: 'com.example',
      xml: '<some_xml attr="a &amp; b">AT&amp;T <b>bold</b></some_xml>',
    }

    expect(parseExtendedProperty(value)).toEqual(expected)
  })

  it('should handle HTML entities in value', () => {
    const value = {
      '@name': 'blogger.itemClass',
      '@value': 'pid-1 &amp; pid-2',
    }
    const expected = {
      name: 'blogger.itemClass',
      value: 'pid-1 & pid-2',
    }

    expect(parseExtendedProperty(value)).toEqual(expected)
  })

  it('should return undefined for empty object', () => {
    expect(parseExtendedProperty({})).toBeUndefined()
  })

  it('should return undefined for non-object input', () => {
    expect(parseExtendedProperty('string')).toBeUndefined()
    expect(parseExtendedProperty(undefined)).toBeUndefined()
    expect(parseExtendedProperty(null)).toBeUndefined()
  })
})

describe('parseGeoPt', () => {
  it('should parse geo point with all properties', () => {
    const value = {
      '@lat': '27.98778',
      '@lon': '86.94444',
      '@elev': '8850.0',
      '@label': 'Summit',
      '@time': '2005-06-06T17:00:00Z',
    }
    const expected = {
      lat: 27.98778,
      lon: 86.94444,
      elev: 8850,
      label: 'Summit',
      time: '2005-06-06T17:00:00Z',
    }

    expect(parseGeoPt(value)).toEqual(expected)
  })

  it('should parse geo point with only coordinates', () => {
    const value = {
      '@lat': '40.75',
      '@lon': '-74.0',
    }
    const expected = {
      lat: 40.75,
      lon: -74,
    }

    expect(parseGeoPt(value)).toEqual(expected)
  })

  it('should return undefined for empty object', () => {
    expect(parseGeoPt({})).toBeUndefined()
  })

  it('should return undefined for non-object input', () => {
    expect(parseGeoPt('string')).toBeUndefined()
    expect(parseGeoPt(undefined)).toBeUndefined()
    expect(parseGeoPt(null)).toBeUndefined()
  })
})

describe('parseIm', () => {
  it('should parse IM with all properties', () => {
    const value = {
      '@address': 'foo@example.com',
      '@label': 'Work',
      '@rel': 'http://schemas.google.com/g/2005#home',
      '@protocol': 'http://schemas.google.com/g/2005#MSN',
      '@primary': 'true',
    }
    const expected = {
      address: 'foo@example.com',
      label: 'Work',
      rel: 'http://schemas.google.com/g/2005#home',
      protocol: 'http://schemas.google.com/g/2005#MSN',
      primary: true,
    }

    expect(parseIm(value)).toEqual(expected)
  })

  it('should parse IM with only address', () => {
    const value = {
      '@address': 'foo@example.com',
    }
    const expected = {
      address: 'foo@example.com',
    }

    expect(parseIm(value)).toEqual(expected)
  })

  it('should return undefined for empty object', () => {
    expect(parseIm({})).toBeUndefined()
  })

  it('should return undefined for non-object input', () => {
    expect(parseIm('string')).toBeUndefined()
    expect(parseIm(undefined)).toBeUndefined()
    expect(parseIm(null)).toBeUndefined()
  })
})

describe('parseMoney', () => {
  it('should parse money with all properties', () => {
    const value = {
      '@amount': '650.0',
      '@currencycode': 'EUR',
    }
    const expected = {
      amount: 650,
      currencyCode: 'EUR',
    }

    expect(parseMoney(value)).toEqual(expected)
  })

  it('should parse money with only amount', () => {
    const value = {
      '@amount': '19.99',
    }
    const expected = {
      amount: 19.99,
    }

    expect(parseMoney(value)).toEqual(expected)
  })

  it('should return undefined for empty object', () => {
    expect(parseMoney({})).toBeUndefined()
  })

  it('should return undefined for non-object input', () => {
    expect(parseMoney('string')).toBeUndefined()
    expect(parseMoney(undefined)).toBeUndefined()
    expect(parseMoney(null)).toBeUndefined()
  })
})

describe('parsePhoneticName', () => {
  it('should parse phonetic name with all properties', () => {
    const value = {
      '@yomi': 'smɪð',
      '#text': 'Smith',
    }
    const expected = {
      value: 'Smith',
      yomi: 'smɪð',
    }

    expect(parsePhoneticName(value)).toEqual(expected)
  })

  it('should parse phonetic name from plain text', () => {
    expect(parsePhoneticName('Smith')).toEqual({ value: 'Smith' })
  })

  it('should handle HTML entities', () => {
    expect(parsePhoneticName('Johnson &amp; Johnson')).toEqual({ value: 'Johnson & Johnson' })
  })

  it('should handle CDATA', () => {
    expect(parsePhoneticName('<![CDATA[Smith]]>')).toEqual({ value: 'Smith' })
  })

  it('should return undefined for empty string', () => {
    expect(parsePhoneticName('')).toBeUndefined()
  })

  it('should return undefined for whitespace only', () => {
    expect(parsePhoneticName('   ')).toBeUndefined()
  })

  it('should return undefined for empty object', () => {
    expect(parsePhoneticName({})).toBeUndefined()
  })

  it('should return undefined for nullish input', () => {
    expect(parsePhoneticName(undefined)).toBeUndefined()
    expect(parsePhoneticName(null)).toBeUndefined()
  })
})

describe('parseName', () => {
  it('should parse name with all properties', () => {
    const value = {
      'gd:givenname': { '@yomi': 'dʒon', '#text': 'Winston' },
      'gd:additionalname': 'Leonard',
      'gd:familyname': 'Spencer-Churchill',
      'gd:nameprefix': 'Sir',
      'gd:namesuffix': 'OG',
      'gd:fullname': 'Sir Winston Leonard Spencer-Churchill, OG',
    }
    const expected = {
      givenName: { value: 'Winston', yomi: 'dʒon' },
      additionalName: { value: 'Leonard' },
      familyName: { value: 'Spencer-Churchill' },
      namePrefix: 'Sir',
      nameSuffix: 'OG',
      fullName: 'Sir Winston Leonard Spencer-Churchill, OG',
    }

    expect(parseName(value)).toEqual(expected)
  })

  it('should parse name with only full name', () => {
    const value = {
      'gd:fullname': 'Elizabeth Bennet',
    }
    const expected = {
      fullName: 'Elizabeth Bennet',
    }

    expect(parseName(value)).toEqual(expected)
  })

  it('should take the first element from an array', () => {
    const value = {
      'gd:givenname': ['Elizabeth', 'Liz'],
    }
    const expected = {
      givenName: { value: 'Elizabeth' },
    }

    expect(parseName(value)).toEqual(expected)
  })

  it('should return undefined for empty object', () => {
    expect(parseName({})).toBeUndefined()
  })

  it('should return undefined for non-object input', () => {
    expect(parseName('string')).toBeUndefined()
    expect(parseName(undefined)).toBeUndefined()
    expect(parseName(null)).toBeUndefined()
  })
})

describe('parseReminder', () => {
  it('should parse reminder with all properties', () => {
    const value = {
      '@absolutetime': '2005-06-06T16:55:00-08:00',
      '@method': 'email',
      '@days': '1',
      '@hours': '2',
      '@minutes': '15',
    }
    const expected = {
      absoluteTime: '2005-06-06T16:55:00-08:00',
      method: 'email',
      days: 1,
      hours: 2,
      minutes: 15,
    }

    expect(parseReminder(value)).toEqual(expected)
  })

  it('should parse reminder with only minutes', () => {
    const value = {
      '@minutes': '15',
    }
    const expected = {
      minutes: 15,
    }

    expect(parseReminder(value)).toEqual(expected)
  })

  it('should return undefined for empty object', () => {
    expect(parseReminder({})).toBeUndefined()
  })

  it('should return undefined for non-object input', () => {
    expect(parseReminder('string')).toBeUndefined()
    expect(parseReminder(undefined)).toBeUndefined()
    expect(parseReminder(null)).toBeUndefined()
  })
})

describe('parseWhen', () => {
  it('should parse when with all properties', () => {
    const value = {
      '@starttime': '2005-06-06T17:00:00-08:00',
      '@endtime': '2005-06-06T18:00:00-08:00',
      '@valuestring': 'This weekend',
      'gd:reminder': [{ '@minutes': '15' }, { '@absolutetime': '2005-06-06T16:55:00-08:00' }],
    }
    const expected = {
      startTime: '2005-06-06T17:00:00-08:00',
      endTime: '2005-06-06T18:00:00-08:00',
      valueString: 'This weekend',
      reminders: [{ minutes: 15 }, { absoluteTime: '2005-06-06T16:55:00-08:00' }],
    }

    expect(parseWhen(value)).toEqual(expected)
  })

  it('should parse when with a date-only start time', () => {
    const value = {
      '@starttime': '2005-06-06',
    }
    const expected = {
      startTime: '2005-06-06',
    }

    expect(parseWhen(value)).toEqual(expected)
  })

  it('should apply custom parseDateFn', () => {
    const value = {
      '@starttime': '2005-06-06T17:00:00Z',
    }
    const expected = {
      startTime: new Date('2005-06-06T17:00:00Z'),
    }

    expect(parseWhen(value, { parseDateFn: (raw) => new Date(raw) })).toEqual(expected)
  })

  it('should return undefined for empty object', () => {
    expect(parseWhen({})).toBeUndefined()
  })

  it('should return undefined for non-object input', () => {
    expect(parseWhen('string')).toBeUndefined()
    expect(parseWhen(undefined)).toBeUndefined()
    expect(parseWhen(null)).toBeUndefined()
  })
})

describe('parseWhere', () => {
  it('should parse where with all properties', () => {
    const value = {
      '@rel': 'http://schemas.google.com/g/2005#event',
      '@label': 'Mountain View Location (main)',
      '@valuestring': "Joe's Pub",
      'gd:entrylink': { '@href': 'https://example.com/10018/JoesPub' },
    }
    const expected = {
      rel: 'http://schemas.google.com/g/2005#event',
      label: 'Mountain View Location (main)',
      valueString: "Joe's Pub",
      entryLink: { href: 'https://example.com/10018/JoesPub' },
    }

    expect(parseWhere(value)).toEqual(expected)
  })

  it('should parse where with only value string', () => {
    const value = {
      '@valuestring': 'Building 41, Room X',
    }
    const expected = {
      valueString: 'Building 41, Room X',
    }

    expect(parseWhere(value)).toEqual(expected)
  })

  it('should return undefined for empty object', () => {
    expect(parseWhere({})).toBeUndefined()
  })

  it('should return undefined for non-object input', () => {
    expect(parseWhere('string')).toBeUndefined()
    expect(parseWhere(undefined)).toBeUndefined()
    expect(parseWhere(null)).toBeUndefined()
  })
})

describe('parseWho', () => {
  it('should parse who with all properties', () => {
    const value = {
      '@rel': 'http://schemas.google.com/g/2005#event.attendee',
      '@email': 'jo@example.com',
      '@valuestring': 'Jo',
      'gd:attendeestatus': { '@value': 'http://schemas.google.com/g/2005#event.tentative' },
      'gd:attendeetype': { '@value': 'http://schemas.google.com/g/2005#event.required' },
      'gd:entrylink': { '@href': 'https://example.com/jo/contacts/Jo' },
    }
    const expected = {
      rel: 'http://schemas.google.com/g/2005#event.attendee',
      email: 'jo@example.com',
      valueString: 'Jo',
      attendeeStatus: 'http://schemas.google.com/g/2005#event.tentative',
      attendeeType: 'http://schemas.google.com/g/2005#event.required',
      entryLink: { href: 'https://example.com/jo/contacts/Jo' },
    }

    expect(parseWho(value)).toEqual(expected)
  })

  it('should parse who with only email', () => {
    const value = {
      '@email': 'jo@example.com',
    }
    const expected = {
      email: 'jo@example.com',
    }

    expect(parseWho(value)).toEqual(expected)
  })

  it('should skip attendee status without value attribute', () => {
    const value = {
      '@valuestring': 'Jo',
      'gd:attendeestatus': '',
    }
    const expected = {
      valueString: 'Jo',
    }

    expect(parseWho(value)).toEqual(expected)
  })

  it('should return undefined for empty object', () => {
    expect(parseWho({})).toBeUndefined()
  })

  it('should return undefined for non-object input', () => {
    expect(parseWho('string')).toBeUndefined()
    expect(parseWho(undefined)).toBeUndefined()
    expect(parseWho(null)).toBeUndefined()
  })
})

describe('parseOrganization', () => {
  it('should parse organization with all properties', () => {
    const value = {
      '@label': 'Work',
      '@rel': 'http://schemas.google.com/g/2005#work',
      '@primary': 'true',
      'gd:orgdepartment': 'Software Development',
      'gd:orgjobdescription': 'Writes documentation',
      'gd:orgname': { '@yomi': 'ekusanpuru', '#text': 'Example, Inc.' },
      'gd:orgsymbol': 'EXMP',
      'gd:orgtitle': 'Tech Writer',
      'gd:where': { '@valuestring': 'Building 40' },
    }
    const expected = {
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

    expect(parseOrganization(value)).toEqual(expected)
  })

  it('should parse organization with only name', () => {
    const value = {
      'gd:orgname': 'Example, Inc.',
    }
    const expected = {
      orgName: { value: 'Example, Inc.' },
    }

    expect(parseOrganization(value)).toEqual(expected)
  })

  it('should handle HTML entities in text elements', () => {
    const value = {
      'gd:orgname': 'Smith &amp; Sons',
    }
    const expected = {
      orgName: { value: 'Smith & Sons' },
    }

    expect(parseOrganization(value)).toEqual(expected)
  })

  it('should handle CDATA in text elements', () => {
    const value = {
      'gd:orgtitle': '<![CDATA[President & CEO]]>',
    }
    const expected = {
      orgTitle: 'President & CEO',
    }

    expect(parseOrganization(value)).toEqual(expected)
  })

  it('should return undefined for empty object', () => {
    expect(parseOrganization({})).toBeUndefined()
  })

  it('should return undefined for non-object input', () => {
    expect(parseOrganization('string')).toBeUndefined()
    expect(parseOrganization(undefined)).toBeUndefined()
    expect(parseOrganization(null)).toBeUndefined()
  })
})

describe('parseOriginalEvent', () => {
  it('should parse original event with all properties', () => {
    const value = {
      '@id': 'i8fl1nrv2bl57c1qgr3f0onmgg',
      '@href': 'https://example.com/calendar/feeds/userID/private-magicCookie/full/eventID',
      'gd:when': { '@starttime': '2006-03-17T22:00:00.000Z' },
    }
    const expected = {
      id: 'i8fl1nrv2bl57c1qgr3f0onmgg',
      href: 'https://example.com/calendar/feeds/userID/private-magicCookie/full/eventID',
      when: { startTime: '2006-03-17T22:00:00.000Z' },
    }

    expect(parseOriginalEvent(value)).toEqual(expected)
  })

  it('should parse original event with only id', () => {
    const value = {
      '@id': 'i8fl1nrv2bl57c1qgr3f0onmgg',
    }
    const expected = {
      id: 'i8fl1nrv2bl57c1qgr3f0onmgg',
    }

    expect(parseOriginalEvent(value)).toEqual(expected)
  })

  it('should return undefined for empty object', () => {
    expect(parseOriginalEvent({})).toBeUndefined()
  })

  it('should return undefined for non-object input', () => {
    expect(parseOriginalEvent('string')).toBeUndefined()
    expect(parseOriginalEvent(undefined)).toBeUndefined()
    expect(parseOriginalEvent(null)).toBeUndefined()
  })
})

describe('parsePhoneNumber', () => {
  it('should parse phone number with all properties', () => {
    const value = {
      '@label': 'Personal calls only',
      '@rel': 'http://schemas.google.com/g/2005#mobile',
      '@uri': 'tel:+12065551212',
      '@primary': 'true',
      '#text': '+1 206 555 1212',
    }
    const expected = {
      value: '+1 206 555 1212',
      label: 'Personal calls only',
      rel: 'http://schemas.google.com/g/2005#mobile',
      uri: 'tel:+12065551212',
      primary: true,
    }

    expect(parsePhoneNumber(value)).toEqual(expected)
  })

  it('should parse phone number from plain text', () => {
    expect(parsePhoneNumber('(425) 555-8080 ext. 72585')).toEqual({
      value: '(425) 555-8080 ext. 72585',
    })
  })

  it('should handle HTML entities', () => {
    expect(parsePhoneNumber('555-1212 &amp; 555-1213')).toEqual({ value: '555-1212 & 555-1213' })
  })

  it('should handle CDATA', () => {
    expect(parsePhoneNumber('<![CDATA[(206)555-1212]]>')).toEqual({ value: '(206)555-1212' })
  })

  it('should return undefined for empty string', () => {
    expect(parsePhoneNumber('')).toBeUndefined()
  })

  it('should return undefined for whitespace only', () => {
    expect(parsePhoneNumber('   ')).toBeUndefined()
  })

  it('should return undefined for empty object', () => {
    expect(parsePhoneNumber({})).toBeUndefined()
  })

  it('should return undefined for nullish input', () => {
    expect(parsePhoneNumber(undefined)).toBeUndefined()
    expect(parsePhoneNumber(null)).toBeUndefined()
  })
})

describe('parsePostalAddress', () => {
  it('should parse postal address with all properties', () => {
    const value = {
      '@label': 'Office',
      '@rel': 'http://schemas.google.com/g/2005#work',
      '@primary': 'true',
      '#text': '1600 Amphitheatre Pkwy\nMountain View, CA 94043',
    }
    const expected = {
      value: '1600 Amphitheatre Pkwy\nMountain View, CA 94043',
      label: 'Office',
      rel: 'http://schemas.google.com/g/2005#work',
      primary: true,
    }

    expect(parsePostalAddress(value)).toEqual(expected)
  })

  it('should parse postal address from plain text', () => {
    expect(parsePostalAddress('500 West 45th Street')).toEqual({ value: '500 West 45th Street' })
  })

  it('should return undefined for empty object', () => {
    expect(parsePostalAddress({})).toBeUndefined()
  })

  it('should return undefined for nullish input', () => {
    expect(parsePostalAddress(undefined)).toBeUndefined()
    expect(parsePostalAddress(null)).toBeUndefined()
  })
})

describe('parseRating', () => {
  it('should parse rating with all properties', () => {
    const value = {
      '@rel': 'http://schemas.google.com/g/2005#overall',
      '@value': '4',
      '@average': '4.65',
      '@min': '1',
      '@max': '5',
      '@numraters': '200',
    }
    const expected = {
      rel: 'http://schemas.google.com/g/2005#overall',
      value: 4,
      average: 4.65,
      min: 1,
      max: 5,
      numRaters: 200,
    }

    expect(parseRating(value)).toEqual(expected)
  })

  it('should parse rating with only scale and value', () => {
    const value = {
      '@value': '4',
      '@min': '1',
      '@max': '5',
    }
    const expected = {
      value: 4,
      min: 1,
      max: 5,
    }

    expect(parseRating(value)).toEqual(expected)
  })

  it('should return undefined for empty object', () => {
    expect(parseRating({})).toBeUndefined()
  })

  it('should return undefined for non-object input', () => {
    expect(parseRating('string')).toBeUndefined()
    expect(parseRating(undefined)).toBeUndefined()
    expect(parseRating(null)).toBeUndefined()
  })
})

describe('parseRecurrenceException', () => {
  it('should parse recurrence exception with all properties', () => {
    const value = {
      '@specialized': 'true',
      'gd:entrylink': { '@href': 'https://example.com/calendar/event/1' },
      'gd:originalevent': { '@id': 'i8fl1nrv2bl57c1qgr3f0onmgg' },
    }
    const expected = {
      specialized: true,
      entryLink: { href: 'https://example.com/calendar/event/1' },
      originalEvent: { id: 'i8fl1nrv2bl57c1qgr3f0onmgg' },
    }

    expect(parseRecurrenceException(value)).toEqual(expected)
  })

  it('should parse recurrence exception with only specialized', () => {
    const value = {
      '@specialized': 'false',
    }
    const expected = {
      specialized: false,
    }

    expect(parseRecurrenceException(value)).toEqual(expected)
  })

  it('should return undefined for empty object', () => {
    expect(parseRecurrenceException({})).toBeUndefined()
  })

  it('should return undefined for non-object input', () => {
    expect(parseRecurrenceException('string')).toBeUndefined()
    expect(parseRecurrenceException(undefined)).toBeUndefined()
    expect(parseRecurrenceException(null)).toBeUndefined()
  })
})

describe('parseCountry', () => {
  it('should parse country with all properties', () => {
    const value = {
      '@code': 'PL',
      '#text': 'Poland',
    }
    const expected = {
      value: 'Poland',
      code: 'PL',
    }

    expect(parseCountry(value)).toEqual(expected)
  })

  it('should parse country from plain text', () => {
    expect(parseCountry('Gabon')).toEqual({ value: 'Gabon' })
  })

  it('should return undefined for empty object', () => {
    expect(parseCountry({})).toBeUndefined()
  })

  it('should return undefined for nullish input', () => {
    expect(parseCountry(undefined)).toBeUndefined()
    expect(parseCountry(null)).toBeUndefined()
  })
})

describe('parseStructuredPostalAddress', () => {
  it('should parse structured postal address with all properties', () => {
    const value = {
      '@rel': 'http://schemas.google.com/g/2005#work',
      '@mailclass': 'http://schemas.google.com/g/2005#letters',
      '@usage': 'http://schemas.google.com/g/2005#general',
      '@label': 'John at Example',
      '@primary': 'true',
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
      'gd:formattedaddress': '1600 Amphitheatre Parkway\nMountain View, CA 94043',
    }
    const expected = {
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
      formattedAddress: '1600 Amphitheatre Parkway\nMountain View, CA 94043',
    }

    expect(parseStructuredPostalAddress(value)).toEqual(expected)
  })

  it('should parse structured postal address with only formatted address', () => {
    const value = {
      'gd:formattedaddress': 'Longbourne, Nr. Meryton, Hertfordshire, England',
    }
    const expected = {
      formattedAddress: 'Longbourne, Nr. Meryton, Hertfordshire, England',
    }

    expect(parseStructuredPostalAddress(value)).toEqual(expected)
  })

  it('should handle HTML entities in text elements', () => {
    const value = {
      'gd:street': '27, rue Pasteur &amp; Co',
    }
    const expected = {
      street: '27, rue Pasteur & Co',
    }

    expect(parseStructuredPostalAddress(value)).toEqual(expected)
  })

  it('should return undefined for empty object', () => {
    expect(parseStructuredPostalAddress({})).toBeUndefined()
  })

  it('should return undefined for non-object input', () => {
    expect(parseStructuredPostalAddress('string')).toBeUndefined()
    expect(parseStructuredPostalAddress(undefined)).toBeUndefined()
    expect(parseStructuredPostalAddress(null)).toBeUndefined()
  })
})

describe('retrievePerson', () => {
  it('should parse Blogger author image', () => {
    const value = {
      name: { '#text': 'Jill Flinton' },
      'gd:image': {
        '@rel': 'http://schemas.google.com/g/2005#thumbnail',
        '@width': '16',
        '@height': '16',
        '@src': 'https://example.com/img/b16-rounded.gif',
      },
    }
    const expected = {
      image: {
        src: 'https://example.com/img/b16-rounded.gif',
        rel: 'http://schemas.google.com/g/2005#thumbnail',
        width: 16,
        height: 16,
      },
    }

    expect(retrievePerson(value)).toEqual(expected)
  })

  it('should take the first image from an array', () => {
    const value = {
      'gd:image': [
        { '@src': 'https://example.com/img/first.png' },
        { '@src': 'https://example.com/img/second.png' },
      ],
    }
    const expected = {
      image: { src: 'https://example.com/img/first.png' },
    }

    expect(retrievePerson(value)).toEqual(expected)
  })

  it('should return undefined when no gd properties exist', () => {
    const value = {
      name: { '#text': 'Jill Flinton' },
    }

    expect(retrievePerson(value)).toBeUndefined()
  })

  it('should return undefined for non-object input', () => {
    expect(retrievePerson('string')).toBeUndefined()
    expect(retrievePerson(undefined)).toBeUndefined()
    expect(retrievePerson(null)).toBeUndefined()
  })
})

describe('retrieveEntry', () => {
  it('should parse Blogger comment extended properties', () => {
    const value = {
      'gd:extendedproperty': [
        { '@name': 'blogger.itemClass', '@value': 'pid-982403090' },
        { '@name': 'blogger.displayTime', '@value': 'September 11, 2012 7:48 AM' },
      ],
    }
    const expected = {
      extendedProperties: [
        { name: 'blogger.itemClass', value: 'pid-982403090' },
        { name: 'blogger.displayTime', value: 'September 11, 2012 7:48 AM' },
      ],
    }

    expect(retrieveEntry(value)).toEqual(expected)
  })

  it('should parse video comments and rating', () => {
    const value = {
      'gd:comments': {
        'gd:feedlink': {
          '@rel': 'http://example.com/schemas/2007#comments',
          '@href': 'https://example.com/feeds/api/videos/0oH9h9sei9I/comments',
          '@counthint': '2',
        },
      },
      'gd:rating': {
        '@average': '5.0',
        '@max': '5',
        '@min': '1',
        '@numraters': '13',
        '@rel': 'http://schemas.google.com/g/2005#overall',
      },
    }
    const expected = {
      comments: {
        feedLink: {
          href: 'https://example.com/feeds/api/videos/0oH9h9sei9I/comments',
          rel: 'http://example.com/schemas/2007#comments',
          countHint: 2,
        },
      },
      rating: {
        rel: 'http://schemas.google.com/g/2005#overall',
        average: 5,
        min: 1,
        max: 5,
        numRaters: 13,
      },
    }

    expect(retrieveEntry(value)).toEqual(expected)
  })

  it('should parse event properties', () => {
    const value = {
      'gd:eventstatus': { '@value': 'http://schemas.google.com/g/2005#event.confirmed' },
      'gd:originalevent': { '@id': 'i8fl1nrv2bl57c1qgr3f0onmgg' },
      'gd:recurrence': 'DTSTART;TZID=America/Los_Angeles:20060314T060000\nDURATION:PT3600S',
      'gd:recurrenceexception': { '@specialized': 'true' },
      'gd:transparency': { '@value': 'http://schemas.google.com/g/2005#event.transparent' },
      'gd:visibility': { '@value': 'http://schemas.google.com/g/2005#event.public' },
      'gd:when': {
        '@starttime': '2005-01-18T21:00:00Z',
        '@endtime': '2005-01-18T22:00:00Z',
      },
      'gd:where': { '@valuestring': 'Building 41, Room X' },
      'gd:who': {
        '@rel': 'http://schemas.google.com/g/2005#event.organizer',
        '@valuestring': 'Receptionist 41',
      },
    }
    const expected = {
      eventStatus: 'http://schemas.google.com/g/2005#event.confirmed',
      originalEvent: { id: 'i8fl1nrv2bl57c1qgr3f0onmgg' },
      recurrence: 'DTSTART;TZID=America/Los_Angeles:20060314T060000\nDURATION:PT3600S',
      recurrenceExceptions: [{ specialized: true }],
      transparency: 'http://schemas.google.com/g/2005#event.transparent',
      visibility: 'http://schemas.google.com/g/2005#event.public',
      whens: [{ startTime: '2005-01-18T21:00:00Z', endTime: '2005-01-18T22:00:00Z' }],
      wheres: [{ valueString: 'Building 41, Room X' }],
      whos: [
        {
          rel: 'http://schemas.google.com/g/2005#event.organizer',
          valueString: 'Receptionist 41',
        },
      ],
    }

    expect(retrieveEntry(value)).toEqual(expected)
  })

  it('should parse contact properties', () => {
    const value = {
      'gd:deleted': '',
      'gd:email': [
        { '@rel': 'http://schemas.google.com/g/2005#work', '@address': 'liz@example.com' },
        { '@rel': 'http://schemas.google.com/g/2005#home', '@address': 'liz@example.org' },
      ],
      'gd:geopt': { '@lat': '40.75', '@lon': '-74.0' },
      'gd:im': { '@address': 'liz@example.com' },
      'gd:money': { '@amount': '650.0', '@currencycode': 'EUR' },
      'gd:name': { 'gd:fullname': 'Elizabeth Bennet' },
      'gd:organization': { 'gd:orgname': 'Example, Inc.' },
      'gd:phonenumber': ['(206)555-1212', '(206)555-1213'],
      'gd:postaladdress': '800 Main Street',
      'gd:resourceid': '9749638',
      'gd:structuredpostaladdress': { 'gd:city': 'Mountain View' },
    }
    const expected = {
      deleted: true,
      emails: [
        { rel: 'http://schemas.google.com/g/2005#work', address: 'liz@example.com' },
        { rel: 'http://schemas.google.com/g/2005#home', address: 'liz@example.org' },
      ],
      geoPt: { lat: 40.75, lon: -74 },
      ims: [{ address: 'liz@example.com' }],
      money: { amount: 650, currencyCode: 'EUR' },
      name: { fullName: 'Elizabeth Bennet' },
      organizations: [{ orgName: { value: 'Example, Inc.' } }],
      phoneNumbers: [{ value: '(206)555-1212' }, { value: '(206)555-1213' }],
      postalAddresses: [{ value: '800 Main Street' }],
      resourceId: '9749638',
      structuredPostalAddresses: [{ city: 'Mountain View' }],
    }

    expect(retrieveEntry(value)).toEqual(expected)
  })

  it('should mark a self-closing deleted element', () => {
    const value = {
      'gd:deleted': '',
    }
    const expected = {
      deleted: true,
    }

    expect(retrieveEntry(value)).toEqual(expected)
  })

  it('should handle CDATA in text elements', () => {
    const value = {
      'gd:resourceid': '<![CDATA[document:9749638]]>',
    }
    const expected = {
      resourceId: 'document:9749638',
    }

    expect(retrieveEntry(value)).toEqual(expected)
  })

  it('should return undefined when no gd properties exist', () => {
    const value = {
      title: { '#text': 'Re: Info?' },
    }

    expect(retrieveEntry(value)).toBeUndefined()
  })

  it('should parse singular properties from arrays (uses first)', () => {
    const value = {
      'gd:rating': [
        { '@value': '4', '@min': '1', '@max': '5' },
        { '@value': '1', '@min': '1', '@max': '5' },
      ],
      'gd:resourceid': ['first', 'second'],
    }
    const expected = {
      rating: { value: 4, min: 1, max: 5 },
      resourceId: 'first',
    }

    expect(retrieveEntry(value)).toEqual(expected)
  })

  it('should return undefined for empty string and whitespace-only values', () => {
    const value = {
      'gd:recurrence': '   ',
      'gd:resourceid': '',
    }

    expect(retrieveEntry(value)).toBeUndefined()
  })

  it('should return undefined for empty object', () => {
    expect(retrieveEntry({})).toBeUndefined()
  })

  it('should return undefined for non-object input', () => {
    expect(retrieveEntry('string')).toBeUndefined()
    expect(retrieveEntry(undefined)).toBeUndefined()
    expect(retrieveEntry(null)).toBeUndefined()
  })
})

describe('retrieveFeed', () => {
  it('should parse feed-level where', () => {
    const value = {
      'gd:where': { '@valuestring': 'Google Cafeteria (Building 40)' },
    }
    const expected = {
      wheres: [{ valueString: 'Google Cafeteria (Building 40)' }],
    }

    expect(retrieveFeed(value)).toEqual(expected)
  })

  it('should return undefined when no gd properties exist', () => {
    const value = {
      title: { '#text': 'Calendar' },
    }

    expect(retrieveFeed(value)).toBeUndefined()
  })

  it('should return undefined for non-object input', () => {
    expect(retrieveFeed('string')).toBeUndefined()
    expect(retrieveFeed(undefined)).toBeUndefined()
    expect(retrieveFeed(null)).toBeUndefined()
  })
})
