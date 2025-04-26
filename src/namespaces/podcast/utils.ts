import type { ParseFunction } from '../../common/types.js'
import {
  isObject,
  isPresent,
  parseArrayOf,
  parseBoolean,
  parseNumber,
  parseSingular,
  parseSingularOf,
  parseString,
  parseTextString,
  parseYesNoBoolean,
  retrieveText,
  trimObject,
} from '../../common/utils.js'
import type {
  AlternateEnclosure,
  Block,
  Chapters,
  ContentLink,
  Episode,
  Feed,
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
  const locked = {
    value: parseYesNoBoolean(retrieveText(value)),
    owner: parseString(value?.['@owner']),
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
    startTime: parseNumber(value['@starttime']),
    duration: parseNumber(value['@duration']),
    display: parseString(retrieveText(value)),
  }

  if (isPresent(soundbite.startTime) && isPresent(soundbite.duration)) {
    return trimObject(soundbite)
  }
}

export const parsePerson: ParseFunction<Person> = (value) => {
  const person = {
    display: parseString(retrieveText(value)),
    role: parseString(value?.['@role']),
    group: parseString(value?.['@group']),
    img: parseString(value?.['@img']),
    href: parseString(value?.['@href']),
  }

  if (isPresent(person.display)) {
    return trimObject(person)
  }
}

export const parseLocation: ParseFunction<Location> = (value) => {
  const location = {
    display: parseString(retrieveText(value)),
    geo: parseString(value?.['@geo']),
    osm: parseString(value?.['@osm']),
  }

  if (isPresent(location.display)) {
    return trimObject(location)
  }
}

export const parseSeason: ParseFunction<Season> = (value) => {
  const season = {
    number: parseNumber(retrieveText(value)),
    name: parseString(value?.['@name']),
  }

  if (isPresent(season.number)) {
    return trimObject(season)
  }
}

export const parseEpisode: ParseFunction<Episode> = (value) => {
  const season = {
    number: parseNumber(retrieveText(value)),
    display: parseString(value?.['@display']),
  }

  if (isPresent(season.number)) {
    return trimObject(season)
  }
}

export const parseTrailer: ParseFunction<Trailer> = (value) => {
  if (!isObject(value)) {
    return
  }

  const trailer = {
    display: parseString(retrieveText(value)),
    url: parseString(value['@url']),
    pubdate: parseString(value['@pubdate']),
    length: parseNumber(value['@length']),
    type: parseString(value['@type']),
    season: parseNumber(value['@season']),
  }

  if (isPresent(trailer.display) && isPresent(trailer.url) && isPresent(trailer.pubdate)) {
    return trimObject(trailer)
  }
}

export const parseLicense: ParseFunction<License> = (value) => {
  const license = {
    display: parseString(retrieveText(value)),
    url: parseString(value?.['@url']),
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
    integrity: parseSingularOf(value['podcast:integrity'], parseIntegrity),
  }

  // TODO: Consider requiring at least one item in `sources` as per spec.
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
    contentType: parseString(value['@contenttype']),
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
    return integrity
  }
}

export const parseValue: ParseFunction<Value> = (value) => {
  if (!isObject(value)) {
    return
  }

  const parsed = {
    type: parseString(value['@type']),
    method: parseString(value['@method']),
    suggested: parseNumber(value['@suggested']),
    valueRecipients: parseArrayOf(value['podcast:valuerecipient'], parseValueRecipient),
    valueTimeSplits: parseArrayOf(value['podcast:valuetimesplit'], parseValueTimeSplit),
  }

  if (isPresent(parsed.type) && isPresent(parsed.method)) {
    return trimObject(parsed)
  }
}

export const parseValueRecipient: ParseFunction<ValueRecipient> = (value) => {
  if (!isObject(value)) {
    return
  }

  const valueRecipient = {
    name: parseString(value['@name']),
    customKey: parseString(value['@customkey']),
    customValue: parseString(value['@customvalue']),
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
    // TODO: Convert it to an array of { url, viewport }?
    srcset: parseString(value['@srcset']),
  })

  return images
}

export const parseLiveItem: ParseFunction<LiveItem> = (value) => {
  if (!isObject(value)) {
    return
  }

  const liveItem = {
    ...parseItem(value),
    status: parseString(value['@status']),
    start: parseString(value['@start']),
    end: parseString(value['@end']),
    contentlinks: parseArrayOf(value['podcast:contentlink'], parseContentLink),
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
    display: parseString(retrieveText(value)),
  }

  if (isPresent(contentLink.href)) {
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
    accountId: parseString(value['@accountid']),
    accountUrl: parseString(value['@accounturl']),
    priority: parseNumber(value['@priority']),
  }

  // INFO: The specification states that the `uri` is required. However, if the protocol is set
  // to `disabled`, no other attributes are necessary. To bypass the protocol value check, which
  // may be invalid, only the protocol is required to ensure consistent behavior.
  if (isPresent(socialInteract.protocol)) {
    return trimObject(socialInteract)
  }
}

