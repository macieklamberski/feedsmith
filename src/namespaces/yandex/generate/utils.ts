import { isPlainObject, trimObject } from 'trousse'
import type { GenerateUtil } from '../../../common/types.js'
import {
  generateCdataString,
  generatePlainString,
  generateTextOrCdataString,
  trimArray,
} from '../../../common/utils.js'
import type { YandexNs } from '../common/types.js'

export const generateLogo: GenerateUtil<YandexNs.Logo> = (logo) => {
  if (!isPlainObject(logo)) {
    return
  }

  const value = {
    '@type': generatePlainString(logo.type),
    ...generateTextOrCdataString(logo.value),
  }

  return trimObject(value)
}

export const generateAnalytics: GenerateUtil<YandexNs.Analytics> = (analytics) => {
  if (!isPlainObject(analytics)) {
    return
  }

  const value = {
    '@type': generatePlainString(analytics.type),
    '@id': generatePlainString(analytics.id),
    '@params': generatePlainString(analytics.params),
    '@url': generatePlainString(analytics.url),
  }

  return trimObject(value)
}

export const generateAdNetwork: GenerateUtil<YandexNs.AdNetwork> = (adNetwork) => {
  if (!isPlainObject(adNetwork)) {
    return
  }

  const value = {
    '@type': generatePlainString(adNetwork.type),
    '@id': generatePlainString(adNetwork.id),
    '@turbo-ad-id': generatePlainString(adNetwork.turboAdId),
    ...generateTextOrCdataString(adNetwork.value),
  }

  return trimObject(value)
}

export const generateRelatedLink: GenerateUtil<YandexNs.RelatedLink> = (relatedLink) => {
  if (!isPlainObject(relatedLink)) {
    return
  }

  const value = {
    '@url': generatePlainString(relatedLink.url),
    '@img': generatePlainString(relatedLink.img),
    ...generateTextOrCdataString(relatedLink.value),
  }

  return trimObject(value)
}

export const generateRelated: GenerateUtil<YandexNs.Related> = (related) => {
  if (!isPlainObject(related)) {
    return
  }

  const value = {
    '@type': generatePlainString(related.type),
    link: trimArray(related.links, generateRelatedLink),
  }

  return trimObject(value)
}

export const generateCommentText: GenerateUtil<YandexNs.CommentText> = (commentText) => {
  if (!isPlainObject(commentText)) {
    return
  }

  const value = {
    '@origin': generatePlainString(commentText.origin),
    '@origin-name': generatePlainString(commentText.originName),
    '@logo': generatePlainString(commentText.logo),
    '@anchor': generatePlainString(commentText.anchor),
    ...generateTextOrCdataString(commentText.value),
  }

  return trimObject(value)
}

export const generateOfficialComment: GenerateUtil<YandexNs.OfficialComment> = (
  officialComment,
) => {
  if (!isPlainObject(officialComment)) {
    return
  }

  const value = {
    'yandex:comment-text': generateCommentText(officialComment.commentText),
    'yandex:bind-to': trimArray(officialComment.bindTos, generateCdataString),
  }

  return trimObject(value)
}

export const generateFeed: GenerateUtil<YandexNs.Feed> = (feed) => {
  if (!isPlainObject(feed)) {
    return
  }

  const value = {
    'yandex:logo': trimArray(feed.logos, generateLogo),
    'yandex:analytics': trimArray(feed.analytics, generateAnalytics),
    'yandex:adNetwork': trimArray(feed.adNetworks, generateAdNetwork),
  }

  return trimObject(value)
}

export const generateItem: GenerateUtil<YandexNs.Item> = (item) => {
  if (!isPlainObject(item)) {
    return
  }

  const value = {
    'yandex:full-text': generateCdataString(item.fullText),
    'yandex:genre': generateCdataString(item.genre),
    'yandex:theme_tags': trimArray(item.themeTags, generateCdataString),
    'yandex:related': generateRelated(item.related),
    'yandex:online': generateCdataString(item.online),
    'yandex:tags': trimArray(item.tags, generateCdataString),
    'yandex:official-comment': generateOfficialComment(item.officialComment),
  }

  return trimObject(value)
}
