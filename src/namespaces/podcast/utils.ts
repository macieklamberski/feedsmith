import type { ParseFunction } from '../../common/types.js'
import {
  isObject,
  isPresent,
  parseArrayOf,
  parseBoolean,
  parseNumber,
  parseString,
  parseYesNoBoolean,
  trimObject,
} from '../../common/utils.js'
import type {
  AlternateEnclosure,
  Block,
  Channel,
  Chapters,
  ContentLink,
  Episode,
  Funding,
  Images,
  Integrity,
  Item,
  License,
  LiveItem,
  Location,
  Locked,
  Person,
  Podping,
  Podroll,
  RemoteItem,
  Season,
  SocialInteract,
  Soundbite,
  Source,
  Trailer,
  Transcript,
  Txt,
  UpdateFrequency,
  Value,
  ValueRecipient,
  ValueTimeSplit,
} from './types.js'

export const parseTranscript: ParseFunction<Transcript> = (value) => {
  if (!isObject(value)) {
    return
  }

  const transcript = {
    url: parseString(value['@url']),
    type: parseString(value['@type']),
    language: parseString(value['@language']),
    rel: parseString(value['@rel']),
  }

  if (isPresent(transcript.url) && isPresent(transcript.type)) {
    return trimObject(transcript)
  }
}

export const parseLocked: ParseFunction<Locked> = (value) => {
  if (!isObject(value)) {
    return
  }

  const locked = {
    value: parseYesNoBoolean(value['@value']),
    owner: parseString(value['@owner']),
  }

  if (isPresent(locked.value)) {
    return trimObject(locked)
  }
}

export const parseFunding: ParseFunction<Funding> = (value) => {
  if (!isObject(value)) {
    return
  }

  const funding = {
    url: parseString(value['@url']),
    display: parseString(value['#text']),
  }

  if (isPresent(funding.url)) {
    return trimObject(funding)
  }
}

export const parseChapters: ParseFunction<Chapters> = (value) => {
  if (!isObject(value)) {
    return
  }

  const chapters = {
    url: parseString(value['@url']),
    type: parseString(value['@type']),
  }

  if (isPresent(chapters.url) && isPresent(chapters.type)) {
    return chapters
  }
}

export const parseSoundbite: ParseFunction<Soundbite> = (value) => {
  if (!isObject(value)) {
    return
  }

  const soundbite = {
    startTime: parseNumber(value['@startTime']),
    duration: parseNumber(value['@duration']),
    display: parseString(value['#text']),
  }

  if (isPresent(soundbite.startTime) && isPresent(soundbite.duration)) {
    return trimObject(soundbite)
  }
}

export const parsePerson: ParseFunction<Person> = (value) => {
  if (!isObject(value)) {
    return
  }

  const person = {
    display: parseString(value['#text']),
    role: parseString(value['@role']),
    group: parseString(value['@group']),
    img: parseString(value['@img']),
    href: parseString(value['@href']),
  }

  if (isPresent(person.display)) {
    return trimObject(person)
  }
}

export const parseLocation: ParseFunction<Location> = (value) => {
  if (!isObject(value)) {
    return
  }

  const location = {
    display: parseString(value['#text']),
    geo: parseString(value['@geo']),
    osm: parseString(value['@osm']),
  }

  if (isPresent(location.display)) {
    return trimObject(location)
  }
}

export const parseSeason: ParseFunction<Season> = (value) => {
  if (!isObject(value)) {
    return
  }

  const season = {
    number: parseNumber(value['#text']),
    name: parseString(value['@name']),
  }

  if (isPresent(season.number)) {
    return trimObject(season)
  }
}

export const parseEpisode: ParseFunction<Episode> = (value) => {
  if (!isObject(value)) {
    return
  }

  const episode = {
    number: parseNumber(value['@number']),
    display: parseString(value['#text']),
  }

  if (isPresent(episode.number)) {
    return trimObject(episode)
  }
}

export const parseTrailer: ParseFunction<Trailer> = (value) => {
  if (!isObject(value)) {
    return
  }

  const trailer = {
    display: parseString(value['#text']),
    url: parseString(value['@url']),
    pubdate: parseString(value['@pubdate']),
    length: parseNumber(value['@length']),
    type: parseString(value['@type']),
    season: parseNumber(value['@season']),
  }

  if (isPresent(trailer.url) && isPresent(trailer.pubdate)) {
    return trimObject(trailer)
  }
}

export const parseLicense: ParseFunction<License> = (value) => {
  if (!isObject(value)) {
    return
  }

  const license = {
    display: parseString(value['#text']),
    url: parseString(value['@url']),
  }

  if (isPresent(license.display)) {
    return trimObject(license)
  }
}

