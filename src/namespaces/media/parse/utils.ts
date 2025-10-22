import type { ParsePartialUtil } from '../../../common/types.js'
import {
  isNonEmptyStringOrNumber,
  isObject,
  parseArrayOf,
  parseBoolean,
  parseCsvOf,
  parseNumber,
  parseSingularOf,
  parseString,
  retrieveText,
  trimObject,
} from '../../../common/utils.js'
import type { Media } from '../common/types.js'

export const parseRating: ParsePartialUtil<Media.Rating> = (value) => {
  const rating = {
    value: ((value) => parseString(retrieveText(value)))(value),
    scheme: parseString(value?.['@scheme']),
  }

  return trimObject(rating)
}

export const retrieveRatings: ParsePartialUtil<Array<Media.Rating>> = (value) => {
  if (!isObject(value)) {
    return
  }

  if (value['media:rating']) {
    return parseArrayOf(value['media:rating'], parseRating)
  }

  // Handle migration from media:adult to media:rating:
  // <media:adult>true</media:adult> → <media:rating scheme="urn:simple">adult</media:rating>
  // <media:adult>false</media:adult> → <media:rating scheme="urn:simple">nonadult</media:rating>
  if (value['media:adult']) {
    const isAdult = parseBoolean(retrieveText(value['media:adult']))

    const rating = {
      value: isAdult ? 'adult' : 'nonadult',
      scheme: 'urn:simple',
    }

    return [rating]
  }
}

export const parseTitleOrDescription: ParsePartialUtil<Media.TitleOrDescription> = (value) => {
  const title = {
    value: ((value) => parseString(retrieveText(value)))(value),
    type: parseString(value?.['@type']),
  }

  return trimObject(title)
}

export const parseThumbnail: ParsePartialUtil<Media.Thumbnail> = (value) => {
  if (!isObject(value)) {
    return
  }

  const thumbnail = {
    url: parseString(value['@url']),
    height: parseNumber(value['@height']),
    width: parseNumber(value['@width']),
    time: parseString(value['@time']),
  }

  return trimObject(thumbnail)
}

export const parseCategory: ParsePartialUtil<Media.Category> = (value) => {
  const category = {
    name: ((value) => parseString(retrieveText(value)))(value),
    scheme: parseString(value?.['@scheme']),
    label: parseString(value?.['@label']),
  }

  return trimObject(category)
}

export const parseHash: ParsePartialUtil<Media.Hash> = (value) => {
  const hash = {
    value: ((value) => parseString(retrieveText(value)))(value),
    algo: parseString(value?.['@algo']),
  }

  return trimObject(hash)
}

export const parsePlayer: ParsePartialUtil<Media.Player> = (value) => {
  if (!isObject(value)) {
    return
  }

  const player = {
    url: parseString(value['@url']),
    height: parseNumber(value['@height']),
    width: parseNumber(value['@width']),
  }

  return trimObject(player)
}

export const parseCredit: ParsePartialUtil<Media.Credit> = (value) => {
  const credit = {
    value: ((value) => parseString(retrieveText(value)))(value),
    role: parseString(value?.['@role']),
    scheme: parseString(value?.['@scheme']),
  }

  return trimObject(credit)
}

export const parseCopyright: ParsePartialUtil<Media.Copyright> = (value) => {
  const copyright = {
    value: ((value) => parseString(retrieveText(value)))(value),
    url: parseString(value?.['@url']),
  }

  return trimObject(copyright)
}

export const parseText: ParsePartialUtil<Media.Text> = (value) => {
  const text = {
    value: ((value) => parseString(retrieveText(value)))(value),
    type: parseString(value?.['@type']),
    lang: parseString(value?.['@lang']),
    start: parseString(value?.['@start']),
    end: parseString(value?.['@end']),
  }

  return trimObject(text)
}

export const parseRestriction: ParsePartialUtil<Media.Restriction> = (value) => {
  if (!isObject(value)) {
    return
  }

  const restriction = {
    value: ((value) => parseString(retrieveText(value)))(value),
    relationship: parseString(value['@relationship']),
    type: parseString(value['@type']),
  }

  return trimObject(restriction)
}

export const parseCommunity: ParsePartialUtil<Media.Community> = (value) => {
  if (!isObject(value)) {
    return
  }

  const community = {
    starRating: parseSingularOf(value['media:starrating'], parseStarRating),
    statistics: parseSingularOf(value['media:statistics'], parseStatistics),
    tags: parseSingularOf(value['media:tags'], parseTags),
  }

  return trimObject(community)
}

