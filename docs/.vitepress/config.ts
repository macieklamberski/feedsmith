import { defineConfig } from 'vitepress'
import llmstxt from 'vitepress-plugin-llms'

export default defineConfig({
  vite: {
    plugins: [llmstxt()],
  },
  title: 'Feedsmith',
  description:
    'Robust and fast JavaScript parser and generator for RSS, Atom, JSON Feed, and RDF feeds, with support for popular namespaces and OPML files.',
  lastUpdated: true,
  cleanUrls: true,
  themeConfig: {
    nav: [
      { text: 'Quick Start', link: '/quick-start' },
      { text: 'Parsing', link: '/parsing/' },
      { text: 'Generating', link: '/generating/' },
    ],
    sidebar: [
      {
        text: 'Getting Started',
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
        ],
      },
      {
        text: 'Generating',
        items: [
          { text: 'Overview', link: '/generating/' },
          { text: 'Styling', link: '/generating/styling' },
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