export const parseAlternateEnclosure: ParseFunction<AlternateEnclosure> = (value) => {
  if (!isObject(value)) {
    return
  }

  const alternateEnclosure = {
    type: parseString(value['@type']),
    length: parseNumber(value['@length']),
    bitrate: parseNumber(value['@bitrate']),
    height: parseNumber(value['@height']),
    lang: parseString(value['@lang']),
    title: parseString(value['@title']),
    rel: parseString(value['@rel']),
    codecs: parseString(value['@codecs']),
    default: parseBoolean(value['@default']),
    sources: parseArrayOf(value['podcast:source'], parseSource),
    integrity: parseIntegrity(value['podcast:integrity']),
  }

  if (isPresent(alternateEnclosure.type)) {
    return trimObject(alternateEnclosure)
  }
}

export const parseSource: ParseFunction<Source> = (value) => {
  if (!isObject(value)) {
    return
  }

  const source = {
    uri: parseString(value['@uri']),
    contentType: parseString(value['@contentType']),
  }

  if (isPresent(source.uri)) {
    return trimObject(source)
  }
}

export const parseIntegrity: ParseFunction<Integrity> = (value) => {
  if (!isObject(value)) {
    return
  }

  const integrity = {
    type: parseString(value['@type']),
    value: parseString(value['@value']),
  }

  if (isPresent(integrity.type) && isPresent(integrity.value)) {
    return trimObject(integrity)
  }
}

export const parseValue: ParseFunction<Value> = (value) => {
  if (!isObject(value)) {
    return
  }

  const valueData = {
    type: parseString(value['@type']),
    method: parseString(value['@method']),
    suggested: parseNumber(value['@suggested']),
    valueRecipients: parseArrayOf(value['podcast:valueRecipient'], parseValueRecipient),
    valueTimeSplits: parseArrayOf(value['podcast:valueTimeSplit'], parseValueTimeSplit),
  }

  if (isPresent(valueData.type) && isPresent(valueData.method)) {
    return trimObject(valueData)
  }
}

export const parseValueRecipient: ParseFunction<ValueRecipient> = (value) => {
  if (!isObject(value)) {
    return
  }

  const valueRecipient = {
    name: parseString(value['@name']),
    customKey: parseString(value['@customKey']),
    customValue: parseString(value['@customValue']),
    type: parseString(value['@type']),
    address: parseString(value['@address']),
    split: parseNumber(value['@split']),
    fee: parseBoolean(value['@fee']),
  }

  if (
    isPresent(valueRecipient.type) &&
    isPresent(valueRecipient.address) &&
    isPresent(valueRecipient.split)
  ) {
    return trimObject(valueRecipient)
  }
}

export const parseImages: ParseFunction<Images> = (value) => {
  if (!isObject(value)) {
    return
  }

  const images = trimObject({
    srcset: parseString(value['@srcset']),
  })

  return images
}

export const parseLiveItem: ParseFunction<LiveItem> = (value) => {
  if (!isObject(value)) {
    return
  }

  const item = parseItem(value)

  if (!item) {
    return
  }

  const liveItem = {
    ...item,
    status: parseString(value['@status']),
    start: parseString(value['@start']),
    end: parseString(value['@end']),
    contentlinks: parseArrayOf(value['podcast:contentLink'], parseContentLink),
  }

  if (isPresent(liveItem.status) && isPresent(liveItem.start)) {
    return liveItem
  }
}

export const parseContentLink: ParseFunction<ContentLink> = (value) => {
  if (!isObject(value)) {
    return
  }

  const contentLink = {
    href: parseString(value['@href']),
    display: parseString(value['#text']),
  }

  if (isPresent(contentLink.href) && isPresent(contentLink.display)) {
    return contentLink
  }
}

export const parseSocialInteract: ParseFunction<SocialInteract> = (value) => {
  if (!isObject(value)) {
    return
  }

  const socialInteract = {
    uri: parseString(value['@uri']),
    protocol: parseString(value['@protocol']),
    accountId: parseString(value['@accountId']),
    accountUrl: parseString(value['@accountUrl']),
    priority: parseNumber(value['@priority']),
  }

  if (isPresent(socialInteract.uri) && isPresent(socialInteract.protocol)) {
    return trimObject(socialInteract)
  }
}

export const parseBlock: ParseFunction<Block> = (value) => {
  if (!isObject(value)) {
    return
  }

  const block = {
    value: parseYesNoBoolean(value['@value']),
    id: parseString(value['@id']),
  }

  if (isPresent(block.value)) {
    return trimObject(block)
  }
}

export const parseTxt: ParseFunction<Txt> = (value) => {
  if (!isObject(value)) {
    return
  }

  const txt = {
    display: parseString(value['#text']),
    purpose: parseString(value['@purpose']),
  }

  if (isPresent(txt.display)) {
    return trimObject(txt)
  }
}

