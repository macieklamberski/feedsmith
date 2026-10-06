import { describe, expect, it } from 'bun:test'
import {
  generateCircleByCenterPoint,
  generateCoordinates,
  generateEnvelope,
  generateExterior,
  generateLinearRing,
  generateLineString,
  generatePoint,
  generatePolygon,
  generatePosition,
  generatePositionList,
  generateRadius,
  generateWhere,
} from './utils.js'

describe('generateCoordinates', () => {
  it('should generate pairs of latitude and longitude', () => {
    const value = [
      { lat: 45.256, lng: -71.92 },
      { lat: 46.46, lng: -72.41 },
    ]

    expect(generateCoordinates(value)).toBe('45.256 -71.92 46.46 -72.41')
  })

  it('should include the height when present', () => {
    const value = [{ lat: 42.3453, lng: -156.2342, alt: 45 }]

    expect(generateCoordinates(value)).toBe('42.3453 -156.2342 45')
  })

  it('should return undefined when a coordinate is incomplete', () => {
    const value = [{ lat: 45.256, lng: -71.92 }, { lat: 46.46 }]

    expect(generateCoordinates(value)).toBeUndefined()
  })

  it('should return undefined for empty and missing inputs', () => {
    expect(generateCoordinates([])).toBeUndefined()
    expect(generateCoordinates(undefined)).toBeUndefined()
  })
})

describe('generatePosition', () => {
  it('should generate a position with its attributes', () => {
    const value = {
      lat: 45.256,
      lng: -71.92,
      srsName: 'EPSG:4326',
      srsDimension: 2,
    }
    const expected = {
      '#text': '45.256 -71.92',
      '@srsName': 'EPSG:4326',
      '@srsDimension': 2,
    }

    expect(generatePosition(value)).toEqual(expected)
  })

  it('should generate a position without attributes', () => {
    const value = { lat: 45.256, lng: -71.92 }
    const expected = { '#text': '45.256 -71.92' }

    expect(generatePosition(value)).toEqual(expected)
  })

  it('should return undefined when a coordinate is missing', () => {
    const value = { lat: 45.256, srsName: 'EPSG:4326' }

    expect(generatePosition(value)).toBeUndefined()
  })

  it('should return undefined for non-object inputs', () => {
    expect(generatePosition(undefined)).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generatePosition(null)).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generatePosition('45.256 -71.92')).toBeUndefined()
  })
})

describe('generatePositionList', () => {
  it('should generate a position list with its attributes', () => {
    const value = {
      points: [
        { lat: 45.256, lng: -71.92 },
        { lat: 46.46, lng: -72.41 },
      ],
      srsName: 'EPSG:4326',
      srsDimension: 2,
      count: 2,
    }
    const expected = {
      '#text': '45.256 -71.92 46.46 -72.41',
      '@srsName': 'EPSG:4326',
      '@srsDimension': 2,
      '@count': 2,
    }

    expect(generatePositionList(value)).toEqual(expected)
  })

  it('should return undefined without points', () => {
    const value = { srsName: 'EPSG:4326' }

    expect(generatePositionList(value)).toBeUndefined()
  })

  it('should return undefined for non-object inputs', () => {
    expect(generatePositionList(undefined)).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generatePositionList(null)).toBeUndefined()
  })
})

describe('generatePoint', () => {
  it('should generate a point with all properties', () => {
    const value = {
      id: 'p1',
      srsName: 'EPSG:4326',
      srsDimension: 2,
      pos: { lat: 45.256, lng: -71.92 },
    }
    const expected = {
      '@gml:id': 'p1',
      '@srsName': 'EPSG:4326',
      '@srsDimension': 2,
      'gml:pos': { '#text': '45.256 -71.92' },
    }

    expect(generatePoint(value)).toEqual(expected)
  })

  it('should return undefined for empty and non-object inputs', () => {
    expect(generatePoint({})).toBeUndefined()
    expect(generatePoint(undefined)).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generatePoint(null)).toBeUndefined()
  })
})

describe('generateLineString', () => {
  it('should generate a line string', () => {
    const value = {
      id: 'l1',
      posList: {
        points: [
          { lat: 45.256, lng: -71.92 },
          { lat: 46.46, lng: -72.41 },
        ],
      },
    }
    const expected = {
      '@gml:id': 'l1',
      'gml:posList': { '#text': '45.256 -71.92 46.46 -72.41' },
    }

    expect(generateLineString(value)).toEqual(expected)
  })

  it('should return undefined for empty and non-object inputs', () => {
    expect(generateLineString({})).toBeUndefined()
    expect(generateLineString(undefined)).toBeUndefined()
  })
})

describe('generateLinearRing', () => {
  it('should generate a linear ring', () => {
    const value = {
      posList: {
        points: [
          { lat: 45, lng: -110 },
          { lat: 46, lng: -109 },
          { lat: 43, lng: -109 },
          { lat: 45, lng: -110 },
        ],
      },
    }
    const expected = {
      'gml:posList': { '#text': '45 -110 46 -109 43 -109 45 -110' },
    }

    expect(generateLinearRing(value)).toEqual(expected)
  })

  it('should return undefined for empty and non-object inputs', () => {
    expect(generateLinearRing({})).toBeUndefined()
    expect(generateLinearRing(undefined)).toBeUndefined()
  })
})

