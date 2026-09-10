import { describe, expect, it } from 'bun:test'
import { detect } from './index.js'

describe('detect', () => {
  it('should detect transcripts with version string', () => {
    const value = {
      version: '1.0.0',
      segments: [{ speaker: 'Host', startTime: 0, body: 'Hello' }],
    }

    expect(detect(value)).toBe(true)
  })

  it('should detect transcripts with version 1.0.0', () => {
    const value = {
      version: '1.0.0',
      segments: [{ speaker: 'Host', startTime: 0, body: 'Hello' }],
    }

    expect(detect(value)).toBe(true)
  })

  it('should detect transcripts with version 1.1.0', () => {
    const value = {
      version: '1.1.0',
      segments: [{ speaker: 'Host', startTime: 0, body: 'Hello' }],
    }

    expect(detect(value)).toBe(true)
  })

  it('should detect transcripts without version but with valid segments array', () => {
    const value = {
      segments: [{ speaker: 'Host', startTime: 0, body: 'Welcome to the show' }],
    }

    expect(detect(value)).toBe(true)
  })

  it('should detect transcripts from JSON string', () => {
    const value = JSON.stringify({
      version: '1.0.0',
      segments: [{ speaker: 'Host', startTime: 0, body: 'Hello' }],
    })

    expect(detect(value)).toBe(true)
  })

  it('should detect transcripts from JSON string with whitespace', () => {
    const json = JSON.stringify({
      version: '1.0.0',
      segments: [{ speaker: 'Host', startTime: 0, body: 'Hello' }],
    })
    const value = `  ${json}  `

    expect(detect(value)).toBe(true)
  })

  it('should not detect empty object', () => {
    const value = {}

    expect(detect(value)).toBe(false)
  })

  it('should not detect object with empty segments array', () => {
    const value = {
      segments: [],
    }

    expect(detect(value)).toBe(false)
  })

  it('should not detect transcripts without startTime', () => {
    const value = {
      segments: [{ speaker: 'Host', body: 'Hello' }],
    }

    expect(detect(value)).toBe(false)
  })

  it('should not detect transcripts without speaker', () => {
    const value = {
      segments: [{ startTime: 0, body: 'Hello' }],
    }

    expect(detect(value)).toBe(false)
  })

  it('should not detect transcripts without body', () => {
    const value = {
      segments: [{ speaker: 'Host', startTime: 0 }],
    }

    expect(detect(value)).toBe(false)
  })

  it('should not detect transcripts with non-number startTime', () => {
    const value = {
      segments: [{ speaker: 'Host', startTime: '0', body: 'Hello' }],
    }

    expect(detect(value)).toBe(false)
  })

  it('should not detect JSON Feed', () => {
    const value = {
      version: 'https://jsonfeed.org/version/1.1',
      title: 'My Feed',
      items: [],
    }

    expect(detect(value)).toBe(false)
  })

  it('should detect document with version 1.x even if it has chapters array', () => {
    const value = {
      version: '1.2.0',
      chapters: [{ startTime: 0, title: 'Introduction' }],
    }

    expect(detect(value)).toBe(true)
  })

  it('should not detect invalid JSON string', () => {
    const value = 'not valid json'

    expect(detect(value)).toBe(false)
  })

  it('should not detect null', () => {
    expect(detect(null)).toBe(false)
  })

  it('should not detect undefined', () => {
    expect(detect(undefined)).toBe(false)
  })

  it('should not detect number', () => {
    expect(detect(123)).toBe(false)
  })

  it('should not detect array', () => {
    expect(detect([])).toBe(false)
  })

  it('should not detect empty string', () => {
    expect(detect('')).toBe(false)
  })

  it('should return false for generic object', () => {
    const genericObj = {
      name: 'John',
      age: 30,
      city: 'New York',
    }

    expect(detect(genericObj)).toBe(false)
  })

  it('should detect document with only version', () => {
    const value = {
      version: '1.0.0',
    }

    expect(detect(value)).toBe(true)
  })

  it('should return false for JSON string with non-transcripts structure', () => {
    const json = JSON.stringify({
      title: 'Just a title',
      description: 'Some description',
    })

    expect(detect(json)).toBe(false)
  })

  it('should return false for object with wrong version format', () => {
    const value = {
      version: '2.0',
      segments: [{ speaker: 'Host', startTime: 0, body: 'Hello' }],
    }

    expect(detect(value)).toBe(false)
  })
})

describe('case insensitive detection', () => {
  it('should detect transcripts with uppercase VERSION', () => {
    const value = {
      VERSION: '1.0.0',
      segments: [{ speaker: 'Host', startTime: 0, body: 'Hello' }],
    }

    expect(detect(value)).toBe(true)
  })

  it('should detect transcripts with uppercase SEGMENTS', () => {
    const value = {
      SEGMENTS: [{ speaker: 'Host', startTime: 0, body: 'Hello' }],
    }

    expect(detect(value)).toBe(true)
  })

  it('should detect transcripts with uppercase STARTTIME', () => {
    const value = {
      segments: [{ speaker: 'Host', STARTTIME: 0, body: 'Hello' }],
    }

    expect(detect(value)).toBe(true)
  })

  it('should detect transcripts with uppercase SPEAKER', () => {
    const value = {
      segments: [{ SPEAKER: 'Host', startTime: 0, body: 'Hello' }],
    }

    expect(detect(value)).toBe(true)
  })

  it('should detect transcripts with uppercase BODY', () => {
    const value = {
      segments: [{ speaker: 'Host', startTime: 0, BODY: 'Hello' }],
    }

    expect(detect(value)).toBe(true)
  })

  it('should detect transcripts with mixed case properties', () => {
    const value = {
      Version: '1.0.0',
      Segments: [{ Speaker: 'Host', StartTime: 0, Body: 'Hello' }],
    }

    expect(detect(value)).toBe(true)
  })

  it('should detect transcripts with all uppercase properties', () => {
    const value = {
      VERSION: '1.0.0',
      SEGMENTS: [{ SPEAKER: 'Host', STARTTIME: 0, BODY: 'Hello' }],
    }

    expect(detect(value)).toBe(true)
  })
})
