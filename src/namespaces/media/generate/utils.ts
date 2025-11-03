import type { GenerateUtil } from '../../../common/types.js'
import {
  generateArrayOrSingular,
  generateCdataString,
  generateCsvOf,
  generateNumber,
  generatePlainString,
  generateTextOrCdataString,
  generateYesNoBoolean,
  isObject,
  trimArray,
  trimObject,
} from '../../../common/utils.js'
import type { MediaNs } from '../common/types.js'

export const generateRating: GenerateUtil<MediaNs.Rating> = (rating) => {
  if (!isObject(rating)) {
    return
  }

  const value = {
    ...generateTextOrCdataString(rating.value),
    '@scheme': generatePlainString(rating.scheme),
  }

  return trimObject(value)
}

export const generateTitleOrDescription: GenerateUtil<MediaNs.TitleOrDescription> = (
  titleOrDescription,
) => {
  if (!isObject(titleOrDescription)) {
    return
  }

  const value = {
    ...generateTextOrCdataString(titleOrDescription.value),
    '@type': generatePlainString(titleOrDescription.type),
  }

  return trimObject(value)
}

export const generateThumbnail: GenerateUtil<MediaNs.Thumbnail> = (thumbnail) => {
  if (!isObject(thumbnail)) {
    return
  }

  const value = {
    '@url': generatePlainString(thumbnail.url),
    '@height': generateNumber(thumbnail.height),
    '@width': generateNumber(thumbnail.width),
    '@time': generatePlainString(thumbnail.time),
  }

  return trimObject(value)
}

export const generateCategory: GenerateUtil<MediaNs.Category> = (category) => {
  if (!isObject(category)) {
    return
  }

  const value = {
    ...generateTextOrCdataString(category.name),
    '@scheme': generatePlainString(category.scheme),
    '@label': generatePlainString(category.label),
  }

  return trimObject(value)
}

export const generateHash: GenerateUtil<MediaNs.Hash> = (hash) => {
  if (!isObject(hash)) {
    return
  }

  const value = {
    ...generateTextOrCdataString(hash.value),
    '@algo': generatePlainString(hash.algo),
  }

  return trimObject(value)
}

export const generatePlayer: GenerateUtil<MediaNs.Player> = (player) => {
  if (!isObject(player)) {
    return
  }

  const value = {
    '@url': generatePlainString(player.url),
    '@height': generateNumber(player.height),
    '@width': generateNumber(player.width),
  }

  return trimObject(value)
}

export const generateCredit: GenerateUtil<MediaNs.Credit> = (credit) => {
  if (!isObject(credit)) {
    return
  }

  const value = {
    ...generateTextOrCdataString(credit.value),
    '@role': generatePlainString(credit.role),
    '@scheme': generatePlainString(credit.scheme),
  }

  return trimObject(value)
}

export const generateCopyright: GenerateUtil<MediaNs.Copyright> = (copyright) => {
  if (!isObject(copyright)) {
    return
  }

  const value = {
    ...generateTextOrCdataString(copyright.value),
    '@url': generatePlainString(copyright.url),
  }

  return trimObject(value)
}

export const generateText: GenerateUtil<MediaNs.Text> = (text) => {
  if (!isObject(text)) {
    return
  }

  const value = {
    ...generateTextOrCdataString(text.value),
    '@type': generatePlainString(text.type),
    '@lang': generatePlainString(text.lang),
    '@start': generatePlainString(text.start),
    '@end': generatePlainString(text.end),
  }

  return trimObject(value)
}

export const generateRestriction: GenerateUtil<MediaNs.Restriction> = (restriction) => {
  if (!isObject(restriction)) {
    return
  }

  const value = {
    ...generateTextOrCdataString(restriction.value),
    '@relationship': generatePlainString(restriction.relationship),
    '@type': generatePlainString(restriction.type),
  }

  return trimObject(value)
}

export const generateStarRating: GenerateUtil<MediaNs.StarRating> = (starRating) => {
  if (!isObject(starRating)) {
    return
  }

  const value = {
    '@average': generateNumber(starRating.average),
    '@count': generateNumber(starRating.count),
    '@min': generateNumber(starRating.min),
    '@max': generateNumber(starRating.max),
  }

  return trimObject(value)
}

