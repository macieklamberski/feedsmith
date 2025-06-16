import { describe, expect, it } from 'bun:test'
import { generate } from './index.js'

describe('generate', () => {
  // TODO: Enable reference tests once advanced features like Text fields being an object of
  // { value: string, type: 'text' | 'html' | 'xhtml' }
  // const versions = {
  //   '10': '1.0',
  //   // ns: 'with namespaces',
  // }

  // for (const [key, label] of Object.entries(versions)) {
  //   it(`should correctly generate Atom ${label}`, async () => {
  //     const reference = `${import.meta.dir}/../references/atom-${key}`
  //     const input = await Bun.file(`${reference}.json`).json()
  //     const expectation = await Bun.file(`${reference}.xml`).text()
  //     const result = generate(input)

  //     expect(result).toEqual(expectation)
  //   })
  // }

  it('should generate minimal valid Atom feed', () => {
    const value = {
      id: 'https://example.com/feed',
      title: 'Minimal Feed',
      updated: new Date('2023-03-15T12:00:00Z'),
    }
    const expected = `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <id>https://example.com/feed</id>
  <title>Minimal Feed</title>
  <updated>2023-03-15T12:00:00.000Z</updated>
</feed>
`

    expect(generate(value)).toEqual(expected)
  })

  it('should generate Atom feed with entries', () => {
    const value = {
      id: 'https://example.com/feed',
      title: 'Feed with Entries',
      updated: new Date('2023-03-15T12:00:00Z'),
      entries: [
        {
          id: 'https://example.com/entry/1',
          title: 'First Entry',
          updated: new Date('2023-03-15T12:00:00Z'),
        },
        {
          id: 'https://example.com/entry/2',
          title: 'Second Entry',
          updated: new Date('2023-03-15T12:00:00Z'),
        },
      ],
    }
    const expected = `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <id>https://example.com/feed</id>
  <title>Feed with Entries</title>
  <updated>2023-03-15T12:00:00.000Z</updated>
  <entry>
    <id>https://example.com/entry/1</id>
    <title>First Entry</title>
    <updated>2023-03-15T12:00:00.000Z</updated>
  </entry>
  <entry>
    <id>https://example.com/entry/2</id>
    <title>Second Entry</title>
    <updated>2023-03-15T12:00:00.000Z</updated>
  </entry>
</feed>
`

    expect(generate(value)).toEqual(expected)
  })

  it('should generate Atom feed with author and links', () => {
    const value = {
      id: 'https://example.com/feed',
      title: 'Feed with Author and Links',
      updated: new Date('2023-03-15T12:00:00Z'),
      authors: [
        {
          name: 'John Doe',
          email: 'john@example.com',
          uri: 'https://example.com/john',
        },
      ],
      links: [
        {
          href: 'https://example.com/feed.xml',
          rel: 'self',
          type: 'application/atom+xml',
        },
        {
          href: 'https://example.com',
          rel: 'alternate',
          type: 'text/html',
        },
      ],
    }
    const expected = `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <author>
    <name>John Doe</name>
    <uri>https://example.com/john</uri>
    <email>john@example.com</email>
  </author>
  <id>https://example.com/feed</id>
  <link href="https://example.com/feed.xml" rel="self" type="application/atom+xml"/>
  <link href="https://example.com" rel="alternate" type="text/html"/>
  <title>Feed with Author and Links</title>
  <updated>2023-03-15T12:00:00.000Z</updated>
</feed>
`

    expect(generate(value)).toEqual(expected)
  })

  it('should generate complete Atom feed with all fields', () => {
    const value = {
      id: 'https://example.com/feed',
      title: 'Complete Atom Feed',
      updated: new Date('2023-03-15T12:00:00Z'),
      authors: [
        {
          name: 'John Doe',
          email: 'john@example.com',
          uri: 'https://example.com/john',
        },
      ],
      categories: [
        {
          term: 'technology',
          scheme: 'https://example.com/categories',
          label: 'Technology',
        },
      ],
      contributors: [
        {
          name: 'Jane Smith',
          email: 'jane@example.com',
        },
      ],
      generator: {
        text: 'Example Generator',
        uri: 'https://example.com/generator',
        version: '1.0',
      },
      icon: 'https://example.com/icon.png',
      logo: 'https://example.com/logo.png',
      rights: 'Copyright 2023 Example Corp',
      subtitle: 'A complete example feed',
      links: [
        {
          href: 'https://example.com/feed.xml',
          rel: 'self',
          type: 'application/atom+xml',
        },
      ],
      entries: [
        {
          id: 'https://example.com/entry/1',
          title: 'Complete Entry',
          updated: new Date('2023-03-15T12:00:00Z'),
          published: new Date('2023-03-10T08:00:00Z'),
          content: 'This is the complete entry content',
          summary: 'Entry summary',
          authors: [
            {
              name: 'Entry Author',
            },
          ],
          categories: [
            {
              term: 'news',
            },
          ],
          links: [
            {
              href: 'https://example.com/entry/1',
              rel: 'alternate',
              type: 'text/html',
            },
          ],
        },
      ],
    }
    const expected = `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <author>
    <name>John Doe</name>
    <uri>https://example.com/john</uri>
    <email>john@example.com</email>
  </author>
  <category term="technology" scheme="https://example.com/categories" label="Technology"/>
  <contributor>
    <name>Jane Smith</name>
    <email>jane@example.com</email>
  </contributor>
  <generator uri="https://example.com/generator" version="1.0">Example Generator</generator>
  <icon>https://example.com/icon.png</icon>
  <id>https://example.com/feed</id>
  <link href="https://example.com/feed.xml" rel="self" type="application/atom+xml"/>
  <logo>https://example.com/logo.png</logo>
  <rights>Copyright 2023 Example Corp</rights>
  <subtitle>A complete example feed</subtitle>
  <title>Complete Atom Feed</title>
  <updated>2023-03-15T12:00:00.000Z</updated>
  <entry>
    <author>
      <name>Entry Author</name>
    </author>
    <category term="news"/>
    <content>This is the complete entry content</content>
    <id>https://example.com/entry/1</id>
    <link href="https://example.com/entry/1" rel="alternate" type="text/html"/>
    <published>2023-03-10T08:00:00.000Z</published>
    <summary>Entry summary</summary>
    <title>Complete Entry</title>
    <updated>2023-03-15T12:00:00.000Z</updated>
  </entry>
</feed>
`

    expect(generate(value)).toEqual(expected)
  })

  it('should handle empty arrays', () => {
    const value = {
      id: 'https://example.com/feed',
      title: 'Feed with Empty Arrays',
      updated: new Date('2023-03-15T12:00:00Z'),
      authors: [],
      categories: [],
      entries: [],
    }
    const expected = `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <id>https://example.com/feed</id>
  <title>Feed with Empty Arrays</title>
  <updated>2023-03-15T12:00:00.000Z</updated>
</feed>
`

    expect(generate(value)).toEqual(expected)
  })

  it('should throw error for invalid Atom feed structure', () => {
    const value = {}

    // @ts-ignore: This is for testing purposes.
    expect(() => generate(value)).toThrow('Invalid input Atom')
  })

  it('should properly encode special characters in text content', () => {
    const updatedDate = new Date('2023-03-15T12:00:00Z')
    const value = {
      id: 'https://example.com/feed',
      title: 'Special & Characters > Need "Escaping"',
      updated: updatedDate,
      subtitle: 'Content with <tags> & "quotes"',
      entries: [
        {
          id: 'https://example.com/entry/1',
          title: 'Entry with & Special Characters',
          updated: updatedDate,
          content: 'Content with <b>bold</b> & "quoted" text',
        },
      ],
    }
    const expected = `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <id>https://example.com/feed</id>
  <subtitle>Content with &lt;tags&gt; &amp; &quot;quotes&quot;</subtitle>
  <title>Special &amp; Characters &gt; Need &quot;Escaping&quot;</title>
  <updated>2023-03-15T12:00:00.000Z</updated>
  <entry>
    <content>Content with &lt;b&gt;bold&lt;/b&gt; &amp; &quot;quoted&quot; text</content>
    <id>https://example.com/entry/1</id>
    <title>Entry with &amp; Special Characters</title>
    <updated>2023-03-15T12:00:00.000Z</updated>
  </entry>
</feed>
`

    expect(generate(value)).toEqual(expected)
  })

  it('should handle invalid dates gracefully', () => {
    const value = {
      id: 'https://example.com/feed',
      title: 'Feed with Invalid Date',
      updated: new Date('invalid-date'),
    }
    const expected = `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <id>https://example.com/feed</id>
  <title>Feed with Invalid Date</title>
</feed>
`

    expect(generate(value)).toEqual(expected)
  })
})
