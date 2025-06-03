import { describe, expect, it } from 'bun:test'
import {
  parseAlternateEnclosure,
  parseBlock,
  parseChapters,
  parseContentLink,
  parseEpisode,
  parseFunding,
  parseImages,
  parseIntegrity,
  parseLicense,
  parseLiveItem,
  parseLocation,
  parseLocked,
  parsePerson,
  parsePodping,
  parsePodroll,
  parseRemoteItem,
  parseSeason,
  parseSocialInteract,
  parseSoundbite,
  parseSource,
  parseTrailer,
  parseTranscript,
  parseTxt,
  parseUpdateFrequency,
  parseValue,
  parseValueRecipient,
  parseValueTimeSplit,
  retrieveFeed,
  retrieveItem,
} from './utils.js'

describe('parseTranscript', () => {
  it('should parse complete transcript object', () => {
    const value = {
      '@url': 'https://example.com/podcast/episode1/transcript.json',
      '@type': 'application/json',
      '@language': 'en',
      '@rel': 'captions',
    }
    const expected = {
      url: 'https://example.com/podcast/episode1/transcript.json',
      type: 'application/json',
      language: 'en',
      rel: 'captions',
    }

    expect(parseTranscript(value)).toEqual(expected)
  })

  it('should parse transcript with only required fields', () => {
    const value = {
      '@url': 'https://example.com/podcast/episode1/transcript.vtt',
      '@type': 'text/vtt',
    }
    const expected = {
      url: 'https://example.com/podcast/episode1/transcript.vtt',
      type: 'text/vtt',
    }

    expect(parseTranscript(value)).toEqual(expected)
  })

  it('should handle coercible values', () => {
    const value = {
      '@url': 'https://example.com/transcript.srt',
      '@type': 123,
      '@language': true,
    }
    const expected = {
      url: 'https://example.com/transcript.srt',
      type: '123',
    }

    expect(parseTranscript(value)).toEqual(expected)
  })

  it('should handle objects with mixed valid and invalid properties', () => {
    const value = {
      '@url': 'https://example.com/transcript.json',
      '@type': 'application/json',
      '@invalid': 'property',
    }
    const expected = {
      url: 'https://example.com/transcript.json',
      type: 'application/json',
    }

    expect(parseTranscript(value)).toEqual(expected)
  })

  it('should return undefined if url is missing', () => {
    const value = {
      '@type': 'text/vtt',
      '@language': 'es',
    }

    expect(parseTranscript(value)).toBeUndefined()
  })

  it('should return undefined if type is missing', () => {
    const value = {
      '@url': 'https://example.com/transcript.vtt',
      '@language': 'fr',
    }

    expect(parseTranscript(value)).toBeUndefined()
  })

  it('should return undefined for empty objects', () => {
    const value = {}

    expect(parseTranscript(value)).toBeUndefined()
  })

  it('should return undefined for objects with unrelated properties', () => {
    const value = {
      '@unrelated': 'property',
      random: 'value',
    }

    expect(parseTranscript(value)).toBeUndefined()
  })

  it('should return undefined for not supported input', () => {
    expect(parseTranscript('not an object')).toBeUndefined()
    expect(parseTranscript(undefined)).toBeUndefined()
    expect(parseTranscript(null)).toBeUndefined()
    expect(parseTranscript([])).toBeUndefined()
  })
})

describe('parseLocked', () => {
  it('should parse complete locked object', () => {
    const value = {
      '#text': 'yes',
      '@owner': 'Example Podcast Network',
    }
    const expected = {
      value: true,
      owner: 'Example Podcast Network',
    }

    expect(parseLocked(value)).toEqual(expected)
  })

  it('should parse locked object with only required value field (as object)', () => {
    const value = {
      '#text': 'no',
    }
    const expected = {
      value: false,
    }

    expect(parseLocked(value)).toEqual(expected)
  })

  it('should parse locked object with only required value field (as string)', () => {
    const value = 'no'
    const expected = {
      value: false,
    }

    expect(parseLocked(value)).toEqual(expected)
  })

  it('should handle coercible values', () => {
    const value = {
      '#text': 'true',
      '@owner': '123',
    }
    const expected = {
      value: true,
      owner: '123',
    }

    expect(parseLocked(value)).toEqual(expected)
  })

  it('should handle objects with mixed valid and invalid properties', () => {
    const value = {
      '#text': 'yes',
      '@owner': 'Example Podcast Network',
      '@invalid': 'property',
    }
    const expected = {
      value: true,
      owner: 'Example Podcast Network',
    }

    expect(parseLocked(value)).toEqual(expected)
  })

  it('should return undefined if value is missing', () => {
    const value = {
      '@owner': 'Example Podcast Network',
    }

    expect(parseLocked(value)).toBeUndefined()
  })

  it('should return undefined for empty objects', () => {
    const value = {}

    expect(parseLocked(value)).toBeUndefined()
  })

  it('should return undefined for objects with only unrelated properties', () => {
    const value = {
      '@unrelated': 'property',
      random: 'value',
    }

    expect(parseLocked(value)).toBeUndefined()
  })

  it('should return undefined for not supported input', () => {
    expect(parseLocked(undefined)).toBeUndefined()
    expect(parseLocked(null)).toBeUndefined()
    expect(parseLocked([])).toBeUndefined()
  })
})

describe('parseFunding', () => {
  it('should parse complete funding object', () => {
    const value = {
      '@url': 'https://example.com/donate',
      '#text': 'Support our podcast',
    }
    const expected = {
      url: 'https://example.com/donate',
      display: 'Support our podcast',
    }

    expect(parseFunding(value)).toEqual(expected)
  })

  it('should parse funding object with only required url field', () => {
    const value = {
      '@url': 'https://example.com/donate',
    }
    const expected = {
      url: 'https://example.com/donate',
    }

    expect(parseFunding(value)).toEqual(expected)
  })

  it('should handle coercible number values', () => {
    const value = {
      '@url': 123,
      '#text': 456,
    }
    const expected = {
      url: '123',
      display: '456',
    }

    expect(parseFunding(value)).toEqual(expected)
  })

  it('should not include boolean values', () => {
    const value = {
      '@url': 'https://example.com/donate',
      '#text': true,
    }
    const expected = {
      url: 'https://example.com/donate',
    }

    expect(parseFunding(value)).toEqual(expected)
  })

  it('should handle objects with mixed valid and invalid properties', () => {
    const value = {
      '@url': 'https://example.com/donate',
      '#text': 'Support our podcast',
      '@invalid': 'property',
    }
    const expected = {
      url: 'https://example.com/donate',
      display: 'Support our podcast',
    }

    expect(parseFunding(value)).toEqual(expected)
  })

  it('should return undefined if url is missing', () => {
    const value = {
      '#text': 'Support our podcast',
    }

    expect(parseFunding(value)).toBeUndefined()
  })

  it('should return undefined for empty objects', () => {
    const value = {}

    expect(parseFunding(value)).toBeUndefined()
  })

  it('should return undefined for objects with only unrelated properties', () => {
    const value = {
      '@unrelated': 'property',
      random: 'value',
    }

    expect(parseFunding(value)).toBeUndefined()
  })

  it('should return undefined for not supported input', () => {
    expect(parseFunding('not an object')).toBeUndefined()
    expect(parseFunding(undefined)).toBeUndefined()
    expect(parseFunding(null)).toBeUndefined()
    expect(parseFunding([])).toBeUndefined()
  })
})

describe('parseChapters', () => {
  it('should parse complete chapters object', () => {
    const value = {
      '@url': 'https://example.com/episode1/chapters.json',
      '@type': 'application/json',
    }
    const expected = {
      url: 'https://example.com/episode1/chapters.json',
      type: 'application/json',
    }

    expect(parseChapters(value)).toEqual(expected)
  })

  it('should handle coercible number values', () => {
    const value = {
      '@url': 123,
      '@type': 456,
    }
    const expected = {
      url: '123',
      type: '456',
    }

    expect(parseChapters(value)).toEqual(expected)
  })

  it('should handle objects with mixed valid and invalid properties', () => {
    const value = {
      '@url': 'https://example.com/chapters.json',
      '@type': 'application/json',
      '@invalid': 'property',
    }
    const expected = {
      url: 'https://example.com/chapters.json',
      type: 'application/json',
    }

    expect(parseChapters(value)).toEqual(expected)
  })

  it('should return undefined if url is missing', () => {
    const value = {
      '@type': 'application/json',
    }

    expect(parseChapters(value)).toBeUndefined()
  })

  it('should return undefined if type is missing', () => {
    const value = {
      '@url': 'https://example.com/chapters.json',
    }

    expect(parseChapters(value)).toBeUndefined()
  })

  it('should return undefined for empty objects', () => {
    const value = {}

    expect(parseChapters(value)).toBeUndefined()
  })

  it('should return undefined for objects with only unrelated properties', () => {
    const value = {
      '@unrelated': 'property',
      random: 'value',
    }

    expect(parseChapters(value)).toBeUndefined()
  })

  it('should return undefined for not supported input', () => {
    expect(parseChapters('not an object')).toBeUndefined()
    expect(parseChapters(undefined)).toBeUndefined()
    expect(parseChapters(null)).toBeUndefined()
    expect(parseChapters([])).toBeUndefined()
  })
})

describe('parseSoundbite', () => {
  it('should parse complete soundbite object', () => {
    const value = {
      '@starttime': 60,
      '@duration': 30,
      '#text': 'This is a great quote',
    }
    const expected = {
      startTime: 60,
      duration: 30,
      display: 'This is a great quote',
    }

    expect(parseSoundbite(value)).toEqual(expected)
  })

  it('should parse soundbite with only required fields', () => {
    const value = {
      '@starttime': 60,
      '@duration': 30,
    }
    const expected = {
      startTime: 60,
      duration: 30,
    }

    expect(parseSoundbite(value)).toEqual(expected)
  })

  it('should handle string values that can be coerced to numbers', () => {
    const value = {
      '@starttime': '60',
      '@duration': '30',
      '#text': 'This is a great quote',
    }
    const expected = {
      startTime: 60,
      duration: 30,
      display: 'This is a great quote',
    }

    expect(parseSoundbite(value)).toEqual(expected)
  })

  it('should handle decimal values', () => {
    const value = {
      '@starttime': 60.5,
      '@duration': 30.25,
      '#text': 'This is a great quote',
    }
    const expected = {
      startTime: 60.5,
      duration: 30.25,
      display: 'This is a great quote',
    }

    expect(parseSoundbite(value)).toEqual(expected)
  })

  it('should handle coercible values', () => {
    const value = {
      '@starttime': '60.5',
      '@duration': '30.25',
      '#text': 123,
    }
    const expected = {
      startTime: 60.5,
      duration: 30.25,
      display: '123',
    }

    expect(parseSoundbite(value)).toEqual(expected)
  })

  it('should handle objects with mixed valid and invalid properties', () => {
    const value = {
      '@starttime': 60,
      '@duration': 30,
      '#text': 'This is a great quote',
      '@invalid': 'property',
    }
    const expected = {
      startTime: 60,
      duration: 30,
      display: 'This is a great quote',
    }

    expect(parseSoundbite(value)).toEqual(expected)
  })

  it('should return undefined if startTime is missing', () => {
    const value = {
      '@duration': 30,
      '#text': 'This is a great quote',
    }

    expect(parseSoundbite(value)).toBeUndefined()
  })

  it('should return undefined if duration is missing', () => {
    const value = {
      '@starttime': 60,
      '#text': 'This is a great quote',
    }

    expect(parseSoundbite(value)).toBeUndefined()
  })

  it('should return undefined if startTime cannot be parsed as a number', () => {
    const value = {
      '@starttime': 'not a number',
      '@duration': 30,
      '#text': 'This is a great quote',
    }

    expect(parseSoundbite(value)).toBeUndefined()
  })

  it('should return undefined if duration cannot be parsed as a number', () => {
    const value = {
      '@starttime': 60,
      '@duration': 'not a number',
      '#text': 'This is a great quote',
    }

    expect(parseSoundbite(value)).toBeUndefined()
  })

  it('should return undefined for empty objects', () => {
    const value = {}

    expect(parseSoundbite(value)).toBeUndefined()
  })

  it('should return undefined for objects with only unrelated properties', () => {
    const value = {
      '@unrelated': 'property',
      random: 'value',
    }

    expect(parseSoundbite(value)).toBeUndefined()
  })

  it('should return undefined for not supported input', () => {
    expect(parseSoundbite('not an object')).toBeUndefined()
    expect(parseSoundbite(undefined)).toBeUndefined()
    expect(parseSoundbite(null)).toBeUndefined()
    expect(parseSoundbite([])).toBeUndefined()
  })
})

