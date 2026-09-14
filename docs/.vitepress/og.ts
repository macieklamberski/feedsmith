import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import { join } from 'node:path'
import { Resvg } from '@resvg/resvg-js'
import satori, { type Font } from 'satori'
import type { DefaultTheme, HeadConfig, SiteConfig, TransformContext } from 'vitepress'

type Options = {
  name: string
  hostname: string
  repo: string
  accent: string
}

type Page = {
  slug: string
  path: string
  heading: string
  section?: string
}

type Node = {
  type: string
  props: Record<string, unknown>
}

type Images = {
  logo: string
  github: string
}

const mdRegex = /\.md$/
const indexRegex = /(^|\/)index$/
const slashRegex = /\//g
const titlePrefixRegex = /^[^:]+:\s*/
const nonBreakingHyphenRegex = /\u2011/g

const size = {
  cardWidth: 1200,
  cardHeight: 630,
  cardPadding: '56px 450px 56px 64px',
  logoTile: 56,
  logoText: 44,
  eyebrowText: 26,
  titleText: 72,
  titleTextLong: 56,
  titleTextLongest: 44,
  titleLongLength: 40,
  titleLongestLength: 90,
  titleMaxLines: 3,
  repoMark: 32,
  repoText: 28,
  railWidth: 600,
  railDotStep: 24,
  railDotRadius: 2,
}

const color = {
  bg: '#171717',
  text: '#f0f0f0',
  textMuted: '#a3a3a3',
  textSoft: '#c4c4c4',
  railDot: '#5c5c5c',
}

const require = createRequire(import.meta.url)
const pages: Array<Page> = []

const h = (type: string, style: Record<string, unknown>, children?: unknown): Node => {
  return { type, props: { style, children } }
}

const getTrail = (
  items: Array<DefaultTheme.SidebarItem>,
  link: string,
): Array<string> | undefined => {
  for (const item of items) {
    if (item.link === link) {
      return []
    }

    const trail = getTrail(item.items ?? [], link)

    if (trail && item.text) {
      return [item.text, ...trail]
    }
  }
}

const getSection = (sidebar: DefaultTheme.Sidebar | undefined, path: string) => {
  if (!Array.isArray(sidebar)) {
    return
  }

  const trail = getTrail(sidebar, `/${path.replace(indexRegex, '')}`)

  return trail?.join(' › ')
}

const renderLogo = (name: string, logo: string): Node => {
  const tile = {
    type: 'img',
    props: { src: logo, width: size.logoTile, height: size.logoTile },
  }

  return h('div', { display: 'flex', alignItems: 'center', gap: 20 }, [
    tile,
    h('div', { fontFamily: 'JetBrains Mono', fontSize: size.logoText }, name),
  ])
}

const renderEyebrow = (section: string, accent: string): Node => {
  return h(
    'div',
    {
      fontFamily: 'JetBrains Mono',
      fontSize: size.eyebrowText,
      color: accent,
      textTransform: 'uppercase',
      letterSpacing: '0.12em',
    },
    section,
  )
}

const getTitleSize = (heading: string) => {
  if (heading.length > size.titleLongestLength) {
    return size.titleTextLongest
  }

  if (heading.length > size.titleLongLength) {
    return size.titleTextLong
  }

  return size.titleText
}

const renderTitle = (heading: string, hasEyebrow: boolean): Node => {
  const isLong = heading.length > size.titleLongestLength
  const style = {
    fontFamily: 'Inter',
    fontSize: getTitleSize(heading),
    fontWeight: isLong ? 400 : 700,
    lineHeight: 1.15,
    letterSpacing: isLong ? '-0.0125em' : '-0.025em',
    color: isLong ? color.textSoft : color.text,
    display: 'block',
  }

  return h('div', hasEyebrow ? { ...style, lineClamp: size.titleMaxLines } : style, heading)
}

const renderRepo = (repo: string, mark: string): Node => {
  return h('div', { display: 'flex', alignItems: 'center', gap: 14, color: color.textMuted }, [
    { type: 'img', props: { src: mark, width: size.repoMark, height: size.repoMark } },
    h('div', { fontFamily: 'JetBrains Mono', fontSize: size.repoText }, repo),
  ])
}

