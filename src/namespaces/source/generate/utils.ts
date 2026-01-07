import type { GenerateUtil } from '../../../common/types.js'
import {
  generateCdataString,
  generateTextOrCdataString,
  isNonEmptyString,
  isObject,
  trimArray,
  trimObject,
} from '../../../common/utils.js'
import type { SourceNs } from '../common/types.js'

export const generateAccount: GenerateUtil<SourceNs.Account> = (account) => {
  if (!isObject(account) || !isNonEmptyString(account.service)) {
    return
  }

  const value = {
    '@service': account.service,
    ...generateTextOrCdataString(account.value),
  }

  return trimObject(value)
}

export const generateLikes: GenerateUtil<SourceNs.Likes> = (likes) => {
  if (!isObject(likes) || !isNonEmptyString(likes.server)) {
    return
  }

  return {
    '@server': likes.server,
  }
}

export const generateArchive: GenerateUtil<SourceNs.Archive> = (archive) => {
  if (!isObject(archive) || !isNonEmptyString(archive.url) || !isNonEmptyString(archive.startDay)) {
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
  if (!isObject(subscriptionList) || !isNonEmptyString(subscriptionList.url)) {
    return
  }

  const value = {
    '@url': subscriptionList.url,
    ...generateTextOrCdataString(subscriptionList.value),
  }

  return trimObject(value)
}

export const generateFeed: GenerateUtil<SourceNs.Feed> = (feed) => {
  if (!isObject(feed)) {
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
  }

  return trimObject(value)
}

export const generateItem: GenerateUtil<SourceNs.Item> = (item) => {
  if (!isObject(item)) {
    return
  }

  const value = {
    'source:markdown': generateCdataString(item.markdown),
    'source:outline': trimArray(item.outlines, generateCdataString),
    'source:localTime': generateCdataString(item.localTime),
    'source:linkFull': generateCdataString(item.linkFull),
  }

  return trimObject(value)
}