describe('parsePerson', () => {
  it('should parse complete person object', () => {
    const value = {
      '#text': 'John Doe',
      '@role': 'host',
      '@group': 'main',
      '@img': 'https://example.com/johndoe.jpg',
      '@href': 'https://example.com/johndoe',
    }
    const expected = {
      display: 'John Doe',
      role: 'host',
      group: 'main',
      img: 'https://example.com/johndoe.jpg',
      href: 'https://example.com/johndoe',
    }

    expect(parsePerson(value)).toEqual(expected)
  })

  it('should parse person with only required display field (as object)', () => {
    const value = {
      '#text': 'John Doe',
    }
    const expected = {
      display: 'John Doe',
    }

    expect(parsePerson(value)).toEqual(expected)
  })

  it('should parse person with only required display field (as string)', () => {
    const value = 'John Doe'
    const expected = {
      display: 'John Doe',
    }

    expect(parsePerson(value)).toEqual(expected)
  })

  it('should handle coercible number values', () => {
    const value = {
      '#text': 123,
      '@role': 456,
    }
    const expected = {
      display: '123',
      role: '456',
    }

    expect(parsePerson(value)).toEqual(expected)
  })

  it('should handle objects with mixed valid and invalid properties', () => {
    const value = {
      '#text': 'John Doe',
      '@role': 'host',
      '@invalid': 'property',
    }
    const expected = {
      display: 'John Doe',
      role: 'host',
    }

    expect(parsePerson(value)).toEqual(expected)
  })

  it('should return undefined if display is missing', () => {
    const value = {
      '@role': 'host',
      '@group': 'main',
    }

    expect(parsePerson(value)).toBeUndefined()
  })

  it('should return undefined for empty objects', () => {
    const value = {}

    expect(parsePerson(value)).toBeUndefined()
  })

  it('should return undefined for objects with only unrelated properties', () => {
    const value = {
      '@unrelated': 'property',
      random: 'value',
    }

    expect(parsePerson(value)).toBeUndefined()
  })

  it('should return undefined for not supported input', () => {
    expect(parsePerson(undefined)).toBeUndefined()
    expect(parsePerson(null)).toBeUndefined()
    expect(parsePerson([])).toBeUndefined()
  })
})

describe('parseLocation', () => {
  it('should parse complete location object', () => {
    const value = {
      '#text': 'San Francisco, CA',
      '@geo': '37.7749,-122.4194',
      '@osm': 'R61317',
    }
    const expected = {
      display: 'San Francisco, CA',
      geo: '37.7749,-122.4194',
      osm: 'R61317',
    }

    expect(parseLocation(value)).toEqual(expected)
  })

  it('should parse location with only required display field (as object)', () => {
    const value = {
      '#text': 'San Francisco, CA',
    }
    const expected = {
      display: 'San Francisco, CA',
    }

    expect(parseLocation(value)).toEqual(expected)
  })

  it('should parse location with only required display field (as string)', () => {
    const value = 'San Francisco, CA'
    const expected = {
      display: 'San Francisco, CA',
    }

    expect(parseLocation(value)).toEqual(expected)
  })

  it('should handle location with geo coordinates', () => {
    const value = {
      '#text': 'San Francisco, CA',
      '@geo': '37.7749,-122.4194',
    }
    const expected = {
      display: 'San Francisco, CA',
      geo: '37.7749,-122.4194',
    }

    expect(parseLocation(value)).toEqual(expected)
  })

  it('should handle location with OSM identifier', () => {
    const value = {
      '#text': 'San Francisco, CA',
      '@osm': 'R61317',
    }
    const expected = {
      display: 'San Francisco, CA',
      osm: 'R61317',
    }

    expect(parseLocation(value)).toEqual(expected)
  })

  it('should handle coercible number values', () => {
    const value = {
      '#text': 123,
      '@geo': 456,
    }
    const expected = {
      display: '123',
      geo: '456',
    }

    expect(parseLocation(value)).toEqual(expected)
  })

  it('should handle objects with mixed valid and invalid properties', () => {
    const value = {
      '#text': 'San Francisco, CA',
      '@geo': '37.7749,-122.4194',
      '@invalid': 'property',
    }
    const expected = {
      display: 'San Francisco, CA',
      geo: '37.7749,-122.4194',
    }

    expect(parseLocation(value)).toEqual(expected)
  })

  it('should return undefined if display is missing', () => {
    const value = {
      '@geo': '37.7749,-122.4194',
      '@osm': 'R61317',
    }

    expect(parseLocation(value)).toBeUndefined()
  })

  it('should return undefined for empty objects', () => {
    const value = {}

    expect(parseLocation(value)).toBeUndefined()
  })

  it('should return undefined for objects with only unrelated properties', () => {
    const value = {
      '@unrelated': 'property',
      random: 'value',
    }

    expect(parseLocation(value)).toBeUndefined()
  })

  it('should return undefined for not supported input', () => {
    expect(parseLocation(undefined)).toBeUndefined()
    expect(parseLocation(null)).toBeUndefined()
    expect(parseLocation([])).toBeUndefined()
  })
})

describe('parseSeason', () => {
  it('should parse complete season object', () => {
    const value = {
      '#text': 2,
      '@name': 'Second Season',
    }
    const expected = {
      number: 2,
      name: 'Second Season',
    }

    expect(parseSeason(value)).toEqual(expected)
  })

  it('should parse season with only required number field (as object)', () => {
    const value = {
      '#text': 3,
    }
    const expected = {
      number: 3,
    }

    expect(parseSeason(value)).toEqual(expected)
  })

  it('should parse season with only required number field (as string)', () => {
    const value = '3'
    const expected = {
      number: 3,
    }

    expect(parseSeason(value)).toEqual(expected)
  })

  it('should parse season with only required number field (as number)', () => {
    const value = 3
    const expected = {
      number: 3,
    }

    expect(parseSeason(value)).toEqual(expected)
  })

  it('should handle string values that can be coerced to numbers', () => {
    const value = {
      '#text': '4',
      '@name': 'Fourth Season',
    }
    const expected = {
      number: 4,
      name: 'Fourth Season',
    }

    expect(parseSeason(value)).toEqual(expected)
  })

  it('should handle coercible values', () => {
    const value = {
      '#text': '5',
      '@name': 123,
    }
    const expected = {
      number: 5,
      name: '123',
    }

    expect(parseSeason(value)).toEqual(expected)
  })

  it('should handle objects with mixed valid and invalid properties', () => {
    const value = {
      '#text': 6,
      '@name': 'Sixth Season',
      '@invalid': 'property',
    }
    const expected = {
      number: 6,
      name: 'Sixth Season',
    }

    expect(parseSeason(value)).toEqual(expected)
  })

  it('should return undefined if number cannot be parsed (as object)', () => {
    const value = {
      '#text': 'not a number',
      '@name': 'Invalid Season',
    }

    expect(parseSeason(value)).toBeUndefined()
  })

  it('should return undefined if number cannot be parsed (as string)', () => {
    const value = 'not a number'

    expect(parseSeason(value)).toBeUndefined()
  })

  it('should return undefined if number is missing', () => {
    const value = {
      '@name': 'Missing Number Season',
    }

    expect(parseSeason(value)).toBeUndefined()
  })

  it('should return undefined for empty objects', () => {
    const value = {}

    expect(parseSeason(value)).toBeUndefined()
  })

  it('should return undefined for objects with only unrelated properties', () => {
    const value = {
      '@unrelated': 'property',
      random: 'value',
    }

    expect(parseSeason(value)).toBeUndefined()
  })

  it('should return undefined for not supoprted input', () => {
    expect(parseSeason(undefined)).toBeUndefined()
    expect(parseSeason(null)).toBeUndefined()
    expect(parseSeason([])).toBeUndefined()
  })
})

describe('parseEpisode', () => {
  it('should parse complete episode object', () => {
    const value = {
      '#text': 42,
      '@display': 'The Answer to Everything',
    }
    const expected = {
      number: 42,
      display: 'The Answer to Everything',
    }

    expect(parseEpisode(value)).toEqual(expected)
  })

  it('should parse episode with only required number field (as object)', () => {
    const value = {
      '#text': 42,
    }
    const expected = {
      number: 42,
    }

    expect(parseEpisode(value)).toEqual(expected)
  })

  it('should parse episode with only required number field (as string)', () => {
    const value = '42'
    const expected = {
      number: 42,
    }

    expect(parseEpisode(value)).toEqual(expected)
  })

  it('should parse episode with only required number field (as number)', () => {
    const value = 42
    const expected = {
      number: 42,
    }

    expect(parseEpisode(value)).toEqual(expected)
  })

  it('should handle string values that can be coerced to numbers', () => {
    const value = {
      '#text': '42',
      '@display': 'The Answer to Everything',
    }
    const expected = {
      number: 42,
      display: 'The Answer to Everything',
    }

    expect(parseEpisode(value)).toEqual(expected)
  })

  it('should handle coercible values', () => {
    const value = {
      '#text': 42,
      '@display': 123,
    }
    const expected = {
      number: 42,
      display: '123',
    }

    expect(parseEpisode(value)).toEqual(expected)
  })

  it('should handle objects with mixed valid and invalid properties', () => {
    const value = {
      '#text': 42,
      '@display': 'The Answer to Everything',
      '@invalid': 'property',
    }
    const expected = {
      number: 42,
      display: 'The Answer to Everything',
    }

    expect(parseEpisode(value)).toEqual(expected)
  })

  it('should return undefined if number is missing', () => {
    const value = {
      '@display': 'Missing Number Episode',
    }

    expect(parseEpisode(value)).toBeUndefined()
  })

  it('should return undefined if number cannot be parsed', () => {
    const value = {
      '#text': 'not a number',
      '@display': 'Invalid Episode',
    }

    expect(parseEpisode(value)).toBeUndefined()
  })

  it('should return undefined for empty objects', () => {
    const value = {}

    expect(parseEpisode(value)).toBeUndefined()
  })

  it('should return undefined for objects with only unrelated properties', () => {
    const value = {
      '@unrelated': 'property',
      random: 'value',
    }

    expect(parseEpisode(value)).toBeUndefined()
  })

  it('should return undefined for not supported input', () => {
    expect(parseEpisode(undefined)).toBeUndefined()
    expect(parseEpisode(null)).toBeUndefined()
    expect(parseEpisode([])).toBeUndefined()
  })
})

describe('parseTrailer', () => {
  it('should parse complete trailer object', () => {
    const value = {
      '#text': 'Season 2 Trailer',
      '@url': 'https://example.com/trailer.mp3',
      '@pubdate': 'Tue, 10 Jan 2023 12:00:00 GMT',
      '@length': 12345678,
      '@type': 'audio/mpeg',
      '@season': 2,
    }
    const expected = {
      display: 'Season 2 Trailer',
      url: 'https://example.com/trailer.mp3',
      pubDate: 'Tue, 10 Jan 2023 12:00:00 GMT',
      length: 12345678,
      type: 'audio/mpeg',
      season: 2,
    }

    expect(parseTrailer(value)).toEqual(expected)
  })

  it('should parse trailer with only required fields', () => {
    const value = {
      '#text': 'Season 2 Trailer',
      '@url': 'https://example.com/trailer.mp3',
      '@pubdate': 'Tue, 10 Jan 2023 12:00:00 GMT',
    }
    const expected = {
      display: 'Season 2 Trailer',
      url: 'https://example.com/trailer.mp3',
      pubDate: 'Tue, 10 Jan 2023 12:00:00 GMT',
    }

    expect(parseTrailer(value)).toEqual(expected)
  })

  it('should handle coercible values', () => {
    const value = {
      '#text': 123,
      '@url': 'https://example.com/trailer.mp3',
      '@pubdate': 'Tue, 10 Jan 2023 12:00:00 GMT',
      '@length': '12345678',
      '@season': '2',
    }
    const expected = {
      display: '123',
      url: 'https://example.com/trailer.mp3',
      pubDate: 'Tue, 10 Jan 2023 12:00:00 GMT',
      length: 12345678,
      season: 2,
    }

    expect(parseTrailer(value)).toEqual(expected)
  })

  it('should handle objects with mixed valid and invalid properties', () => {
    const value = {
      '#text': 'Season 2 Trailer',
      '@url': 'https://example.com/trailer.mp3',
      '@pubdate': 'Tue, 10 Jan 2023 12:00:00 GMT',
      '@invalid': 'property',
    }
    const expected = {
      display: 'Season 2 Trailer',
      url: 'https://example.com/trailer.mp3',
      pubDate: 'Tue, 10 Jan 2023 12:00:00 GMT',
    }

    expect(parseTrailer(value)).toEqual(expected)
  })

  it('should return undefined if text is missing', () => {
    const value = {
      '@url': 'https://example.com/trailer.mp3',
      '@pubdate': 'Tue, 10 Jan 2023 12:00:00 GMT',
    }

    expect(parseTrailer(value)).toBeUndefined()
  })

  it('should return undefined if url is missing', () => {
    const value = {
      '#text': 'Season 2 Trailer',
      '@pubdate': 'Tue, 10 Jan 2023 12:00:00 GMT',
    }

    expect(parseTrailer(value)).toBeUndefined()
  })

  it('should return undefined if pubdate is missing', () => {
    const value = {
      '#text': 'Season 2 Trailer',
      '@url': 'https://example.com/trailer.mp3',
    }

    expect(parseTrailer(value)).toBeUndefined()
  })

  it('should return undefined for empty objects', () => {
    const value = {}

    expect(parseTrailer(value)).toBeUndefined()
  })

  it('should return undefined for objects with only unrelated properties', () => {
    const value = {
      '@unrelated': 'property',
      random: 'value',
    }

    expect(parseTrailer(value)).toBeUndefined()
  })

  it('should return undefined for not supported input', () => {
    expect(parseTrailer('not an object')).toBeUndefined()
    expect(parseTrailer(undefined)).toBeUndefined()
    expect(parseTrailer(null)).toBeUndefined()
    expect(parseTrailer([])).toBeUndefined()
  })
})

