import { describe, expect, it } from 'bun:test'
import { retrieveFeed } from './utils.js'

describe('retrieveFeed', () => {
  it('should parse adultContent (with #text)', () => {
    const value = {
      'blogger:adultcontent': { '#text': 'true' },
    }
    const expected = {
      adultContent: true,
    }

    expect(retrieveFeed(value)).toEqual(expected)
  })

  it('should parse adultContent (without #text)', () => {
    const value = {
      'blogger:adultcontent': 'true',
    }
    const expected = {
      adultContent: true,
    }

    expect(retrieveFeed(value)).toEqual(expected)
  })

  it('should parse adultContent set to false', () => {
    const value = {
      'blogger:adultcontent': 'false',
    }
    const expected = {
      adultContent: false,
    }

    expect(retrieveFeed(value)).toEqual(expected)
  })

  it('should parse the first adultContent from an array', () => {
    const value = {
      'blogger:adultcontent': ['true', 'false'],
    }
    const expected = {
      adultContent: true,
    }

    expect(retrieveFeed(value)).toEqual(expected)
  })

  it('should parse adultContent wrapped in CDATA', () => {
    const value = {
      'blogger:adultcontent': { '#text': '<![CDATA[true]]>' },
    }
    const expected = {
      adultContent: true,
    }

    expect(retrieveFeed(value)).toEqual(expected)
  })

  it('should return undefined for empty adultContent', () => {
    const value = {
      'blogger:adultcontent': '',
    }

    expect(retrieveFeed(value)).toBeUndefined()
  })

  it('should return undefined for whitespace-only adultContent', () => {
    const value = {
      'blogger:adultcontent': '   ',
    }

    expect(retrieveFeed(value)).toBeUndefined()
  })

  it('should return undefined for adultContent without #text', () => {
    const value = {
      'blogger:adultcontent': {},
    }

    expect(retrieveFeed(value)).toBeUndefined()
  })

  it('should return undefined when no blogger properties exist', () => {
    const value = {
      title: 'Example Blog',
    }

    expect(retrieveFeed(value)).toBeUndefined()
  })

  it('should return undefined for empty object', () => {
    expect(retrieveFeed({})).toBeUndefined()
  })

  it('should return undefined for non-object inputs', () => {
    expect(retrieveFeed('true')).toBeUndefined()
    expect(retrieveFeed(123)).toBeUndefined()
    expect(retrieveFeed(null)).toBeUndefined()
    expect(retrieveFeed(undefined)).toBeUndefined()
  })

  it('should return undefined for array input', () => {
    const value = [{ 'blogger:adultcontent': 'true' }]

    expect(retrieveFeed(value)).toBeUndefined()
  })
})
