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

  return trimObject({
    '#text': rating.value,
    '@scheme': rating.scheme,
  })
}

export const generateTitleOrDescription: GenerateFunction<TitleOrDescription> = (
  titleOrDescription,
) => {
  if (!isObject(titleOrDescription)) {
    return
  }

  return trimObject({
    '#text': titleOrDescription.value,
    '@type': titleOrDescription.type,
  })
}

export const generateThumbnail: GenerateFunction<Thumbnail> = (thumbnail) => {
  if (!isObject(thumbnail)) {
    return
  }

  return trimObject({
    '@url': thumbnail.url,
    '@height': thumbnail.height,
    '@width': thumbnail.width,
    '@time': thumbnail.time,
  })
}

export const generateCategory: GenerateFunction<Category> = (category) => {
  if (!isObject(category)) {
    return
  }

  return trimObject({
    '#text': category.name,
    '@scheme': category.scheme,
    '@label': category.label,
  })
}

export const generateHash: GenerateFunction<Hash> = (hash) => {
  if (!isObject(hash)) {
    return
  }

  return trimObject({
    '#text': hash.value,
    '@algo': hash.algo,
  })
}

export const generatePlayer: GenerateFunction<Player> = (player) => {
  if (!isObject(player)) {
    return
  }

  return trimObject({
    '@url': player.url,
    '@height': player.height,
    '@width': player.width,
  })
}

export const generateCredit: GenerateFunction<Credit> = (credit) => {
  if (!isObject(credit)) {
    return
  }

  return trimObject({
    '#text': credit.value,
    '@role': credit.role,
    '@scheme': credit.scheme,
  })
}

export const generateCopyright: GenerateFunction<Copyright> = (copyright) => {
  if (!isObject(copyright)) {
    return
  }

  return trimObject({
    '#text': copyright.value,
    '@url': copyright.url,
  })
}

export const generateText: GenerateFunction<Text> = (text) => {
  if (!isObject(text)) {
    return
  }

  return trimObject({
    '#text': text.value,
    '@type': text.type,
    '@lang': text.lang,
    '@start': text.start,
    '@end': text.end,
  })
}

export const generateRestriction: GenerateFunction<Restriction> = (restriction) => {
  if (!isObject(restriction)) {
    return
  }

  return trimObject({
    '#text': restriction.value,
    '@relationship': restriction.relationship,
    '@type': restriction.type,
  })
}

export const generateStarRating: GenerateFunction<StarRating> = (starRating) => {
  if (!isObject(starRating)) {
    return
  }

  return trimObject({
    '@average': starRating.average,
    '@count': starRating.count,
    '@min': starRating.min,
    '@max': starRating.max,
  })
}

export const generateStatistics: GenerateFunction<Statistics> = (statistics) => {
  if (!isObject(statistics)) {
    return
  }

  return trimObject({
    '@views': statistics.views,
    '@favorites': statistics.favorites,
  })
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

  return trimObject({
    'media:starRating': generateStarRating(community.starRating),
    'media:statistics': generateStatistics(community.statistics),
    'media:tags': generateCsvOf(community.tags, generateTag),
  })
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

  return trimObject({
    '#text': param.value,
    '@name': param.name,
  })
}

export const generateEmbed: GenerateFunction<Embed> = (embed) => {
  if (!isObject(embed)) {
    return
  }

  return trimObject({
    '@url': embed.url,
    '@width': embed.width,
    '@height': embed.height,
    'media:param': trimArray(embed.params?.map(generateParam)),
  })
}

export const generateStatus: GenerateFunction<Status> = (status) => {
  if (!isObject(status)) {
    return
  }

  return trimObject({
    '@state': status.state,
    '@reason': status.reason,
  })
}

export const generatePrice: GenerateFunction<Price> = (price) => {
  if (!isObject(price)) {
    return
  }

  return trimObject({
    '@type': price.type,
    '@info': price.info,
    '@price': price.price,
    '@currency': price.currency,
  })
}

export const generateLicense: GenerateFunction<License> = (license) => {
  if (!isObject(license)) {
    return
  }

  return trimObject({
    '#text': license.name,
    '@type': license.type,
    '@href': license.href,
  })
}

export const generateSubTitle: GenerateFunction<SubTitle> = (subTitle) => {
  if (!isObject(subTitle)) {
    return
  }

  return trimObject({
    '@type': subTitle.type,
    '@lang': subTitle.lang,
    '@href': subTitle.href,
  })
}

export const generatePeerLink: GenerateFunction<PeerLink> = (peerLink) => {
  if (!isObject(peerLink)) {
    return
  }

  return trimObject({
    '@type': peerLink.type,
    '@href': peerLink.href,
  })
}

export const generateRights: GenerateFunction<Rights> = (rights) => {
  if (!isObject(rights)) {
    return
  }

  return trimObject({
    '@status': rights.status,
  })
}

export const generateScene: GenerateFunction<Scene> = (scene) => {
  if (!isObject(scene)) {
    return
  }

  return trimObject({
    sceneTitle: scene.title,
    sceneDescription: scene.description,
    sceneStartTime: scene.startTime,
    sceneEndTime: scene.endTime,
  })
}

export const generateLocation: GenerateFunction<Location> = (location) => {
  if (!isObject(location)) {
    return
  }

  return trimObject({
    '#text': location.description,
    '@start': location.start,
    '@end': location.end,
    '@lat': location.lat,
    '@lng': location.lng,
  })
}

export const generateCommonElements: GenerateFunction<CommonElements> = (elements) => {
  if (!isObject(elements)) {
    return
  }

  return trimObject({
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
  })
}

export const generateContent: GenerateFunction<Content> = (content) => {
  if (!isObject(content)) {
    return
  }

  return trimObject({
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
  })
}

export const generateGroup: GenerateFunction<Group> = (group) => {
  if (!isObject(group)) {
    return
  }

  return trimObject({
    'media:content': trimArray(group.contents?.map(generateContent)),
    ...generateCommonElements(group),
  })
}

export const generateItemOrFeed: GenerateFunction<ItemOrFeed> = (itemOrFeed) => {
  if (!isObject(itemOrFeed)) {
    return
  }

  return trimObject({
    'media:group': generateGroup(itemOrFeed.group),
    'media:content': trimArray(itemOrFeed.contents?.map(generateContent)),
    ...generateCommonElements(itemOrFeed),
  })
}
