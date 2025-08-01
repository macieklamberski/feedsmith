import type { ParsePartialFunction } from '@/common/types.js'
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
} from '@/common/utils.js'
import type {
  Category,
  CommonElements,
  Community,
  Content,
  Copyright,
  Credit,
  Embed,
  Group,
  Hash,
  ItemOrFeed,
  License,
  Location,
  Param,
  PeerLink,
  Player,
  Price,
  Rating,
  Restriction,
  Rights,
  Scene,
  StarRating,
  Statistics,
  Status,
  SubTitle,
  Tag,
  Text,
  Thumbnail,
  TitleOrDescription,
} from '@/namespaces/media/common/types.js'

export const parseRating: ParsePartialFunction<Rating> = (value) => {
  const rating = {
    value: ((value) => parseString(retrieveText(value)))(value),
    scheme: parseString(value?.['@scheme']),
  }

  return trimObject(rating)
}

export const retrieveRatings: ParsePartialFunction<Array<Rating>> = (value) => {
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

export const parseTitleOrDescription: ParsePartialFunction<TitleOrDescription> = (value) => {
  const title = {
    value: ((value) => parseString(retrieveText(value)))(value),
    type: parseString(value?.['@type']),
  }

  return trimObject(title)
}

export const parseThumbnail: ParsePartialFunction<Thumbnail> = (value) => {
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

export const parseCategory: ParsePartialFunction<Category> = (value) => {
  const category = {
    name: ((value) => parseString(retrieveText(value)))(value),
    scheme: parseString(value?.['@scheme']),
    label: parseString(value?.['@label']),
  }

  return trimObject(category)
}

export const parseHash: ParsePartialFunction<Hash> = (value) => {
  const hash = {
    value: ((value) => parseString(retrieveText(value)))(value),
    algo: parseString(value?.['@algo']),
  }

  return trimObject(hash)
}

export const parsePlayer: ParsePartialFunction<Player> = (value) => {
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

export const parseCredit: ParsePartialFunction<Credit> = (value) => {
  const credit = {
    value: ((value) => parseString(retrieveText(value)))(value),
    role: parseString(value?.['@role']),
    scheme: parseString(value?.['@scheme']),
  }

  return trimObject(credit)
}

export const parseCopyright: ParsePartialFunction<Copyright> = (value) => {
  const copyright = {
    value: ((value) => parseString(retrieveText(value)))(value),
    url: parseString(value?.['@url']),
  }

  return trimObject(copyright)
}

export const parseText: ParsePartialFunction<Text> = (value) => {
  const text = {
    value: ((value) => parseString(retrieveText(value)))(value),
    type: parseString(value?.['@type']),
    lang: parseString(value?.['@lang']),
    start: parseString(value?.['@start']),
    end: parseString(value?.['@end']),
  }

  return trimObject(text)
}

export const parseRestriction: ParsePartialFunction<Restriction> = (value) => {
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

export const parseCommunity: ParsePartialFunction<Community> = (value) => {
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

export const parseStarRating: ParsePartialFunction<StarRating> = (value) => {
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

export const parseStatistics: ParsePartialFunction<Statistics> = (value) => {
  if (!isObject(value)) {
    return
  }

  const statistics = {
    views: parseNumber(value['@views']),
    favorites: parseNumber(value['@favorites']),
  }

  return trimObject(statistics)
}

export const parseTags: ParsePartialFunction<Array<Tag>> = (value) => {
  return parseCsvOf(value, (segment) => {
    const split = segment.split(':')

    return {
      name: parseString(split[0]) ?? '',
      weight: parseNumber(split[1]) ?? 1,
    }
  })
}

export const parseComments: ParsePartialFunction<Array<string>> = (value) => {
  return parseArrayOf(value?.['media:comment'], (value) => parseString(retrieveText(value)))
}

export const parseEmbed: ParsePartialFunction<Embed> = (value) => {
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

export const parseParam: ParsePartialFunction<Param> = (value) => {
  if (!isObject(value)) {
    return
  }

  const param = {
    name: parseString(value['@name']),
    value: ((value) => parseString(retrieveText(value)))(value),
  }

  return trimObject(param)
}

export const parseResponses: ParsePartialFunction<Array<string>> = (value) => {
  return parseArrayOf(value?.['media:response'], (value) => parseString(retrieveText(value)))
}

export const parseBackLinks: ParsePartialFunction<Array<string>> = (value) => {
  return parseArrayOf(value?.['media:backlink'], (value) => parseString(retrieveText(value)))
}

export const parseStatus: ParsePartialFunction<Status> = (value) => {
  if (!isObject(value)) {
    return
  }

  const status = {
    state: parseString(value['@state']),
    reason: parseString(value['@reason']),
  }

  return trimObject(status)
}

export const parsePrice: ParsePartialFunction<Price> = (value) => {
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

export const parseLicense: ParsePartialFunction<License> = (value) => {
  const license = {
    name: ((value) => parseString(retrieveText(value)))(value),
    type: parseString(value?.['@type']),
    href: parseString(value?.['@href']),
  }

  return trimObject(license)
}

export const parseSubTitle: ParsePartialFunction<SubTitle> = (value) => {
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

export const parsePeerLink: ParsePartialFunction<PeerLink> = (value) => {
  if (!isObject(value)) {
    return
  }

  const peerLink = {
    type: parseString(value['@type']),
    href: parseString(value['@href']),
  }

  return trimObject(peerLink)
}

export const parseRights: ParsePartialFunction<Rights> = (value) => {
  if (!isObject(value)) {
    return
  }

  const rights = {
    status: parseString(value['@status']),
  }

  return trimObject(rights)
}

export const parseScene: ParsePartialFunction<Scene> = (value) => {
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

export const parseScenes: ParsePartialFunction<Array<Scene>> = (value) => {
  return parseArrayOf(value?.['media:scene'], parseScene)
}

export const parseLocation: ParsePartialFunction<Location> = (value) => {
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

export const retrieveCommonElements: ParsePartialFunction<CommonElements> = (value) => {
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

export const parseContent: ParsePartialFunction<Content> = (value) => {
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

export const parseGroup: ParsePartialFunction<Group> = (value) => {
  if (!isObject(value)) {
    return
  }

  const group = {
    contents: parseArrayOf(value['media:content'], parseContent),
    ...retrieveCommonElements(value),
  }

  return trimObject(group)
}

export const retrieveItemOrFeed: ParsePartialFunction<ItemOrFeed> = (value) => {
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