export const parseStarRating: ParsePartialUtil<Media.StarRating> = (value) => {
  if (!isObject(value)) {
    return
  }

  const starRating = {
    average: parseNumber(value['@average']),
    count: parseNumber(value['@count']),
    min: parseNumber(value['@min']),
    max: parseNumber(value['@max']),
  }

  return trimObject(starRating)
}

export const parseStatistics: ParsePartialUtil<Media.Statistics> = (value) => {
  if (!isObject(value)) {
    return
  }

  const statistics = {
    views: parseNumber(value['@views']),
    favorites: parseNumber(value['@favorites']),
  }

  return trimObject(statistics)
}

export const parseTags: ParsePartialUtil<Array<Media.Tag>> = (value) => {
  return parseCsvOf(value, (segment) => {
    const split = segment.split(':')

    return {
      name: parseString(split[0]) ?? '',
      weight: parseNumber(split[1]) ?? 1,
    }
  })
}

export const parseComments: ParsePartialUtil<Array<string>> = (value) => {
  return parseArrayOf(value?.['media:comment'], (value) => parseString(retrieveText(value)))
}

export const parseEmbed: ParsePartialUtil<Media.Embed> = (value) => {
  if (!isObject(value)) {
    return
  }

  const embed = {
    url: parseString(value['@url']),
    width: parseNumber(value['@width']),
    height: parseNumber(value['@height']),
    params: parseArrayOf(value['media:param'], parseParam),
  }

  return trimObject(embed)
}

export const parseParam: ParsePartialUtil<Media.Param> = (value) => {
  if (!isObject(value)) {
    return
  }

  const param = {
    name: parseString(value['@name']),
    value: ((value) => parseString(retrieveText(value)))(value),
  }

  return trimObject(param)
}

export const parseResponses: ParsePartialUtil<Array<string>> = (value) => {
  return parseArrayOf(value?.['media:response'], (value) => parseString(retrieveText(value)))
}

export const parseBackLinks: ParsePartialUtil<Array<string>> = (value) => {
  return parseArrayOf(value?.['media:backlink'], (value) => parseString(retrieveText(value)))
}

export const parseStatus: ParsePartialUtil<Media.Status> = (value) => {
  if (!isObject(value)) {
    return
  }

  const status = {
    state: parseString(value['@state']),
    reason: parseString(value['@reason']),
  }

  return trimObject(status)
}

export const parsePrice: ParsePartialUtil<Media.Price> = (value) => {
  if (!isObject(value)) {
    return
  }

  const price = {
    type: parseString(value['@type']),
    info: parseString(value['@info']),
    price: parseNumber(value['@price']),
    currency: parseString(value['@currency']),
  }

  return trimObject(price)
}

export const parseLicense: ParsePartialUtil<Media.License> = (value) => {
  const license = {
    name: ((value) => parseString(retrieveText(value)))(value),
    type: parseString(value?.['@type']),
    href: parseString(value?.['@href']),
  }

  return trimObject(license)
}

export const parseSubTitle: ParsePartialUtil<Media.SubTitle> = (value) => {
  if (!isObject(value)) {
    return
  }

  const subTitle = {
    type: parseString(value['@type']),
    lang: parseString(value['@lang']),
    href: parseString(value['@href']),
  }

  return trimObject(subTitle)
}

export const parsePeerLink: ParsePartialUtil<Media.PeerLink> = (value) => {
  if (!isObject(value)) {
    return
  }

  const peerLink = {
    type: parseString(value['@type']),
    href: parseString(value['@href']),
  }

  return trimObject(peerLink)
}

export const parseRights: ParsePartialUtil<Media.Rights> = (value) => {
  if (!isObject(value)) {
    return
  }

  const rights = {
    status: parseString(value['@status']),
  }

  return trimObject(rights)
}

export const parseScene: ParsePartialUtil<Media.Scene> = (value) => {
  if (!isObject(value)) {
    return
  }

  const scene = {
    title: parseSingularOf(value.scenetitle, (value) => parseString(retrieveText(value))),
    description: parseSingularOf(value.scenedescription, (value) =>
      parseString(retrieveText(value)),
    ),
    startTime: parseSingularOf(value.scenestarttime, (value) => parseString(retrieveText(value))),
    endTime: parseSingularOf(value.sceneendtime, (value) => parseString(retrieveText(value))),
  }

  return trimObject(scene)
}

