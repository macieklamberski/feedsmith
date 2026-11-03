import { describe, expect, it } from 'bun:test'
import {
  parseAdNetwork,
  parseAnalytics,
  parseCommentText,
  parseLogo,
  parseOfficialComment,
  parseRelated,
  parseRelatedLink,
  retrieveFeed,
  retrieveItem,
} from './utils.js'

describe('parseLogo', () => {
  it('should parse logo with type', () => {
    const value = {
      '@type': 'square',
      '#text': 'https://example.com/yandexsquarelogo.png',
    }
    const expected = {
      type: 'square',
      value: 'https://example.com/yandexsquarelogo.png',
    }

    expect(parseLogo(value)).toEqual(expected)
  })

  it('should parse logo written as bare text', () => {
    const value = 'https://example.com/yandexlogo.png'
    const expected = {
      value: 'https://example.com/yandexlogo.png',
    }

    expect(parseLogo(value)).toEqual(expected)
  })

  it('should handle HTML entities in text content', () => {
    const value = 'https://example.com/logo.png?w=180&amp;h=180'
    const expected = {
      value: 'https://example.com/logo.png?w=180&h=180',
    }

    expect(parseLogo(value)).toEqual(expected)
  })

  it('should return undefined for empty object', () => {
    expect(parseLogo({})).toBeUndefined()
  })

  it('should return undefined for whitespace-only text', () => {
    expect(parseLogo('   ')).toBeUndefined()
  })

  it('should return undefined for undefined and null', () => {
    expect(parseLogo(undefined)).toBeUndefined()
    expect(parseLogo(null)).toBeUndefined()
  })
})

describe('parseAnalytics', () => {
  it('should parse analytics with all properties', () => {
    const value = {
      '@type': 'custom',
      '@id': '12345678',
      '@params': '{ "section": "news" }',
      '@url': 'https://example.com/counter/{random}',
    }
    const expected = {
      type: 'custom',
      id: '12345678',
      params: '{ "section": "news" }',
      url: 'https://example.com/counter/{random}',
    }

    expect(parseAnalytics(value)).toEqual(expected)
  })

  it('should parse analytics with only type and id', () => {
    const value = {
      '@type': 'Yandex',
      '@id': '12345678',
    }
    const expected = {
      type: 'Yandex',
      id: '12345678',
    }

    expect(parseAnalytics(value)).toEqual(expected)
  })

  it('should handle HTML entities in attributes', () => {
    const value = {
      '@type': 'custom',
      '@url': 'https://example.com/counter?a=1&amp;b=2',
    }
    const expected = {
      type: 'custom',
      url: 'https://example.com/counter?a=1&b=2',
    }

    expect(parseAnalytics(value)).toEqual(expected)
  })

  it('should return undefined for empty object', () => {
    expect(parseAnalytics({})).toBeUndefined()
  })

  it('should return undefined for whitespace-only attributes', () => {
    const value = {
      '@type': '   ',
      '@id': '\t\n',
    }

    expect(parseAnalytics(value)).toBeUndefined()
  })

  it('should return undefined for non-object input', () => {
    expect(parseAnalytics('Yandex')).toBeUndefined()
    expect(parseAnalytics(undefined)).toBeUndefined()
    expect(parseAnalytics(null)).toBeUndefined()
    expect(parseAnalytics([])).toBeUndefined()
  })
})

describe('parseAdNetwork', () => {
  it('should parse ad network with all properties', () => {
    const value = {
      '@type': 'AdFox',
      '@id': 'R-A-123456-1',
      '@turbo-ad-id': 'first_ad_place',
      '#text': '<div id="adfox_1"></div>',
    }
    const expected = {
      type: 'AdFox',
      id: 'R-A-123456-1',
      turboAdId: 'first_ad_place',
      value: '<div id="adfox_1"></div>',
    }

    expect(parseAdNetwork(value)).toEqual(expected)
  })

  it('should parse ad network with only attributes', () => {
    const value = {
      '@type': 'Yandex',
      '@id': 'R-A-123456-1',
    }
    const expected = {
      type: 'Yandex',
      id: 'R-A-123456-1',
    }

    expect(parseAdNetwork(value)).toEqual(expected)
  })

  it('should handle CDATA in text content', () => {
    const value = {
      '@type': 'AdFox',
      '#text': '<![CDATA[<div id="adfox_1"></div>]]>',
    }
    const expected = {
      type: 'AdFox',
      value: '<div id="adfox_1"></div>',
    }

    expect(parseAdNetwork(value)).toEqual(expected)
  })

  it('should return undefined for empty object', () => {
    expect(parseAdNetwork({})).toBeUndefined()
  })

  it('should return undefined for non-object input', () => {
    expect(parseAdNetwork('Yandex')).toBeUndefined()
    expect(parseAdNetwork(undefined)).toBeUndefined()
    expect(parseAdNetwork(null)).toBeUndefined()
  })
})

