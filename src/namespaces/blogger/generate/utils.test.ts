import { describe, expect, it } from 'bun:test'
import { generateFeed } from './utils.js'

describe('generateFeed', () => {
  it('should generate adultContent set to true', () => {
    const value = {
      adultContent: true,
    }
    const expected = {
      'blogger:adultContent': true,
    }

    expect(generateFeed(value)).toEqual(expected)
  })

  it('should generate adultContent set to false', () => {
    const value = {
      adultContent: false,
    }
    const expected = {
      'blogger:adultContent': false,
    }

    expect(generateFeed(value)).toEqual(expected)
  })

  it('should return undefined for undefined adultContent', () => {
    const value = {
      adultContent: undefined,
    }

    expect(generateFeed(value)).toBeUndefined()
  })

  it('should return undefined for non-boolean adultContent', () => {
    const value = {
      adultContent: 'true',
    }

    // @ts-expect-error: This is for testing purposes.
    expect(generateFeed(value)).toBeUndefined()
  })

  it('should return undefined for empty object', () => {
    expect(generateFeed({})).toBeUndefined()
  })

  it('should return undefined for non-object inputs', () => {
    // @ts-expect-error: This is for testing purposes.
    expect(generateFeed('true')).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generateFeed(123)).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generateFeed(null)).toBeUndefined()
    expect(generateFeed(undefined)).toBeUndefined()
  })

  it('should return undefined for array input', () => {
    // @ts-expect-error: This is for testing purposes.
    expect(generateFeed([{ adultContent: true }])).toBeUndefined()
  })
})