const renderRail = (): Node => {
  const dots: Array<Node> = []

  for (let y = size.railDotStep / 2; y < size.cardHeight; y += size.railDotStep) {
    for (let x = size.railDotStep / 2; x < size.railWidth; x += size.railDotStep) {
      const opacity = x / size.railWidth

      dots.push({
        type: 'circle',
        props: { cx: x, cy: y, r: size.railDotRadius, fill: color.railDot, opacity },
      })
    }
  }

  const svg: Node = {
    type: 'svg',
    props: {
      width: size.railWidth,
      height: size.cardHeight,
      viewBox: `0 0 ${size.railWidth} ${size.cardHeight}`,
      children: dots,
    },
  }

  return h('div', { position: 'absolute', top: 0, right: 0, display: 'flex' }, svg)
}

const renderCard = ({ name, repo, accent }: Options, page: Page, images: Images): Node => {
  const card = {
    width: size.cardWidth,
    height: size.cardHeight,
    display: 'flex',
    background: color.bg,
    color: color.text,
  }
  const body = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: size.cardPadding,
  }

  return h('div', card, [
    renderRail(),
    h('div', body, [
      renderLogo(name, images.logo),
      h('div', { display: 'flex', flexDirection: 'column', gap: 16 }, [
        page.section ? renderEyebrow(page.section, accent) : undefined,
        renderTitle(page.heading, Boolean(page.section)),
      ]),
      renderRepo(repo, images.github),
    ]),
  ])
}

const loadFonts = async (): Promise<Array<Font>> => {
  const interRegular = require.resolve('@fontsource/inter/files/inter-latin-400-normal.woff')
  const interBold = require.resolve('@fontsource/inter/files/inter-latin-700-normal.woff')
  const mono = require.resolve(
    '@fontsource/jetbrains-mono/files/jetbrains-mono-latin-500-normal.woff',
  )

  return [
    { name: 'Inter', weight: 400, data: await readFile(interRegular) },
    { name: 'Inter', weight: 700, data: await readFile(interBold) },
    { name: 'JetBrains Mono', weight: 500, data: await readFile(mono) },
  ]
}

const loadImage = async (path: string) => {
  const svg = await readFile(path, 'utf8')

  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`
}

const loadImages = async (srcDir: string): Promise<Images> => {
  return {
    logo: await loadImage(join(srcDir, 'public/favicon.svg')),
    github: await loadImage(join(import.meta.dirname, 'github.svg')),
  }
}

const renderPng = async (options: Options, page: Page, fonts: Array<Font>, images: Images) => {
  const svg = await satori(renderCard(options, page, images), {
    width: size.cardWidth,
    height: size.cardHeight,
    fonts,
  })

  return new Resvg(svg).render().asPng()
}

export const createOg = (options: Options) => {
  const { name, hostname } = options

  const transformHead = ({
    pageData,
    siteData,
    description,
  }: TransformContext<DefaultTheme.Config>): Array<HeadConfig> => {
    const path = pageData.relativePath.replace(mdRegex, '')
    const slug = path.replace(slashRegex, '-')
    const title = pageData.title || name
    const section = slug === 'index' ? undefined : getSection(siteData.themeConfig.sidebar, path)
    const heading = (
      slug === 'index' ? siteData.description : title.replace(titlePrefixRegex, '')
    ).replace(nonBreakingHyphenRegex, '-')
    const pageUrl = `${hostname}/${path.replace(indexRegex, '')}`
    const imageUrl = `${hostname}/og/${slug}.png`

    pages.push({ slug, path, heading, section })

    return [
      ['meta', { property: 'og:type', content: 'website' }],
      ['meta', { property: 'og:url', content: pageUrl }],
      ['meta', { property: 'og:title', content: title }],
      ['meta', { property: 'og:description', content: description }],
      ['meta', { property: 'og:image', content: imageUrl }],
      ['meta', { property: 'og:image:width', content: String(size.cardWidth) }],
      ['meta', { property: 'og:image:height', content: String(size.cardHeight) }],
      ['meta', { property: 'og:image:alt', content: title }],
      ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
      ['meta', { name: 'twitter:title', content: title }],
      ['meta', { name: 'twitter:description', content: description }],
      ['meta', { name: 'twitter:image', content: imageUrl }],
    ]
  }

  const buildEnd = async ({ outDir, srcDir }: SiteConfig) => {
    const ogDir = join(outDir, 'og')
    const fonts = await loadFonts()
    const images = await loadImages(srcDir)

    await mkdir(ogDir, { recursive: true })

    for (const page of pages) {
      await writeFile(
        join(ogDir, `${page.slug}.png`),
        await renderPng(options, page, fonts, images),
      )
    }
  }

  return { transformHead, buildEnd }
}
