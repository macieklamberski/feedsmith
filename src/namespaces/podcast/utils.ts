import type { ParseFunction } from '../../common/types.js'
import {
  hasAllProps,
  isNonEmptyObject,
  isObject,
  omitUndefinedFromObject,
  parseArrayOf,
  parseBoolean,
  parseNumber,
  parseString,
  parseYesNoBoolean,
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

  const transcript = omitUndefinedFromObject({
    url: parseString(value['@url']),
    type: parseString(value['@type']),
    language: parseString(value['@language']),
    rel: parseString(value['@rel']),
  })

  if (hasAllProps(transcript, ['url', 'type'])) {
    return transcript
  }
}

export const parseLocked: ParseFunction<Locked> = (value) => {
  if (!isObject(value)) {
    return
  }

  const locked = omitUndefinedFromObject({
    value: parseYesNoBoolean(value['@value']),
    owner: parseString(value['@owner']),
  })

  if (hasAllProps(locked, ['value'])) {
    return locked
  }
}

export const parseFunding: ParseFunction<Funding> = (value) => {
  if (!isObject(value)) {
    return
  }

  const funding = omitUndefinedFromObject({
    url: parseString(value['@url']),
    display: parseString(value['#text']),
  })

  if (hasAllProps(funding, ['url'])) {
    return funding
  }
}

export const parseChapters: ParseFunction<Chapters> = (value) => {
  if (!isObject(value)) {
    return
  }

  const chapters = omitUndefinedFromObject({
    url: parseString(value['@url']),
    type: parseString(value['@type']),
  })

  if (hasAllProps(chapters, ['url', 'type'])) {
    return chapters
  }
}

export const parseSoundbite: ParseFunction<Soundbite> = (value) => {
  if (!isObject(value)) {
    return
  }

  const soundbite = omitUndefinedFromObject({
    startTime: parseNumber(value['@startTime']),
    duration: parseNumber(value['@duration']),
    display: parseString(value['#text']),
  })

  if (hasAllProps(soundbite, ['startTime', 'duration'])) {
    return soundbite
  }
}

export const parsePerson: ParseFunction<Person> = (value) => {
  if (!isObject(value)) {
    return
  }

  const person = omitUndefinedFromObject({
    display: parseString(value['#text']),
    role: parseString(value['@role']),
    group: parseString(value['@group']),
    img: parseString(value['@img']),
    href: parseString(value['@href']),
  })

  if (hasAllProps(person, ['display'])) {
    return person
  }
}

export const parseLocation: ParseFunction<Location> = (value) => {
  if (!isObject(value)) {
    return
  }

  const location = omitUndefinedFromObject({
    display: parseString(value['#text']),
    geo: parseString(value['@geo']),
    osm: parseString(value['@osm']),
  })

  if (hasAllProps(location, ['display'])) {
    return location
  }
}

export const parseSeason: ParseFunction<Season> = (value) => {
  if (!isObject(value)) {
    return
  }

  const season = omitUndefinedFromObject({
    number: parseNumber(value['#text']),
    name: parseString(value['@name']),
  })

  if (hasAllProps(season, ['number'])) {
    return season
  }
}

export const parseEpisode: ParseFunction<Episode> = (value) => {
  if (!isObject(value)) {
    return
  }

  const episode = omitUndefinedFromObject({
    number: parseNumber(value['@number']),
    display: parseString(value['#text']),
  })

  if (hasAllProps(episode, ['number'])) {
    return episode
  }
}

export const parseTrailer: ParseFunction<Trailer> = (value) => {
  if (!isObject(value)) {
    return
  }

  const trailer = omitUndefinedFromObject({
    display: parseString(value['#text']),
    url: parseString(value['@url']),
    pubdate: parseString(value['@pubdate']),
    length: parseNumber(value['@length']),
    type: parseString(value['@type']),
    season: parseNumber(value['@season']),
  })

  if (hasAllProps(trailer, ['url', 'pubdate'])) {
    return trailer
  }
}

export const parseLicense: ParseFunction<License> = (value) => {
  if (!isObject(value)) {
    return
  }

  const license = omitUndefinedFromObject({
    display: parseString(value['#text']),
    url: parseString(value['@url']),
  })

  if (hasAllProps(license, ['display'])) {
    return license
  }
}

export const parseAlternateEnclosure: ParseFunction<AlternateEnclosure> = (value) => {
  if (!isObject(value)) {
    return
  }

  const alternateEnclosure = omitUndefinedFromObject({
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
  })

  if (hasAllProps(alternateEnclosure, ['type'])) {
    return alternateEnclosure
  }
}

export const parseSource: ParseFunction<Source> = (value) => {
  if (!isObject(value)) {
    return
  }

  const source = omitUndefinedFromObject({
    uri: parseString(value['@uri']),
    contentType: parseString(value['@contentType']),
  })

  if (hasAllProps(source, ['uri'])) {
    return source
  }
}

export const parseIntegrity: ParseFunction<Integrity> = (value) => {
  if (!isObject(value)) {
    return
  }

  const integrity = omitUndefinedFromObject({
    type: parseString(value['@type']),
    value: parseString(value['@value']),
  })

  if (hasAllProps(integrity, ['type', 'value'])) {
    return integrity
  }
}

export const parseValue: ParseFunction<Value> = (value) => {
  if (!isObject(value)) {
    return
  }

  const valueData = omitUndefinedFromObject({
    type: parseString(value['@type']),
    method: parseString(value['@method']),
    suggested: parseNumber(value['@suggested']),
    valueRecipients: parseArrayOf(value['podcast:valueRecipient'], parseValueRecipient),
    valueTimeSplits: parseArrayOf(value['podcast:valueTimeSplit'], parseValueTimeSplit),
  })

  if (hasAllProps(valueData, ['type', 'method'])) {
    return valueData
  }
}

