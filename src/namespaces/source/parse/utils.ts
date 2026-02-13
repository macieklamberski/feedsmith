import type { ParseUtilPartial } from '../../../common/types.js'
import {
  isObject,
  parseArrayOf,
  parseSingularOf,
  parseString,
  retrieveText,
  trimObject,
} from '../../../common/utils.js'
import type { SourceNs } from '../common/types.js'

export const parseAccount: ParseUtilPartial<SourceNs.Account> = (value) => {
  if (!isObject(value)) {
    return
  }

  const account = {
    service: parseString(value['@service']),
    value: parseString(retrieveText(value)),
  }

  return trimObject(account)
}

export const parseLikes: ParseUtilPartial<SourceNs.Likes> = (value) => {
  if (!isObject(value)) {
    return
  }

  const likes = {
    server: parseString(value['@server']),
  }

  return trimObject(likes)
}

export const parseArchive: ParseUtilPartial<SourceNs.Archive> = (value) => {
  if (!isObject(value)) {
    return
  }

  const archive = {
    url: parseSingularOf(value['source:url'], (value) => parseString(retrieveText(value))),
    startDay: parseSingularOf(value['source:startday'], (value) =>
      parseString(retrieveText(value)),
    ),
    endDay: parseSingularOf(value['source:endday'], (value) => parseString(retrieveText(value))),
    filename: parseSingularOf(value['source:filename'], (value) =>
      parseString(retrieveText(value)),
    ),
  }

  return trimObject(archive)
}

export const parseSubscriptionList: ParseUtilPartial<SourceNs.SubscriptionList> = (value) => {
  if (!isObject(value)) {
    return
  }

  const subscriptionList = {
    url: parseString(value['@url']),
    value: parseString(retrieveText(value)),
  }

  return trimObject(subscriptionList)
}

export const retrieveFeed: ParseUtilPartial<SourceNs.Feed> = (value) => {
  if (!isObject(value)) {
    return
  }

  const feed = {
    accounts: parseArrayOf(value['source:account'], parseAccount),
    likes: parseSingularOf(value['source:likes'], parseLikes),
    archive: parseSingularOf(value['source:archive'], parseArchive),
    subscriptionLists: parseArrayOf(value['source:subscriptionlist'], parseSubscriptionList),
    cloud: parseSingularOf(value['source:cloud'], (value) => parseString(retrieveText(value))),
    blogroll: parseSingularOf(value['source:blogroll'], (value) =>
      parseString(retrieveText(value)),
    ),
    self: parseSingularOf(value['source:self'], (value) => parseString(retrieveText(value))),
  }

  return trimObject(feed)
}

export const retrieveItem: ParseUtilPartial<SourceNs.Item> = (value) => {
  if (!isObject(value)) {
    return
  }

  const item = {
    markdown: parseSingularOf(value['source:markdown'], (value) =>
      parseString(retrieveText(value)),
    ),
    outlines: parseArrayOf(value['source:outline'], (value) => parseString(retrieveText(value))),
    localTime: parseSingularOf(value['source:localtime'], (value) =>
      parseString(retrieveText(value)),
    ),
    linkFull: parseSingularOf(value['source:linkfull'], (value) =>
      parseString(retrieveText(value)),
    ),
  }

  return trimObject(item)
}
