import { describe, expect, it } from 'bun:test'
import { parseChapter, parseDocument, parseLocation } from './utils.js'

describe('parseLocation', () => {
  it('should parse location with all properties', () => {
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

    expect(parseLocation(value)).toEqual(expected)
  })

  it('should parse location with only required properties', () => {
    const value = {
      name: 'Central Park',
      geo: 'geo:40.7829,-73.9654',
    }
    const expected = {
      name: 'Central Park',
      geo: 'geo:40.7829,-73.9654',
    }

    expect(parseLocation(value)).toEqual(expected)
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

    expect(parseLocation(value)).toEqual(expected)
  })

  it('should handle whitespace-only strings', () => {
    const value = {
      name: '   ',
      geo: '   ',
    }

    expect(parseLocation(value)).toBeUndefined()
  })

  it('should return undefined for empty object', () => {
    const value = {}

    expect(parseLocation(value)).toBeUndefined()
  })

  it('should return undefined for non-object inputs', () => {
    expect(parseLocation(null)).toBeUndefined()
    expect(parseLocation(undefined)).toBeUndefined()
    expect(parseLocation('string')).toBeUndefined()
    expect(parseLocation(123)).toBeUndefined()
  })
})

describe('parseChapter', () => {
  it('should parse chapter with all properties', () => {
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

    expect(parseChapter(value)).toEqual(expected)
  })

  it('should parse chapter with only required startTime', () => {
    const value = {
      startTime: 120,
    }
    const expected = {
      startTime: 120,
    }

    expect(parseChapter(value)).toEqual(expected)
  })

  it('should parse chapter with toc set to false', () => {
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

    expect(parseChapter(value)).toEqual(expected)
  })

  it('should handle startTime as string number', () => {
    const value = {
      startTime: '90.5',
    }
    const expected = {
      startTime: 90.5,
    }

    expect(parseChapter(value)).toEqual(expected)
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

    expect(parseChapter(value)).toEqual(expected)
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

    expect(parseChapter(value)).toEqual(expected)
  })

  it('should handle whitespace-only strings', () => {
    const value = {
      startTime: 0,
      title: '   ',
    }
    const expected = {
      startTime: 0,
    }

    expect(parseChapter(value)).toEqual(expected)
  })

  it('should return undefined for empty object', () => {
    const value = {}

    expect(parseChapter(value)).toBeUndefined()
  })

  it('should return undefined for non-object inputs', () => {
    expect(parseChapter(null)).toBeUndefined()
    expect(parseChapter(undefined)).toBeUndefined()
    expect(parseChapter('string')).toBeUndefined()
    expect(parseChapter(123)).toBeUndefined()
  })
})

describe('parseDocument', () => {
  const expectedFull = {
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

  it('should parse document with all properties', () => {
    const value = {
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

    expect(parseDocument(value)).toEqual(expectedFull)
  })

  it('should parse document with only chapters', () => {
    const value = {
      version: '1.2.0',
      chapters: [{ startTime: 0 }, { startTime: 30 }],
    }
    const expected = {
      chapters: [{ startTime: 0 }, { startTime: 30 }],
    }

    expect(parseDocument(value)).toEqual(expected)
  })

  it('should parse document with chapters containing locations', () => {
    const value = {
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
    const expected = {
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

    expect(parseDocument(value)).toEqual(expected)
  })

  it('should parse document with waypoints set to true', () => {
    const value = {
      version: '1.2.0',
      chapters: [{ startTime: 0 }],
      waypoints: true,
    }
    const expected = {
      chapters: [{ startTime: 0 }],
      waypoints: true,
    }

    expect(parseDocument(value)).toEqual(expected)
  })

  it('should handle coercible values', () => {
    const value = {
      version: 1.2,
      chapters: [{ startTime: '0' }],
    }
    const expected = {
      chapters: [{ startTime: 0 }],
    }

    expect(parseDocument(value)).toEqual(expected)
  })

  it('should handle empty chapters array', () => {
    const value = {
      version: '1.2.0',
      chapters: [],
    }

    expect(parseDocument(value)).toBeUndefined()
  })

  it('should handle empty strings', () => {
    const value = {
      version: '1.2.0',
      chapters: [{ startTime: 0 }],
      author: '',
      title: '',
    }
    const expected = {
      chapters: [{ startTime: 0 }],
    }

    expect(parseDocument(value)).toEqual(expected)
  })

  it('should handle whitespace-only strings', () => {
    const value = {
      version: '   ',
      chapters: [],
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
      VERSION: '1.2.0',
      CHAPTERS: [{ STARTTIME: 0, TITLE: 'Introduction' }],
      AUTHOR: 'John Doe',
      TITLE: 'Episode Chapters',
    }
    const expected = {
      chapters: [{ startTime: 0, title: 'Introduction' }],
      author: 'John Doe',
      title: 'Episode Chapters',
    }

    expect(parseDocument(value)).toEqual(expected)
  })

  it('should parse document with mixed case property names', () => {
    const value = {
      Version: '1.2.0',
      Chapters: [{ StartTime: 0, Title: 'Introduction' }],
      Author: 'John Doe',
      PodcastName: 'My Podcast',
    }
    const expected = {
      chapters: [{ startTime: 0, title: 'Introduction' }],
      author: 'John Doe',
      podcastName: 'My Podcast',
    }

    expect(parseDocument(value)).toEqual(expected)
  })

  it('should parse chapter with uppercase property names', () => {
    const value = {
      STARTTIME: 0,
      TITLE: 'Introduction',
      IMG: 'https://example.com/intro.jpg',
      URL: 'https://example.com/intro',
      TOC: true,
      ENDTIME: 60,
    }
    const expected = {
      startTime: 0,
      title: 'Introduction',
      img: 'https://example.com/intro.jpg',
      url: 'https://example.com/intro',
      toc: true,
      endTime: 60,
    }

    expect(parseChapter(value)).toEqual(expected)
  })

  it('should parse location with uppercase property names', () => {
    const value = {
      NAME: 'Eiffel Tower',
      GEO: 'geo:48.8584,2.2945',
      OSM: 'W5013364',
    }
    const expected = {
      name: 'Eiffel Tower',
      geo: 'geo:48.8584,2.2945',
      osm: 'W5013364',
    }

    expect(parseLocation(value)).toEqual(expected)
  })

  it('should prefer exact case match over case-insensitive match', () => {
    const value = {
      startTime: 0,
      STARTTIME: 999,
      title: 'Correct',
      TITLE: 'Wrong',
    }
    const expected = {
      startTime: 0,
      title: 'Correct',
    }

    expect(parseChapter(value)).toEqual(expected)
  })
})
