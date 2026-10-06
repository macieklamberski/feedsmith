import { isPlainObject, trimObject } from 'trousse'
import type { ParseUtilPartial } from '../../../common/types.js'
import { parseArrayOf, parseSingularOf, parseString, retrieveText } from '../../../common/utils.js'
import type { YandexNs } from '../common/types.js'

export const parseLogo: ParseUtilPartial<YandexNs.Logo> = (value) => {
  const logo = {
    type: parseString(value?.['@type']),
    value: parseString(retrieveText(value)),
  }

  return trimObject(logo)
}

export const parseAnalytics: ParseUtilPartial<YandexNs.Analytics> = (value) => {
  if (!isPlainObject(value)) {
    return
  }

  const analytics = {
    type: parseString(value['@type']),
    id: parseString(value['@id']),
    params: parseString(value['@params']),
    url: parseString(value['@url']),
  }

  return trimObject(analytics)
}

export const parseAdNetwork: ParseUtilPartial<YandexNs.AdNetwork> = (value) => {
  if (!isPlainObject(value)) {
    return
  }

  const adNetwork = {
    type: parseString(value['@type']),
    id: parseString(value['@id']),
    turboAdId: parseString(value['@turbo-ad-id']),
    value: parseString(retrieveText(value)),
  }

  return trimObject(adNetwork)
}

export const parseRelatedLink: ParseUtilPartial<YandexNs.RelatedLink> = (value) => {
  if (!isPlainObject(value)) {
    return
  }

  const relatedLink = {
    url: parseString(value['@url']),
    img: parseString(value['@img']),
    value: parseString(retrieveText(value)),
  }

  return trimObject(relatedLink)
}

export const parseRelated: ParseUtilPartial<YandexNs.Related> = (value) => {
  if (!isPlainObject(value)) {
    return
  }

  const related = {
    type: parseString(value['@type']),
    links: parseArrayOf(value.link, parseRelatedLink),
  }

  return trimObject(related)
}

export const parseCommentText: ParseUtilPartial<YandexNs.CommentText> = (value) => {
  const commentText = {
    origin: parseString(value?.['@origin']),
    originName: parseString(value?.['@origin-name']),
    logo: parseString(value?.['@logo']),
    anchor: parseString(value?.['@anchor']),
    value: parseString(retrieveText(value)),
  }

  return trimObject(commentText)
}

export const parseOfficialComment: ParseUtilPartial<YandexNs.OfficialComment> = (value) => {
  if (!isPlainObject(value)) {
    return
  }

  const officialComment = {
    commentText: parseSingularOf(value['yandex:comment-text'], parseCommentText),
    bindTos: parseArrayOf(value['yandex:bind-to'], (value) => parseString(retrieveText(value))),
  }

  return trimObject(officialComment)
}

export const retrieveFeed: ParseUtilPartial<YandexNs.Feed> = (value) => {
  if (!isPlainObject(value)) {
    return
  }

  const feed = {
    logos: parseArrayOf(value['yandex:logo'], parseLogo),
    analytics: parseArrayOf(value['yandex:analytics'], parseAnalytics),
    adNetworks: parseArrayOf(value['yandex:adnetwork'], parseAdNetwork),
  }

  return trimObject(feed)
}

export const retrieveItem: ParseUtilPartial<YandexNs.Item> = (value) => {
  if (!isPlainObject(value)) {
    return
  }

  const item = {
    fullText: parseSingularOf(value['yandex:full-text'], (value) =>
      parseString(retrieveText(value)),
    ),
    genre: parseSingularOf(value['yandex:genre'], (value) => parseString(retrieveText(value))),
    themeTags: parseArrayOf(value['yandex:theme_tags'], (value) =>
      parseString(retrieveText(value)),
    ),
    related: parseSingularOf(value['yandex:related'], parseRelated),
    online: parseSingularOf(value['yandex:online'], (value) => parseString(retrieveText(value))),
    tags: parseArrayOf(value['yandex:tags'], (value) => parseString(retrieveText(value))),
    officialComment: parseSingularOf(value['yandex:official-comment'], parseOfficialComment),
  }

  return trimObject(item)
}