export const parseValueRecipient: ParseFunction<ValueRecipient> = (value) => {
  if (!isObject(value)) {
    return
  }

  const valueRecipient = omitUndefinedFromObject({
    name: parseString(value['@name']),
    customKey: parseString(value['@customKey']),
    customValue: parseString(value['@customValue']),
    type: parseString(value['@type']),
    address: parseString(value['@address']),
    split: parseNumber(value['@split']),
    fee: parseBoolean(value['@fee']),
  })

  if (hasAllProps(valueRecipient, ['type', 'address', 'split'])) {
    return valueRecipient
  }
}

export const parseImages: ParseFunction<Images> = (value) => {
  if (!isObject(value)) {
    return
  }

  const images = omitUndefinedFromObject({
    srcset: parseString(value['@srcset']),
  })

  if (hasAllProps(images, ['srcset'])) {
    return images
  }
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

  if (hasAllProps(liveItem, ['status', 'start'])) {
    return liveItem
  }
}

export const parseContentLink: ParseFunction<ContentLink> = (value) => {
  if (!isObject(value)) {
    return
  }

  const contentLink = omitUndefinedFromObject({
    href: parseString(value['@href']),
    display: parseString(value['#text']),
  })

  if (hasAllProps(contentLink, ['href', 'display'])) {
    return contentLink
  }
}

export const parseSocialInteract: ParseFunction<SocialInteract> = (value) => {
  if (!isObject(value)) {
    return
  }

  const socialInteract = omitUndefinedFromObject({
    uri: parseString(value['@uri']),
    protocol: parseString(value['@protocol']),
    accountId: parseString(value['@accountId']),
    accountUrl: parseString(value['@accountUrl']),
    priority: parseNumber(value['@priority']),
  })

  if (hasAllProps(socialInteract, ['uri', 'protocol'])) {
    return socialInteract
  }
}

export const parseBlock: ParseFunction<Block> = (value) => {
  if (!isObject(value)) {
    return
  }

  const block = omitUndefinedFromObject({
    value: parseYesNoBoolean(value['@value']),
    id: parseString(value['@id']),
  })

  if (hasAllProps(block, ['value'])) {
    return block
  }
}

export const parseTxt: ParseFunction<Txt> = (value) => {
  if (!isObject(value)) {
    return
  }

  const txt = omitUndefinedFromObject({
    display: parseString(value['#text']),
    purpose: parseString(value['@purpose']),
  })

  if (hasAllProps(txt, ['display'])) {
    return txt
  }
}

export const parseRemoteItem: ParseFunction<RemoteItem> = (value) => {
  if (!isObject(value)) {
    return
  }

  const remoteItem = omitUndefinedFromObject({
    feedGuid: parseString(value['@feedGuid']),
    feedUrl: parseString(value['@feedUrl']),
    itemGuid: parseString(value['@itemGuid']),
    medium: parseString(value['@medium']),
  })

  if (hasAllProps(remoteItem, ['feedGuid'])) {
    return remoteItem
  }
}

export const parsePodroll: ParseFunction<Podroll> = (value) => {
  if (!isObject(value)) {
    return
  }

  const podroll = omitUndefinedFromObject({
    remoteItems: parseArrayOf(value['podcast:remoteItem'], parseRemoteItem),
  })

  if (isNonEmptyObject(podroll)) {
    return podroll
  }
}

export const parseUpdateFrequency: ParseFunction<UpdateFrequency> = (value) => {
  if (!isObject(value)) {
    return
  }

  const updateFrequency = omitUndefinedFromObject({
    display: parseString(value['#text']),
    complete: parseBoolean(value['@complete']),
    dtstart: parseString(value['@dtstart']),
    rrule: parseString(value['@rrule']),
  })

  if (hasAllProps(updateFrequency, ['display'])) {
    return updateFrequency
  }
}

export const parsePodping: ParseFunction<Podping> = (value) => {
  if (!isObject(value)) {
    return
  }

  const podping = omitUndefinedFromObject({
    usesPodping: parseBoolean(value['@usesPodping']),
  })

  if (hasAllProps(podping, ['usesPodping'])) {
    return podping
  }
}

export const parseValueTimeSplit: ParseFunction<ValueTimeSplit> = (value) => {
  if (!isObject(value)) {
    return
  }

  const valueTimeSplit = omitUndefinedFromObject({
    startTime: parseNumber(value['@startTime']),
    duration: parseNumber(value['@duration']),
    remoteStartTime: parseNumber(value['@remoteStartTime']),
    remotePercentage: parseNumber(value['@remotePercentage']),
    // TODO: Make sure that even if the remoteItem is an array (if feed contained multiple items),
    // only the first one is taken.
    remoteItem: parseRemoteItem(value['podcast:remoteItem']),
    valueRecipients: parseArrayOf(value['podcast:valueRecipient'], parseValueRecipient),
  })

  if (hasAllProps(valueTimeSplit, ['startTime', 'duration'])) {
    return valueTimeSplit
  }
}

export const parseItem: ParseFunction<Item> = (value) => {
  if (!isObject(value)) {
    return
  }

  const item = omitUndefinedFromObject({
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

  if (isNonEmptyObject(item)) {
    return item
  }
}

export const parseChannel: ParseFunction<Channel> = (value) => {
  if (!isObject(value)) {
    return
  }

  const channel = omitUndefinedFromObject({
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

  if (isNonEmptyObject(channel)) {
    return channel
  }
}
