import type { GenerateFunction } from '../../../common/types.js'
import {
  generateCsvOf,
  generateYesNoBoolean,
  isObject,
  trimArray,
  trimObject,
} from '../../../common/utils.js'
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
} from '../common/types.js'

export const generateRating: GenerateFunction<Rating> = (rating) => {
  if (!isObject(rating)) {
    return
  }

  const value = {
    '#text': rating.value,
    '@scheme': rating.scheme,
  }

  return trimObject(value)
}

export const generateTitleOrDescription: GenerateFunction<TitleOrDescription> = (
  titleOrDescription,
) => {
  if (!isObject(titleOrDescription)) {
    return
  }

  const value = {
    '#text': titleOrDescription.value,
    '@type': titleOrDescription.type,
  }

  return trimObject(value)
}

export const generateThumbnail: GenerateFunction<Thumbnail> = (thumbnail) => {
  if (!isObject(thumbnail)) {
    return
  }

  const value = {
    '@url': thumbnail.url,
    '@height': thumbnail.height,
    '@width': thumbnail.width,
    '@time': thumbnail.time,
  }

  return trimObject(value)
}

export const generateCategory: GenerateFunction<Category> = (category) => {
  if (!isObject(category)) {
    return
  }

  const value = {
    '#text': category.name,
    '@scheme': category.scheme,
    '@label': category.label,
  }

  return trimObject(value)
}

export const generateHash: GenerateFunction<Hash> = (hash) => {
  if (!isObject(hash)) {
    return
  }

  const value = {
    '#text': hash.value,
    '@algo': hash.algo,
  }

  return trimObject(value)
}

export const generatePlayer: GenerateFunction<Player> = (player) => {
  if (!isObject(player)) {
    return
  }

  const value = {
    '@url': player.url,
    '@height': player.height,
    '@width': player.width,
  }

  return trimObject(value)
}

export const generateCredit: GenerateFunction<Credit> = (credit) => {
  if (!isObject(credit)) {
    return
  }

  const value = {
    '#text': credit.value,
    '@role': credit.role,
    '@scheme': credit.scheme,
  }

  return trimObject(value)
}

export const generateCopyright: GenerateFunction<Copyright> = (copyright) => {
  if (!isObject(copyright)) {
    return
  }

  const value = {
    '#text': copyright.value,
    '@url': copyright.url,
  }

  return trimObject(value)
}

export const generateText: GenerateFunction<Text> = (text) => {
  if (!isObject(text)) {
    return
  }

  const value = {
    '#text': text.value,
    '@type': text.type,
    '@lang': text.lang,
    '@start': text.start,
    '@end': text.end,
  }

  return trimObject(value)
}

export const generateRestriction: GenerateFunction<Restriction> = (restriction) => {
  if (!isObject(restriction)) {
    return
  }

  const value = {
    '#text': restriction.value,
    '@relationship': restriction.relationship,
    '@type': restriction.type,
  }

  return trimObject(value)
}

export const generateStarRating: GenerateFunction<StarRating> = (starRating) => {
  if (!isObject(starRating)) {
    return
  }

  const value = {
    '@average': starRating.average,
    '@count': starRating.count,
    '@min': starRating.min,
    '@max': starRating.max,
  }

  return trimObject(value)
}

export const generateStatistics: GenerateFunction<Statistics> = (statistics) => {
  if (!isObject(statistics)) {
    return
  }

  const value = {
    '@views': statistics.views,
    '@favorites': statistics.favorites,
  }

  return trimObject(value)
}

export const generateTag: GenerateFunction<Tag> = (tag) => {
  if (!isObject(tag)) {
    return
  }

  return `${tag.name}:${tag.weight}`
}

export const generateCommunity: GenerateFunction<Community> = (community) => {
  if (!isObject(community)) {
    return
  }

  const value = {
    'media:starRating': generateStarRating(community.starRating),
    'media:statistics': generateStatistics(community.statistics),
    'media:tags': generateCsvOf(community.tags, generateTag),
  }

  return trimObject(value)
}

export const generateComments: GenerateFunction<Array<string>> = (comments) => {
  return trimArray(comments)
}

export const generateResponses: GenerateFunction<Array<string>> = (responses) => {
  return trimArray(responses)
}

export const generateBackLinks: GenerateFunction<Array<string>> = (backLinks) => {
  return trimArray(backLinks)
}

export const generateParam: GenerateFunction<Param> = (param) => {
  if (!isObject(param)) {
    return
  }

  const value = {
    '#text': param.value,
    '@name': param.name,
  }

  return trimObject(value)
}

export const generateEmbed: GenerateFunction<Embed> = (embed) => {
  if (!isObject(embed)) {
    return
  }

  const value = {
    '@url': embed.url,
    '@width': embed.width,
    '@height': embed.height,
    'media:param': trimArray(embed.params?.map(generateParam)),
  }

  return trimObject(value)
}

export const generateStatus: GenerateFunction<Status> = (status) => {
  if (!isObject(status)) {
    return
  }

  const value = {
    '@state': status.state,
    '@reason': status.reason,
  }

  return trimObject(value)
}

