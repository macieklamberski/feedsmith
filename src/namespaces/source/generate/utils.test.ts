import { describe, expect, it } from 'bun:test'
import {
  generateAccount,
  generateArchive,
  generateFeed,
  generateItem,
  generateLikes,
  generateSubscriptionList,
} from './utils.js'

describe('generateAccount', () => {
  it('should generate account with service and value', () => {
    const value = {
      service: 'twitter',
      value: 'johndoe',
    }
    const expected = {
      '@service': 'twitter',
      '#text': 'johndoe',
    }

    expect(generateAccount(value)).toEqual(expected)
  })

  it('should return undefined when service is missing', () => {
    const value = {
      username: 'johndoe',
    }

    // @ts-expect-error: This is for testing purposes.
    expect(generateAccount(value)).toBeUndefined()
  })

  it('should generate account with only service', () => {
    const value = {
      service: 'twitter',
    }

    const expected = {
      '@service': 'twitter',
    }

    expect(generateAccount(value)).toEqual(expected)
  })

  it('should return undefined for non-object input', () => {
    expect(generateAccount(undefined)).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generateAccount(null)).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generateAccount('not an object')).toBeUndefined()
  })
})

describe('generateLikes', () => {
  it('should generate likes with only server', () => {
    const value = {
      server: 'http://likes.example.com/',
    }
    const expected = {
      '@server': 'http://likes.example.com/',
    }

    expect(generateLikes(value)).toEqual(expected)
  })

  it('should generate likes with only server', () => {
    const value = {
      server: 'http://likes.example.com/',
    }
    const expected = {
      '@server': 'http://likes.example.com/',
    }

    expect(generateLikes(value)).toEqual(expected)
  })

  it('should return undefined when server is missing', () => {
    const value = {}

    // @ts-expect-error: This is for testing purposes.
    expect(generateLikes(value)).toBeUndefined()
  })
})

describe('generateArchive', () => {
  it('should generate complete archive with all properties', () => {
    const value = {
      url: 'http://example.com/archive',
      startDay: '2023-01-01',
      endDay: '2023-12-31',
      filename: 'archive2023.xml',
    }
    const expected = {
      'source:url': 'http://example.com/archive',
      'source:startDay': '2023-01-01',
      'source:endDay': '2023-12-31',
      'source:filename': 'archive2023.xml',
    }

    expect(generateArchive(value)).toEqual(expected)
  })

  it('should generate archive with only required fields', () => {
    const value = {
      url: 'http://example.com/archive',
      startDay: '2023-01-01',
    }
    const expected = {
      'source:url': 'http://example.com/archive',
      'source:startDay': '2023-01-01',
    }

    expect(generateArchive(value)).toEqual(expected)
  })

  it('should return undefined when url is missing', () => {
    const value = {
      startDay: '2023-01-01',
      endDay: '2023-12-31',
    }

    // @ts-expect-error: This is for testing purposes.
    expect(generateArchive(value)).toBeUndefined()
  })

  it('should return undefined when startDay is missing', () => {
    const value = {
      url: 'http://example.com/archive',
      endDay: '2023-12-31',
    }

    // @ts-expect-error: This is for testing purposes.
    expect(generateArchive(value)).toBeUndefined()
  })
})

describe('generateSubscriptionList', () => {
  it('should generate subscription list with url and text', () => {
    const value = {
      url: 'http://example.com/subscriptions.opml',
      value: 'follows',
    }
    const expected = {
      '@url': 'http://example.com/subscriptions.opml',
      '#text': 'follows',
    }

    expect(generateSubscriptionList(value)).toEqual(expected)
  })

  it('should generate subscription list with only url', () => {
    const value = {
      url: 'http://example.com/subs.opml',
    }
    const expected = {
      '@url': 'http://example.com/subs.opml',
    }

    expect(generateSubscriptionList(value)).toEqual(expected)
  })

  it('should return undefined when url is missing', () => {
    const value = {
      value: 'follows',
    }

    // @ts-expect-error: This is for testing purposes.
    expect(generateSubscriptionList(value)).toBeUndefined()
  })
})

describe('generateFeed', () => {
  it('should generate complete feed with all properties', () => {
    const value = {
      accounts: [{ service: 'twitter', value: 'davewiner' }],
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
    const expected = {
      'source:account': [{ '@service': 'twitter', '#text': 'davewiner' }],
      'source:likes': { '@server': 'http://likes.example.com/' },
      'source:archive': {
        'source:url': 'http://example.com/archive',
        'source:startDay': '2023-01-01',
        'source:endDay': '2023-12-31',
      },
      'source:subscriptionList': [
        { '@url': 'http://example.com/subscriptions.opml', '#text': 'follows' },
      ],
      'source:cloud': 'https://cloudserver.example.com/notify',
      'source:blogroll': 'https://blog.example.com/blogroll.opml',
      'source:self': 'http://example.com/feed.xml',
    }

    expect(generateFeed(value)).toEqual(expected)
  })

  it('should handle single account element', () => {
    const value = {
      accounts: [{ service: 'twitter', value: 'davewiner' }],
    }
    const expected = {
      'source:account': [{ '@service': 'twitter', '#text': 'davewiner' }],
    }

    expect(generateFeed(value)).toEqual(expected)
  })

  it('should handle archive element', () => {
    const value = {
      archive: { url: 'http://example.com/archive1', startDay: '2023-01-01', endDay: '2023-06-30' },
    }
    const expected = {
      'source:archive': {
        'source:url': 'http://example.com/archive1',
        'source:startDay': '2023-01-01',
        'source:endDay': '2023-06-30',
      },
    }

    expect(generateFeed(value)).toEqual(expected)
  })

  it('should handle empty object', () => {
    const value = {}

    expect(generateFeed(value)).toBeUndefined()
  })

  it('should return undefined for non-object input', () => {
    expect(generateFeed(undefined)).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generateFeed(null)).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generateFeed('not an object')).toBeUndefined()
  })
})

describe('generateItem', () => {
  it('should generate complete item with all properties', () => {
    const value = {
      markdown: '# Title\n\nThis is **markdown** content.',
      outlines: ['<outline text="Item 1"><outline text="Subitem 1"/></outline>'],
      localTime: '2023-12-25 10:30:00',
      linkFull: 'http://example.com/very/long/url/that/was/shortened',
    }
    const expected = {
      'source:markdown': '# Title\n\nThis is **markdown** content.',
      'source:outline': [
        { '#cdata': '<outline text="Item 1"><outline text="Subitem 1"/></outline>' },
      ],
      'source:localTime': '2023-12-25 10:30:00',
      'source:linkFull': 'http://example.com/very/long/url/that/was/shortened',
    }

    expect(generateItem(value)).toEqual(expected)
  })

  it('should handle item with only markdown', () => {
    const value = {
      markdown: '**Bold** text in markdown',
    }
    const expected = {
      'source:markdown': '**Bold** text in markdown',
    }

    expect(generateItem(value)).toEqual(expected)
  })

  it('should handle empty object', () => {
    const value = {}

    expect(generateItem(value)).toBeUndefined()
  })

  it('should return undefined for non-object input', () => {
    expect(generateItem(undefined)).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generateItem(null)).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generateItem('not an object')).toBeUndefined()
  })
})
