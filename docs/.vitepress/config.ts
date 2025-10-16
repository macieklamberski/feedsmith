import { defineConfig } from 'vitepress'
import llmstxt from 'vitepress-plugin-llms'

export default defineConfig({
  vite: {
    plugins: [llmstxt()],
  },
  title: 'Feedsmith',
  description:
    'Fast, all‑in‑one JavaScript feed parser and generator for RSS, Atom, RDF, and JSON Feed, with support for popular namespaces and OPML files.',
  lastUpdated: true,
  cleanUrls: true,
  head: [
    [
      'script',
      {
        async: '',
        src: 'https://umami.lamberski.com/script.js',
        'data-website-id': 'a9c61323-eaac-4bbb-bd20-b1c6f0d69a3d',
      },
    ],
  ],
  themeConfig: {
    outline: {
      level: [2, 3],
    },
    nav: [
      { text: 'Quick Start', link: '/quick-start' },
      { text: 'Parsing', link: '/parsing/' },
      { text: 'Generating', link: '/generating/' },
    ],
    sidebar: [
      {
        text: 'Get Started',
        items: [
          { text: 'Introduction', link: '/' },
          { text: 'Quick Start', link: '/quick-start' },
          { text: 'Benchmarks', link: '/benchmarks' },
        ],
      },
      {
        text: 'Parsing',
        items: [
          { text: 'Overview', link: '/parsing/' },
          { text: 'Namespaces', link: '/parsing/namespaces' },
          { text: 'Dates', link: '/parsing/dates' },
          { text: 'Detecting', link: '/parsing/detecting' },
          { text: 'Examples', link: '/parsing/examples' },
        ],
      },
      {
        text: 'Generating',
        items: [
          { text: 'Overview', link: '/generating/' },
          { text: 'Styling', link: '/generating/styling' },
          { text: 'Lenient Mode', link: '/generating/lenient-mode' },
          { text: 'Examples', link: '/generating/examples' },
        ],
      },
      {
        text: 'API Reference',
        items: [
          {
            text: 'Universal',
            link: '/reference/',
          },
          {
            text: 'Feeds',
            collapsed: true,
            items: [
              { text: 'RSS', link: '/reference/feeds/rss' },
              { text: 'Atom', link: '/reference/feeds/atom' },
              { text: 'RDF', link: '/reference/feeds/rdf' },
              { text: 'JSON Feed', link: '/reference/feeds/json-feed' },
            ],
          },
          {
            text: 'Namespaces',
            collapsed: true,
            items: [
              { text: 'Atom', link: '/reference/namespaces/atom' },
              { text: 'Dublin Core', link: '/reference/namespaces/dc' },
              { text: 'Syndication', link: '/reference/namespaces/sy' },
              { text: 'Content', link: '/reference/namespaces/content' },
              { text: 'Slash', link: '/reference/namespaces/slash' },
              { text: 'iTunes', link: '/reference/namespaces/itunes' },
              { text: 'Podcast', link: '/reference/namespaces/podcast' },
              { text: 'Podlove Simple Chapters', link: '/reference/namespaces/psc' },
              { text: 'Media RSS', link: '/reference/namespaces/media' },
              { text: 'GeoRSS-Simple', link: '/reference/namespaces/georss' },
              { text: 'Atom Threading', link: '/reference/namespaces/thr' },
              { text: 'Dublin Core Terms', link: '/reference/namespaces/dcterms' },
              { text: 'Well-Formed Web', link: '/reference/namespaces/wfw' },
              { text: 'Source', link: '/reference/namespaces/source' },
              { text: 'FeedPress', link: '/reference/namespaces/feedpress' },
              { text: 'YouTube', link: '/reference/namespaces/yt' },
            ],
          },
          {
            text: 'OPML',
            link: '/reference/opml',
          },
        ],
      },
      {
        text: 'Migration from 1.x to 2.x',
        link: '/migration-to-2.x',
      },
    ],
    search: {
      provider: 'local',
    },
    socialLinks: [
      {
        icon: 'github',
        link: 'https://github.com/macieklamberski/feedsmith',
      },
      {
        icon: 'npm',
        link: 'https://www.npmjs.com/package/feedsmith',
      },
    ],
  },
})