describe('parseLicense', () => {
  it('should parse complete license object', () => {
    const value = {
      '#text': 'Creative Commons Attribution 4.0',
      '@url': 'https://creativecommons.org/licenses/by/4.0/',
    }
    const expected = {
      display: 'Creative Commons Attribution 4.0',
      url: 'https://creativecommons.org/licenses/by/4.0/',
    }

    expect(parseLicense(value)).toEqual(expected)
  })

  it('should parse license with only required display field (as object)', () => {
    const value = {
      '#text': 'All Rights Reserved',
    }
    const expected = {
      display: 'All Rights Reserved',
    }

    expect(parseLicense(value)).toEqual(expected)
  })

  it('should parse license with only required display field (as string)', () => {
    const value = 'All Rights Reserved'
    const expected = {
      display: 'All Rights Reserved',
    }

    expect(parseLicense(value)).toEqual(expected)
  })

  it('should handle coercible values', () => {
    const value = {
      '#text': 123,
      '@url': 456,
    }
    const expected = {
      display: '123',
      url: '456',
    }

    expect(parseLicense(value)).toEqual(expected)
  })

  it('should handle objects with mixed valid and invalid properties', () => {
    const value = {
      '#text': 'Creative Commons Attribution 4.0',
      '@url': 'https://creativecommons.org/licenses/by/4.0/',
      '@invalid': 'property',
    }
    const expected = {
      display: 'Creative Commons Attribution 4.0',
      url: 'https://creativecommons.org/licenses/by/4.0/',
    }

    expect(parseLicense(value)).toEqual(expected)
  })

  it('should return undefined if display is missing', () => {
    const value = {
      '@url': 'https://creativecommons.org/licenses/by/4.0/',
    }

    expect(parseLicense(value)).toBeUndefined()
  })

  it('should return undefined for empty objects', () => {
    const value = {}

    expect(parseLicense(value)).toBeUndefined()
  })

  it('should return undefined for objects with only unrelated properties', () => {
    const value = {
      '@unrelated': 'property',
      random: 'value',
    }

    expect(parseLicense(value)).toBeUndefined()
  })

  it('should return undefined for not supported input', () => {
    expect(parseLicense(undefined)).toBeUndefined()
    expect(parseLicense(null)).toBeUndefined()
    expect(parseLicense([])).toBeUndefined()
  })
})

describe('parseAlternateEnclosure', () => {
  const expectedFull = {
    type: 'audio/mpeg',
    length: 12345678,
    bitrate: 128000,
    height: 0,
    lang: 'en',
    title: 'MP3 Audio',
    rel: 'enclosure',
    codecs: 'mp3',
    default: true,
    sources: [{ uri: 'https://example.com/episode.mp3', contentType: 'audio/mpeg' }],
    integrity: {
      type: 'sha256',
      value: '7694f4a66316e53c8cdd9d79c6d6e5152528a9d2de82758bc08b0025a253ac20',
    },
  }

  it('should parse complete alternateEnclosure object', () => {
    const value = {
      '@type': 'audio/mpeg',
      '@length': 12345678,
      '@bitrate': 128000,
      '@height': 0,
      '@lang': 'en',
      '@title': 'MP3 Audio',
      '@rel': 'enclosure',
      '@codecs': 'mp3',
      '@default': 'true',
      'podcast:source': [
        { '@uri': 'https://example.com/episode.mp3', '@contenttype': 'audio/mpeg' },
      ],
      'podcast:integrity': {
        '@type': 'sha256',
        '@value': '7694f4a66316e53c8cdd9d79c6d6e5152528a9d2de82758bc08b0025a253ac20',
      },
    }
  })

  it('should parse complete alternateEnclosure object (as array of values)', () => {
    const value = {
      '@type': 'audio/mpeg',
      '@length': 12345678,
      '@bitrate': 128000,
      '@height': 0,
      '@lang': 'en',
      '@title': 'MP3 Audio',
      '@rel': 'enclosure',
      '@codecs': 'mp3',
      '@default': 'true',
      'podcast:source': [
        { '@uri': 'https://example.com/episode.mp3', '@contenttype': 'audio/mpeg' },
      ],
      'podcast:integrity': [
        {
          '@type': 'sha256',
          '@value': '7694f4a66316e53c8cdd9d79c6d6e5152528a9d2de82758bc08b0025a253ac20',
        },
      ],
    }

    expect(parseAlternateEnclosure(value)).toEqual(expectedFull)
  })

  it('should parse alternateEnclosure with only required type field', () => {
    const value = {
      '@type': 'audio/mpeg',
    }
    const expected = {
      type: 'audio/mpeg',
    }

    expect(parseAlternateEnclosure(value)).toEqual(expected)
  })

  it('should handle coercible values', () => {
    const value = {
      '@type': 123,
      '@length': '12345678',
      '@bitrate': '128000',
    }
    const expected = {
      type: '123',
      length: 12345678,
      bitrate: 128000,
    }

    expect(parseAlternateEnclosure(value)).toEqual(expected)
  })

  it('should handle boolean conversion', () => {
    const value = {
      '@type': 'audio/mpeg',
      '@default': 'true',
    }
    const expected = {
      type: 'audio/mpeg',
      default: true,
    }

    expect(parseAlternateEnclosure(value)).toEqual(expected)
  })

  it('should handle objects with mixed valid and invalid properties', () => {
    const value = {
      '@type': 'audio/mpeg',
      '@length': 12345678,
      '@invalid': 'property',
    }
    const expected = {
      type: 'audio/mpeg',
      length: 12345678,
    }

    expect(parseAlternateEnclosure(value)).toEqual(expected)
  })

  it('should return undefined if type is missing', () => {
    const value = {
      '@length': 12345678,
      '@bitrate': 128000,
    }

    expect(parseAlternateEnclosure(value)).toBeUndefined()
  })

  it('should return undefined for empty objects', () => {
    const value = {}

    expect(parseAlternateEnclosure(value)).toBeUndefined()
  })

  it('should return undefined for objects with only unrelated properties', () => {
    const value = {
      '@unrelated': 'property',
      random: 'value',
    }

    expect(parseAlternateEnclosure(value)).toBeUndefined()
  })

  it('should return undefined for not supported input', () => {
    expect(parseAlternateEnclosure('not an object')).toBeUndefined()
    expect(parseAlternateEnclosure(undefined)).toBeUndefined()
    expect(parseAlternateEnclosure(null)).toBeUndefined()
    expect(parseAlternateEnclosure([])).toBeUndefined()
  })
})

describe('parseSource', () => {
  it('should parse complete source object', () => {
    const value = {
      '@uri': 'https://example.com/episode.mp3',
      '@contenttype': 'audio/mpeg',
    }
    const expected = {
      uri: 'https://example.com/episode.mp3',
      contentType: 'audio/mpeg',
    }

    expect(parseSource(value)).toEqual(expected)
  })

  it('should parse source with only required uri field', () => {
    const value = {
      '@uri': 'https://example.com/episode.mp3',
    }
    const expected = {
      uri: 'https://example.com/episode.mp3',
    }

    expect(parseSource(value)).toEqual(expected)
  })

  it('should handle coercible values', () => {
    const value = {
      '@uri': 123,
      '@contenttype': 456,
    }
    const expected = {
      uri: '123',
      contentType: '456',
    }

    expect(parseSource(value)).toEqual(expected)
  })

  it('should handle objects with mixed valid and invalid properties', () => {
    const value = {
      '@uri': 'https://example.com/episode.mp3',
      '@contenttype': 'audio/mpeg',
      '@invalid': 'property',
    }
    const expected = {
      uri: 'https://example.com/episode.mp3',
      contentType: 'audio/mpeg',
    }

    expect(parseSource(value)).toEqual(expected)
  })

  it('should return undefined if uri is missing', () => {
    const value = {
      '@contenttype': 'audio/mpeg',
    }

    expect(parseSource(value)).toBeUndefined()
  })

  it('should return undefined for empty objects', () => {
    const value = {}

    expect(parseSource(value)).toBeUndefined()
  })

  it('should return undefined for objects with only unrelated properties', () => {
    const value = {
      '@unrelated': 'property',
      random: 'value',
    }

    expect(parseSource(value)).toBeUndefined()
  })

  it('should return undefined for not supported input', () => {
    expect(parseSource('not an object')).toBeUndefined()
    expect(parseSource(undefined)).toBeUndefined()
    expect(parseSource(null)).toBeUndefined()
    expect(parseSource([])).toBeUndefined()
  })
})

describe('parseIntegrity', () => {
  it('should parse complete integrity object', () => {
    const value = {
      '@type': 'sha256',
      '@value': '7694f4a66316e53c8cdd9d79c6d6e5152528a9d2de82758bc08b0025a253ac20',
    }
    const expected = {
      type: 'sha256',
      value: '7694f4a66316e53c8cdd9d79c6d6e5152528a9d2de82758bc08b0025a253ac20',
    }

    expect(parseIntegrity(value)).toEqual(expected)
  })

  it('should handle coercible values', () => {
    const value = {
      '@type': 123,
      '@value': 456,
    }
    const expected = {
      type: '123',
      value: '456',
    }

    expect(parseIntegrity(value)).toEqual(expected)
  })

  it('should handle objects with mixed valid and invalid properties', () => {
    const value = {
      '@type': 'sha256',
      '@value': '7694f4a66316e53c8cdd9d79c6d6e5152528a9d2de82758bc08b0025a253ac20',
      '@invalid': 'property',
    }
    const expected = {
      type: 'sha256',
      value: '7694f4a66316e53c8cdd9d79c6d6e5152528a9d2de82758bc08b0025a253ac20',
    }

    expect(parseIntegrity(value)).toEqual(expected)
  })

  it('should return undefined if type is missing', () => {
    const value = {
      '@value': '7694f4a66316e53c8cdd9d79c6d6e5152528a9d2de82758bc08b0025a253ac20',
    }

    expect(parseIntegrity(value)).toBeUndefined()
  })

  it('should return undefined if value is missing', () => {
    const value = {
      '@type': 'sha256',
    }

    expect(parseIntegrity(value)).toBeUndefined()
  })

  it('should return undefined for empty objects', () => {
    const value = {}

    expect(parseIntegrity(value)).toBeUndefined()
  })

  it('should return undefined for objects with only unrelated properties', () => {
    const value = {
      '@unrelated': 'property',
      random: 'value',
    }

    expect(parseIntegrity(value)).toBeUndefined()
  })

  it('should return undefined for not supported input', () => {
    expect(parseIntegrity('not an object')).toBeUndefined()
    expect(parseIntegrity(undefined)).toBeUndefined()
    expect(parseIntegrity(null)).toBeUndefined()
    expect(parseIntegrity([])).toBeUndefined()
  })
})

