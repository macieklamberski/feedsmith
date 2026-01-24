import { describe, expect, it } from 'bun:test'
import { generateDocument, generateSegment } from './utils.js'

describe('generateSegment', () => {
  it('should generate segment with all properties', () => {
    const value = {
      speaker: 'Host',
      startTime: 0,
      body: 'Welcome to the show!',
      endTime: 5.5,
    }
    const expected = {
      speaker: 'Host',
      startTime: 0,
      body: 'Welcome to the show!',
      endTime: 5.5,
    }

    expect(generateSegment(value)).toEqual(expected)
  })

  it('should generate segment with only required properties', () => {
    const value = {
      speaker: 'Guest',
      startTime: 10.5,
      body: 'Thanks for having me.',
    }
    const expected = {
      speaker: 'Guest',
      startTime: 10.5,
      body: 'Thanks for having me.',
    }

    expect(generateSegment(value)).toEqual(expected)
  })

  it('should handle floating point times', () => {
    const value = {
      speaker: 'Host',
      startTime: 10.5,
      body: 'Text',
      endTime: 20.75,
    }
    const expected = {
      speaker: 'Host',
      startTime: 10.5,
      body: 'Text',
      endTime: 20.75,
    }

    expect(generateSegment(value)).toEqual(expected)
  })

  it('should handle startTime of zero', () => {
    const value = {
      speaker: 'Host',
      startTime: 0,
      body: 'First line',
    }
    const expected = {
      speaker: 'Host',
      startTime: 0,
      body: 'First line',
    }

    expect(generateSegment(value)).toEqual(expected)
  })

  it('should handle empty strings', () => {
    const value = {
      speaker: '',
      startTime: 0,
      body: '',
    }
    const expected = {
      startTime: 0,
    }

    expect(generateSegment(value)).toEqual(expected)
  })

  it('should handle whitespace-only strings', () => {
    const value = {
      speaker: '   ',
      startTime: 0,
      body: '   ',
    }
    const expected = {
      startTime: 0,
    }

    expect(generateSegment(value)).toEqual(expected)
  })

  it('should handle empty object', () => {
    expect(generateSegment({})).toBeUndefined()
  })

  it('should handle non-object inputs', () => {
    // @ts-expect-error: This is for testing purposes.
    expect(generateSegment('string')).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generateSegment(123)).toBeUndefined()
    expect(generateSegment(undefined)).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generateSegment(null)).toBeUndefined()
  })
})

describe('generateDocument', () => {
  it('should generate document with all properties', () => {
    const value = {
      segments: [
        {
          speaker: 'Host',
          startTime: 0,
          body: 'Welcome to the show!',
          endTime: 5.5,
        },
        {
          speaker: 'Guest',
          startTime: 5.5,
          body: 'Thanks for having me.',
        },
      ],
    }
    const expected = {
      version: '1.0.0',
      segments: [
        {
          speaker: 'Host',
          startTime: 0,
          body: 'Welcome to the show!',
          endTime: 5.5,
        },
        {
          speaker: 'Guest',
          startTime: 5.5,
          body: 'Thanks for having me.',
        },
      ],
    }

    expect(generateDocument(value)).toEqual(expected)
  })

  it('should generate document with minimal segment', () => {
    const value = {
      segments: [{ speaker: 'Host', startTime: 0, body: 'Hello' }],
    }
    const expected = {
      version: '1.0.0',
      segments: [{ speaker: 'Host', startTime: 0, body: 'Hello' }],
    }

    expect(generateDocument(value)).toEqual(expected)
  })

  it('should handle empty segments array', () => {
    const value = {
      segments: [],
    }
    const expected = {
      version: '1.0.0',
    }

    expect(generateDocument(value)).toEqual(expected)
  })

  it('should handle empty object', () => {
    const expected = {
      version: '1.0.0',
    }

    expect(generateDocument({})).toEqual(expected)
  })

  it('should handle non-object inputs', () => {
    // @ts-expect-error: This is for testing purposes.
    expect(generateDocument('string')).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generateDocument(123)).toBeUndefined()
    expect(generateDocument(undefined)).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generateDocument(null)).toBeUndefined()
  })
})
