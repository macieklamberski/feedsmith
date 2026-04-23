import { describe, expect, it } from 'bun:test'
import { generateChapter, generateDocument, generateLocation } from './utils.js'

describe('generateLocation', () => {
  it('should generate location with all properties', () => {
    const value = {
      name: 'Eiffel Tower',
      geo: 'geo:48.8584,2.2945',
      osm: 'W5013364',
    }
    const expected = {
      name: 'Eiffel Tower',
      geo: 'geo:48.8584,2.2945',
      osm: 'W5013364',
    }

    expect(generateLocation(value)).toEqual(expected)
  })

  it('should generate location with only required properties', () => {
    const value = {
      name: 'Central Park',
      geo: 'geo:40.7829,-73.9654',
    }
    const expected = {
      name: 'Central Park',
      geo: 'geo:40.7829,-73.9654',
    }

    expect(generateLocation(value)).toEqual(expected)
  })

  it('should handle empty strings', () => {
    const value = {
      name: 'Location',
      geo: 'geo:0,0',
      osm: '',
    }
    const expected = {
      name: 'Location',
      geo: 'geo:0,0',
    }

    expect(generateLocation(value)).toEqual(expected)
  })

  it('should handle whitespace-only strings', () => {
    const value = {
      name: '   ',
      geo: '   ',
    }

    expect(generateLocation(value)).toBeUndefined()
  })

  it('should handle empty object', () => {
    expect(generateLocation({})).toBeUndefined()
  })

  it('should handle non-object inputs', () => {
    // @ts-expect-error: This is for testing purposes.
    expect(generateLocation('string')).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generateLocation(123)).toBeUndefined()
    expect(generateLocation(undefined)).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generateLocation(null)).toBeUndefined()
  })
})

describe('generateChapter', () => {
  it('should generate chapter with all properties', () => {
    const value = {
      startTime: 0,
      title: 'Introduction',
      img: 'https://example.com/intro.jpg',
      url: 'https://example.com/intro',
      toc: true,
      endTime: 60,
      location: {
        name: 'Studio',
        geo: 'geo:40.7128,-74.0060',
        osm: 'R175905',
      },
    }
    const expected = {
      startTime: 0,
      title: 'Introduction',
      img: 'https://example.com/intro.jpg',
      url: 'https://example.com/intro',
      toc: true,
      endTime: 60,
      location: {
        name: 'Studio',
        geo: 'geo:40.7128,-74.0060',
        osm: 'R175905',
      },
    }

    expect(generateChapter(value)).toEqual(expected)
  })

  it('should generate chapter with only required startTime', () => {
    const value = {
      startTime: 120,
    }
    const expected = {
      startTime: 120,
    }

    expect(generateChapter(value)).toEqual(expected)
  })

  it('should generate chapter with toc set to false', () => {
    const value = {
      startTime: 0,
      title: 'Hidden Chapter',
      toc: false,
    }
    const expected = {
      startTime: 0,
      title: 'Hidden Chapter',
      toc: false,
    }

    expect(generateChapter(value)).toEqual(expected)
  })

  it('should handle floating point times', () => {
    const value = {
      startTime: 10.5,
      endTime: 20.75,
    }
    const expected = {
      startTime: 10.5,
      endTime: 20.75,
    }

    expect(generateChapter(value)).toEqual(expected)
  })

  it('should handle startTime of zero', () => {
    const value = {
      startTime: 0,
    }
    const expected = {
      startTime: 0,
    }

    expect(generateChapter(value)).toEqual(expected)
  })

  it('should handle empty strings', () => {
    const value = {
      startTime: 0,
      title: '',
      img: '',
      url: '',
    }
    const expected = {
      startTime: 0,
    }

    expect(generateChapter(value)).toEqual(expected)
  })

  it('should handle whitespace-only strings', () => {
    const value = {
      startTime: 0,
      title: '   ',
    }
    const expected = {
      startTime: 0,
    }

    expect(generateChapter(value)).toEqual(expected)
  })

  it('should handle empty object', () => {
    expect(generateChapter({})).toBeUndefined()
  })

  it('should handle non-object inputs', () => {
    // @ts-expect-error: This is for testing purposes.
    expect(generateChapter('string')).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generateChapter(123)).toBeUndefined()
    expect(generateChapter(undefined)).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generateChapter(null)).toBeUndefined()
  })
})