describe('parseValue', () => {
  it('should parse complete value object', () => {
    const value = {
      '@type': 'lightning',
      '@method': 'keysend',
      '@suggested': 0.00000005,
      'podcast:valuerecipient': [
        {
          '@type': 'node',
          '@address': '02d5c1bf8b940dc9cadca86d1b0a3c37fbe39cee4c7e839e33bef9174531d27f52',
          '@split': 90,
          '@name': 'Podcast Host',
        },
      ],
      'podcast:valuetimesplit': [
        {
          '@starttime': 60,
          '@duration': 120,
          'podcast:valuerecipient': {
            '@type': 'node',
            '@address': '02d5c1bf8b940dc9cadca86d1b0a3c37fbe39cee4c7e839e33bef9174531d27f52',
            '@split': 100,
          },
        },
      ],
    }
    const expected = {
      type: 'lightning',
      method: 'keysend',
      suggested: 0.00000005,
      valueRecipients: [
        {
          type: 'node',
          address: '02d5c1bf8b940dc9cadca86d1b0a3c37fbe39cee4c7e839e33bef9174531d27f52',
          split: 90,
          name: 'Podcast Host',
        },
      ],
      valueTimeSplits: [
        {
          startTime: 60,
          duration: 120,
          valueRecipients: [
            {
              type: 'node',
              address: '02d5c1bf8b940dc9cadca86d1b0a3c37fbe39cee4c7e839e33bef9174531d27f52',
              split: 100,
            },
          ],
        },
      ],
    }

    expect(parseValue(value)).toEqual(expected)
  })

  it('should parse value with only required fields', () => {
    const value = {
      '@type': 'lightning',
      '@method': 'keysend',
    }
    const expected = {
      type: 'lightning',
      method: 'keysend',
    }

    expect(parseValue(value)).toEqual(expected)
  })

  it('should handle coercible values', () => {
    const value = {
      '@type': 123,
      '@method': 456,
      '@suggested': '0.00000005',
    }
    const expected = {
      type: '123',
      method: '456',
      suggested: 0.00000005,
    }

    expect(parseValue(value)).toEqual(expected)
  })

  it('should handle objects with mixed valid and invalid properties', () => {
    const value = {
      '@type': 'lightning',
      '@method': 'keysend',
      '@invalid': 'property',
    }
    const expected = {
      type: 'lightning',
      method: 'keysend',
    }

    expect(parseValue(value)).toEqual(expected)
  })

  it('should return undefined if type is missing', () => {
    const value = {
      '@method': 'keysend',
      '@suggested': 0.00000005,
    }

    expect(parseValue(value)).toBeUndefined()
  })

  it('should return undefined if method is missing', () => {
    const value = {
      '@type': 'lightning',
      '@suggested': 0.00000005,
    }

    expect(parseValue(value)).toBeUndefined()
  })

  it('should return undefined for empty objects', () => {
    const value = {}

    expect(parseValue(value)).toBeUndefined()
  })

  it('should return undefined for objects with only unrelated properties', () => {
    const value = {
      '@unrelated': 'property',
      random: 'value',
    }

    expect(parseValue(value)).toBeUndefined()
  })

  it('should return undefined for not supported input', () => {
    expect(parseValue('not an object')).toBeUndefined()
    expect(parseValue(undefined)).toBeUndefined()
    expect(parseValue(null)).toBeUndefined()
    expect(parseValue([])).toBeUndefined()
  })
})

describe('parseValueRecipient', () => {
  it('should parse complete valueRecipient object', () => {
    const value = {
      '@name': 'Podcast Host',
      '@customkey': 'customKeyName',
      '@customvalue': 'customKeyValue',
      '@type': 'node',
      '@address': '02d5c1bf8b940dc9cadca86d1b0a3c37fbe39cee4c7e839e33bef9174531d27f52',
      '@split': 90,
      '@fee': true,
    }
    const expected = {
      name: 'Podcast Host',
      customKey: 'customKeyName',
      customValue: 'customKeyValue',
      type: 'node',
      address: '02d5c1bf8b940dc9cadca86d1b0a3c37fbe39cee4c7e839e33bef9174531d27f52',
      split: 90,
      fee: true,
    }

    expect(parseValueRecipient(value)).toEqual(expected)
  })

  it('should parse valueRecipient with only required fields', () => {
    const value = {
      '@type': 'node',
      '@address': '02d5c1bf8b940dc9cadca86d1b0a3c37fbe39cee4c7e839e33bef9174531d27f52',
      '@split': 90,
    }
    const expected = {
      type: 'node',
      address: '02d5c1bf8b940dc9cadca86d1b0a3c37fbe39cee4c7e839e33bef9174531d27f52',
      split: 90,
    }

    expect(parseValueRecipient(value)).toEqual(expected)
  })

  it('should handle coercible values', () => {
    const value = {
      '@name': 123,
      '@type': 456,
      '@address': 789,
      '@split': '90',
    }
    const expected = {
      name: '123',
      type: '456',
      address: '789',
      split: 90,
    }

    expect(parseValueRecipient(value)).toEqual(expected)
  })

  it('should handle boolean values', () => {
    const value = {
      '@type': 'node',
      '@address': '02d5c1bf8b940dc9cadca86d1b0a3c37fbe39cee4c7e839e33bef9174531d27f52',
      '@split': 90,
      '@fee': 'true',
    }
    const expected = {
      type: 'node',
      address: '02d5c1bf8b940dc9cadca86d1b0a3c37fbe39cee4c7e839e33bef9174531d27f52',
      split: 90,
      fee: true,
    }

    expect(parseValueRecipient(value)).toEqual(expected)
  })

  it('should handle objects with mixed valid and invalid properties', () => {
    const value = {
      '@type': 'node',
      '@address': '02d5c1bf8b940dc9cadca86d1b0a3c37fbe39cee4c7e839e33bef9174531d27f52',
      '@split': 90,
      '@invalid': 'property',
    }
    const expected = {
      type: 'node',
      address: '02d5c1bf8b940dc9cadca86d1b0a3c37fbe39cee4c7e839e33bef9174531d27f52',
      split: 90,
    }

    expect(parseValueRecipient(value)).toEqual(expected)
  })

  it('should return undefined if type is missing', () => {
    const value = {
      '@address': '02d5c1bf8b940dc9cadca86d1b0a3c37fbe39cee4c7e839e33bef9174531d27f52',
      '@split': 90,
    }

    expect(parseValueRecipient(value)).toBeUndefined()
  })

  it('should return undefined if address is missing', () => {
    const value = {
      '@type': 'node',
      '@split': 90,
    }

    expect(parseValueRecipient(value)).toBeUndefined()
  })

  it('should return undefined if split is missing', () => {
    const value = {
      '@type': 'node',
      '@address': '02d5c1bf8b940dc9cadca86d1b0a3c37fbe39cee4c7e839e33bef9174531d27f52',
    }

    expect(parseValueRecipient(value)).toBeUndefined()
  })

  it('should return undefined if split cannot be parsed as a number', () => {
    const value = {
      '@type': 'node',
      '@address': '02d5c1bf8b940dc9cadca86d1b0a3c37fbe39cee4c7e839e33bef9174531d27f52',
      '@split': 'not a number',
    }

    expect(parseValueRecipient(value)).toBeUndefined()
  })

  it('should return undefined for empty objects', () => {
    const value = {}

    expect(parseValueRecipient(value)).toBeUndefined()
  })

  it('should return undefined for objects with only unrelated properties', () => {
    const value = {
      '@unrelated': 'property',
      random: 'value',
    }

    expect(parseValueRecipient(value)).toBeUndefined()
  })

  it('should return undefined for not supported input', () => {
    expect(parseValueRecipient('not an object')).toBeUndefined()
    expect(parseValueRecipient(undefined)).toBeUndefined()
    expect(parseValueRecipient(null)).toBeUndefined()
    expect(parseValueRecipient([])).toBeUndefined()
  })
})

describe('parseImages', () => {
  it('should parse a complete images object with srcset', () => {
    const value = {
      '@srcset': 'image-1x.jpg 1x, image-2x.jpg 2x, image-3x.jpg 3x',
    }
    const expected = {
      srcset: 'image-1x.jpg 1x, image-2x.jpg 2x, image-3x.jpg 3x',
    }

    expect(parseImages(value)).toEqual(expected)
  })

  it('should handle coercible number values', () => {
    const value = {
      '@srcset': 123,
    }
    const expected = {
      srcset: '123',
    }

    expect(parseImages(value)).toEqual(expected)
  })

  it('should handle objects with mixed valid and invalid properties', () => {
    const value = {
      '@srcset': 'image-1x.jpg 1x, image-2x.jpg 2x',
      '@invalid': 'property',
      random: 'value',
    }
    const expected = {
      srcset: 'image-1x.jpg 1x, image-2x.jpg 2x',
    }

    expect(parseImages(value)).toEqual(expected)
  })

  it('should return undefined if srcset is missing', () => {
    const value = {
      '@someotherproperty': 'value',
    }

    expect(parseImages(value)).toBeUndefined()
  })

  it('should return undefined for empty objects', () => {
    const value = {}

    expect(parseImages(value)).toBeUndefined()
  })

  it('should return undefined for non-object inputs', () => {
    expect(parseImages('not an object')).toBeUndefined()
    expect(parseImages(false)).toBeUndefined()
    expect(parseImages(undefined)).toBeUndefined()
    expect(parseImages(null)).toBeUndefined()
    expect(parseImages([])).toBeUndefined()
    expect(parseImages(123)).toBeUndefined()
  })
})

describe('parseLiveItem', () => {
  it('should parse complete liveItem object', () => {
    const value = {
      '@status': 'live',
      '@start': '2023-06-15T15:00:00Z',
      '@end': '2023-06-15T16:00:00Z',
      'podcast:contentlink': [
        {
          '@href': 'https://example.com/livestream',
          '#text': 'Watch our livestream',
        },
        {
          '@href': 'https://example.com/chat',
          '#text': 'Join the chat',
        },
      ],
      // Below are items from a regular Item object.
      'podcast:person': [
        {
          '#text': 'Jane Doe',
          '@role': 'host',
        },
      ],
      'podcast:location': {
        '#text': 'New York, NY',
        '@geo': '40.7128,-74.0060',
      },
    }
    const expected = {
      status: 'live',
      start: '2023-06-15T15:00:00Z',
      end: '2023-06-15T16:00:00Z',
      contentlinks: [
        {
          href: 'https://example.com/livestream',
          display: 'Watch our livestream',
        },
        {
          href: 'https://example.com/chat',
          display: 'Join the chat',
        },
      ],
      persons: [
        {
          display: 'Jane Doe',
          role: 'host',
        },
      ],
      location: {
        display: 'New York, NY',
        geo: '40.7128,-74.0060',
      },
    }

    expect(parseLiveItem(value)).toEqual(expected)
  })

  it('should parse liveItem with only required fields', () => {
    const value = {
      '@status': 'pending',
      '@start': '2023-06-15T15:00:00Z',
    }
    const expected = {
      status: 'pending',
      start: '2023-06-15T15:00:00Z',
    }

    expect(parseLiveItem(value)).toEqual(expected)
  })

  it('should parse liveItem with single contentLink as object', () => {
    const value = {
      '@status': 'live',
      '@start': '2023-06-15T15:00:00Z',
      'podcast:contentlink': {
        '@href': 'https://example.com/livestream',
        '#text': 'Watch our livestream',
      },
    }
    const expected = {
      status: 'live',
      start: '2023-06-15T15:00:00Z',
      contentlinks: [
        {
          href: 'https://example.com/livestream',
          display: 'Watch our livestream',
        },
      ],
    }

    expect(parseLiveItem(value)).toEqual(expected)
  })

  it('should handle coercible values', () => {
    const value = {
      '@status': 123,
      '@start': 456,
      '@end': 789,
    }
    const expected = {
      status: '123',
      start: '456',
      end: '789',
    }

    expect(parseLiveItem(value)).toEqual(expected)
  })

  it('should handle objects with mixed valid and invalid properties', () => {
    const value = {
      '@status': 'live',
      '@start': '2023-06-15T15:00:00Z',
      '@invalid': 'property',
      'podcast:contentlink': [
        {
          '@href': 'https://example.com/livestream',
          '#text': 'Watch our livestream',
        },
        {
          '#text': 'Invalid link', // Missing href.
        },
      ],
    }
    const expected = {
      status: 'live',
      start: '2023-06-15T15:00:00Z',
      contentlinks: [
        {
          href: 'https://example.com/livestream',
          display: 'Watch our livestream',
        },
      ],
    }

    expect(parseLiveItem(value)).toEqual(expected)
  })

  it('should return undefined if status is missing', () => {
    const value = {
      '@start': '2023-06-15T15:00:00Z',
      '@end': '2023-06-15T16:00:00Z',
    }

    expect(parseLiveItem(value)).toBeUndefined()
  })

  it('should return undefined if start is missing', () => {
    const value = {
      '@status': 'live',
      '@end': '2023-06-15T16:00:00Z',
    }

    expect(parseLiveItem(value)).toBeUndefined()
  })

  it('should return undefined for empty objects', () => {
    const value = {}

    expect(parseLiveItem(value)).toBeUndefined()
  })

  it('should return undefined for objects with only unrelated properties', () => {
    const value = {
      '@unrelated': 'property',
      random: 'value',
    }

    expect(parseLiveItem(value)).toBeUndefined()
  })

  it('should return undefined for not supported input', () => {
    expect(parseLiveItem('not an object')).toBeUndefined()
    expect(parseLiveItem(undefined)).toBeUndefined()
    expect(parseLiveItem(null)).toBeUndefined()
    expect(parseLiveItem([])).toBeUndefined()
  })
})

