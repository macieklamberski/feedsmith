import { describe, expect, it } from 'bun:test'
import { generate } from './index.js'

describe('generate', () => {
  const versions = {
    '20': '2.0',
    // ns: 'with namespaces',
  }

  for (const [key, label] of Object.entries(versions)) {
    it(`should correctly generate RSS ${label}`, async () => {
      const reference = `${import.meta.dir}/../references/rss-${key}`
      const input = await Bun.file(`${reference}.json`).json()
      const expectation = await Bun.file(`${reference}.xml`).text()
      const result = generate(input)

      expect(result).toEqual(expectation)
    })
  }

  it('should generate RSS with sy namespace', () => {
    const input = {
      title: 'Feed with sy namespace',
      description: 'Test feed with syndication namespace',
      sy: {
        updatePeriod: 'hourly',
        updateFrequency: 2,
        updateBase: new Date('2023-01-01T00:00:00Z'),
      },
    }

    const expected = `<?xml version="1.0" encoding="utf-8"?>
<rss version="2.0" xmlns:sy="http://purl.org/rss/1.0/modules/syndication/">
  <channel>
    <title>Feed with sy namespace</title>
    <description>Test feed with syndication namespace</description>
    <sy:updatePeriod>hourly</sy:updatePeriod>
    <sy:updateFrequency>2</sy:updateFrequency>
    <sy:updateBase>2023-01-01T00:00:00.000Z</sy:updateBase>
  </channel>
</rss>
`

    expect(generate(input)).toEqual(expected)
  })

  it('should generate RSS with dc namespace', () => {
    const input = {
      title: 'Feed with dc namespace',
      description: 'Test feed with Dublin Core namespace',
      dc: {
        creator: 'John Doe',
        rights: 'Copyright 2023',
      },
      items: [
        {
          title: 'First item',
          dc: {
            creator: 'Jane Smith',
            date: new Date('2023-01-01T00:00:00Z'),
          },
        },
      ],
    }

    const expected = `<?xml version="1.0" encoding="utf-8"?>
<rss version="2.0" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>Feed with dc namespace</title>
    <description>Test feed with Dublin Core namespace</description>
    <dc:creator>John Doe</dc:creator>
    <dc:rights>Copyright 2023</dc:rights>
    <item>
      <title>First item</title>
      <dc:creator>Jane Smith</dc:creator>
      <dc:date>2023-01-01T00:00:00.000Z</dc:date>
    </item>
  </channel>
</rss>
`

    expect(generate(input)).toEqual(expected)
  })
})
