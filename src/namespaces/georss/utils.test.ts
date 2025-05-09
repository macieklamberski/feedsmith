import { describe, expect, it } from 'bun:test'
import { parseBox, parseLatLngPairs, parseLine, parsePoint, parsePolygon } from './utils.js'

describe('parseLatLngPairs', () => {
  it('should parse a valid string with a exactly 1 lat/lng pair', () => {
    const value = '45.256 -71.92'
    const expected = [{ lat: 45.256, lng: -71.92 }]

    expect(parseLatLngPairs(value, { min: 1, max: 1 })).toEqual(expected)
  })

  it('should parse a valid string with exactly 3 lat/lng pairs', () => {
    const value = '45.256 -71.92 37.8 -122.41 51.5 -0.12'
    const expected = [
      { lat: 45.256, lng: -71.92 },
      { lat: 37.8, lng: -122.41 },
      { lat: 51.5, lng: -0.12 },
    ]

    expect(parseLatLngPairs(value, { min: 3, max: 3 })).toEqual(expected)
  })

  it('should parse a valid string with exactly 3 lat/lng pairs and varied spacing', () => {
    const value = '45.256  -71.92\t37.8 -122.41    51.5 -0.12'
    const expected = [
      { lat: 45.256, lng: -71.92 },
      { lat: 37.8, lng: -122.41 },
      { lat: 51.5, lng: -0.12 },
    ]

    expect(parseLatLngPairs(value, { min: 3, max: 3 })).toEqual(expected)
  })

  it('should parse a valid string with a ranging lat/lng pairs', () => {
    const value = '45.256 -71.92'
    const expected = [{ lat: 45.256, lng: -71.92 }]

    expect(parseLatLngPairs(value, { min: 1, max: 4 })).toEqual(expected)
  })

  it('should parse a valid string with a required min lat/lng pairs', () => {
    const value = '45.256 -71.92'
    const expected = [{ lat: 45.256, lng: -71.92 }]

    expect(parseLatLngPairs(value, { min: 1 })).toEqual(expected)
  })

  it('should parse a valid string with a required max lat/lng pairs', () => {
    const value = '45.256 -71.92'
    const expected = [{ lat: 45.256, lng: -71.92 }]

    expect(parseLatLngPairs(value, { max: 1 })).toEqual(expected)
  })

  it('should return undefined if pairsCount does not match the actual number of pairs', () => {
    const value = '45.256 -71.92 37.8 -122.41'

    expect(parseLatLngPairs(value, { min: 3, max: 3 })).toBeUndefined()
  })

  it('should parse a valid string with a no lat/lng pairs count requirement', () => {
    const value = '45.256 -71.92'
    const expected = [{ lat: 45.256, lng: -71.92 }]

    expect(parseLatLngPairs(value)).toEqual(expected)
  })

  it('should return undefined if the number of coordinates is odd', () => {
    const value = '45.256 -71.92 37.8'

    expect(parseLatLngPairs(value)).toBeUndefined()
  })

  it('should return undefined for empty strings', () => {
    const value = ''

    expect(parseLatLngPairs(value)).toBeUndefined()
  })

  it('should return undefined for not supported input', () => {
    expect(parseLatLngPairs(undefined)).toBeUndefined()
    expect(parseLatLngPairs(null)).toBeUndefined()
    expect(parseLatLngPairs({})).toBeUndefined()
    expect(parseLatLngPairs([])).toBeUndefined()
  })

  it('should handle non-numeric coordinates', () => {
    const value = 'invalid 123 45.256 -71.92'

    expect(parseLatLngPairs(value)).toBeUndefined()
  })

  it('should handle a mix of valid and invalid coordinates', () => {
    const value = '45.256 -71.92 invalid text'

    expect(parseLatLngPairs(value)).toBeUndefined()
  })
})

