import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Feedsmith',
  description:
    'Robust and fast JavaScript parser and generator for RSS, Atom, JSON Feed, and RDF feeds, with support for popular namespaces and OPML files.',
  cleanUrls: true,
  themeConfig: {
    nav: [
      { text: 'Quick Start', link: '/quick-start' },
      { text: 'Parsing', link: '/parsing' },
      { text: 'Generating', link: '/generating' },
    ],
    sidebar: [
      {
        items: [
          { text: 'Introduction', link: '/' },
          { text: 'Installation', link: '/installation' },
          { text: 'Philosophy', link: '/philosophy' },
          { text: 'Benchmarks', link: '/benchmarks' },
          {
            text: 'Parsing',
            items: [
              { text: 'Overview', link: '/parsing/' },
              { text: 'Namespaces', link: '/parsing/namespaces' },
              { text: 'Dates', link: '/parsing/dates' },
            ],
          },
          {
            text: 'Generating',
            items: [
              { text: 'Overview', link: '/generating/' },
              { text: 'Styling', link: '/generating/styling' },
            ],
          },
          { text: 'Detecting', link: '/detecting' },
        ],
      },
      {
        text: 'API Reference',
        link: '/api',
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
