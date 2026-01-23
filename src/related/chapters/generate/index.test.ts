import { describe, expect, it } from 'bun:test'
import { generate } from './index.js'

describe('generate', () => {
  it('should generate chapters document', () => {
    const value = {
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
    const expected = {
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
    }

    expect(generate(value)).toEqual(expected)
  })

  it('should generate chapters with all properties', () => {
    const value = {
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
    const expected = {
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
    }

    expect(generate(value)).toEqual(expected)
  })

  it('should generate minimal chapters document', () => {
    const value = {
      chapters: [{ startTime: 0 }],
    }
    const expected = {
      version: '1.2.0',
      chapters: [{ startTime: 0 }],
    }

    expect(generate(value)).toEqual(expected)
  })

  it('should generate chapters with floating point times', () => {
    const value = {
      chapters: [{ startTime: 10.5, endTime: 20.75 }],
    }
    const expected = {
      version: '1.2.0',
      chapters: [{ startTime: 10.5, endTime: 20.75 }],
    }

    expect(generate(value)).toEqual(expected)
  })

  it('should generate document with empty object', () => {
    const value = {}
    const expected = {
      version: '1.2.0',
    }

    expect(generate(value)).toEqual(expected)
  })

  it('should generate document with missing chapters (lenient)', () => {
    const value = {
      title: 'No chapters',
    }
    const expected = {
      version: '1.2.0',
      title: 'No chapters',
    }

    expect(generate(value)).toEqual(expected)
  })

  it('should generate document with empty chapters array (lenient)', () => {
    const value = {
      chapters: [],
    }
    const expected = {
      version: '1.2.0',
    }

    expect(generate(value)).toEqual(expected)
  })
})

describe('strict mode', () => {
  it('should require chapters in strict mode', () => {
    // @ts-expect-error: This is for testing purposes.
    generate({ title: 'Test' }, { strict: true })
  })

  it('should accept document with all required fields in strict mode', () => {
    generate({ chapters: [{ startTime: 0 }] }, { strict: true })
  })

  it('should require chapter startTime in strict mode', () => {
    generate(
      {
        // @ts-expect-error: This is for testing purposes.
        chapters: [{ title: 'Hello' }],
      },
      { strict: true },
    )
  })

  it('should require location name and geo in strict mode', () => {
    generate(
      {
        chapters: [
          {
            startTime: 0,
            // @ts-expect-error: This is for testing purposes.
            location: { name: 'Test' },
          },
        ],
      },
      { strict: true },
    )
  })

  it('should accept location with all required fields in strict mode', () => {
    generate(
      {
        chapters: [
          {
            startTime: 0,
            location: { name: 'Eiffel Tower', geo: 'geo:48.8584,2.2945' },
          },
        ],
      },
      { strict: true },
    )
  })

  it('should accept partial document in lenient mode', () => {
    generate({ title: 'Test' })
  })
})

describe('generate edge cases', () => {
  it('should accept partial documents', () => {
    const value = {
      title: 'Test Chapters',
    }
    const expected = {
      version: '1.2.0',
      title: 'Test Chapters',
    }

    expect(generate(value)).toEqual(expected)
  })

  it('should handle zero startTime', () => {
    const value = {
      chapters: [{ startTime: 0 }],
    }
    const expected = {
      version: '1.2.0',
      chapters: [{ startTime: 0 }],
    }

    expect(generate(value)).toEqual(expected)
  })

  it('should handle boolean waypoints', () => {
    const value = {
      chapters: [{ startTime: 0 }],
      waypoints: true,
    }
    const expected = {
      version: '1.2.0',
      chapters: [{ startTime: 0 }],
      waypoints: true,
    }

    expect(generate(value)).toEqual(expected)
  })
})