describe('parsePoint', () => {
  it('should parse valid point string with space separator', () => {
    const value = '45.256 -71.92'
    const expected = {
      lat: 45.256,
      lng: -71.92,
    }

    expect(parsePoint(value)).toEqual(expected)
  })

  it('should return undefined for invalid point format with too many coordinates', () => {
    const value = '45.256 -71.92 123.45'

    expect(parsePoint(value)).toBeUndefined()
  })

  it('should return undefined for invalid point format with too few coordinates', () => {
    const value = '45.256'

    expect(parsePoint(value)).toBeUndefined()
  })

  it('should return undefined for empty strings', () => {
    const value = ''

    expect(parsePoint(value)).toBeUndefined()
  })

  it('should handle non-numeric coordinates', () => {
    const value = 'invalid latitude'

    expect(parsePoint(value)).toBeUndefined()
  })

  it('should return undefined for not supported input', () => {
    expect(parsePoint(3)).toBeUndefined()
    expect(parsePoint(undefined)).toBeUndefined()
    expect(parsePoint(null)).toBeUndefined()
    expect(parsePoint({})).toBeUndefined()
    expect(parsePoint([])).toBeUndefined()
  })
})

describe('parseLine', () => {
  it('should parse a valid line with exactly 2 points', () => {
    const value = '45.256 -71.92 37.8 -122.41'
    const expected = {
      points: [
        { lat: 45.256, lng: -71.92 },
        { lat: 37.8, lng: -122.41 },
      ],
    }

    expect(parseLine(value)).toEqual(expected)
  })

  it('should parse a valid line with more than 2 points', () => {
    const value = '45.256 -71.92 37.8 -122.41 51.5 -0.12'
    const expected = {
      points: [
        { lat: 45.256, lng: -71.92 },
        { lat: 37.8, lng: -122.41 },
        { lat: 51.5, lng: -0.12 },
      ],
    }

    expect(parseLine(value)).toEqual(expected)
  })

  it('should handle a line with varied spacing', () => {
    const value = '45.256  -71.92\t37.8 -122.41'
    const expected = {
      points: [
        { lat: 45.256, lng: -71.92 },
        { lat: 37.8, lng: -122.41 },
      ],
    }

    expect(parseLine(value)).toEqual(expected)
  })

  it('should handle non-numeric coordinates', () => {
    const value = '45.256 -71.92 invalid latitude'

    expect(parseLine(value)).toBeUndefined()
  })

  it('should return undefined if there are fewer than 2 points', () => {
    const value = '45.256 -71.92'

    expect(parseLine(value)).toBeUndefined()
  })

  it('should return undefined if the number of coordinates is odd', () => {
    const value = '45.256 -71.92 37.8'

    expect(parseLine(value)).toBeUndefined()
  })

  it('should return undefined for empty strings', () => {
    const value = ''

    expect(parseLine(value)).toBeUndefined()
  })

  it('should return undefined for not supported input', () => {
    expect(parseLine(undefined)).toBeUndefined()
    expect(parseLine(null)).toBeUndefined()
    expect(parseLine({})).toBeUndefined()
    expect(parseLine([])).toBeUndefined()
  })
})