describe('parseContentLink', () => {
  it('should parse complete content link object', () => {
    const value = {
      '@href': 'https://example.com/livestream',
      '#text': 'Watch our livestream',
    }
    const expected = {
      href: 'https://example.com/livestream',
      display: 'Watch our livestream',
    }

    expect(parseContentLink(value)).toEqual(expected)
  })

  it('should handle coercible number values', () => {
    const value = {
      '@href': 'https://example.com/livestream',
      '#text': 123,
    }
    const expected = {
      href: 'https://example.com/livestream',
      display: '123',
    }

    expect(parseContentLink(value)).toEqual(expected)
  })

  it('should handle objects with mixed valid and invalid properties', () => {
    const value = {
      '@href': 'https://example.com/livestream',
      '#text': 'Watch our livestream',
      '@invalid': 'property',
    }
    const expected = {
      href: 'https://example.com/livestream',
      display: 'Watch our livestream',
    }

    expect(parseContentLink(value)).toEqual(expected)
  })

  it('should return undefined if href is missing', () => {
    const value = {
      '#text': 'Watch our livestream',
    }

    expect(parseContentLink(value)).toBeUndefined()
  })

  it('should return undefined for empty objects', () => {
    const value = {}

    expect(parseContentLink(value)).toBeUndefined()
  })

  it('should return undefined for objects with only unrelated properties', () => {
    const value = {
      '@unrelated': 'property',
      random: 'value',
    }

    expect(parseContentLink(value)).toBeUndefined()
  })

  it('should return undefined for not supported input', () => {
    expect(parseContentLink('not an object')).toBeUndefined()
    expect(parseContentLink(undefined)).toBeUndefined()
    expect(parseContentLink(null)).toBeUndefined()
    expect(parseContentLink([])).toBeUndefined()
  })
})

describe('parseSocialInteract', () => {
  it('should parse complete social interact object', () => {
    const value = {
      '@uri': 'https://example.com/episodes/1/comments',
      '@protocol': 'activitypub',
      '@accountid': 'user@example.com',
      '@accounturl': 'https://example.com/users/user',
      '@priority': 1,
    }
    const expected = {
      uri: 'https://example.com/episodes/1/comments',
      protocol: 'activitypub',
      accountId: 'user@example.com',
      accountUrl: 'https://example.com/users/user',
      priority: 1,
    }

    expect(parseSocialInteract(value)).toEqual(expected)
  })

  it('should parse social interact with only required fields', () => {
    const value = {
      '@protocol': 'disabled',
    }
    const expected = {
      protocol: 'disabled',
    }

    expect(parseSocialInteract(value)).toEqual(expected)
  })

  it('should handle coercible values', () => {
    const value = {
      '@uri': 'https://example.com/episodes/1/comments',
      '@protocol': 'activitypub',
      '@priority': '5',
    }
    const expected = {
      uri: 'https://example.com/episodes/1/comments',
      protocol: 'activitypub',
      priority: 5,
    }

    expect(parseSocialInteract(value)).toEqual(expected)
  })

  it('should handle objects with mixed valid and invalid properties', () => {
    const value = {
      '@uri': 'https://example.com/episodes/1/comments',
      '@protocol': 'activitypub',
      '@invalid': 'property',
    }
    const expected = {
      uri: 'https://example.com/episodes/1/comments',
      protocol: 'activitypub',
    }

    expect(parseSocialInteract(value)).toEqual(expected)
  })

  it('should return undefined for empty objects', () => {
    const value = {}

    expect(parseSocialInteract(value)).toBeUndefined()
  })

  it('should return undefined for objects with only unrelated properties', () => {
    const value = {
      '@unrelated': 'property',
      random: 'value',
    }

    expect(parseSocialInteract(value)).toBeUndefined()
  })

  it('should return undefined for not supported input', () => {
    expect(parseSocialInteract('not an object')).toBeUndefined()
    expect(parseSocialInteract(undefined)).toBeUndefined()
    expect(parseSocialInteract(null)).toBeUndefined()
    expect(parseSocialInteract([])).toBeUndefined()
  })
})

describe('parseBlock', () => {
  it('should parse complete block object', () => {
    const value = {
      '#text': 'yes',
      '@id': 'spotify',
    }
    const expected = {
      value: true,
      id: 'spotify',
    }

    expect(parseBlock(value)).toEqual(expected)
  })

  it('should parse block with only required value field (as object)', () => {
    const value = {
      '#text': 'yes',
    }
    const expected = {
      value: true,
    }

    expect(parseBlock(value)).toEqual(expected)
  })

  it('should parse block with only required value field (as string)', () => {
    const value = 'yes'
    const expected = {
      value: true,
    }

    expect(parseBlock(value)).toEqual(expected)
  })

  it('should parse block with only required value field with negative value', () => {
    const value = {
      '#text': 'no',
    }
    const expected = {
      value: false,
    }

    expect(parseBlock(value)).toEqual(expected)
  })

  it('should handle objects with mixed valid and invalid properties', () => {
    const value = {
      '#text': 'yes',
      '@id': 'spotify',
      '@invalid': 'property',
    }
    const expected = {
      value: true,
      id: 'spotify',
    }

    expect(parseBlock(value)).toEqual(expected)
  })

  it('should return false value if not a valid yes/no string', () => {
    const value = {
      '#text': 'invalid',
      '@id': 'spotify',
    }
    const expected = {
      value: false,
      id: 'spotify',
    }

    expect(parseBlock(value)).toEqual(expected)
  })

  it('should return undefined if value is missing', () => {
    const value = {
      '@id': 'spotify',
    }

    expect(parseBlock(value)).toBeUndefined()
  })

  it('should return undefined for empty objects', () => {
    const value = {}

    expect(parseBlock(value)).toBeUndefined()
  })

  it('should return undefined for objects with only unrelated properties', () => {
    const value = {
      '@unrelated': 'property',
      random: 'value',
    }

    expect(parseBlock(value)).toBeUndefined()
  })

  it('should return undefined for not supported input', () => {
    expect(parseBlock(undefined)).toBeUndefined()
    expect(parseBlock(null)).toBeUndefined()
    expect(parseBlock([])).toBeUndefined()
  })
})

describe('parseTxt', () => {
  it('should parse complete txt object', () => {
    const value = {
      '#text': 'Additional podcast information',
      '@purpose': 'description',
    }
    const expected = {
      display: 'Additional podcast information',
      purpose: 'description',
    }

    expect(parseTxt(value)).toEqual(expected)
  })

  it('should parse txt with only required display field (as object)', () => {
    const value = {
      '#text': 'Additional podcast information',
    }
    const expected = {
      display: 'Additional podcast information',
    }

    expect(parseTxt(value)).toEqual(expected)
  })

  it('should parse txt with only required display field (as string)', () => {
    const value = 'Additional podcast information'
    const expected = {
      display: 'Additional podcast information',
    }

    expect(parseTxt(value)).toEqual(expected)
  })

  it('should handle coercible number values', () => {
    const value = {
      '#text': 'Additional podcast information',
      '@purpose': 123,
    }
    const expected = {
      display: 'Additional podcast information',
      purpose: '123',
    }

    expect(parseTxt(value)).toEqual(expected)
  })

  it('should handle objects with mixed valid and invalid properties', () => {
    const value = {
      '#text': 'Additional podcast information',
      '@purpose': 'description',
      '@invalid': 'property',
    }
    const expected = {
      display: 'Additional podcast information',
      purpose: 'description',
    }

    expect(parseTxt(value)).toEqual(expected)
  })

  it('should return undefined if display is missing', () => {
    const value = {
      '@purpose': 'description',
    }

    expect(parseTxt(value)).toBeUndefined()
  })

  it('should return undefined for empty objects', () => {
    const value = {}

    expect(parseTxt(value)).toBeUndefined()
  })

  it('should return undefined for objects with only unrelated properties', () => {
    const value = {
      '@unrelated': 'property',
      random: 'value',
    }

    expect(parseTxt(value)).toBeUndefined()
  })

  it('should return undefined for not supported input', () => {
    expect(parseTxt(undefined)).toBeUndefined()
    expect(parseTxt(null)).toBeUndefined()
    expect(parseTxt([])).toBeUndefined()
  })
})

describe('parseRemoteItem', () => {
  it('should parse complete remote item object', () => {
    const value = {
      '@feedguid': 'urn:uuid:fdafc891-1b24-59de-85bc-a41f6fad5dbd',
      '@feedurl': 'https://example.com/feed.xml',
      '@itemguid': 'urn:uuid:4cef2a1f-9b8e-56fc-ba91-f7e401311de3',
      '@medium': 'podcast',
    }
    const expected = {
      feedGuid: 'urn:uuid:fdafc891-1b24-59de-85bc-a41f6fad5dbd',
      feedUrl: 'https://example.com/feed.xml',
      itemGuid: 'urn:uuid:4cef2a1f-9b8e-56fc-ba91-f7e401311de3',
      medium: 'podcast',
    }

    expect(parseRemoteItem(value)).toEqual(expected)
  })

  it('should parse remote item with only required feedGuid field', () => {
    const value = {
      '@feedguid': 'urn:uuid:fdafc891-1b24-59de-85bc-a41f6fad5dbd',
    }
    const expected = {
      feedGuid: 'urn:uuid:fdafc891-1b24-59de-85bc-a41f6fad5dbd',
    }

    expect(parseRemoteItem(value)).toEqual(expected)
  })

  it('should handle coercible number values', () => {
    const value = {
      '@feedguid': 'urn:uuid:fdafc891-1b24-59de-85bc-a41f6fad5dbd',
      '@medium': 123,
    }
    const expected = {
      feedGuid: 'urn:uuid:fdafc891-1b24-59de-85bc-a41f6fad5dbd',
      medium: '123',
    }

    expect(parseRemoteItem(value)).toEqual(expected)
  })

  it('should handle objects with mixed valid and invalid properties', () => {
    const value = {
      '@feedguid': 'urn:uuid:fdafc891-1b24-59de-85bc-a41f6fad5dbd',
      '@feedurl': 'https://example.com/feed.xml',
      '@invalid': 'property',
    }
    const expected = {
      feedGuid: 'urn:uuid:fdafc891-1b24-59de-85bc-a41f6fad5dbd',
      feedUrl: 'https://example.com/feed.xml',
    }

    expect(parseRemoteItem(value)).toEqual(expected)
  })

  it('should return undefined if feedGuid is missing', () => {
    const value = {
      '@feedurl': 'https://example.com/feed.xml',
      '@itemguid': 'urn:uuid:4cef2a1f-9b8e-56fc-ba91-f7e401311de3',
    }

    expect(parseRemoteItem(value)).toBeUndefined()
  })

  it('should return undefined for empty objects', () => {
    const value = {}

    expect(parseRemoteItem(value)).toBeUndefined()
  })

  it('should return undefined for objects with only unrelated properties', () => {
    const value = {
      '@unrelated': 'property',
      random: 'value',
    }

    expect(parseRemoteItem(value)).toBeUndefined()
  })

  it('should return undefined for not supported input', () => {
    expect(parseRemoteItem('not an object')).toBeUndefined()
    expect(parseRemoteItem(undefined)).toBeUndefined()
    expect(parseRemoteItem(null)).toBeUndefined()
    expect(parseRemoteItem([])).toBeUndefined()
  })
})

