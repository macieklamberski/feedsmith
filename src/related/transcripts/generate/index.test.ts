import { describe, expect, it } from 'bun:test'
import { generate } from './index.js'

describe('generate', () => {
  it('should generate transcripts document', () => {
    const value = {
      segments: [
        {
          speaker: 'Host',
          startTime: 0,
          body: 'Welcome to the show!',
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
        },
        {
          speaker: 'Guest',
          startTime: 5.5,
          body: 'Thanks for having me.',
        },
      ],
    }

    expect(generate(value)).toEqual(expected)
  })

  it('should generate transcripts with all properties', () => {
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
          endTime: 10.2,
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
          endTime: 10.2,
        },
      ],
    }

    expect(generate(value)).toEqual(expected)
  })

  it('should generate minimal transcripts document', () => {
    const value = {
      segments: [{ speaker: 'Host', startTime: 0, body: 'Hello' }],
    }
    const expected = {
      version: '1.0.0',
      segments: [{ speaker: 'Host', startTime: 0, body: 'Hello' }],
    }

    expect(generate(value)).toEqual(expected)
  })

  it('should generate transcripts with floating point times', () => {
    const value = {
      segments: [{ speaker: 'Host', startTime: 10.5, body: 'Text', endTime: 20.75 }],
    }
    const expected = {
      version: '1.0.0',
      segments: [{ speaker: 'Host', startTime: 10.5, body: 'Text', endTime: 20.75 }],
    }

    expect(generate(value)).toEqual(expected)
  })

  it('should generate document with empty object', () => {
    const value = {}
    const expected = {
      version: '1.0.0',
    }

    expect(generate(value)).toEqual(expected)
  })

  it('should generate document with missing segments (lenient)', () => {
    const value = {}
    const expected = {
      version: '1.0.0',
    }

    expect(generate(value)).toEqual(expected)
  })

  it('should generate document with empty segments array (lenient)', () => {
    const value = {
      segments: [],
    }
    const expected = {
      version: '1.0.0',
    }

    expect(generate(value)).toEqual(expected)
  })
})

describe('strict mode', () => {
  it('should require segments in strict mode', () => {
    // @ts-expect-error: This is for testing purposes.
    generate({}, { strict: true })
  })

  it('should accept document with all required fields in strict mode', () => {
    generate(
      { version: '1.0.0', segments: [{ speaker: 'Host', startTime: 0, body: 'Hello' }] },
      { strict: true },
    )
  })

  it('should require segment speaker, startTime, and body in strict mode', () => {
    generate(
      {
        version: '1.0.0',
        // @ts-expect-error: This is for testing purposes.
        segments: [{ startTime: 0 }],
      },
      { strict: true },
    )
  })

  it('should accept segment with all required fields in strict mode', () => {
    generate(
      {
        version: '1.0.0',
        segments: [{ speaker: 'Host', startTime: 0, body: 'Hello' }],
      },
      { strict: true },
    )
  })

  it('should accept partial document in lenient mode', () => {
    generate({})
  })
})

describe('generate edge cases', () => {
  it('should accept partial documents', () => {
    const value = {}
    const expected = {
      version: '1.0.0',
    }

    expect(generate(value)).toEqual(expected)
  })

  it('should handle zero startTime', () => {
    const value = {
      segments: [{ speaker: 'Host', startTime: 0, body: 'First' }],
    }
    const expected = {
      version: '1.0.0',
      segments: [{ speaker: 'Host', startTime: 0, body: 'First' }],
    }

    expect(generate(value)).toEqual(expected)
  })

  it('should handle multiple segments', () => {
    const value = {
      segments: [
        { speaker: 'Host', startTime: 0, body: 'Hello' },
        { speaker: 'Guest', startTime: 5, body: 'Hi there' },
        { speaker: 'Host', startTime: 10, body: 'Welcome' },
      ],
    }
    const expected = {
      version: '1.0.0',
      segments: [
        { speaker: 'Host', startTime: 0, body: 'Hello' },
        { speaker: 'Guest', startTime: 5, body: 'Hi there' },
        { speaker: 'Host', startTime: 10, body: 'Welcome' },
      ],
    }

    expect(generate(value)).toEqual(expected)
  })
})
