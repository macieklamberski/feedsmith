import type { ParseFunction } from '../../../common/types.js'
import {
  isObject,
  isPresent,
  parseArrayOf,
  parseBoolean,
  parseNumber,
  parseSingularOf,
  parseString,
  parseTextString,
  parseYesNoBoolean,
  retrieveText,
  trimObject,
} from '../../../common/utils.js'
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
} from '../common/types.js'

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
    return trimObject(transcript) as Transcript
  }
}

export const parseLocked: ParseFunction<Locked> = (value) => {
  const locked = {
    value: parseYesNoBoolean(retrieveText(value)),
    owner: parseString(value?.['@owner']),
  }

  if (isPresent(locked.value)) {
    return trimObject(locked) as Locked
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
    return trimObject(funding) as Funding
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
    return chapters as Chapters
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
    return trimObject(soundbite) as Soundbite
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
    return trimObject(person) as Person
  }
}

export const parseLocation: ParseFunction<Location> = (value) => {
  const location = {
    display: parseString(retrieveText(value)),
    geo: parseString(value?.['@geo']),
    osm: parseString(value?.['@osm']),
  }

  if (isPresent(location.display)) {
    return trimObject(location) as Location
  }
}

export const parseSeason: ParseFunction<Season> = (value) => {
  const season = {
    number: parseNumber(retrieveText(value)),
    name: parseString(value?.['@name']),
  }

  if (isPresent(season.number)) {
    return trimObject(season) as Season
  }
}

export const parseEpisode: ParseFunction<Episode> = (value) => {
  const season = {
    number: parseNumber(retrieveText(value)),
    display: parseString(value?.['@display']),
  }

  if (isPresent(season.number)) {
    return trimObject(season) as Episode
  }
}

export const parseTrailer: ParseFunction<Trailer<string>> = (value) => {
  if (!isObject(value)) {
    return
  }

  const trailer = {
    display: parseString(retrieveText(value)),
    url: parseString(value['@url']),
    pubDate: parseString(value['@pubdate']),
    length: parseNumber(value['@length']),
    type: parseString(value['@type']),
    season: parseNumber(value['@season']),
  }

  if (isPresent(trailer.display) && isPresent(trailer.url) && isPresent(trailer.pubDate)) {
    return trimObject(trailer) as Trailer<string>
  }
}

export const parseLicense: ParseFunction<License> = (value) => {
  const license = {
    display: parseString(retrieveText(value)),
    url: parseString(value?.['@url']),
  }

  if (isPresent(license.display)) {
    return trimObject(license) as License
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
    return trimObject(alternateEnclosure) as AlternateEnclosure
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
    return trimObject(source) as Source
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
    return integrity as Integrity
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
    return trimObject(parsed) as Value
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
    return trimObject(valueRecipient) as ValueRecipient
  }
}

export const parseImages: ParseFunction<Images> = (value) => {
  if (!isObject(value)) {
    return
  }

  const images = {
    // TODO: Convert it to an array of { url, viewport }?
    srcset: parseString(value['@srcset']),
  }

  return trimObject(images) as Images
}

export const parseLiveItem: ParseFunction<LiveItem<string>> = (value) => {
  if (!isObject(value)) {
    return
  }

  const liveItem = {
    ...retrieveItem(value),
    status: parseString(value['@status']),
    start: parseString(value['@start']),
    end: parseString(value['@end']),
    contentlinks: parseArrayOf(value['podcast:contentlink'], parseContentLink),
  }

  if (isPresent(liveItem.status) && isPresent(liveItem.start)) {
    return trimObject(liveItem) as LiveItem<string>
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
    return trimObject(contentLink) as ContentLink
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
    return trimObject(socialInteract) as SocialInteract
  }
}

export const parseBlock: ParseFunction<Block> = (value) => {
  const block = {
    value: parseYesNoBoolean(retrieveText(value)),
    id: parseString(value?.['@id']),
  }

  if (isPresent(block.value)) {
    return trimObject(block) as Block
  }
}

export const parseTxt: ParseFunction<Txt> = (value) => {
  const txt = {
    display: parseString(retrieveText(value)),
    purpose: parseString(value?.['@purpose']),
  }

  if (isPresent(txt.display)) {
    return trimObject(txt) as Txt
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
    return trimObject(remoteItem) as RemoteItem
  }
}

export const parsePodroll: ParseFunction<Podroll> = (value) => {
  if (!isObject(value)) {
    return
  }

  const podroll = {
    remoteItems: parseArrayOf(value['podcast:remoteitem'], parseRemoteItem),
  }

  return trimObject(podroll) as Podroll
}

export const parseUpdateFrequency: ParseFunction<UpdateFrequency<string>> = (value) => {
  const updateFrequency = {
    display: parseString(retrieveText(value)),
    complete: parseBoolean(value?.['@complete']),
    dtstart: parseString(value?.['@dtstart']),
    rrule: parseString(value?.['@rrule']),
  }

  if (isPresent(updateFrequency.display)) {
    return trimObject(updateFrequency) as UpdateFrequency<string>
  }
}

export const parsePodping: ParseFunction<Podping> = (value) => {
  if (!isObject(value)) {
    return
  }

  const podping = {
    usesPodping: parseBoolean(value['@usespodping']),
  }

  return trimObject(podping) as Podping
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
    remoteItem: parseSingularOf(value['podcast:remoteitem'], parseRemoteItem),
    valueRecipients: parseArrayOf(value['podcast:valuerecipient'], parseValueRecipient),
  }

  if (isPresent(valueTimeSplit.startTime) && isPresent(valueTimeSplit.duration)) {
    return trimObject(valueTimeSplit) as ValueTimeSplit
  }
}

export const retrieveItem: ParseFunction<Item> = (value) => {
  if (!isObject(value)) {
    return
  }

  const item = {
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
  }

  return trimObject(item) as Item
}

export const retrieveFeed: ParseFunction<Feed<string>> = (value) => {
  if (!isObject(value)) {
    return
  }

  const feed = {
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
  }

  return trimObject(feed) as Feed<string>
}