describe('parsePodroll', () => {
  it('should parse podroll with remoteItems', () => {
    const value = {
      'podcast:remoteitem': [
        {
          '@feedguid': 'urn:uuid:fdafc891-1b24-59de-85bc-a41f6fad5dbd',
          '@feedurl': 'https://example.com/feed1.xml',
        },
        {
          '@feedguid': 'urn:uuid:8eb78004-d85a-51dc-9126-e291618ca9ae',
          '@feedurl': 'https://example.com/feed2.xml',
        },
      ],
    }
    const expected = {
      remoteItems: [
        {
          feedGuid: 'urn:uuid:fdafc891-1b24-59de-85bc-a41f6fad5dbd',
          feedUrl: 'https://example.com/feed1.xml',
        },
        {
          feedGuid: 'urn:uuid:8eb78004-d85a-51dc-9126-e291618ca9ae',
          feedUrl: 'https://example.com/feed2.xml',
        },
      ],
    }

    expect(parsePodroll(value)).toEqual(expected)
  })

  it('should parse podroll with single remoteItem', () => {
    const value = {
      'podcast:remoteitem': {
        '@feedguid': 'urn:uuid:fdafc891-1b24-59de-85bc-a41f6fad5dbd',
        '@feedurl': 'https://example.com/feed.xml',
      },
    }
    const expected = {
      remoteItems: [
        {
          feedGuid: 'urn:uuid:fdafc891-1b24-59de-85bc-a41f6fad5dbd',
          feedUrl: 'https://example.com/feed.xml',
        },
      ],
    }

    expect(parsePodroll(value)).toEqual(expected)
  })

  it('should filter out invalid remoteItems', () => {
    const value = {
      'podcast:remoteitem': [
        {
          '@feedguid': 'urn:uuid:fdafc891-1b24-59de-85bc-a41f6fad5dbd',
          '@feedurl': 'https://example.com/feed1.xml',
        },
        {
          '@feedurl': 'https://example.com/feed2.xml',
        },
      ],
    }
    const expected = {
      remoteItems: [
        {
          feedGuid: 'urn:uuid:fdafc891-1b24-59de-85bc-a41f6fad5dbd',
          feedUrl: 'https://example.com/feed1.xml',
        },
      ],
    }

    expect(parsePodroll(value)).toEqual(expected)
  })

  it('should handle objects with mixed valid and invalid properties', () => {
    const value = {
      'podcast:remoteitem': [
        {
          '@feedguid': 'urn:uuid:fdafc891-1b24-59de-85bc-a41f6fad5dbd',
        },
      ],
      '@invalid': 'property',
    }
    const expected = {
      remoteItems: [
        {
          feedGuid: 'urn:uuid:fdafc891-1b24-59de-85bc-a41f6fad5dbd',
        },
      ],
    }

    expect(parsePodroll(value)).toEqual(expected)
  })

  it('should return undefined if no valid remoteItems exist', () => {
    const value = {
      'podcast:remoteitem': [
        { '@feedurl': 'https://example.com/feed1.xml' },
        { '@medium': 'podcast' },
      ],
    }

    expect(parsePodroll(value)).toBeUndefined()
  })

  it('should return undefined for empty objects', () => {
    const value = {}

    expect(parsePodroll(value)).toBeUndefined()
  })

  it('should return undefined for objects with only unrelated properties', () => {
    const value = {
      '@unrelated': 'property',
      random: 'value',
    }

    expect(parsePodroll(value)).toBeUndefined()
  })

  it('should return undefined for not supported input', () => {
    expect(parsePodroll('not an object')).toBeUndefined()
    expect(parsePodroll(undefined)).toBeUndefined()
    expect(parsePodroll(null)).toBeUndefined()
    expect(parsePodroll([])).toBeUndefined()
  })
})

describe('parseUpdateFrequency', () => {
  it('should parse complete update frequency object', () => {
    const value = {
      '#text': 'Weekly on Mondays',
      '@complete': 'true',
      '@dtstart': '2023-01-01',
      '@rrule': 'FREQ=WEEKLY;BYDAY=MO',
    }
    const expected = {
      display: 'Weekly on Mondays',
      complete: true,
      dtstart: '2023-01-01',
      rrule: 'FREQ=WEEKLY;BYDAY=MO',
    }

    expect(parseUpdateFrequency(value)).toEqual(expected)
  })

  it('should parse update frequency with only required display field (as object)', () => {
    const value = {
      '#text': 'Weekly on Mondays',
    }
    const expected = {
      display: 'Weekly on Mondays',
    }

    expect(parseUpdateFrequency(value)).toEqual(expected)
  })

  it('should parse update frequency with only required display field (as string)', () => {
    const value = 'Weekly on Mondays'
    const expected = {
      display: 'Weekly on Mondays',
    }

    expect(parseUpdateFrequency(value)).toEqual(expected)
  })

  it('should handle coercible values', () => {
    const value = {
      '#text': 'Weekly on Mondays',
      '@complete': 'true',
    }
    const expected = {
      display: 'Weekly on Mondays',
      complete: true,
    }

    expect(parseUpdateFrequency(value)).toEqual(expected)
  })

  it('should handle objects with mixed valid and invalid properties', () => {
    const value = {
      '#text': 'Weekly on Mondays',
      '@dtstart': '2023-01-01',
      '@invalid': 'property',
    }
    const expected = {
      display: 'Weekly on Mondays',
      dtstart: '2023-01-01',
    }

    expect(parseUpdateFrequency(value)).toEqual(expected)
  })

  it('should return undefined if display is missing', () => {
    const value = {
      '@complete': 'true',
      '@dtstart': '2023-01-01',
    }

    expect(parseUpdateFrequency(value)).toBeUndefined()
  })

  it('should return undefined for empty objects', () => {
    const value = {}

    expect(parseUpdateFrequency(value)).toBeUndefined()
  })

  it('should return undefined for objects with only unrelated properties', () => {
    const value = {
      '@unrelated': 'property',
      random: 'value',
    }

    expect(parseUpdateFrequency(value)).toBeUndefined()
  })

  it('should return undefined for not supported input', () => {
    expect(parseUpdateFrequency(undefined)).toBeUndefined()
    expect(parseUpdateFrequency(null)).toBeUndefined()
    expect(parseUpdateFrequency([])).toBeUndefined()
  })
})

describe('parsePodping', () => {
  it('should parse complete podping object', () => {
    const value = {
      '@usespodping': 'true',
    }
    const expected = {
      usesPodping: true,
    }

    expect(parsePodping(value)).toEqual(expected)
  })

  it('should handle objects with mixed valid and invalid properties', () => {
    const value = {
      '@usespodping': 'false',
      '@invalid': 'property',
    }
    const expected = {
      usesPodping: false,
    }

    expect(parsePodping(value)).toEqual(expected)
  })

  it('should return undefined if usesPodping is missing', () => {
    const value = {
      '@somethingelse': 'value',
    }

    expect(parsePodping(value)).toBeUndefined()
  })

  it('should return undefined for empty objects', () => {
    const value = {}

    expect(parsePodping(value)).toBeUndefined()
  })

  it('should return undefined for objects with only unrelated properties', () => {
    const value = {
      '@unrelated': 'property',
      random: 'value',
    }

    expect(parsePodping(value)).toBeUndefined()
  })

  it('should return undefined for not supported input', () => {
    expect(parsePodping('not an object')).toBeUndefined()
    expect(parsePodping(undefined)).toBeUndefined()
    expect(parsePodping(null)).toBeUndefined()
    expect(parsePodping([])).toBeUndefined()
  })
})

describe('parseValueTimeSplit', () => {
  const expectedFull = {
    startTime: 120.5,
    duration: 30.0,
    remoteStartTime: 0,
    remotePercentage: 50,
    remoteItem: {
      feedGuid: 'urn:uuid:fdafc891-1b24-59de-85bc-a41f6fad5dbd',
      feedUrl: 'https://example.com/feed.xml',
    },
    valueRecipients: [
      {
        type: 'payment',
        address: 'example@example.com',
        split: 50,
      },
      {
        type: 'payment',
        address: 'another@example.com',
        split: 50,
      },
    ],
  }

  it('should parse complete value time split object', () => {
    const value = {
      '@starttime': 120.5,
      '@duration': 30.0,
      '@remotestarttime': 0,
      '@remotepercentage': 50,
      'podcast:remoteitem': {
        '@feedguid': 'urn:uuid:fdafc891-1b24-59de-85bc-a41f6fad5dbd',
        '@feedurl': 'https://example.com/feed.xml',
      },
      'podcast:valuerecipient': [
        {
          '@type': 'payment',
          '@address': 'example@example.com',
          '@split': 50,
        },
        {
          '@type': 'payment',
          '@address': 'another@example.com',
          '@split': 50,
        },
      ],
    }

    expect(parseValueTimeSplit(value)).toEqual(expectedFull)
  })

  it('should parse complete value time split object (as array of values)', () => {
    const value = {
      '@starttime': 120.5,
      '@duration': 30.0,
      '@remotestarttime': 0,
      '@remotepercentage': 50,
      'podcast:remoteitem': [
        {
          '@feedguid': 'urn:uuid:fdafc891-1b24-59de-85bc-a41f6fad5dbd',
          '@feedurl': 'https://example.com/feed.xml',
        },
      ],
      'podcast:valuerecipient': [
        {
          '@type': 'payment',
          '@address': 'example@example.com',
          '@split': 50,
        },
        {
          '@type': 'payment',
          '@address': 'another@example.com',
          '@split': 50,
        },
      ],
    }

    expect(parseValueTimeSplit(value)).toEqual(expectedFull)
  })

  it('should parse value time split with only required fields', () => {
    const value = {
      '@starttime': 120.5,
      '@duration': 30.0,
    }
    const expected = {
      startTime: 120.5,
      duration: 30.0,
    }

    expect(parseValueTimeSplit(value)).toEqual(expected)
  })

  it('should handle coercible string values for numbers', () => {
    const value = {
      '@starttime': '120.5',
      '@duration': '30',
      '@remotepercentage': '50',
    }
    const expected = {
      startTime: 120.5,
      duration: 30,
      remotePercentage: 50,
    }

    expect(parseValueTimeSplit(value)).toEqual(expected)
  })

  it('should handle single value recipient', () => {
    const value = {
      '@starttime': 120.5,
      '@duration': 30.0,
      'podcast:valuerecipient': {
        '@type': 'payment',
        '@address': 'example@example.com',
        '@split': 100,
      },
    }
    const expected = {
      startTime: 120.5,
      duration: 30.0,
      valueRecipients: [
        {
          type: 'payment',
          address: 'example@example.com',
          split: 100,
        },
      ],
    }

    expect(parseValueTimeSplit(value)).toEqual(expected)
  })

  it('should handle remoteItem correctly', () => {
    const value = {
      '@starttime': 120.5,
      '@duration': 30.0,
      'podcast:remoteitem': {
        '@feedguid': 'urn:uuid:fdafc891-1b24-59de-85bc-a41f6fad5dbd',
        '@feedurl': 'https://example.com/feed.xml',
      },
    }
    const expected = {
      startTime: 120.5,
      duration: 30.0,
      remoteItem: {
        feedGuid: 'urn:uuid:fdafc891-1b24-59de-85bc-a41f6fad5dbd',
        feedUrl: 'https://example.com/feed.xml',
      },
    }

    expect(parseValueTimeSplit(value)).toEqual(expected)
  })

  it('should filter out invalid value recipients', () => {
    const value = {
      '@starttime': 120.5,
      '@duration': 30.0,
      'podcast:valuerecipient': [
        { '@type': 'payment', '@address': 'example@example.com', '@split': '30' },
        { '@type': 'payment' },
        { '@address': 'missing-type@example.com' },
      ],
    }
    const expected = {
      startTime: 120.5,
      duration: 30.0,
      valueRecipients: [
        {
          type: 'payment',
          address: 'example@example.com',
          split: 30,
        },
      ],
    }

    // @ts-ignore: This is for testing purposes.
    expect(parseValueTimeSplit(value)).toEqual(expected)
  })

  it('should not include invalid remoteItem', () => {
    const value = {
      '@starttime': 120.5,
      '@duration': 30.0,
      'podcast:remoteitem': {
        '@feedurl': 'https://example.com/feed.xml',
      },
    }
    const expected = {
      startTime: 120.5,
      duration: 30.0,
    }

    expect(parseValueTimeSplit(value)).toEqual(expected)
  })

  it('should handle objects with mixed valid and invalid properties', () => {
    const value = {
      '@starttime': 120.5,
      '@duration': 30.0,
      '@invalid': 'property',
      random: 'value',
    }
    const expected = {
      startTime: 120.5,
      duration: 30.0,
    }

    expect(parseValueTimeSplit(value)).toEqual(expected)
  })

  it('should return undefined if startTime is missing', () => {
    const value = {
      '@duration': 30.0,
      '@remotepercentage': 50,
    }

    expect(parseValueTimeSplit(value)).toBeUndefined()
  })

  it('should return undefined if duration is missing', () => {
    const value = {
      '@starttime': 120.5,
      '@remotepercentage': 50,
    }

    expect(parseValueTimeSplit(value)).toBeUndefined()
  })

  it('should return undefined for empty objects', () => {
    const value = {}

    expect(parseValueTimeSplit(value)).toBeUndefined()
  })

  it('should return undefined for objects with only unrelated properties', () => {
    const value = {
      '@unrelated': 'property',
      random: 'value',
    }

    expect(parseValueTimeSplit(value)).toBeUndefined()
  })

  it('should return undefined for not supported input', () => {
    expect(parseValueTimeSplit('not an object')).toBeUndefined()
    expect(parseValueTimeSplit(undefined)).toBeUndefined()
    expect(parseValueTimeSplit(null)).toBeUndefined()
    expect(parseValueTimeSplit([])).toBeUndefined()
  })
})