export const parseRemoteItem: ParseFunction<RemoteItem> = (value) => {
  if (!isObject(value)) {
    return
  }

  const remoteItem = {
    feedGuid: parseString(value['@feedGuid']),
    feedUrl: parseString(value['@feedUrl']),
    itemGuid: parseString(value['@itemGuid']),
    medium: parseString(value['@medium']),
  }

  if (isPresent(remoteItem.feedGuid)) {
    return trimObject(remoteItem)
  }
}

export const parsePodroll: ParseFunction<Podroll> = (value) => {
  if (!isObject(value)) {
    return
  }

  const podroll = trimObject({
    remoteItems: parseArrayOf(value['podcast:remoteItem'], parseRemoteItem),
  })

  return podroll
}

export const parseUpdateFrequency: ParseFunction<UpdateFrequency> = (value) => {
  if (!isObject(value)) {
    return
  }

  const updateFrequency = {
    display: parseString(value['#text']),
    complete: parseBoolean(value['@complete']),
    dtstart: parseString(value['@dtstart']),
    rrule: parseString(value['@rrule']),
  }

  if (isPresent(updateFrequency.display)) {
    return trimObject(updateFrequency)
  }
}

export const parsePodping: ParseFunction<Podping> = (value) => {
  if (!isObject(value)) {
    return
  }

  const podping = trimObject({
    usesPodping: parseBoolean(value['@usesPodping']),
  })

  return podping
}

export const parseValueTimeSplit: ParseFunction<ValueTimeSplit> = (value) => {
  if (!isObject(value)) {
    return
  }

  const valueTimeSplit = {
    startTime: parseNumber(value['@startTime']),
    duration: parseNumber(value['@duration']),
    remoteStartTime: parseNumber(value['@remoteStartTime']),
    remotePercentage: parseNumber(value['@remotePercentage']),
    // TODO: Make sure that even if the remoteItem is an array (if feed contained multiple items),
    // only the first one is taken.
    remoteItem: parseRemoteItem(value['podcast:remoteItem']),
    valueRecipients: parseArrayOf(value['podcast:valueRecipient'], parseValueRecipient),
  }

  if (isPresent(valueTimeSplit.startTime) && isPresent(valueTimeSplit.duration)) {
    return trimObject(valueTimeSplit)
  }
}

export const parseItem: ParseFunction<Item> = (value) => {
  if (!isObject(value)) {
    return
  }

  const item = trimObject({
    transcripts: parseArrayOf(value['podcast:transcript'], parseTranscript),
    chapters: parseChapters(value['podcast:chapters']),
    soundbites: parseArrayOf(value['podcast:soundbite'], parseSoundbite),
    persons: parseArrayOf(value['podcast:person'], parsePerson),
    location: parseLocation(value['podcast:location']),
    season: parseSeason(value['podcast:season']),
    episode: parseEpisode(value['podcast:episode']),
    license: parseLicense(value['podcast:license']),
    alternateEnclosures: parseArrayOf(value['podcast:alternateEnclosure'], parseAlternateEnclosure),
    value: parseValue(value['podcast:value']),
    socialInteracts: parseArrayOf(value['podcast:socialInteract'], parseSocialInteract),
    txts: parseArrayOf(value['podcast:txt'], parseTxt),
  })

  return item
}

export const parseChannel: ParseFunction<Channel> = (value) => {
  if (!isObject(value)) {
    return
  }

  const channel = trimObject({
    locked: parseLocked(value['podcast:locked']),
    fundings: parseArrayOf(value['podcast:funding'], parseFunding),
    persons: parseArrayOf(value['podcast:person'], parsePerson),
    location: parseLocation(value['podcast:location']),
    trailers: parseArrayOf(value['podcast:trailer'], parseTrailer),
    license: parseLicense(value['podcast:license']),
    guid: parseString(value['podcast:guid']?.['#text']),
    value: parseValue(value['podcast:value']),
    medium: parseString(value['podcast:medium']?.['#text']),
    images: parseString(value['podcast:images']?.['#text']),
    liveItems: parseArrayOf(value['podcast:liveItem'], parseLiveItem),
    blocks: parseArrayOf(value['podcast:block'], parseBlock),
    txts: parseArrayOf(value['podcast:txt'], parseTxt),
    remoteItems: parseArrayOf(value['podcast:remoteItem'], parseRemoteItem),
    updateFrequency: parseUpdateFrequency(value['podcast:updateFrequency']),
    podping: value['podcast:podping'] ? parsePodping(value['podcast:podping']) : undefined,
  })

  return channel
}
