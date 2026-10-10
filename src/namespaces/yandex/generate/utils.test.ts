import { describe, expect, it } from 'bun:test'
import {
  generateAdNetwork,
  generateAnalytics,
  generateCommentText,
  generateFeed,
  generateItem,
  generateLogo,
  generateOfficialComment,
  generateRelated,
  generateRelatedLink,
} from './utils.js'

describe('generateLogo', () => {
  it('should generate logo with type', () => {
    const value = {
      type: 'square',
      value: 'https://example.com/yandexsquarelogo.png',
    }
    const expected = {
      '@type': 'square',
      '#text': 'https://example.com/yandexsquarelogo.png',
    }

    expect(generateLogo(value)).toEqual(expected)
  })

  it('should generate logo with only value', () => {
    const value = {
      value: 'https://example.com/yandexlogo.png',
    }
    const expected = {
      '#text': 'https://example.com/yandexlogo.png',
    }

    expect(generateLogo(value)).toEqual(expected)
  })

  it('should return undefined for empty object', () => {
    expect(generateLogo({})).toBeUndefined()
  })

  it('should return undefined for non-object inputs', () => {
    // @ts-expect-error: This is for testing purposes.
    expect(generateLogo('https://example.com/yandexlogo.png')).toBeUndefined()
    expect(generateLogo(undefined)).toBeUndefined()
  })
})

describe('generateAnalytics', () => {
  it('should generate analytics with all properties', () => {
    const value = {
      type: 'custom',
      id: '12345678',
      params: '{ "section": "news" }',
      url: 'https://example.com/counter/{random}',
    }
    const expected = {
      '@type': 'custom',
      '@id': '12345678',
      '@params': '{ "section": "news" }',
      '@url': 'https://example.com/counter/{random}',
    }

    expect(generateAnalytics(value)).toEqual(expected)
  })

  it('should generate analytics with only type', () => {
    const value = {
      type: 'LiveInternet',
    }
    const expected = {
      '@type': 'LiveInternet',
    }

    expect(generateAnalytics(value)).toEqual(expected)
  })

  it('should return undefined for whitespace-only strings', () => {
    const value = {
      type: '   ',
      id: '\t\n',
    }

    expect(generateAnalytics(value)).toBeUndefined()
  })

  it('should return undefined for empty object', () => {
    expect(generateAnalytics({})).toBeUndefined()
  })

  it('should return undefined for non-object inputs', () => {
    // @ts-expect-error: This is for testing purposes.
    expect(generateAnalytics('Yandex')).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generateAnalytics(123)).toBeUndefined()
    expect(generateAnalytics(undefined)).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generateAnalytics(null)).toBeUndefined()
  })
})

describe('generateAdNetwork', () => {
  it('should generate ad network with all properties', () => {
    const value = {
      type: 'AdFox',
      id: 'R-A-123456-1',
      turboAdId: 'first_ad_place',
      value: '<div id="adfox_1"></div>',
    }
    const expected = {
      '@type': 'AdFox',
      '@id': 'R-A-123456-1',
      '@turbo-ad-id': 'first_ad_place',
      '#cdata': '<div id="adfox_1"></div>',
    }

    expect(generateAdNetwork(value)).toEqual(expected)
  })

  it('should generate ad network with only attributes', () => {
    const value = {
      type: 'Yandex',
      id: 'R-A-123456-1',
    }
    const expected = {
      '@type': 'Yandex',
      '@id': 'R-A-123456-1',
    }

    expect(generateAdNetwork(value)).toEqual(expected)
  })

  it('should return undefined for empty object', () => {
    expect(generateAdNetwork({})).toBeUndefined()
  })

  it('should return undefined for non-object inputs', () => {
    // @ts-expect-error: This is for testing purposes.
    expect(generateAdNetwork('Yandex')).toBeUndefined()
    expect(generateAdNetwork(undefined)).toBeUndefined()
  })
})