describe('retrieveItem', () => {
  const expectedFull = {
    transcripts: [
      {
        url: 'https://example.com/transcript.json',
        type: 'application/json',
        language: 'en',
      },
    ],
    chapters: {
      url: 'https://example.com/chapters.json',
      type: 'application/json',
    },
    soundbites: [
      {
        startTime: 60,
        duration: 30,
        display: 'This is a key moment',
      },
    ],
    persons: [
      {
        display: 'Jane Doe',
        role: 'host',
        img: 'https://example.com/janedoe.jpg',
      },
      {
        display: 'John Smith',
        role: 'guest',
      },
    ],
    location: {
      display: 'New York, NY',
      geo: '40.7128,-74.0060',
    },
    season: {
      number: 2,
      name: 'Second Season',
    },
    episode: {
      number: 5,
      display: 'The Fifth Episode',
    },
    license: {
      display: 'CC BY 4.0',
      url: 'https://creativecommons.org/licenses/by/4.0/',
    },
    alternateEnclosures: [
      {
        type: 'audio/mpeg',
        length: 12345678,
        bitrate: 128000,
        sources: [
          {
            uri: 'https://example.com/episode.mp3',
          },
        ],
      },
    ],
    value: {
      type: 'lightning',
      method: 'keysend',
      suggested: 0.00000005,
      valueRecipients: [
        {
          type: 'node',
          address: '02d5c1bf8b940dc9cadca86d1b0a3c37fbe39cee4c7e839e33bef9174531d27f52',
          split: 100,
        },
      ],
    },
    socialInteracts: [
      {
        uri: 'https://example.com/episodes/1/comments',
        protocol: 'activitypub',
      },
    ],
    images: {
      srcset: 'image-1x.jpg 1x, image-2x.jpg 2x',
    },
    txts: [
      {
        display: 'Additional information',
        purpose: 'description',
      },
    ],
  }

  it('should parse a complete item with all podcast namespace elements', () => {
    const value = {
      'podcast:transcript': [
        {
          '@url': 'https://example.com/transcript.json',
          '@type': 'application/json',
          '@language': 'en',
        },
      ],
      'podcast:chapters': {
        '@url': 'https://example.com/chapters.json',
        '@type': 'application/json',
      },
      'podcast:soundbite': [
        {
          '@starttime': 60,
          '@duration': 30,
          '#text': 'This is a key moment',
        },
      ],
      'podcast:person': [
        {
          '#text': 'Jane Doe',
          '@role': 'host',
          '@img': 'https://example.com/janedoe.jpg',
        },
        {
          '#text': 'John Smith',
          '@role': 'guest',
        },
      ],
      'podcast:location': {
        '#text': 'New York, NY',
        '@geo': '40.7128,-74.0060',
      },
      'podcast:season': {
        '#text': 2,
        '@name': 'Second Season',
      },
      'podcast:episode': {
        '#text': 5,
        '@display': 'The Fifth Episode',
      },
      'podcast:license': {
        '#text': 'CC BY 4.0',
        '@url': 'https://creativecommons.org/licenses/by/4.0/',
      },
      'podcast:alternateenclosure': [
        {
          '@type': 'audio/mpeg',
          '@length': 12345678,
          '@bitrate': 128000,
          'podcast:source': {
            '@uri': 'https://example.com/episode.mp3',
          },
        },
      ],
      'podcast:value': {
        '@type': 'lightning',
        '@method': 'keysend',
        '@suggested': 0.00000005,
        'podcast:valuerecipient': {
          '@type': 'node',
          '@address': '02d5c1bf8b940dc9cadca86d1b0a3c37fbe39cee4c7e839e33bef9174531d27f52',
          '@split': 100,
        },
      },
      'podcast:images': {
        '@srcset': 'image-1x.jpg 1x, image-2x.jpg 2x',
      },
      'podcast:socialinteract': [
        {
          '@uri': 'https://example.com/episodes/1/comments',
          '@protocol': 'activitypub',
        },
      ],
      'podcast:txt': [
        {
          '#text': 'Additional information',
          '@purpose': 'description',
        },
      ],
    }

    expect(retrieveItem(value)).toEqual(expectedFull)
  })

  it('should parse a complete item with all podcast namespace elements (as array of values)', () => {
    const value = {
      'podcast:transcript': [
        {
          '@url': 'https://example.com/transcript.json',
          '@type': 'application/json',
          '@language': 'en',
        },
      ],
      'podcast:chapters': [
        {
          '@url': 'https://example.com/chapters.json',
          '@type': 'application/json',
        },
      ],
      'podcast:soundbite': [
        {
          '@starttime': 60,
          '@duration': 30,
          '#text': 'This is a key moment',
        },
      ],
      'podcast:person': [
        {
          '#text': 'Jane Doe',
          '@role': 'host',
          '@img': 'https://example.com/janedoe.jpg',
        },
        {
          '#text': 'John Smith',
          '@role': 'guest',
        },
      ],
      'podcast:location': [
        {
          '#text': 'New York, NY',
          '@geo': '40.7128,-74.0060',
        },
      ],
      'podcast:season': [
        {
          '#text': 2,
          '@name': 'Second Season',
        },
      ],
      'podcast:episode': [
        {
          '#text': 5,
          '@display': 'The Fifth Episode',
        },
      ],
      'podcast:license': [
        {
          '#text': 'CC BY 4.0',
          '@url': 'https://creativecommons.org/licenses/by/4.0/',
        },
      ],
      'podcast:alternateenclosure': [
        {
          '@type': 'audio/mpeg',
          '@length': 12345678,
          '@bitrate': 128000,
          'podcast:source': {
            '@uri': 'https://example.com/episode.mp3',
          },
        },
      ],
      'podcast:value': [
        {
          '@type': 'lightning',
          '@method': 'keysend',
          '@suggested': 0.00000005,
          'podcast:valuerecipient': {
            '@type': 'node',
            '@address': '02d5c1bf8b940dc9cadca86d1b0a3c37fbe39cee4c7e839e33bef9174531d27f52',
            '@split': 100,
          },
        },
      ],
      'podcast:images': [
        {
          '@srcset': 'image-1x.jpg 1x, image-2x.jpg 2x',
        },
      ],
      'podcast:socialinteract': [
        {
          '@uri': 'https://example.com/episodes/1/comments',
          '@protocol': 'activitypub',
        },
      ],
      'podcast:txt': [
        {
          '#text': 'Additional information',
          '@purpose': 'description',
        },
      ],
    }

    expect(retrieveItem(value)).toEqual(expectedFull)
  })

  it('should parse item with single transcript element', () => {
    const value = {
      'podcast:transcript': {
        '@url': 'https://example.com/transcript.json',
        '@type': 'application/json',
      },
    }
    const expected = {
      transcripts: [
        {
          url: 'https://example.com/transcript.json',
          type: 'application/json',
        },
      ],
    }

    expect(retrieveItem(value)).toEqual(expected)
  })

  it('should parse item with multiple transcript elements', () => {
    const value = {
      'podcast:transcript': [
        {
          '@url': 'https://example.com/transcript.json',
          '@type': 'application/json',
          '@language': 'en',
        },
        {
          '@url': 'https://example.com/transcript-es.json',
          '@type': 'application/json',
          '@language': 'es',
        },
      ],
    }
    const expected = {
      transcripts: [
        {
          url: 'https://example.com/transcript.json',
          type: 'application/json',
          language: 'en',
        },
        {
          url: 'https://example.com/transcript-es.json',
          type: 'application/json',
          language: 'es',
        },
      ],
    }

    expect(retrieveItem(value)).toEqual(expected)
  })

  it('should handle invalid transcript elements', () => {
    const value = {
      'podcast:transcript': [
        {
          '@url': 'https://example.com/transcript.json',
          '@type': 'application/json',
        },
        {
          '@type': 'application/json', // Missing url.
        },
        {
          '@url': 'https://example.com/transcript2.json', // Missing type.
        },
      ],
    }
    const expected = {
      transcripts: [
        {
          url: 'https://example.com/transcript.json',
          type: 'application/json',
        },
      ],
    }

    expect(retrieveItem(value)).toEqual(expected)
  })

  it('should handle multiple properties with mixed valid and invalid elements', () => {
    const value = {
      'podcast:transcript': {
        '@url': 'https://example.com/transcript.json',
        '@type': 'application/json',
      },
      'podcast:person': [
        {
          '#text': 'Jane Doe',
          '@role': 'host',
        },
        {
          '@role': 'guest', // Missing name.
        },
      ],
      'podcast:soundbite': [
        {
          '@starttime': 60,
          '@duration': 30,
          '#text': 'Key moment',
        },
        {
          '@starttime': 120, // Missing duration.
          '#text': 'Another moment',
        },
      ],
    }
    const expected = {
      transcripts: [
        {
          url: 'https://example.com/transcript.json',
          type: 'application/json',
        },
      ],
      persons: [
        {
          display: 'Jane Doe',
          role: 'host',
        },
      ],
      soundbites: [
        {
          startTime: 60,
          duration: 30,
          display: 'Key moment',
        },
      ],
    }

    expect(retrieveItem(value)).toEqual(expected)
  })

  it('should handle coercible values', () => {
    const value = {
      'podcast:season': 2,
      'podcast:episode': {
        '#text': '5',
        '@display': 123,
      },
      'podcast:soundbite': {
        '@starttime': '60.5',
        '@duration': '30.25',
        '#text': 456,
      },
    }
    const expected = {
      season: {
        number: 2,
      },
      episode: {
        number: 5,
        display: '123',
      },
      soundbites: [
        {
          startTime: 60.5,
          duration: 30.25,
          display: '456',
        },
      ],
    }

    expect(retrieveItem(value)).toEqual(expected)
  })

  it('should return undefined for empty objects', () => {
    const value = {}
    expect(retrieveItem(value)).toBeUndefined()
  })

  it('should return undefined for non-object inputs', () => {
    expect(retrieveItem('not an object')).toBeUndefined()
    expect(retrieveItem(undefined)).toBeUndefined()
    expect(retrieveItem(null)).toBeUndefined()
    expect(retrieveItem([])).toBeUndefined()
    expect(retrieveItem(123)).toBeUndefined()
  })

  it('should return undefined if all parsed properties are undefined', () => {
    const value = {
      'podcast:transcript': {
        '@type': 'application/json', // Missing url.
      },
      'podcast:person': {
        '@role': 'host', // Missing display.
      },
    }
    expect(retrieveItem(value)).toBeUndefined()
  })
})