describe('generateExterior', () => {
  it('should generate the linear ring of an exterior', () => {
    const value = {
      linearRing: {
        posList: {
          points: [
            { lat: 45, lng: -110 },
            { lat: 46, lng: -109 },
            { lat: 43, lng: -109 },
            { lat: 45, lng: -110 },
          ],
        },
      },
    }
    const expected = {
      'gml:LinearRing': {
        'gml:posList': { '#text': '45 -110 46 -109 43 -109 45 -110' },
      },
    }

    expect(generateExterior(value)).toEqual(expected)
  })

  it('should return undefined for empty and non-object inputs', () => {
    expect(generateExterior({})).toBeUndefined()
    expect(generateExterior(undefined)).toBeUndefined()
  })
})

describe('generatePolygon', () => {
  it('should generate a polygon with all properties', () => {
    const value = {
      id: 'poly1',
      srsName: 'urn:ogc:def:crs:EPSG:9.0:26986',
      exterior: {
        linearRing: {
          posList: {
            points: [
              { lat: 236750, lng: 900000 },
              { lat: 237750, lng: 900000 },
              { lat: 237750, lng: 901000 },
              { lat: 236750, lng: 900000 },
            ],
          },
        },
      },
    }
    const expected = {
      '@gml:id': 'poly1',
      '@srsName': 'urn:ogc:def:crs:EPSG:9.0:26986',
      'gml:exterior': {
        'gml:LinearRing': {
          'gml:posList': {
            '#text': '236750 900000 237750 900000 237750 901000 236750 900000',
          },
        },
      },
    }

    expect(generatePolygon(value)).toEqual(expected)
  })

  it('should return undefined for empty and non-object inputs', () => {
    expect(generatePolygon({})).toBeUndefined()
    expect(generatePolygon(undefined)).toBeUndefined()
  })
})

describe('generateEnvelope', () => {
  it('should generate an envelope with all properties', () => {
    const value = {
      srsName: 'EPSG:4326',
      lowerCorner: { lat: 42.943, lng: -71.032 },
      upperCorner: { lat: 43.039, lng: -69.856 },
    }
    const expected = {
      '@srsName': 'EPSG:4326',
      'gml:lowerCorner': { '#text': '42.943 -71.032' },
      'gml:upperCorner': { '#text': '43.039 -69.856' },
    }

    expect(generateEnvelope(value)).toEqual(expected)
  })

  it('should return undefined for empty and non-object inputs', () => {
    expect(generateEnvelope({})).toBeUndefined()
    expect(generateEnvelope(undefined)).toBeUndefined()
  })
})

describe('generateRadius', () => {
  it('should generate a radius with its unit', () => {
    const value = { value: 500, uom: 'm' }
    const expected = { '#text': 500, '@uom': 'm' }

    expect(generateRadius(value)).toEqual(expected)
  })

  it('should return undefined without a value', () => {
    const value = { uom: 'm' }

    expect(generateRadius(value)).toBeUndefined()
  })

  it('should return undefined for non-object inputs', () => {
    expect(generateRadius(undefined)).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generateRadius(500)).toBeUndefined()
  })
})

describe('generateCircleByCenterPoint', () => {
  it('should generate a circle with all properties', () => {
    const value = {
      numArc: 1,
      interpolation: 'circularArcCenterPointWithRadius',
      pos: { lat: 45.256, lng: -71.92 },
      radius: { value: 500, uom: 'm' },
    }
    const expected = {
      '@numArc': 1,
      '@interpolation': 'circularArcCenterPointWithRadius',
      'gml:pos': { '#text': '45.256 -71.92' },
      'gml:radius': { '#text': 500, '@uom': 'm' },
    }

    expect(generateCircleByCenterPoint(value)).toEqual(expected)
  })

  it('should return undefined for empty and non-object inputs', () => {
    expect(generateCircleByCenterPoint({})).toBeUndefined()
    expect(generateCircleByCenterPoint(undefined)).toBeUndefined()
  })
})

describe('generateWhere', () => {
  it('should generate every geometry the profile allows', () => {
    const value = {
      point: {
        pos: { lat: 45.256, lng: -71.92 },
      },
      lineString: {
        posList: {
          points: [
            { lat: 45.256, lng: -71.92 },
            { lat: 46.46, lng: -72.41 },
          ],
        },
      },
      polygon: {
        exterior: {
          linearRing: {
            posList: {
              points: [
                { lat: 45, lng: -110 },
                { lat: 46, lng: -109 },
                { lat: 43, lng: -109 },
                { lat: 45, lng: -110 },
              ],
            },
          },
        },
      },
      envelope: {
        lowerCorner: { lat: 42.943, lng: -71.032 },
        upperCorner: { lat: 43.039, lng: -69.856 },
      },
      circleByCenterPoint: {
        pos: { lat: 45.256, lng: -71.92 },
        radius: { value: 500, uom: 'm' },
      },
    }
    const expected = {
      'gml:Point': {
        'gml:pos': { '#text': '45.256 -71.92' },
      },
      'gml:LineString': {
        'gml:posList': { '#text': '45.256 -71.92 46.46 -72.41' },
      },
      'gml:Polygon': {
        'gml:exterior': {
          'gml:LinearRing': {
            'gml:posList': { '#text': '45 -110 46 -109 43 -109 45 -110' },
          },
        },
      },
      'gml:Envelope': {
        'gml:lowerCorner': { '#text': '42.943 -71.032' },
        'gml:upperCorner': { '#text': '43.039 -69.856' },
      },
      'gml:CircleByCenterPoint': {
        'gml:pos': { '#text': '45.256 -71.92' },
        'gml:radius': { '#text': 500, '@uom': 'm' },
      },
    }

    expect(generateWhere(value)).toEqual(expected)
  })

  it('should return undefined for empty and non-object inputs', () => {
    expect(generateWhere({})).toBeUndefined()
    expect(generateWhere(undefined)).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generateWhere(null)).toBeUndefined()
  })
})