describe('generateRelatedLink', () => {
  it('should generate related link with all properties', () => {
    const value = {
      url: 'https://example.com/news/1',
      img: 'https://example.com/images/1.jpg',
      value: 'First story',
    }
    const expected = {
      '@url': 'https://example.com/news/1',
      '@img': 'https://example.com/images/1.jpg',
      '#text': 'First story',
    }

    expect(generateRelatedLink(value)).toEqual(expected)
  })

  it('should generate related link with only url', () => {
    const value = {
      url: 'https://example.com/news/1',
    }
    const expected = {
      '@url': 'https://example.com/news/1',
    }

    expect(generateRelatedLink(value)).toEqual(expected)
  })

  it('should return undefined for empty object', () => {
    expect(generateRelatedLink({})).toBeUndefined()
  })

  it('should return undefined for non-object inputs', () => {
    // @ts-expect-error: This is for testing purposes.
    expect(generateRelatedLink('https://example.com/news/1')).toBeUndefined()
    expect(generateRelatedLink(undefined)).toBeUndefined()
  })
})

describe('generateRelated', () => {
  it('should generate related with type and links', () => {
    const value = {
      type: 'infinity',
      links: [
        { url: 'https://example.com/news/1', value: 'First story' },
        { url: 'https://example.com/news/2', value: 'Second story' },
      ],
    }
    const expected = {
      '@type': 'infinity',
      link: [
        { '@url': 'https://example.com/news/1', '#text': 'First story' },
        { '@url': 'https://example.com/news/2', '#text': 'Second story' },
      ],
    }

    expect(generateRelated(value)).toEqual(expected)
  })

  it('should return undefined for empty links', () => {
    const value = {
      links: [],
    }

    expect(generateRelated(value)).toBeUndefined()
  })

  it('should return undefined for empty object', () => {
    expect(generateRelated({})).toBeUndefined()
  })

  it('should return undefined for non-object inputs', () => {
    // @ts-expect-error: This is for testing purposes.
    expect(generateRelated([])).toBeUndefined()
    expect(generateRelated(undefined)).toBeUndefined()
  })
})

describe('generateCommentText', () => {
  it('should generate comment text with all properties', () => {
    const value = {
      origin: 'https://example.org/press/disproof/21/',
      originName: 'City Administration',
      logo: 'https://example.org/logo.png',
      anchor: 'comment',
      value: 'More than 4,400 medics have already received payments.',
    }
    const expected = {
      '@origin': 'https://example.org/press/disproof/21/',
      '@origin-name': 'City Administration',
      '@logo': 'https://example.org/logo.png',
      '@anchor': 'comment',
      '#text': 'More than 4,400 medics have already received payments.',
    }

    expect(generateCommentText(value)).toEqual(expected)
  })

  it('should return undefined for empty object', () => {
    expect(generateCommentText({})).toBeUndefined()
  })

  it('should return undefined for non-object inputs', () => {
    // @ts-expect-error: This is for testing purposes.
    expect(generateCommentText('comment')).toBeUndefined()
    expect(generateCommentText(undefined)).toBeUndefined()
  })
})

describe('generateOfficialComment', () => {
  it('should generate official comment with all properties', () => {
    const value = {
      commentText: {
        origin: 'https://example.org/press/disproof/21/',
        value: 'More than 4,400 medics have already received payments.',
      },
      bindTos: ['https://example.com/city/113469', 'https://example.net/2020/08/06/'],
    }
    const expected = {
      'yandex:comment-text': {
        '@origin': 'https://example.org/press/disproof/21/',
        '#text': 'More than 4,400 medics have already received payments.',
      },
      'yandex:bind-to': ['https://example.com/city/113469', 'https://example.net/2020/08/06/'],
    }

    expect(generateOfficialComment(value)).toEqual(expected)
  })

  it('should return undefined for empty object', () => {
    expect(generateOfficialComment({})).toBeUndefined()
  })

  it('should return undefined for non-object inputs', () => {
    // @ts-expect-error: This is for testing purposes.
    expect(generateOfficialComment('comment')).toBeUndefined()
    expect(generateOfficialComment(undefined)).toBeUndefined()
  })
})