describe('retrieveFeed', () => {
  const expectedFull = {
    locked: {
      value: true,
      owner: 'Example Podcaster',
    },
    fundings: [
      {
        url: 'https://example.com/donate',
        display: 'Support the show',
      },
    ],
    persons: [
      {
        display: 'Jane Doe',
        role: 'host',
        img: 'https://example.com/janedoe.jpg',
      },
    ],
    location: {
      display: 'San Francisco, CA',
      geo: '37.7749,-122.4194',
    },
    trailers: [
      {
        display: 'Season 2 Trailer',
        url: 'https://example.com/trailer.mp3',
        pubDate: 'Tue, 10 Jan 2023 12:00:00 GMT',
        length: 12345678,
        type: 'audio/mpeg',
      },
    ],
    license: {
      display: 'CC BY 4.0',
      url: 'https://creativecommons.org/licenses/by/4.0/',
    },
    guid: 'urn:uuid:fdafc891-1b24-59de-85bc-a41f6fad5dbd',
    value: {
      type: 'lightning',
      method: 'keysend',
      suggested: 0.00000005,
      valueRecipients: [
        {
          type: 'node',
          address: '02d5c1bf8b940dc9cadca86d1b0a3c37fbe39cee4c7e839e33bef9174531d27f52',
          split: 100,
        },
      ],
    },
    medium: 'podcast',
    images: {
      srcset: 'image-1x.jpg 1x, image-2x.jpg 2x',
    },
    liveItems: [
      {
        status: 'live',
        start: '2023-06-15T15:00:00Z',
        end: '2023-06-15T16:00:00Z',
        contentlinks: [
          {
            href: 'https://example.com/live',
            display: 'Watch live',
          },
        ],
      },
    ],
    blocks: [
      {
        value: true,
        id: 'spotify',
      },
    ],
    txts: [
      {
        display: 'Additional podcast information',
        purpose: 'description',
      },
    ],
    remoteItems: [
      {
        feedGuid: 'urn:uuid:8eb78004-d85a-51dc-9126-e291618ca9ae',
        feedUrl: 'https://example.com/feed2.xml',
      },
    ],
    podroll: {
      remoteItems: [
        {
          feedGuid: 'urn:uuid:fdafc891-1b24-59de-85bc-a41f6fad5dbd',
          feedUrl: 'https://example.com/feed1.xml',
        },
        {
          feedGuid: 'urn:uuid:8eb78004-d85a-51dc-9126-e291618ca9ae',
          feedUrl: 'https://example.com/feed2.xml',
        },
      ],
    },
    updateFrequency: {
      display: 'Weekly on Mondays',
      complete: true,
    },
    podping: {
      usesPodping: true,
    },
  }

  it('should parse a complete feed with all podcast namespace elements', () => {
    const value = {
      'podcast:locked': {
        '#text': 'yes',
        '@owner': 'Example Podcaster',
      },
      'podcast:funding': [
        {
          '@url': 'https://example.com/donate',
          '#text': 'Support the show',
        },
      ],
      'podcast:person': [
        {
          '#text': 'Jane Doe',
          '@role': 'host',
          '@img': 'https://example.com/janedoe.jpg',
        },
      ],
      'podcast:location': {
        '#text': 'San Francisco, CA',
        '@geo': '37.7749,-122.4194',
      },
      'podcast:trailer': [
        {
          '#text': 'Season 2 Trailer',
          '@url': 'https://example.com/trailer.mp3',
          '@pubdate': 'Tue, 10 Jan 2023 12:00:00 GMT',
          '@length': 12345678,
          '@type': 'audio/mpeg',
        },
      ],
      'podcast:license': {
        '#text': 'CC BY 4.0',
        '@url': 'https://creativecommons.org/licenses/by/4.0/',
      },
      'podcast:guid': 'urn:uuid:fdafc891-1b24-59de-85bc-a41f6fad5dbd',
      'podcast:value': {
        '@type': 'lightning',
        '@method': 'keysend',
        '@suggested': 0.00000005,
        'podcast:valuerecipient': {
          '@type': 'node',
          '@address': '02d5c1bf8b940dc9cadca86d1b0a3c37fbe39cee4c7e839e33bef9174531d27f52',
          '@split': 100,
        },
      },
      'podcast:medium': 'podcast',
      'podcast:images': {
        '@srcset': 'image-1x.jpg 1x, image-2x.jpg 2x',
      },
      'podcast:liveitem': [
        {
          '@status': 'live',
          '@start': '2023-06-15T15:00:00Z',
          '@end': '2023-06-15T16:00:00Z',
          'podcast:contentlink': {
            '@href': 'https://example.com/live',
            '#text': 'Watch live',
          },
        },
      ],
      'podcast:block': [
        {
          '#text': 'yes',
          '@id': 'spotify',
        },
      ],
      'podcast:txt': [
        {
          '#text': 'Additional podcast information',
          '@purpose': 'description',
        },
      ],
      'podcast:remoteitem': [
        {
          '@feedguid': 'urn:uuid:8eb78004-d85a-51dc-9126-e291618ca9ae',
          '@feedurl': 'https://example.com/feed2.xml',
        },
      ],
      'podcast:podroll': {
        'podcast:remoteitem': [
          {
            '@feedguid': 'urn:uuid:fdafc891-1b24-59de-85bc-a41f6fad5dbd',
            '@feedurl': 'https://example.com/feed1.xml',
          },
          {
            '@feedguid': 'urn:uuid:8eb78004-d85a-51dc-9126-e291618ca9ae',
            '@feedurl': 'https://example.com/feed2.xml',
          },
        ],
      },
      'podcast:updatefrequency': {
        '#text': 'Weekly on Mondays',
        '@complete': 'true',
      },
      'podcast:podping': {
        '@usespodping': 'true',
      },
    }

    expect(retrieveFeed(value)).toEqual(expectedFull)
  })

  it('should parse a complete feed with all podcast namespace elements (as array of values)', () => {
    const value = {
      'podcast:locked': [
        {
          '#text': 'yes',
          '@owner': 'Example Podcaster',
        },
      ],
      'podcast:funding': [
        {
          '@url': 'https://example.com/donate',
          '#text': 'Support the show',
        },
      ],
      'podcast:person': [
        {
          '#text': 'Jane Doe',
          '@role': 'host',
          '@img': 'https://example.com/janedoe.jpg',
        },
      ],
      'podcast:location': [
        {
          '#text': 'San Francisco, CA',
          '@geo': '37.7749,-122.4194',
        },
      ],
      'podcast:trailer': [
        {
          '#text': 'Season 2 Trailer',
          '@url': 'https://example.com/trailer.mp3',
          '@pubdate': 'Tue, 10 Jan 2023 12:00:00 GMT',
          '@length': 12345678,
          '@type': 'audio/mpeg',
        },
      ],
      'podcast:license': [
        {
          '#text': 'CC BY 4.0',
          '@url': 'https://creativecommons.org/licenses/by/4.0/',
        },
      ],
      'podcast:guid': ['urn:uuid:fdafc891-1b24-59de-85bc-a41f6fad5dbd'],
      'podcast:value': [
        {
          '@type': 'lightning',
          '@method': 'keysend',
          '@suggested': 0.00000005,
          'podcast:valuerecipient': {
            '@type': 'node',
            '@address': '02d5c1bf8b940dc9cadca86d1b0a3c37fbe39cee4c7e839e33bef9174531d27f52',
            '@split': 100,
          },
        },
      ],
      'podcast:medium': ['podcast'],
      'podcast:images': [
        {
          '@srcset': 'image-1x.jpg 1x, image-2x.jpg 2x',
        },
      ],
      'podcast:liveitem': [
        {
          '@status': 'live',
          '@start': '2023-06-15T15:00:00Z',
          '@end': '2023-06-15T16:00:00Z',
          'podcast:contentlink': {
            '@href': 'https://example.com/live',
            '#text': 'Watch live',
          },
        },
      ],
      'podcast:block': [
        {
          '#text': 'yes',
          '@id': 'spotify',
        },
      ],
      'podcast:txt': [
        {
          '#text': 'Additional podcast information',
          '@purpose': 'description',
        },
      ],
      'podcast:remoteitem': [
        {
          '@feedguid': 'urn:uuid:8eb78004-d85a-51dc-9126-e291618ca9ae',
          '@feedurl': 'https://example.com/feed2.xml',
        },
      ],
      'podcast:podroll': [
        {
          'podcast:remoteitem': [
            {
              '@feedguid': 'urn:uuid:fdafc891-1b24-59de-85bc-a41f6fad5dbd',
              '@feedurl': 'https://example.com/feed1.xml',
            },
            {
              '@feedguid': 'urn:uuid:8eb78004-d85a-51dc-9126-e291618ca9ae',
              '@feedurl': 'https://example.com/feed2.xml',
            },
          ],
        },
      ],
      'podcast:updatefrequency': [
        {
          '#text': 'Weekly on Mondays',
          '@complete': 'true',
        },
      ],
      'podcast:podping': [
        {
          '@usespodping': 'true',
        },
      ],
    }

    expect(retrieveFeed(value)).toEqual(expectedFull)
  })

  it('should parse feed with single funding element', () => {
    const value = {
      'podcast:funding': {
        '@url': 'https://example.com/donate',
        '#text': 'Support the show',
      },
    }
    const expected = {
      fundings: [
        {
          url: 'https://example.com/donate',
          display: 'Support the show',
        },
      ],
    }

    expect(retrieveFeed(value)).toEqual(expected)
  })

  it('should parse feed with multiple funding elements', () => {
    const value = {
      'podcast:funding': [
        {
          '@url': 'https://example.com/donate',
          '#text': 'Support the show',
        },
        {
          '@url': 'https://example.com/patreon',
          '#text': 'Join our Patreon',
        },
      ],
    }
    const expected = {
      fundings: [
        {
          url: 'https://example.com/donate',
          display: 'Support the show',
        },
        {
          url: 'https://example.com/patreon',
          display: 'Join our Patreon',
        },
      ],
    }

    expect(retrieveFeed(value)).toEqual(expected)
  })

  it('should handle invalid funding elements', () => {
    const value = {
      'podcast:funding': [
        {
          '@url': 'https://example.com/donate',
          '#text': 'Support the show',
        },
        {
          '#text': 'Invalid funding', // Missing url.
        },
      ],
    }
    const expected = {
      fundings: [
        {
          url: 'https://example.com/donate',
          display: 'Support the show',
        },
      ],
    }

    expect(retrieveFeed(value)).toEqual(expected)
  })

  it('should handle multiple properties with mixed valid and invalid elements', () => {
    const value = {
      'podcast:locked': {
        '#text': 'yes',
        '@owner': 'Example Podcaster',
      },
      'podcast:funding': [
        {
          '@url': 'https://example.com/donate',
          '#text': 'Support the show',
        },
        {
          '#text': 'Invalid funding', // Missing url.
        },
      ],
      'podcast:person': [
        {
          '#text': 'Jane Doe',
          '@role': 'host',
        },
        {
          '@role': 'guest', // Missing name.
        },
      ],
    }
    const expected = {
      locked: {
        value: true,
        owner: 'Example Podcaster',
      },
      fundings: [
        {
          url: 'https://example.com/donate',
          display: 'Support the show',
        },
      ],
      persons: [
        {
          display: 'Jane Doe',
          role: 'host',
        },
      ],
    }

    expect(retrieveFeed(value)).toEqual(expected)
  })

  it('should handle coercible values', () => {
    const value = {
      'podcast:locked': {
        '#text': 'true',
        '@owner': 123,
      },
      'podcast:trailer': {
        '#text': 456,
        '@url': 'https://example.com/trailer.mp3',
        '@pubdate': 'Tue, 10 Jan 2023 12:00:00 GMT',
        '@length': '12345678',
      },
      'podcast:medium': 789,
    }
    const expected = {
      locked: {
        value: true,
        owner: '123',
      },
      trailers: [
        {
          display: '456',
          url: 'https://example.com/trailer.mp3',
          pubDate: 'Tue, 10 Jan 2023 12:00:00 GMT',
          length: 12345678,
        },
      ],
      medium: '789',
    }

    expect(retrieveFeed(value)).toEqual(expected)
  })

  it('should return undefined for empty objects', () => {
    const value = {}

    expect(retrieveFeed(value)).toBeUndefined()
  })

  it('should return undefined for non-object inputs', () => {
    expect(retrieveFeed('not an object')).toBeUndefined()
    expect(retrieveFeed(undefined)).toBeUndefined()
    expect(retrieveFeed(null)).toBeUndefined()
    expect(retrieveFeed([])).toBeUndefined()
    expect(retrieveFeed(123)).toBeUndefined()
  })

  it('should return undefined if all parsed properties are undefined', () => {
    const value = {
      'podcast:funding': {
        '#text': 'Support the show', // Missing url.
      },
      'podcast:person': {
        '@role': 'host', // Missing display.
      },
    }
    expect(retrieveFeed(value)).toBeUndefined()
  })

  it('should parse liveItem with multiple contentLinks', () => {
    const value = {
      'podcast:liveitem': {
        '@status': 'live',
        '@start': '2023-06-15T15:00:00Z',
        'podcast:contentlink': [
          { '@href': 'https://example.com/live', '#text': 'Watch live' },
          { '@href': 'https://youtube.com/live', '#text': 'Watch on YouTube' },
        ],
      },
    }
    const expected = {
      liveItems: [
        {
          status: 'live',
          start: '2023-06-15T15:00:00Z',
          contentlinks: [
            { href: 'https://example.com/live', display: 'Watch live' },
            { href: 'https://youtube.com/live', display: 'Watch on YouTube' },
          ],
        },
      ],
    }

    expect(retrieveFeed(value)).toEqual(expected)
  })

  it('should parse multiple liveItems', () => {
    const value = {
      'podcast:liveitem': [
        { '@status': 'pending', '@start': '2023-06-15T15:00:00Z' },
        { '@status': 'live', '@start': '2023-06-16T15:00:00Z' },
      ],
    }
    const expected = {
      liveItems: [
        { status: 'pending', start: '2023-06-15T15:00:00Z' },
        { status: 'live', start: '2023-06-16T15:00:00Z' },
      ],
    }

    expect(retrieveFeed(value)).toEqual(expected)
  })
})