export const parseBlock: ParseFunction<Block> = (value) => {
  const block = {
    value: parseYesNoBoolean(retrieveText(value)),
    id: parseString(value?.['@id']),
  }

  if (isPresent(block.value)) {
    return trimObject(block)
  }
}

export const parseTxt: ParseFunction<Txt> = (value) => {
  const txt = {
    display: parseString(retrieveText(value)),
    purpose: parseString(value?.['@purpose']),
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
    feedGuid: parseString(value['@feedguid']),
    feedUrl: parseString(value['@feedurl']),
    itemGuid: parseString(value['@itemguid']),
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
    remoteItems: parseArrayOf(value['podcast:remoteitem'], parseRemoteItem),
  })

  return podroll
}

export const parseUpdateFrequency: ParseFunction<UpdateFrequency> = (value) => {
  const updateFrequency = {
    display: parseString(retrieveText(value)),
    complete: parseBoolean(value?.['@complete']),
    dtstart: parseString(value?.['@dtstart']),
    rrule: parseString(value?.['@rrule']),
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
    usesPodping: parseBoolean(value['@usespodping']),
  })

  return podping
}

export const parseValueTimeSplit: ParseFunction<ValueTimeSplit> = (value) => {
  if (!isObject(value)) {
    return
  }

  const valueTimeSplit = {
    startTime: parseNumber(value['@starttime']),
    duration: parseNumber(value['@duration']),
    remoteStartTime: parseNumber(value['@remotestarttime']),
    remotePercentage: parseNumber(value['@remotepercentage']),
    // TODO: Make sure that even if the remoteItem is an array (if feed contained multiple items),
    // only the first one is taken.
    remoteItem: parseSingularOf(value['podcast:remoteitem'], parseRemoteItem),
    valueRecipients: parseArrayOf(value['podcast:valuerecipient'], parseValueRecipient),
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
    chapters: parseSingularOf(value['podcast:chapters'], parseChapters),
    soundbites: parseArrayOf(value['podcast:soundbite'], parseSoundbite),
    persons: parseArrayOf(value['podcast:person'], parsePerson),
    location: parseSingularOf(value['podcast:location'], parseLocation),
    season: parseSingularOf(value['podcast:season'], parseSeason),
    episode: parseSingularOf(value['podcast:episode'], parseEpisode),
    license: parseSingularOf(value['podcast:license'], parseLicense),
    alternateEnclosures: parseArrayOf(value['podcast:alternateenclosure'], parseAlternateEnclosure),
    value: parseSingularOf(value['podcast:value'], parseValue),
    images: parseSingularOf(value['podcast:images'], parseImages),
    socialInteracts: parseArrayOf(value['podcast:socialinteract'], parseSocialInteract),
    txts: parseArrayOf(value['podcast:txt'], parseTxt),
  })

  return item
}

export const parseFeed: ParseFunction<Feed> = (value) => {
  if (!isObject(value)) {
    return
  }

  const feed = trimObject({
    locked: parseSingularOf(value['podcast:locked'], parseLocked),
    fundings: parseArrayOf(value['podcast:funding'], parseFunding),
    persons: parseArrayOf(value['podcast:person'], parsePerson),
    location: parseSingularOf(value['podcast:location'], parseLocation),
    trailers: parseArrayOf(value['podcast:trailer'], parseTrailer),
    license: parseSingularOf(value['podcast:license'], parseLicense),
    guid: parseSingularOf(value['podcast:guid'], parseTextString),
    value: parseSingularOf(value['podcast:value'], parseValue),
    medium: parseSingularOf(value['podcast:medium'], parseTextString),
    images: parseSingularOf(value['podcast:images'], parseImages),
    liveItems: parseArrayOf(value['podcast:liveitem'], parseLiveItem),
    blocks: parseArrayOf(value['podcast:block'], parseBlock),
    txts: parseArrayOf(value['podcast:txt'], parseTxt),
    remoteItems: parseArrayOf(value['podcast:remoteitem'], parseRemoteItem),
    podroll: parseSingularOf(value['podcast:podroll'], parsePodroll),
    updateFrequency: parseSingularOf(value['podcast:updatefrequency'], parseUpdateFrequency),
    podping: parseSingularOf(value['podcast:podping'], parsePodping),
  })

  return feed
}
