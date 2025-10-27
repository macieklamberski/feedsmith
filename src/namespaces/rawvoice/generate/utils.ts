import type { DateLike, GenerateUtil } from '../../../common/types.js'
import {
  generateCdataString,
  generateNumber,
  generatePlainString,
  generateRfc822Date,
  generateTextOrCdataString,
  isObject,
  trimArray,
  trimObject,
} from '../../../common/utils.js'
import type { RawvoiceNs } from '../common/types.js'

export const generateRating: GenerateUtil<RawvoiceNs.Rating> = (rating) => {
  if (!isObject(rating)) {
    return
  }

  const value = {
    ...generateTextOrCdataString(rating.value),
    '@tv': generatePlainString(rating.tv),
    '@movie': generatePlainString(rating.movie),
  }

  return trimObject(value)
}

export const generateLiveStream: GenerateUtil<RawvoiceNs.LiveStream<DateLike>> = (liveStream) => {
  if (!isObject(liveStream)) {
    return
  }

  const value = {
    ...generateTextOrCdataString(liveStream.url),
    '@schedule': generateRfc822Date(liveStream.schedule),
    '@duration': generatePlainString(liveStream.duration),
    '@type': generatePlainString(liveStream.type),
  }

  return trimObject(value)
}

export const generatePoster: GenerateUtil<RawvoiceNs.Poster> = (poster) => {
  if (!isObject(poster)) {
    return
  }

  const value = {
    '@url': generatePlainString(poster.url),
  }

  return trimObject(value)
}

export const generateAlternateEnclosure: GenerateUtil<RawvoiceNs.AlternateEnclosure> = (
  alternateEnclosure,
) => {
  if (!isObject(alternateEnclosure)) {
    return
  }

  const value = {
    '@src': generatePlainString(alternateEnclosure.src),
    '@type': generatePlainString(alternateEnclosure.type),
    '@length': generateNumber(alternateEnclosure.length),
  }

  return trimObject(value)
}

export const generateSubscribe: GenerateUtil<RawvoiceNs.Subscribe> = (subscribe) => {
  if (!isObject(subscribe)) {
    return
  }

  const value: RawvoiceNs.Subscribe = {}

  for (const key in subscribe) {
    value[`@${key}`] = generatePlainString(subscribe[key])
  }

  return trimObject(value)
}

export const generateMetamark: GenerateUtil<RawvoiceNs.Metamark> = (metamark) => {
  if (!isObject(metamark)) {
    return
  }

  const value = {
    ...generateTextOrCdataString(metamark.value),
    '@type': generatePlainString(metamark.type),
    '@link': generatePlainString(metamark.link),
    '@position': generateNumber(metamark.position),
    '@duration': generateNumber(metamark.duration),
  }

  return trimObject(value)
}

export const generateItem: GenerateUtil<RawvoiceNs.Item> = (item) => {
  if (!isObject(item)) {
    return
  }

  const value = {
    'rawvoice:poster': generatePoster(item.poster),
    'rawvoice:isHd': generateCdataString(item.isHd),
    'rawvoice:embed': generateCdataString(item.embed),
    'rawvoice:webm': generateAlternateEnclosure(item.webm),
    'rawvoice:mp4': generateAlternateEnclosure(item.mp4),
    'rawvoice:metamark': trimArray(item.metamarks, generateMetamark),
  }

  return trimObject(value)
}

export const generateFeed: GenerateUtil<RawvoiceNs.Feed<DateLike>> = (feed) => {
  if (!isObject(feed)) {
    return
  }

  const value = {
    'rawvoice:rating': generateRating(feed.rating),
    'rawvoice:liveEmbed': generateCdataString(feed.liveEmbed),
    'rawvoice:flashLiveStream': generateLiveStream(feed.flashLiveStream),
    'rawvoice:httpLiveStream': generateLiveStream(feed.httpLiveStream),
    'rawvoice:shoutcastLiveStream': generateLiveStream(feed.shoutcastLiveStream),
    'rawvoice:liveStream': generateLiveStream(feed.liveStream),
    'rawvoice:location': generateCdataString(feed.location),
    'rawvoice:frequency': generateCdataString(feed.frequency),
    'rawvoice:mycast': generateCdataString(feed.mycast),
    'rawvoice:subscribe': generateSubscribe(feed.subscribe),
  }

  return trimObject(value)
}