export const generatePrice: GenerateFunction<Price> = (price) => {
  if (!isObject(price)) {
    return
  }

  const value = {
    '@type': price.type,
    '@info': price.info,
    '@price': price.price,
    '@currency': price.currency,
  }

  return trimObject(value)
}

export const generateLicense: GenerateFunction<License> = (license) => {
  if (!isObject(license)) {
    return
  }

  const value = {
    '#text': license.name,
    '@type': license.type,
    '@href': license.href,
  }

  return trimObject(value)
}

export const generateSubTitle: GenerateFunction<SubTitle> = (subTitle) => {
  if (!isObject(subTitle)) {
    return
  }

  const value = {
    '@type': subTitle.type,
    '@lang': subTitle.lang,
    '@href': subTitle.href,
  }

  return trimObject(value)
}

export const generatePeerLink: GenerateFunction<PeerLink> = (peerLink) => {
  if (!isObject(peerLink)) {
    return
  }

  const value = {
    '@type': peerLink.type,
    '@href': peerLink.href,
  }

  return trimObject(value)
}

export const generateRights: GenerateFunction<Rights> = (rights) => {
  if (!isObject(rights)) {
    return
  }

  const value = {
    '@status': rights.status,
  }

  return trimObject(value)
}

export const generateScene: GenerateFunction<Scene> = (scene) => {
  if (!isObject(scene)) {
    return
  }

  const value = {
    sceneTitle: scene.title,
    sceneDescription: scene.description,
    sceneStartTime: scene.startTime,
    sceneEndTime: scene.endTime,
  }

  return trimObject(value)
}

export const generateLocation: GenerateFunction<Location> = (location) => {
  if (!isObject(location)) {
    return
  }

  const value = {
    '#text': location.description,
    '@start': location.start,
    '@end': location.end,
    '@lat': location.lat,
    '@lng': location.lng,
  }

  return trimObject(value)
}

export const generateCommonElements: GenerateFunction<CommonElements> = (elements) => {
  if (!isObject(elements)) {
    return
  }

  const value = {
    'media:rating': trimArray(elements.ratings?.map(generateRating)),
    'media:title': generateTitleOrDescription(elements.title),
    'media:description': generateTitleOrDescription(elements.description),
    'media:keywords': generateCsvOf(elements.keywords),
    'media:thumbnail': trimArray(elements.thumbnails?.map(generateThumbnail)),
    'media:category': trimArray(elements.categories?.map(generateCategory)),
    'media:hash': trimArray(elements.hashes?.map(generateHash)),
    'media:player': generatePlayer(elements.player),
    'media:credit': trimArray(elements.credits?.map(generateCredit)),
    'media:copyright': generateCopyright(elements.copyright),
    'media:text': trimArray(elements.texts?.map(generateText)),
    'media:restriction': trimArray(elements.restrictions?.map(generateRestriction)),
    'media:community': generateCommunity(elements.community),
    'media:comment': generateComments(elements.comments),
    'media:embed': generateEmbed(elements.embed),
    'media:response': generateResponses(elements.responses),
    'media:backLink': generateBackLinks(elements.backLinks),
    'media:status': generateStatus(elements.status),
    'media:price': trimArray(elements.prices?.map(generatePrice)),
    'media:license': trimArray(elements.licenses?.map(generateLicense)),
    'media:subTitle': trimArray(elements.subTitles?.map(generateSubTitle)),
    'media:peerLink': trimArray(elements.peerLinks?.map(generatePeerLink)),
    'media:location': trimArray(elements.locations?.map(generateLocation)),
    'media:rights': generateRights(elements.rights),
    'media:scene': trimArray(elements.scenes?.map(generateScene)),
  }

  return trimObject(value)
}

export const generateContent: GenerateFunction<Content> = (content) => {
  if (!isObject(content)) {
    return
  }

  const value = {
    '@url': content.url,
    '@fileSize': content.fileSize,
    '@type': content.type,
    '@medium': content.medium,
    '@isDefault': generateYesNoBoolean(content.isDefault),
    '@expression': content.expression,
    '@bitrate': content.bitrate,
    '@framerate': content.framerate,
    '@samplingrate': content.samplingrate,
    '@channels': content.channels,
    '@duration': content.duration,
    '@height': content.height,
    '@width': content.width,
    '@lang': content.lang,
    ...generateCommonElements(content),
  }

  return trimObject(value)
}

export const generateGroup: GenerateFunction<Group> = (group) => {
  if (!isObject(group)) {
    return
  }

  const value = {
    'media:content': trimArray(group.contents?.map(generateContent)),
    ...generateCommonElements(group),
  }

  return trimObject(value)
}

export const generateItemOrFeed: GenerateFunction<ItemOrFeed> = (itemOrFeed) => {
  if (!isObject(itemOrFeed)) {
    return
  }

  const value = {
    'media:group': generateGroup(itemOrFeed.group),
    'media:content': trimArray(itemOrFeed.contents?.map(generateContent)),
    ...generateCommonElements(itemOrFeed),
  }

  return trimObject(value)
}
