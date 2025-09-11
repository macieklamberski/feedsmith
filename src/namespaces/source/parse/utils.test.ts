import { describe, expect, it } from 'bun:test'
import {
  parseAccount,
  parseArchive,
  parseLikes,
  parseSubscriptionList,
  retrieveFeed,
  retrieveItem,
} from './utils.js'

describe('parseAccount', () => {
  it('should parse account with service and value', () => {
    const value = {
      '@service': 'twitter',
      '#text': 'johndoe',
    }
    const expected = {
      service: 'twitter',
      value: 'johndoe',
    }

    expect(parseAccount(value)).toEqual(expected)
  })

  it('should handle case-insensitive service names', () => {
    const value = {
      '@service': 'Facebook',
      '#text': 'john.doe.123',
    }
    const expected = {
      service: 'Facebook',
      value: 'john.doe.123',
    }

    expect(parseAccount(value)).toEqual(expected)
  })

  it('should parse account with only value when service is missing', () => {
    const value = {
      '#text': 'username',
    }
    const expected = {
      value: 'username',
    }

    expect(parseAccount(value)).toEqual(expected)
  })

  it('should parse account with only service (no value)', () => {
    const value = {
      '@service': 'twitter',
    }
    const expected = {
      service: 'twitter',
    }

    expect(parseAccount(value)).toEqual(expected)
  })

  it('should return undefined for non-object input', () => {
    expect(parseAccount('not an object')).toBeUndefined()
    expect(parseAccount(undefined)).toBeUndefined()
    expect(parseAccount(null)).toBeUndefined()
  })
})

describe('parseLikes', () => {
  it('should parse likes with server attribute', () => {
    const value = {
      '@server': 'http://likes.example.com/',
    }
    const expected = {
      server: 'http://likes.example.com/',
    }

    expect(parseLikes(value)).toEqual(expected)
  })

  it('should return undefined when no attributes present', () => {
    const value = {}

    expect(parseLikes(value)).toBeUndefined()
  })
})

describe('parseArchive', () => {
  it('should parse complete archive with all properties', () => {
    const value = {
      'source:url': 'http://example.com/archive',
      'source:startday': '2023-01-01',
      'source:endday': '2023-12-31',
      'source:filename': 'archive2023.xml',
    }
    const expected = {
      url: 'http://example.com/archive',
      startDay: '2023-01-01',
      endDay: '2023-12-31',
      filename: 'archive2023.xml',
    }

    expect(parseArchive(value)).toEqual(expected)
  })

  it('should parse archive with only required fields', () => {
    const value = {
      'source:url': 'http://example.com/archive',
      'source:startday': '2023-01-01',
    }
    const expected = {
      url: 'http://example.com/archive',
      startDay: '2023-01-01',
    }

    expect(parseArchive(value)).toEqual(expected)
  })

  it('should parse partial archive when url is missing', () => {
    const value = {
      'source:startday': '2023-01-01',
      'source:endday': '2023-12-31',
    }
    const expected = {
      startDay: '2023-01-01',
      endDay: '2023-12-31',
    }

    expect(parseArchive(value)).toEqual(expected)
  })

  it('should parse partial archive when startDay is missing', () => {
    const value = {
      'source:url': 'http://example.com/archive',
      'source:endday': '2023-12-31',
    }
    const expected = {
      url: 'http://example.com/archive',
      endDay: '2023-12-31',
    }

    expect(parseArchive(value)).toEqual(expected)
  })
})

describe('parseSubscriptionList', () => {
  it('should parse subscription list with url and text', () => {
    const value = {
      '@url': 'http://example.com/subscriptions.opml',
      '#text': 'follows',
    }
    const expected = {
      url: 'http://example.com/subscriptions.opml',
      value: 'follows',
    }

    expect(parseSubscriptionList(value)).toEqual(expected)
  })

  it('should parse subscription list with only url', () => {
    const value = {
      '@url': 'http://example.com/subs.opml',
    }
    const expected = {
      url: 'http://example.com/subs.opml',
    }

    expect(parseSubscriptionList(value)).toEqual(expected)
  })

  it('should parse subscription list with only value when url is missing', () => {
    const value = {
      '#text': 'follows',
    }
    const expected = {
      value: 'follows',
    }

    expect(parseSubscriptionList(value)).toEqual(expected)
  })
})

describe('retrieveFeed', () => {
  it('should parse complete feed with all properties', () => {
    const value = {
      'source:account': { '@service': 'twitter', '#text': 'johndoe' },
      'source:likes': { '@server': 'http://likes.example.com/' },
      'source:archive': {
        'source:url': 'http://example.com/archive',
        'source:startday': '2023-01-01',
        'source:endday': '2023-12-31',
      },
      'source:subscriptionlist': {
        '@url': 'http://example.com/subscriptions.opml',
        '#text': 'follows',
      },
      'source:cloud': 'https://cloudserver.example.com/notify',
      'source:blogroll': 'https://blog.example.com/blogroll.opml',
      'source:self': 'http://example.com/feed.xml',
    }
    const expected = {
      accounts: [{ service: 'twitter', value: 'johndoe' }],
      likes: { server: 'http://likes.example.com/' },
      archive: {
        url: 'http://example.com/archive',
        startDay: '2023-01-01',
        endDay: '2023-12-31',
      },
      subscriptionLists: [{ url: 'http://example.com/subscriptions.opml', value: 'follows' }],
      cloud: 'https://cloudserver.example.com/notify',
      blogroll: 'https://blog.example.com/blogroll.opml',
      self: 'http://example.com/feed.xml',
    }

    expect(retrieveFeed(value)).toEqual(expected)
  })

  it('should handle single account element', () => {
    const value = {
      'source:account': { '@service': 'twitter', '#text': 'johndoe' },
    }
    const expected = {
      accounts: [{ service: 'twitter', value: 'johndoe' }],
    }

    expect(retrieveFeed(value)).toEqual(expected)
  })

  it('should handle empty object', () => {
    const value = {}

    expect(retrieveFeed(value)).toBeUndefined()
  })

  it('should return undefined for non-object input', () => {
    expect(retrieveFeed('not an object')).toBeUndefined()
    expect(retrieveFeed(undefined)).toBeUndefined()
    expect(retrieveFeed(null)).toBeUndefined()
  })
})

describe('retrieveItem', () => {
  it('should parse complete item with all properties', () => {
    const value = {
      'source:markdown': '# Title\n\nThis is **markdown** content.',
      'source:outline': '<outline text="Item 1"><outline text="Subitem 1"/></outline>',
      'source:localtime': '2023-12-25 10:30:00',
      'source:linkfull': 'http://example.com/very/long/url/that/was/shortened',
    }
    const expected = {
      markdown: '# Title\n\nThis is **markdown** content.',
      outlines: ['<outline text="Item 1"><outline text="Subitem 1"/></outline>'],
      localTime: '2023-12-25 10:30:00',
      linkFull: 'http://example.com/very/long/url/that/was/shortened',
    }

    expect(retrieveItem(value)).toEqual(expected)
  })

  it('should handle item with only markdown', () => {
    const value = {
      'source:markdown': '**Bold** text in markdown',
    }
    const expected = {
      markdown: '**Bold** text in markdown',
    }

    expect(retrieveItem(value)).toEqual(expected)
  })

  it('should handle empty object', () => {
    const value = {}

    expect(retrieveItem(value)).toBeUndefined()
  })

  it('should return undefined for non-object input', () => {
    expect(retrieveItem('not an object')).toBeUndefined()
    expect(retrieveItem(undefined)).toBeUndefined()
    expect(retrieveItem(null)).toBeUndefined()
  })
})
