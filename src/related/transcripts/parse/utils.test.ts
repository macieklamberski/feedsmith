import { describe, expect, it } from 'bun:test'
import { parseDocument, parseSegment } from './utils.js'

describe('parseSegment', () => {
  it('should parse segment with all properties', () => {
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

    expect(parseSegment(value)).toEqual(expected)
  })

  it('should parse segment with only required properties', () => {
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

    expect(parseSegment(value)).toEqual(expected)
  })

  it('should handle startTime as string number', () => {
    const value = {
      speaker: 'Host',
      startTime: '90.5',
      body: 'Some text',
    }
    const expected = {
      speaker: 'Host',
      startTime: 90.5,
      body: 'Some text',
    }

    expect(parseSegment(value)).toEqual(expected)
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

    expect(parseSegment(value)).toEqual(expected)
  })

  it('should handle zero startTime', () => {
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

    expect(parseSegment(value)).toEqual(expected)
  })

  it('should handle empty strings', () => {
    const value = {
      speaker: 'Host',
      startTime: 0,
      body: '',
    }
    const expected = {
      speaker: 'Host',
      startTime: 0,
    }

    expect(parseSegment(value)).toEqual(expected)
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

    expect(parseSegment(value)).toEqual(expected)
  })

  it('should return undefined for empty object', () => {
    const value = {}

    expect(parseSegment(value)).toBeUndefined()
  })

  it('should return undefined for non-object inputs', () => {
    expect(parseSegment(null)).toBeUndefined()
    expect(parseSegment(undefined)).toBeUndefined()
    expect(parseSegment('string')).toBeUndefined()
    expect(parseSegment(123)).toBeUndefined()
  })
})

describe('parseDocument', () => {
  const expectedFull = {
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

  it('should parse document with all properties', () => {
    const value = {
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

    expect(parseDocument(value)).toEqual(expectedFull)
  })

  it('should parse document with minimal segment', () => {
    const value = {
      version: '1.0.0',
      segments: [{ speaker: 'Host', startTime: 0, body: 'Hello' }],
    }
    const expected = {
      version: '1.0.0',
      segments: [{ speaker: 'Host', startTime: 0, body: 'Hello' }],
    }

    expect(parseDocument(value)).toEqual(expected)
  })

  it('should handle coercible values', () => {
    const value = {
      version: '1.0.0',
      segments: [{ speaker: 'Host', startTime: '0', body: 'Text' }],
    }
    const expected = {
      version: '1.0.0',
      segments: [{ speaker: 'Host', startTime: 0, body: 'Text' }],
    }

    expect(parseDocument(value)).toEqual(expected)
  })

  it('should handle empty segments array', () => {
    const value = {
      version: '1.0.0',
      segments: [],
    }
    const expected = {
      version: '1.0.0',
    }

    expect(parseDocument(value)).toEqual(expected)
  })

  it('should handle empty strings', () => {
    const value = {
      version: '',
      segments: [{ speaker: 'Host', startTime: 0, body: 'Text' }],
    }
    const expected = {
      segments: [{ speaker: 'Host', startTime: 0, body: 'Text' }],
    }

    expect(parseDocument(value)).toEqual(expected)
  })

  it('should handle whitespace-only strings', () => {
    const value = {
      version: '   ',
      segments: [],
    }

    expect(parseDocument(value)).toBeUndefined()
  })

  it('should return undefined for empty object', () => {
    const value = {}

    expect(parseDocument(value)).toBeUndefined()
  })

  it('should return undefined for non-object inputs', () => {
    expect(parseDocument(null)).toBeUndefined()
    expect(parseDocument(undefined)).toBeUndefined()
    expect(parseDocument('string')).toBeUndefined()
    expect(parseDocument(123)).toBeUndefined()
  })
})

describe('case insensitive parsing', () => {
  it('should parse document with uppercase property names', () => {
    const value = {
      VERSION: '1.0.0',
      SEGMENTS: [{ SPEAKER: 'Host', STARTTIME: 0, BODY: 'Hello' }],
    }
    const expected = {
      version: '1.0.0',
      segments: [{ speaker: 'Host', startTime: 0, body: 'Hello' }],
    }

    expect(parseDocument(value)).toEqual(expected)
  })

  it('should parse document with mixed case property names', () => {
    const value = {
      Version: '1.0.0',
      Segments: [{ Speaker: 'Host', StartTime: 0, Body: 'Hello' }],
    }
    const expected = {
      version: '1.0.0',
      segments: [{ speaker: 'Host', startTime: 0, body: 'Hello' }],
    }

    expect(parseDocument(value)).toEqual(expected)
  })

  it('should parse segment with uppercase property names', () => {
    const value = {
      SPEAKER: 'Host',
      STARTTIME: 0,
      BODY: 'Welcome',
      ENDTIME: 5.5,
    }
    const expected = {
      speaker: 'Host',
      startTime: 0,
      body: 'Welcome',
      endTime: 5.5,
    }

    expect(parseSegment(value)).toEqual(expected)
  })

  it('should prefer exact case match over case-insensitive match', () => {
    const value = {
      speaker: 'Correct',
      SPEAKER: 'Wrong',
      startTime: 0,
      STARTTIME: 999,
      body: 'Right',
      BODY: 'Wrong',
    }
    const expected = {
      speaker: 'Correct',
      startTime: 0,
      body: 'Right',
    }

    expect(parseSegment(value)).toEqual(expected)
  })
})