describe('generateFeed', () => {
  it('should generate feed with all properties', () => {
    const value = {
      logos: [
        { value: 'https://example.com/yandexlogo.png' },
        { type: 'square', value: 'https://example.com/yandexsquarelogo.png' },
      ],
      analytics: [{ type: 'Yandex', id: '12345678' }, { type: 'LiveInternet' }],
      adNetworks: [{ type: 'Yandex', id: 'R-A-123456-1', turboAdId: 'first_ad_place' }],
    }
    const expected = {
      'yandex:logo': [
        { '#text': 'https://example.com/yandexlogo.png' },
        { '@type': 'square', '#text': 'https://example.com/yandexsquarelogo.png' },
      ],
      'yandex:analytics': [{ '@type': 'Yandex', '@id': '12345678' }, { '@type': 'LiveInternet' }],
      'yandex:adNetwork': [
        { '@type': 'Yandex', '@id': 'R-A-123456-1', '@turbo-ad-id': 'first_ad_place' },
      ],
    }

    expect(generateFeed(value)).toEqual(expected)
  })

  it('should generate feed with only analytics', () => {
    const value = {
      analytics: [{ type: 'Yandex', id: '12345678' }],
    }
    const expected = {
      'yandex:analytics': [{ '@type': 'Yandex', '@id': '12345678' }],
    }

    expect(generateFeed(value)).toEqual(expected)
  })

  it('should return undefined for empty object', () => {
    expect(generateFeed({})).toBeUndefined()
  })

  it('should return undefined for non-object inputs', () => {
    // @ts-expect-error: This is for testing purposes.
    expect(generateFeed('feed')).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generateFeed(123)).toBeUndefined()
    expect(generateFeed(undefined)).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generateFeed(null)).toBeUndefined()
  })
})

describe('generateItem', () => {
  it('should generate item with all properties', () => {
    const value = {
      fullText: 'The city council approved the budget on Tuesday.',
      genre: 'message',
      themeTags: ['krasnodar', 'selskoe_khozyaystvo'],
      related: {
        links: [{ url: 'https://example.com/news/1', value: 'First story' }],
      },
      online: 'https://example.com/translation.xml',
      tags: ['budget', 'council'],
      officialComment: {
        bindTos: ['https://example.com/city/113469'],
      },
    }
    const expected = {
      'yandex:full-text': 'The city council approved the budget on Tuesday.',
      'yandex:genre': 'message',
      'yandex:theme_tags': ['krasnodar', 'selskoe_khozyaystvo'],
      'yandex:related': {
        link: [{ '@url': 'https://example.com/news/1', '#text': 'First story' }],
      },
      'yandex:online': 'https://example.com/translation.xml',
      'yandex:tags': ['budget', 'council'],
      'yandex:official-comment': {
        'yandex:bind-to': ['https://example.com/city/113469'],
      },
    }

    expect(generateItem(value)).toEqual(expected)
  })

  it('should generate item with only full text', () => {
    const value = {
      fullText: 'The city council approved the budget on Tuesday.',
    }
    const expected = {
      'yandex:full-text': 'The city council approved the budget on Tuesday.',
    }

    expect(generateItem(value)).toEqual(expected)
  })

  it('should keep HTML in full text inside CDATA', () => {
    const value = {
      fullText: '<p>Bread &amp; butter prices rose.</p>',
    }
    const expected = {
      'yandex:full-text': { '#cdata': '<p>Bread &amp; butter prices rose.</p>' },
    }

    expect(generateItem(value)).toEqual(expected)
  })

  it('should return undefined for empty and whitespace-only strings', () => {
    const value = {
      fullText: '',
      genre: '   ',
    }

    expect(generateItem(value)).toBeUndefined()
  })

  it('should return undefined for empty object', () => {
    expect(generateItem({})).toBeUndefined()
  })

  it('should return undefined for non-object inputs', () => {
    // @ts-expect-error: This is for testing purposes.
    expect(generateItem('item')).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generateItem([])).toBeUndefined()
    expect(generateItem(undefined)).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generateItem(null)).toBeUndefined()
  })
})
