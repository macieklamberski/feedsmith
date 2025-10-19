import type { GenerateUtil } from '../../../common/types.js'
import {
  generateCdataString,
  generatePlainString,
  generateTextOrCdataString,
  isNonEmptyString,
  isObject,
  trimArray,
  trimObject,
} from '../../../common/utils.js'
import type { Account, Archive, Feed, Item, Likes, SubscriptionList } from '../common/types.js'

export const generateAccount: GenerateUtil<Account> = (account) => {
  if (!isObject(account) || !isNonEmptyString(account.service)) {
    return
  }

  const value = {
    '@service': account.service,
    ...generateTextOrCdataString(account.value),
  }

  return trimObject(value)
}

export const generateLikes: GenerateUtil<Likes> = (likes) => {
  if (!isObject(likes) || !isNonEmptyString(likes.server)) {
    return
  }

  return {
    '@server': likes.server,
  }
}

export const generateArchive: GenerateUtil<Archive> = (archive) => {
  if (!isObject(archive) || !isNonEmptyString(archive.url) || !isNonEmptyString(archive.startDay)) {
    return
  }

  const value = {
    'source:url': archive.url,
    'source:startDay': archive.startDay,
    'source:endDay': generatePlainString(archive.endDay),
    'source:filename': generatePlainString(archive.filename),
  }

  return trimObject(value)
}

export const generateSubscriptionList: GenerateUtil<SubscriptionList> = (subscriptionList) => {
  if (!isObject(subscriptionList) || !isNonEmptyString(subscriptionList.url)) {
    return
  }

  const value = {
    '@url': subscriptionList.url,
    ...generateTextOrCdataString(subscriptionList.value),
  }

  return trimObject(value)
}

export const generateFeed: GenerateUtil<Feed> = (feed) => {
  if (!isObject(feed)) {
    return
  }

  const value = {
    'source:account': trimArray(feed.accounts, generateAccount),
    'source:likes': generateLikes(feed.likes),
    'source:archive': generateArchive(feed.archive),
    'source:subscriptionList': trimArray(feed.subscriptionLists, generateSubscriptionList),
    'source:cloud': generatePlainString(feed.cloud),
    'source:blogroll': generatePlainString(feed.blogroll),
    'source:self': generatePlainString(feed.self),
  }

  return trimObject(value)
}

export const generateItem: GenerateUtil<Item> = (item) => {
  if (!isObject(item)) {
    return
  }

  const value = {
    'source:markdown': generateCdataString(item.markdown),
    'source:outline': trimArray(item.outlines, generateCdataString),
    'source:localTime': generatePlainString(item.localTime),
    'source:linkFull': generatePlainString(item.linkFull),
  }

  return trimObject(value)
}