describe('parseRelatedLink', () => {
  it('should parse related link with all properties', () => {
    const value = {
      '@url': 'https://example.com/news/2024/05/12/budget.html',
      '@img': 'https://example.com/images/budget.jpg',
      '#text': 'Budget passes second reading',
    }
    const expected = {
      url: 'https://example.com/news/2024/05/12/budget.html',
      img: 'https://example.com/images/budget.jpg',
      value: 'Budget passes second reading',
    }

    expect(parseRelatedLink(value)).toEqual(expected)
  })

  it('should parse related link with only url', () => {
    const value = {
      '@url': 'https://example.com/news/2024/05/12/budget.html',
    }
    const expected = {
      url: 'https://example.com/news/2024/05/12/budget.html',
    }

    expect(parseRelatedLink(value)).toEqual(expected)
  })

  it('should handle HTML entities in text content', () => {
    const value = {
      '@url': 'https://example.com/news/1',
      '#text': 'Bread &amp; butter prices',
    }
    const expected = {
      url: 'https://example.com/news/1',
      value: 'Bread & butter prices',
    }

    expect(parseRelatedLink(value)).toEqual(expected)
  })

  it('should return undefined for empty object', () => {
    expect(parseRelatedLink({})).toBeUndefined()
  })

  it('should return undefined for non-object input', () => {
    expect(parseRelatedLink('https://example.com/news/1')).toBeUndefined()
    expect(parseRelatedLink(undefined)).toBeUndefined()
    expect(parseRelatedLink(null)).toBeUndefined()
  })
})

describe('parseRelated', () => {
  it('should parse related with type and links', () => {
    const value = {
      '@type': 'infinity',
      link: [
        { '@url': 'https://example.com/news/1', '#text': 'First story' },
        { '@url': 'https://example.com/news/2', '#text': 'Second story' },
      ],
    }
    const expected = {
      type: 'infinity',
      links: [
        { url: 'https://example.com/news/1', value: 'First story' },
        { url: 'https://example.com/news/2', value: 'Second story' },
      ],
    }

    expect(parseRelated(value)).toEqual(expected)
  })

  it('should parse related with a single link', () => {
    const value = {
      link: { '@url': 'https://example.com/news/1', '#text': 'First story' },
    }
    const expected = {
      links: [{ url: 'https://example.com/news/1', value: 'First story' }],
    }

    expect(parseRelated(value)).toEqual(expected)
  })

  it('should skip links without content', () => {
    const value = {
      link: [{}, { '@url': 'https://example.com/news/1' }],
    }
    const expected = {
      links: [{ url: 'https://example.com/news/1' }],
    }

    expect(parseRelated(value)).toEqual(expected)
  })

  it('should return undefined for empty object', () => {
    expect(parseRelated({})).toBeUndefined()
  })

  it('should return undefined for non-object input', () => {
    expect(parseRelated('https://example.com/news/1')).toBeUndefined()
    expect(parseRelated(undefined)).toBeUndefined()
    expect(parseRelated(null)).toBeUndefined()
  })
})

describe('parseCommentText', () => {
  it('should parse comment text with all properties', () => {
    const value = {
      '@origin': 'https://example.org/press/disproof/21/',
      '@origin-name': 'City Administration',
      '@logo': 'https://example.org/logo.png',
      '@anchor': 'comment',
      '#text': 'More than 4,400 medics have already received payments.',
    }
    const expected = {
      origin: 'https://example.org/press/disproof/21/',
      originName: 'City Administration',
      logo: 'https://example.org/logo.png',
      anchor: 'comment',
      value: 'More than 4,400 medics have already received payments.',
    }

    expect(parseCommentText(value)).toEqual(expected)
  })

  it('should parse comment text with only text', () => {
    const value = {
      '#text': 'More than 4,400 medics have already received payments.',
    }
    const expected = {
      value: 'More than 4,400 medics have already received payments.',
    }

    expect(parseCommentText(value)).toEqual(expected)
  })

  it('should parse comment text written as bare text', () => {
    const value = 'More than 4,400 medics have already received payments.'
    const expected = {
      value: 'More than 4,400 medics have already received payments.',
    }

    expect(parseCommentText(value)).toEqual(expected)
  })

  it('should return undefined for empty object', () => {
    expect(parseCommentText({})).toBeUndefined()
  })

  it('should return undefined for non-object input', () => {
    expect(parseCommentText(undefined)).toBeUndefined()
    expect(parseCommentText(null)).toBeUndefined()
  })
})

describe('parseOfficialComment', () => {
  it('should parse official comment with all properties', () => {
    const value = {
      'yandex:comment-text': {
        '@origin': 'https://example.org/press/disproof/21/',
        '#text': 'More than 4,400 medics have already received payments.',
      },
      'yandex:bind-to': ['https://example.com/city/113469', 'https://example.net/2020/08/06/'],
    }
    const expected = {
      commentText: {
        origin: 'https://example.org/press/disproof/21/',
        value: 'More than 4,400 medics have already received payments.',
      },
      bindTos: ['https://example.com/city/113469', 'https://example.net/2020/08/06/'],
    }

    expect(parseOfficialComment(value)).toEqual(expected)
  })

  it('should parse official comment with a single bind-to', () => {
    const value = {
      'yandex:bind-to': 'https://example.com/city/113469',
    }
    const expected = {
      bindTos: ['https://example.com/city/113469'],
    }

    expect(parseOfficialComment(value)).toEqual(expected)
  })

  it('should return undefined for empty object', () => {
    expect(parseOfficialComment({})).toBeUndefined()
  })

  it('should return undefined for non-object input', () => {
    expect(parseOfficialComment('comment')).toBeUndefined()
    expect(parseOfficialComment(undefined)).toBeUndefined()
    expect(parseOfficialComment(null)).toBeUndefined()
  })
})

