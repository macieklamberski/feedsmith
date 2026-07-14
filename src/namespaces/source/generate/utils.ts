import { isNonEmptyString, isPlainObject } from 'trousse'
import type { GenerateUtil } from '../../../common/types.js'
import {
  generateBoolean,
  generateCdataString,
  generateTextOrCdataString,
  trimArray,
  trimObject,
} from '../../../common/utils.js'
import type { SourceNs } from '../common/types.js'

export const generateAccount: GenerateUtil<SourceNs.Account> = (account) => {
  if (!isPlainObject(account) || !isNonEmptyString(account.service)) {
    return
  }

  const value = {
    '@service': account.service,
    ...generateTextOrCdataString(account.value),
  }

  return trimObject(value)
}

export const generateLikes: GenerateUtil<SourceNs.Likes> = (likes) => {
  if (!isPlainObject(likes) || !isNonEmptyString(likes.server)) {
    return
  }

  return {
    '@server': likes.server,
  }
}

export const generateArchive: GenerateUtil<SourceNs.Archive> = (archive) => {
  if (
    !isPlainObject(archive) ||
    !isNonEmptyString(archive.url) ||
    !isNonEmptyString(archive.startDay)
  ) {
    return
  }

  const value = {
    'source:url': archive.url,
    'source:startDay': archive.startDay,
    'source:endDay': generateCdataString(archive.endDay),
    'source:filename': generateCdataString(archive.filename),
  }

  return trimObject(value)
}

export const generateSubscriptionList: GenerateUtil<SourceNs.SubscriptionList> = (
  subscriptionList,
) => {
  if (!isPlainObject(subscriptionList) || !isNonEmptyString(subscriptionList.url)) {
    return
  }

  const value = {
    '@url': subscriptionList.url,
    ...generateTextOrCdataString(subscriptionList.value),
  }

  return trimObject(value)
}

export const generateInReplyTo: GenerateUtil<SourceNs.InReplyTo> = (inReplyTo) => {
  if (!isPlainObject(inReplyTo) || !isNonEmptyString(inReplyTo.value)) {
    return
  }

  const value = {
    ...generateTextOrCdataString(inReplyTo.value),
    '@isPermaLink': generateBoolean(inReplyTo.isPermaLink),
  }

  return trimObject(value)
}

export const generateFeed: GenerateUtil<SourceNs.Feed> = (feed) => {
  if (!isPlainObject(feed)) {
    return
  }

  const value = {
    'source:account': trimArray(feed.accounts, generateAccount),
    'source:likes': generateLikes(feed.likes),
    'source:archive': generateArchive(feed.archive),
    'source:subscriptionList': trimArray(feed.subscriptionLists, generateSubscriptionList),
    'source:cloud': generateCdataString(feed.cloud),
    'source:blogroll': generateCdataString(feed.blogroll),
    'source:self': generateCdataString(feed.self),
    'source:localTime': generateCdataString(feed.localTime),
  }

  return trimObject(value)
}

export const generateItem: GenerateUtil<SourceNs.Item> = (item) => {
  if (!isPlainObject(item)) {
    return
  }

  const value = {
    'source:markdown': generateCdataString(item.markdown),
    'source:outline': trimArray(item.outlines, generateCdataString),
    'source:linkFull': generateCdataString(item.linkFull),
    'source:inReplyTo': generateInReplyTo(item.inReplyTo),
  }

  return trimObject(value)
}