describe('generateDocument', () => {
  it('should generate document with all properties', () => {
    const value = {
      chapters: [
        {
          startTime: 0,
          title: 'Introduction',
          img: 'https://example.com/intro.jpg',
          url: 'https://example.com/intro',
          toc: true,
          endTime: 60,
        },
        {
          startTime: 60,
          title: 'Main Content',
          toc: true,
        },
      ],
      author: 'John Doe',
      title: 'Episode Chapters',
      podcastName: 'My Podcast',
      description: 'Chapter markers for episode 1',
      fileName: 'episode1-chapters.json',
      waypoints: false,
    }
    const expected = {
      version: '1.2.0',
      chapters: [
        {
          startTime: 0,
          title: 'Introduction',
          img: 'https://example.com/intro.jpg',
          url: 'https://example.com/intro',
          toc: true,
          endTime: 60,
        },
        {
          startTime: 60,
          title: 'Main Content',
          toc: true,
        },
      ],
      author: 'John Doe',
      title: 'Episode Chapters',
      podcastName: 'My Podcast',
      description: 'Chapter markers for episode 1',
      fileName: 'episode1-chapters.json',
      waypoints: false,
    }

    expect(generateDocument(value)).toEqual(expected)
  })

  it('should generate document with only chapters', () => {
    const value = {
      chapters: [{ startTime: 0 }, { startTime: 30 }],
    }
    const expected = {
      version: '1.2.0',
      chapters: [{ startTime: 0 }, { startTime: 30 }],
    }

    expect(generateDocument(value)).toEqual(expected)
  })

  it('should generate document with chapters containing locations', () => {
    const value = {
      chapters: [
        {
          startTime: 0,
          title: 'At the Eiffel Tower',
          location: {
            name: 'Eiffel Tower',
            geo: 'geo:48.8584,2.2945',
            osm: 'W5013364',
          },
        },
      ],
    }
    const expected = {
      version: '1.2.0',
      chapters: [
        {
          startTime: 0,
          title: 'At the Eiffel Tower',
          location: {
            name: 'Eiffel Tower',
            geo: 'geo:48.8584,2.2945',
            osm: 'W5013364',
          },
        },
      ],
    }

    expect(generateDocument(value)).toEqual(expected)
  })

  it('should generate document with waypoints set to true', () => {
    const value = {
      chapters: [{ startTime: 0 }],
      waypoints: true,
    }
    const expected = {
      version: '1.2.0',
      chapters: [{ startTime: 0 }],
      waypoints: true,
    }

    expect(generateDocument(value)).toEqual(expected)
  })

  it('should handle empty chapters array', () => {
    const value = {
      chapters: [],
    }
    const expected = {
      version: '1.2.0',
    }

    expect(generateDocument(value)).toEqual(expected)
  })

  it('should handle empty strings', () => {
    const value = {
      chapters: [{ startTime: 0 }],
      author: '',
      title: '',
    }
    const expected = {
      version: '1.2.0',
      chapters: [{ startTime: 0 }],
    }

    expect(generateDocument(value)).toEqual(expected)
  })

  it('should handle whitespace-only strings', () => {
    const value = {
      chapters: [],
      author: '   ',
    }
    const expected = {
      version: '1.2.0',
    }

    expect(generateDocument(value)).toEqual(expected)
  })

  it('should handle empty object', () => {
    const expected = {
      version: '1.2.0',
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
