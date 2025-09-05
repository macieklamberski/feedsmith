import type { GenerateFunction } from '../../../common/types.js'
import {
  generateCdataString,
  generatePlainString,
  isNonEmptyString,
  isObject,
  trimArray,
  trimObject,
} from '../../../common/utils.js'
import type { Account, Archive, Feed, Item, Likes, SubscriptionList } from '../common/types.js'

export const generateAccount: GenerateFunction<Account> = (account) => {
  if (!isObject(account) || !isNonEmptyString(account.service)) {
    return
  }

  const value = {
    '@service': account.service,
    '#text': generatePlainString(account.value),
  }

  return trimObject(value)
}

export const generateLikes: GenerateFunction<Likes> = (likes) => {
  if (!isObject(likes) || !isNonEmptyString(likes.server)) {
    return
  }

  return {
    '@server': likes.server,
  }
}

export const generateArchive: GenerateFunction<Archive> = (archive) => {
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

export const generateSubscriptionList: GenerateFunction<SubscriptionList> = (subscriptionList) => {
  if (!isObject(subscriptionList) || !isNonEmptyString(subscriptionList.url)) {
    return
  }

  const value = {
    '@url': subscriptionList.url,
    '#text': generatePlainString(subscriptionList.value),
  }

  return trimObject(value)
}

export const generateFeed: GenerateFunction<Feed> = (feed) => {
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

export const generateItem: GenerateFunction<Item> = (item) => {
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
