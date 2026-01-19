const { generateRssFeed, parseFeed } = require('feedsmith')

import type { Rss } from 'feedsmith'

const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Test Feed</title>
    <link>https://example.com</link>
    <description>Test Description</description>
  </channel>
</rss>`

const result = parseFeed(rssXml)

const feedData: Rss.Feed<Date> = {
  title: 'Generated Feed',
  link: 'https://example.com',
  description: 'Generated description',
  items: [],
}

const generatedRss = generateRssFeed(feedData)
