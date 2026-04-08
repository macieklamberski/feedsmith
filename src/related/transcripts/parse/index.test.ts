import { describe, expect, it } from 'bun:test'
import { locales } from '../../../common/config.js'
import { parse } from './index.js'

describe('parse', () => {
  it('should parse valid JSON transcripts string', () => {
    const value = JSON.stringify({
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
    })
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

    expect(parse(value)).toEqual(expected)
  })

  it('should parse already-parsed object', () => {
    const value = {
      version: '1.0.0',
      segments: [
        {
          speaker: 'Host',
          startTime: 0,
          body: 'Welcome to the show!',
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
      ],
    }

    expect(parse(value)).toEqual(expected)
  })

  it('should parse transcripts with all properties', () => {
    const value = JSON.stringify({
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
    })
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

    expect(parse(value)).toEqual(expected)
  })

  it('should parse minimal valid transcripts document', () => {
    const value = JSON.stringify({
      version: '1.0.0',
      segments: [{ speaker: 'Host', startTime: 0, body: 'Hello' }],
    })
    const expected = {
      version: '1.0.0',
      segments: [{ speaker: 'Host', startTime: 0, body: 'Hello' }],
    }

    expect(parse(value)).toEqual(expected)
  })

  it('should parse transcripts from string with leading whitespace', () => {
    const json = JSON.stringify({
      version: '1.0.0',
      segments: [{ speaker: 'Host', startTime: 0, body: 'Test' }],
    })
    const value = `  ${json}`
    const expected = {
      version: '1.0.0',
      segments: [{ speaker: 'Host', startTime: 0, body: 'Test' }],
    }

    expect(parse(value)).toEqual(expected)
  })

  it('should parse transcripts from string with trailing whitespace', () => {
    const json = JSON.stringify({
      version: '1.0.0',
      segments: [{ speaker: 'Host', startTime: 0, body: 'Test' }],
    })
    const value = `${json}  `
    const expected = {
      version: '1.0.0',
      segments: [{ speaker: 'Host', startTime: 0, body: 'Test' }],
    }

    expect(parse(value)).toEqual(expected)
  })

  it('should parse transcripts from string with whitespace on both ends', () => {
    const json = JSON.stringify({
      version: '1.0.0',
      segments: [{ speaker: 'Host', startTime: 0, body: 'Test' }],
    })
    const value = `  ${json}  `
    const expected = {
      version: '1.0.0',
      segments: [{ speaker: 'Host', startTime: 0, body: 'Test' }],
    }

    expect(parse(value)).toEqual(expected)
  })

  it('should handle malformed JSON string', () => {
    const value = '{"version":"1.0.0","segments":[{"speaker":"Host"'

    expect(() => parse(value)).toThrowError(locales.invalidInputTranscripts)
  })

  it('should throw error for empty object', () => {
    expect(() => parse({})).toThrowError(locales.invalidInputTranscripts)
  })

  it('should throw error for empty segments array', () => {
    expect(() => parse({ segments: [] })).toThrowError(locales.invalidInputTranscripts)
  })

  it('should throw error for invalid string', () => {
    expect(() => parse('not valid json')).toThrowError(locales.invalidInputTranscripts)
  })

  it('should throw error for null', () => {
    expect(() => parse(null)).toThrowError(locales.invalidInputTranscripts)
  })

  it('should throw error for undefined', () => {
    expect(() => parse(undefined)).toThrowError(locales.invalidInputTranscripts)
  })

  it('should throw error for array', () => {
    expect(() => parse([])).toThrowError(locales.invalidInputTranscripts)
  })

  it('should throw error for number', () => {
    expect(() => parse(123)).toThrowError(locales.invalidInputTranscripts)
  })

  it('should handle case insensitive fields', () => {
    const value = {
      VERSION: '1.0.0',
      SEGMENTS: [{ SPEAKER: 'Host', STARTTIME: 0, BODY: 'Hello' }],
    }
    const expected = {
      version: '1.0.0',
      segments: [{ speaker: 'Host', startTime: 0, body: 'Hello' }],
    }

    expect(parse(value)).toEqual(expected)
  })
})