export const generateStatistics: GenerateUtil<MediaNs.Statistics> = (statistics) => {
  if (!isObject(statistics)) {
    return
  }

  const value = {
    '@views': generateNumber(statistics.views),
    '@favorites': generateNumber(statistics.favorites),
  }

  return trimObject(value)
}

export const generateTag: GenerateUtil<MediaNs.Tag> = (tag) => {
  if (!isObject(tag)) {
    return
  }

  const name = generatePlainString(tag.name)

  if (!name) {
    return
  }

  const weight = generateNumber(tag.weight) ?? 1

  return `${name}:${weight}`
}

export const generateCommunity: GenerateUtil<MediaNs.Community> = (community) => {
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

export const generateComments: GenerateUtil<Array<string>> = (comments) => {
  const value = {
    'media:comment': trimArray(comments, generateCdataString),
  }

  return trimObject(value)
}

export const generateResponses: GenerateUtil<Array<string>> = (responses) => {
  const value = {
    'media:response': trimArray(responses, generateCdataString),
  }

  return trimObject(value)
}

export const generateBackLinks: GenerateUtil<Array<string>> = (backLinks) => {
  const value = {
    'media:backLink': trimArray(backLinks, generateCdataString),
  }

  return trimObject(value)
}

export const generateScenes: GenerateUtil<Array<MediaNs.Scene>> = (scenes) => {
  const value = {
    'media:scene': trimArray(scenes, generateScene),
  }

  return trimObject(value)
}

export const generateParam: GenerateUtil<MediaNs.Param> = (param) => {
  if (!isObject(param)) {
    return
  }

  const value = {
    ...generateTextOrCdataString(param.value),
    '@name': generatePlainString(param.name),
  }

  return trimObject(value)
}

export const generateEmbed: GenerateUtil<MediaNs.Embed> = (embed) => {
  if (!isObject(embed)) {
    return
  }

  const value = {
    '@url': generatePlainString(embed.url),
    '@width': generateNumber(embed.width),
    '@height': generateNumber(embed.height),
    'media:param': trimArray(embed.params, generateParam),
  }

  return trimObject(value)
}

export const generateStatus: GenerateUtil<MediaNs.Status> = (status) => {
  if (!isObject(status)) {
    return
  }

  const value = {
    '@state': generatePlainString(status.state),
    '@reason': generatePlainString(status.reason),
  }

  return trimObject(value)
}

export const generatePrice: GenerateUtil<MediaNs.Price> = (price) => {
  if (!isObject(price)) {
    return
  }

  const value = {
    '@type': generatePlainString(price.type),
    '@info': generatePlainString(price.info),
    '@price': generateNumber(price.price),
    '@currency': generatePlainString(price.currency),
  }

  return trimObject(value)
}

export const generateLicense: GenerateUtil<MediaNs.License> = (license) => {
  if (!isObject(license)) {
    return
  }

  const value = {
    ...generateTextOrCdataString(license.name),
    '@type': generatePlainString(license.type),
    '@href': generatePlainString(license.href),
  }

  return trimObject(value)
}

export const generateSubTitle: GenerateUtil<MediaNs.SubTitle> = (subTitle) => {
  if (!isObject(subTitle)) {
    return
  }

  const value = {
    '@type': generatePlainString(subTitle.type),
    '@lang': generatePlainString(subTitle.lang),
    '@href': generatePlainString(subTitle.href),
  }

  return trimObject(value)
}

export const generatePeerLink: GenerateUtil<MediaNs.PeerLink> = (peerLink) => {
  if (!isObject(peerLink)) {
    return
  }

  const value = {
    '@type': generatePlainString(peerLink.type),
    '@href': generatePlainString(peerLink.href),
  }

  return trimObject(value)
}

export const generateRights: GenerateUtil<MediaNs.Rights> = (rights) => {
  if (!isObject(rights)) {
    return
  }

  const value = {
    '@status': generatePlainString(rights.status),
  }

  return trimObject(value)
}

export const generateScene: GenerateUtil<MediaNs.Scene> = (scene) => {
  if (!isObject(scene)) {
    return
  }

  const value = {
    sceneTitle: generateCdataString(scene.title),
    sceneDescription: generateCdataString(scene.description),
    sceneStartTime: generateCdataString(scene.startTime),
    sceneEndTime: generateCdataString(scene.endTime),
  }

  return trimObject(value)
}

export const generateLocation: GenerateUtil<MediaNs.Location> = (location) => {
  if (!isObject(location)) {
    return
  }

  const value = {
    ...generateTextOrCdataString(location.description),
    '@start': generatePlainString(location.start),
    '@end': generatePlainString(location.end),
    '@lat': generateNumber(location.lat),
    '@lng': generateNumber(location.lng),
  }

  return trimObject(value)
}

export const generateCommonElements: GenerateUtil<MediaNs.CommonElements> = (elements) => {
  if (!isObject(elements)) {
    return
  }

  const value = {
    'media:rating': trimArray(elements.ratings, generateRating),
    'media:title': generateTitleOrDescription(elements.title),
    'media:description': generateTitleOrDescription(elements.description),
    'media:keywords': generateCsvOf(elements.keywords, generatePlainString),
    'media:thumbnail': trimArray(elements.thumbnails, generateThumbnail),
    'media:category': trimArray(elements.categories, generateCategory),
    'media:hash': trimArray(elements.hashes, generateHash),
    'media:player': generatePlayer(elements.player),
    'media:credit': trimArray(elements.credits, generateCredit),
    'media:copyright': generateCopyright(elements.copyright),
    'media:text': trimArray(elements.texts, generateText),
    'media:restriction': trimArray(elements.restrictions, generateRestriction),
    'media:community': generateCommunity(elements.community),
    'media:comments': generateComments(elements.comments),
    'media:embed': generateEmbed(elements.embed),
    'media:responses': generateResponses(elements.responses),
    'media:backLinks': generateBackLinks(elements.backLinks),
    'media:status': generateStatus(elements.status),
    'media:price': trimArray(elements.prices, generatePrice),
    'media:license': trimArray(elements.licenses, generateLicense),
    'media:subTitle': trimArray(elements.subTitles, generateSubTitle),
    'media:peerLink': trimArray(elements.peerLinks, generatePeerLink),
    'media:location': trimArray(elements.locations, generateLocation),
    'media:rights': generateRights(elements.rights),
    'media:scenes': generateScenes(elements.scenes),
  }

  return trimObject(value)
}

export const generateContent: GenerateUtil<MediaNs.Content> = (content) => {
  if (!isObject(content)) {
    return
  }

  const value = {
    '@url': generatePlainString(content.url),
    '@fileSize': generateNumber(content.fileSize),
    '@type': generatePlainString(content.type),
    '@medium': generatePlainString(content.medium),
    '@isDefault': generateYesNoBoolean(content.isDefault),
    '@expression': generatePlainString(content.expression),
    '@bitrate': generateNumber(content.bitrate),
    '@framerate': generateNumber(content.framerate),
    '@samplingrate': generateNumber(content.samplingrate),
    '@channels': generateNumber(content.channels),
    '@duration': generateNumber(content.duration),
    '@height': generateNumber(content.height),
    '@width': generateNumber(content.width),
    '@lang': generatePlainString(content.lang),
    ...generateCommonElements(content),
  }

  return trimObject(value)
}

export const generateGroup: GenerateUtil<MediaNs.Group> = (group) => {
  if (!isObject(group)) {
    return
  }

  const value = {
    'media:content': trimArray(group.contents, generateContent),
    ...generateCommonElements(group),
  }

  return trimObject(value)
}

export const generateItemOrFeed: GenerateUtil<MediaNs.ItemOrFeed> = (itemOrFeed) => {
  if (!isObject(itemOrFeed)) {
    return
  }

  const value = {
    'media:group': generateArrayOrSingular(itemOrFeed.groups, itemOrFeed.group, generateGroup),
    'media:content': trimArray(itemOrFeed.contents, generateContent),
    ...generateCommonElements(itemOrFeed),
  }

  return trimObject(value)
}