describe('retrieveFeed', () => {
  it('should parse all feed properties', () => {
    const value = {
      'yandex:logo': [
        'https://example.com/yandexlogo.png',
        { '@type': 'square', '#text': 'https://example.com/yandexsquarelogo.png' },
      ],
      'yandex:analytics': [{ '@type': 'Yandex', '@id': '12345678' }, { '@type': 'LiveInternet' }],
      'yandex:adnetwork': {
        '@type': 'Yandex',
        '@id': 'R-A-123456-1',
        '@turbo-ad-id': 'first_ad_place',
      },
    }
    const expected = {
      logos: [
        { value: 'https://example.com/yandexlogo.png' },
        { type: 'square', value: 'https://example.com/yandexsquarelogo.png' },
      ],
      analytics: [{ type: 'Yandex', id: '12345678' }, { type: 'LiveInternet' }],
      adNetworks: [{ type: 'Yandex', id: 'R-A-123456-1', turboAdId: 'first_ad_place' }],
    }

    expect(retrieveFeed(value)).toEqual(expected)
  })

  it('should parse feed with only analytics', () => {
    const value = {
      'yandex:analytics': { '@type': 'Yandex', '@id': '12345678' },
    }
    const expected = {
      analytics: [{ type: 'Yandex', id: '12345678' }],
    }

    expect(retrieveFeed(value)).toEqual(expected)
  })

  it('should return undefined when no yandex properties are present', () => {
    const value = {
      title: 'Example News',
    }

    expect(retrieveFeed(value)).toBeUndefined()
  })

  it('should return undefined for non-object input', () => {
    expect(retrieveFeed(null)).toBeUndefined()
    expect(retrieveFeed(undefined)).toBeUndefined()
    expect(retrieveFeed('string')).toBeUndefined()
    expect(retrieveFeed(123)).toBeUndefined()
    expect(retrieveFeed([])).toBeUndefined()
  })
})

describe('retrieveItem', () => {
  it('should parse all item properties', () => {
    const value = {
      'yandex:full-text': { '#text': 'The city council approved the budget on Tuesday.' },
      'yandex:genre': { '#text': 'message' },
      'yandex:theme_tags': [{ '#text': 'krasnodar' }, { '#text': 'selskoe_khozyaystvo' }],
      'yandex:related': {
        link: { '@url': 'https://example.com/news/1', '#text': 'First story' },
      },
      'yandex:online': { '#text': 'https://example.com/translation.xml' },
      'yandex:tags': [{ '#text': 'budget' }, { '#text': 'council' }],
      'yandex:official-comment': {
        'yandex:bind-to': 'https://example.com/city/113469',
      },
    }
    const expected = {
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

    expect(retrieveItem(value)).toEqual(expected)
  })

  it('should parse item with only full text', () => {
    const value = {
      'yandex:full-text': 'The city council approved the budget on Tuesday.',
    }
    const expected = {
      fullText: 'The city council approved the budget on Tuesday.',
    }

    expect(retrieveItem(value)).toEqual(expected)
  })

  it('should parse full text from CDATA', () => {
    const value = {
      'yandex:full-text': {
        '#text': '<![CDATA[<p>The city council approved the budget.</p>]]>',
      },
    }
    const expected = {
      fullText: '<p>The city council approved the budget.</p>',
    }

    expect(retrieveItem(value)).toEqual(expected)
  })

  it('should handle HTML entities in full text', () => {
    const value = {
      'yandex:full-text': { '#text': 'Bread &amp; butter prices rose.' },
    }
    const expected = {
      fullText: 'Bread & butter prices rose.',
    }

    expect(retrieveItem(value)).toEqual(expected)
  })

  it('should use the first genre when repeated', () => {
    const value = {
      'yandex:genre': ['article', 'message'],
    }
    const expected = {
      genre: 'article',
    }

    expect(retrieveItem(value)).toEqual(expected)
  })

  it('should skip empty and whitespace-only values', () => {
    const value = {
      'yandex:full-text': { '#text': '' },
      'yandex:genre': { '#text': '   ' },
    }

    expect(retrieveItem(value)).toBeUndefined()
  })

  it('should return undefined when no yandex properties are present', () => {
    const value = {
      title: 'Council approves budget',
    }

    expect(retrieveItem(value)).toBeUndefined()
  })

  it('should return undefined for non-object input', () => {
    expect(retrieveItem(null)).toBeUndefined()
    expect(retrieveItem(undefined)).toBeUndefined()
    expect(retrieveItem('string')).toBeUndefined()
    expect(retrieveItem(123)).toBeUndefined()
    expect(retrieveItem([])).toBeUndefined()
  })
})