export const parseScenes: ParsePartialUtil<Array<Media.Scene>> = (value) => {
  return parseArrayOf(value?.['media:scene'], parseScene)
}

export const parseLocation: ParsePartialUtil<Media.Location> = (value) => {
  // For cases where the location is simply a string within the <media:location> tag.
  if (isNonEmptyStringOrNumber(value) || isObject(value)) {
    const location = {
      description: ((value) => parseString(retrieveText(value)))(value),
    }

    return trimObject(location)
  }

  // TODO: Extend parseLocation according to the specification of media:location:
  // https://www.rssboard.org/media-rss#media-peerlink after implementing GeoRSS GML support.
}

export const retrieveCommonElements: ParsePartialUtil<Media.CommonElements> = (value) => {
  if (!isObject(value)) {
    return
  }

  const commonElements = {
    ratings: retrieveRatings(value),
    title: parseSingularOf(value['media:title'], parseTitleOrDescription),
    description: parseSingularOf(value['media:description'], parseTitleOrDescription),
    keywords: parseSingularOf(value['media:keywords'], (value) =>
      parseCsvOf(retrieveText(value), parseString),
    ),
    thumbnails: parseArrayOf(value['media:thumbnail'], parseThumbnail),
    categories: parseArrayOf(value['media:category'], parseCategory),
    hashes: parseArrayOf(value['media:hash'], parseHash),
    player: parseSingularOf(value['media:player'], parsePlayer),
    credits: parseArrayOf(value['media:credit'], parseCredit),
    copyright: parseSingularOf(value['media:copyright'], parseCopyright),
    texts: parseArrayOf(value['media:text'], parseText),
    restrictions: parseArrayOf(value['media:restriction'], parseRestriction),
    community: parseSingularOf(value['media:community'], parseCommunity),
    comments: parseSingularOf(value['media:comments'], parseComments),
    embed: parseSingularOf(value['media:embed'], parseEmbed),
    responses: parseSingularOf(value['media:responses'], parseResponses),
    backLinks: parseSingularOf(value['media:backlinks'], parseBackLinks),
    status: parseSingularOf(value['media:status'], parseStatus),
    prices: parseArrayOf(value['media:price'], parsePrice),
    licenses: parseArrayOf(value['media:license'], parseLicense),
    subTitles: parseArrayOf(value['media:subtitle'], parseSubTitle),
    peerLinks: parseArrayOf(value['media:peerlink'], parsePeerLink),
    locations: parseArrayOf(value['media:location'], parseLocation),
    rights: parseSingularOf(value['media:rights'], parseRights),
    scenes: parseSingularOf(value['media:scenes'], parseScenes),
  }

  return trimObject(commonElements)
}

export const parseContent: ParsePartialUtil<Media.Content> = (value) => {
  if (!isObject(value)) {
    return
  }

  const content = {
    url: parseString(value['@url']),
    fileSize: parseNumber(value['@filesize']),
    type: parseString(value['@type']),
    medium: parseString(value['@medium']),
    isDefault: parseBoolean(value['@isdefault']),
    expression: parseString(value['@expression']),
    bitrate: parseNumber(value['@bitrate']),
    framerate: parseNumber(value['@framerate']),
    samplingrate: parseNumber(value['@samplingrate']),
    channels: parseNumber(value['@channels']),
    duration: parseNumber(value['@duration']),
    height: parseNumber(value['@height']),
    width: parseNumber(value['@width']),
    lang: parseString(value['@lang']),
    ...retrieveCommonElements(value),
  }

  return trimObject(content)
}

export const parseGroup: ParsePartialUtil<Media.Group> = (value) => {
  if (!isObject(value)) {
    return
  }

  const group = {
    contents: parseArrayOf(value['media:content'], parseContent),
    ...retrieveCommonElements(value),
  }

  return trimObject(group)
}

export const retrieveItemOrFeed: ParsePartialUtil<Media.ItemOrFeed> = (value) => {
  if (!isObject(value)) {
    return
  }

  const itemOrFeed = {
    group: parseSingularOf(value['media:group'], parseGroup),
    contents: parseArrayOf(value['media:content'], parseContent),
    ...retrieveCommonElements(value),
  }

  return trimObject(itemOrFeed)
}
