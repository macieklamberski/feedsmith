import { describe, expect, it } from 'bun:test'
import { detect } from './index.js'

describe('detect', () => {
  it('should detect chapters with version string', () => {
    const value = {
      version: '1.2.0',
      chapters: [{ startTime: 0 }],
    }

    expect(detect(value)).toBe(true)
  })

  it('should detect chapters with version 1.0.0', () => {
    const value = {
      version: '1.0.0',
      chapters: [{ startTime: 0 }],
    }

    expect(detect(value)).toBe(true)
  })

  it('should detect chapters with version 1.1.0', () => {
    const value = {
      version: '1.1.0',
      chapters: [{ startTime: 0 }],
    }

    expect(detect(value)).toBe(true)
  })

  it('should detect chapters without version but with valid chapters array', () => {
    const value = {
      chapters: [{ startTime: 0, title: 'Introduction' }],
    }

    expect(detect(value)).toBe(true)
  })

  it('should detect chapters from JSON string', () => {
    const value = JSON.stringify({
      version: '1.2.0',
      chapters: [{ startTime: 0 }],
    })

    expect(detect(value)).toBe(true)
  })

  it('should detect chapters from JSON string with whitespace', () => {
    const json = JSON.stringify({
      version: '1.2.0',
      chapters: [{ startTime: 0 }],
    })
    const value = `  ${json}  `

    expect(detect(value)).toBe(true)
  })

  it('should not detect empty object', () => {
    const value = {}

    expect(detect(value)).toBe(false)
  })

  it('should not detect object with empty chapters array', () => {
    const value = {
      chapters: [],
    }

    expect(detect(value)).toBe(false)
  })

  it('should not detect chapters without startTime', () => {
    const value = {
      chapters: [{ title: 'Introduction' }],
    }

    expect(detect(value)).toBe(false)
  })

  it('should not detect chapters with non-number startTime', () => {
    const value = {
      chapters: [{ startTime: '0' }],
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

  it('should return false for object with only title', () => {
    const value = {
      title: 'Just a title',
    }

    expect(detect(value)).toBe(false)
  })

  it('should return false for JSON string with non-chapters structure', () => {
    const json = JSON.stringify({
      title: 'Just a title',
      description: 'Some description',
    })

    expect(detect(json)).toBe(false)
  })

  it('should return false for object with wrong version format', () => {
    const value = {
      version: '2.0',
      chapters: [{ startTime: 0 }],
    }

    expect(detect(value)).toBe(false)
  })
})

describe('case insensitive detection', () => {
  it('should detect chapters with uppercase VERSION', () => {
    const value = {
      VERSION: '1.2.0',
      chapters: [{ startTime: 0 }],
    }

    expect(detect(value)).toBe(true)
  })

  it('should detect chapters with uppercase CHAPTERS', () => {
    const value = {
      CHAPTERS: [{ startTime: 0 }],
    }

    expect(detect(value)).toBe(true)
  })

  it('should detect chapters with uppercase STARTTIME', () => {
    const value = {
      chapters: [{ STARTTIME: 0 }],
    }

    expect(detect(value)).toBe(true)
  })

  it('should detect chapters with mixed case properties', () => {
    const value = {
      Version: '1.2.0',
      Chapters: [{ StartTime: 0 }],
    }

    expect(detect(value)).toBe(true)
  })

  it('should detect chapters with all uppercase properties', () => {
    const value = {
      VERSION: '1.2.0',
      CHAPTERS: [{ STARTTIME: 0, TITLE: 'Test' }],
    }

    expect(detect(value)).toBe(true)
  })
})