describe('parsePolygon', () => {
  it('should parse a valid polygon with exactly 4 points', () => {
    const value = '45.256 -71.92 37.8 -122.41 51.5 -0.12 40.7 -74.0'
    const expected = {
      points: [
        { lat: 45.256, lng: -71.92 },
        { lat: 37.8, lng: -122.41 },
        { lat: 51.5, lng: -0.12 },
        { lat: 40.7, lng: -74.0 },
      ],
    }

    expect(parsePolygon(value)).toEqual(expected)
  })

  it('should parse a valid polygon with more than 4 points', () => {
    const value = '45.256 -71.92 37.8 -122.41 51.5 -0.12 40.7 -74.0 35.6 139.7'
    const expected = {
      points: [
        { lat: 45.256, lng: -71.92 },
        { lat: 37.8, lng: -122.41 },
        { lat: 51.5, lng: -0.12 },
        { lat: 40.7, lng: -74.0 },
        { lat: 35.6, lng: 139.7 },
      ],
    }

    expect(parsePolygon(value)).toEqual(expected)
  })

  it('should handle a polygon with varied spacing', () => {
    const value = '45.256  -71.92\t37.8 -122.41    51.5 -0.12 40.7 -74.0'
    const expected = {
      points: [
        { lat: 45.256, lng: -71.92 },
        { lat: 37.8, lng: -122.41 },
        { lat: 51.5, lng: -0.12 },
        { lat: 40.7, lng: -74.0 },
      ],
    }

    expect(parsePolygon(value)).toEqual(expected)
  })

  it('should handle non-numeric coordinates', () => {
    const value = '45.256 -71.92 37.8 -122.41 invalid latitude -0.12'

    expect(parsePolygon(value)).toBeUndefined()
  })

  it('should return undefined if there are fewer than 4 points', () => {
    const value = '45.256 -71.92 37.8 -122.41 51.5 -0.12'

    // This is three points, but the function requires at least 4
    expect(parsePolygon(value)).toBeUndefined()
  })

  it('should return undefined if the number of coordinates is odd', () => {
    const value = '45.256 -71.92 37.8 -122.41 51.5 -0.12 40.7'

    expect(parsePolygon(value)).toBeUndefined()
  })

  it('should return undefined for empty strings', () => {
    const value = ''

    expect(parsePolygon(value)).toBeUndefined()
  })

  it('should return undefined for not supported input', () => {
    expect(parsePolygon(undefined)).toBeUndefined()
    expect(parsePolygon(null)).toBeUndefined()
    expect(parsePolygon({})).toBeUndefined()
    expect(parsePolygon([])).toBeUndefined()
  })
})

describe('parseBox', () => {
  it('should parse a valid box with exactly 2 points', () => {
    const value = '45.256 -71.92 51.5 -0.12'
    const expected = {
      lowerLeftCorner: { lat: 45.256, lng: -71.92 },
      upperRightCorner: { lat: 51.5, lng: -0.12 },
    }

    expect(parseBox(value)).toEqual(expected)
  })

  it('should handle a box with varied spacing', () => {
    const value = '45.256  -71.92\t51.5 -0.12'
    const expected = {
      lowerLeftCorner: { lat: 45.256, lng: -71.92 },
      upperRightCorner: { lat: 51.5, lng: -0.12 },
    }

    expect(parseBox(value)).toEqual(expected)
  })

  it('should handle partial box objects with missing corners', () => {
    // This simulates a case where parseLatLngPairs returns valid points
    // but one of them has undefined coordinates.
    const valueWithInvalidPoints = '45.256 NaN 51.5 -0.12'

    expect(parseBox(valueWithInvalidPoints)).toBeUndefined()
  })

  it('should return undefined if there are not exactly 2 points', () => {
    const valueTooFew = '45.256 -71.92'
    const valueTooMany = '45.256 -71.92 51.5 -0.12 40.7 -74.0'

    expect(parseBox(valueTooFew)).toBeUndefined()
    expect(parseBox(valueTooMany)).toBeUndefined()
  })

  it('should return undefined if the number of coordinates is odd', () => {
    const value = '45.256 -71.92 51.5'

    expect(parseBox(value)).toBeUndefined()
  })

  it('should return undefined for empty strings', () => {
    const value = ''

    expect(parseBox(value)).toBeUndefined()
  })

  it('should handle non-numeric coordinates', () => {
    const value = '45.256 -71.92 invalid latitude'

    expect(parseBox(value)).toBeUndefined()
  })

  it('should return undefined for not supported input', () => {
    expect(parseBox(undefined)).toBeUndefined()
    expect(parseBox(null)).toBeUndefined()
    expect(parseBox({})).toBeUndefined()
    expect(parseBox([])).toBeUndefined()
  })
})
