import { describe, expect, it } from 'bun:test'
import { locales } from '../../../common/config.js'
import { parse } from './index.js'

describe('parse', () => {
  it('should parse valid JSON chapters string', () => {
    const value = JSON.stringify({
      version: '1.2.0',
      chapters: [
        {
          startTime: 0,
          title: 'Introduction',
        },
        {
          startTime: 60,
          title: 'Main Content',
        },
      ],
      title: 'Episode Chapters',
    })
    const expected = {
      chapters: [
        {
          startTime: 0,
          title: 'Introduction',
        },
        {
          startTime: 60,
          title: 'Main Content',
        },
      ],
      title: 'Episode Chapters',
    }

    expect(parse(value)).toEqual(expected)
  })

  it('should parse already-parsed object', () => {
    const value = {
      version: '1.2.0',
      chapters: [
        {
          startTime: 0,
          title: 'Introduction',
        },
      ],
      title: 'Episode Chapters',
    }
    const expected = {
      chapters: [
        {
          startTime: 0,
          title: 'Introduction',
        },
      ],
      title: 'Episode Chapters',
    }

    expect(parse(value)).toEqual(expected)
  })

  it('should parse chapters with all properties', () => {
    const value = JSON.stringify({
      version: '1.2.0',
      chapters: [
        {
          startTime: 0,
          title: 'At the Eiffel Tower',
          img: 'https://example.com/eiffel.jpg',
          url: 'https://example.com/chapter1',
          toc: true,
          endTime: 120,
          location: {
            name: 'Eiffel Tower',
            geo: 'geo:48.8584,2.2945',
            osm: 'W5013364',
          },
        },
      ],
      author: 'John Doe',
      title: 'Travel Podcast Chapters',
      podcastName: 'World Travels',
      description: 'Chapter markers for Paris episode',
      fileName: 'paris-chapters.json',
      waypoints: true,
    })
    const expected = {
      chapters: [
        {
          startTime: 0,
          title: 'At the Eiffel Tower',
          img: 'https://example.com/eiffel.jpg',
          url: 'https://example.com/chapter1',
          toc: true,
          endTime: 120,
          location: {
            name: 'Eiffel Tower',
            geo: 'geo:48.8584,2.2945',
            osm: 'W5013364',
          },
        },
      ],
      author: 'John Doe',
      title: 'Travel Podcast Chapters',
      podcastName: 'World Travels',
      description: 'Chapter markers for Paris episode',
      fileName: 'paris-chapters.json',
      waypoints: true,
    }

    expect(parse(value)).toEqual(expected)
  })

  it('should parse minimal valid chapters document', () => {
    const value = JSON.stringify({
      version: '1.2.0',
      chapters: [{ startTime: 0 }],
    })
    const expected = {
      chapters: [{ startTime: 0 }],
    }

    expect(parse(value)).toEqual(expected)
  })

  it('should parse chapters from string with leading whitespace', () => {
    const json = JSON.stringify({
      version: '1.2.0',
      chapters: [{ startTime: 0, title: 'Test' }],
    })
    const value = `  ${json}`
    const expected = {
      chapters: [{ startTime: 0, title: 'Test' }],
    }

    expect(parse(value)).toEqual(expected)
  })

  it('should parse chapters from string with trailing whitespace', () => {
    const json = JSON.stringify({
      version: '1.2.0',
      chapters: [{ startTime: 0, title: 'Test' }],
    })
    const value = `${json}  `
    const expected = {
      chapters: [{ startTime: 0, title: 'Test' }],
    }

    expect(parse(value)).toEqual(expected)
  })

  it('should parse chapters from string with whitespace on both ends', () => {
    const json = JSON.stringify({
      version: '1.2.0',
      chapters: [{ startTime: 0, title: 'Test' }],
    })
    const value = `  ${json}  `
    const expected = {
      chapters: [{ startTime: 0, title: 'Test' }],
    }

    expect(parse(value)).toEqual(expected)
  })

  it('should handle malformed JSON string', () => {
    const value = '{"version":"1.2.0","chapters":[{"startTime":0'

    expect(() => parse(value)).toThrowError(locales.invalidInputChapters)
  })

  it('should parse document with missing chapters (lenient)', () => {
    const value = JSON.stringify({
      version: '1.2.0',
      title: 'No chapters',
    })
    const expected = {
      title: 'No chapters',
    }

    expect(parse(value)).toEqual(expected)
  })

  it('should throw error for empty object', () => {
    expect(() => parse({})).toThrowError(locales.invalidInputChapters)
  })

  it('should throw error for empty chapters array', () => {
    expect(() => parse({ chapters: [] })).toThrowError(locales.invalidInputChapters)
  })

  it('should throw error for invalid string', () => {
    expect(() => parse('not valid json')).toThrowError(locales.invalidInputChapters)
  })

  it('should throw error for null', () => {
    expect(() => parse(null)).toThrowError(locales.invalidInputChapters)
  })

  it('should throw error for undefined', () => {
    expect(() => parse(undefined)).toThrowError(locales.invalidInputChapters)
  })

  it('should throw error for array', () => {
    expect(() => parse([])).toThrowError(locales.invalidInputChapters)
  })

  it('should throw error for number', () => {
    expect(() => parse(123)).toThrowError(locales.invalidInputChapters)
  })

  it('should handle case insensitive fields', () => {
    const value = {
      VERSION: '1.2.0',
      CHAPTERS: [{ STARTTIME: 0, TITLE: 'Introduction' }],
      AUTHOR: 'John Doe',
    }
    const expected = {
      chapters: [{ startTime: 0, title: 'Introduction' }],
      author: 'John Doe',
    }

    expect(parse(value)).toEqual(expected)
  })
})
