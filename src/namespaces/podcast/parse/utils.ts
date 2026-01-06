import type { ParsePartialUtil } from '../../../common/types.js'
import {
  isObject,
  parseArrayOf,
  parseBoolean,
  parseDate,
  parseNumber,
  parseSingularOf,
  parseString,
  parseYesNoBoolean,
  retrieveText,
  trimArray,
  trimObject,
} from '../../../common/utils.js'
import type { PodcastNs } from '../common/types.js'

export const parseTranscript: ParsePartialUtil<PodcastNs.Transcript> = (value) => {
  if (!isObject(value)) {
    return
  }

  const transcript = {
    url: parseString(value['@url']),
    type: parseString(value['@type']),
    language: parseString(value['@language']),
    rel: parseString(value['@rel']),
  }

  return trimObject(transcript)
}

export const parseLocked: ParsePartialUtil<PodcastNs.Locked> = (value) => {
  const locked = {
    value: parseYesNoBoolean(retrieveText(value)),
    owner: parseString(value?.['@owner']),
  }

  return trimObject(locked)
}

export const parseFunding: ParsePartialUtil<PodcastNs.Funding> = (value) => {
  if (!isObject(value)) {
    return
  }

  const funding = {
    url: parseString(value['@url']),
    display: parseString(value['#text']),
  }

  return trimObject(funding)
}

export const parseChapters: ParsePartialUtil<PodcastNs.Chapters> = (value) => {
  if (!isObject(value)) {
    return
  }

  const chapters = {
    url: parseString(value['@url']),
    type: parseString(value['@type']),
  }

  return trimObject(chapters)
}

export const parseSoundbite: ParsePartialUtil<PodcastNs.Soundbite> = (value) => {
  if (!isObject(value)) {
    return
  }

  const soundbite = {
    startTime: parseNumber(value['@starttime']),
    duration: parseNumber(value['@duration']),
    display: parseString(retrieveText(value)),
  }

  return trimObject(soundbite)
}

export const parsePerson: ParsePartialUtil<PodcastNs.Person> = (value) => {
  const person = {
    display: parseString(retrieveText(value)),
    role: parseString(value?.['@role']),
    group: parseString(value?.['@group']),
    img: parseString(value?.['@img']),
    href: parseString(value?.['@href']),
  }

  return trimObject(person)
}

export const parseLocation: ParsePartialUtil<PodcastNs.Location> = (value) => {
  const location = {
    display: parseString(retrieveText(value)),
    rel: parseString(value?.['@rel']),
    geo: parseString(value?.['@geo']),
    osm: parseString(value?.['@osm']),
    country: parseString(value?.['@country']),
  }

  return trimObject(location)
}

export const parseSeason: ParsePartialUtil<PodcastNs.Season> = (value) => {
  const season = {
    number: parseNumber(retrieveText(value)),
    name: parseString(value?.['@name']),
  }

  return trimObject(season)
}

export const parseEpisode: ParsePartialUtil<PodcastNs.Episode> = (value) => {
  const episode = {
    number: parseNumber(retrieveText(value)),
    display: parseString(value?.['@display']),
  }

  return trimObject(episode)
}

export const parseTrailer: ParsePartialUtil<PodcastNs.Trailer<string>> = (value) => {
  if (!isObject(value)) {
    return
  }

  const trailer = {
    display: parseString(retrieveText(value)),
    url: parseString(value['@url']),
    pubDate: parseDate(value['@pubdate']),
    length: parseNumber(value['@length']),
    type: parseString(value['@type']),
    season: parseNumber(value['@season']),
  }

  return trimObject(trailer)
}

export const parseLicense: ParsePartialUtil<PodcastNs.License> = (value) => {
  const license = {
    display: parseString(retrieveText(value)),
    url: parseString(value?.['@url']),
  }

  return trimObject(license)
}

export const parseAlternateEnclosure: ParsePartialUtil<PodcastNs.AlternateEnclosure> = (value) => {
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

  return trimObject(alternateEnclosure)
}

export const parseSource: ParsePartialUtil<PodcastNs.Source> = (value) => {
  if (!isObject(value)) {
    return
  }

  const source = {
    uri: parseString(value['@uri']),
    contentType: parseString(value['@contenttype']),
  }

  return trimObject(source)
}

export const parseIntegrity: ParsePartialUtil<PodcastNs.Integrity> = (value) => {
  if (!isObject(value)) {
    return
  }

  const integrity = {
    type: parseString(value['@type']),
    value: parseString(value['@value']),
  }

  return trimObject(integrity)
}

export const parseValue: ParsePartialUtil<PodcastNs.Value> = (value) => {
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

  return trimObject(parsed)
}

export const parseValueRecipient: ParsePartialUtil<PodcastNs.ValueRecipient> = (value) => {
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

  return trimObject(valueRecipient)
}

export const parseImage: ParsePartialUtil<PodcastNs.Image> = (value) => {
  if (!isObject(value)) {
    return
  }

  const image = {
    href: parseString(value['@href']),
    alt: parseString(value['@alt']),
    aspectRatio: parseString(value['@aspect-ratio']),
    width: parseNumber(value['@width']),
    height: parseNumber(value['@height']),
    type: parseString(value['@type']),
    purpose: parseString(value['@purpose']),
  }

  return trimObject(image)
}

export const parseImages: ParsePartialUtil<Array<PodcastNs.Image>> = (value) => {
  const srcset = parseString(value?.['@srcset'])

  if (!srcset) {
    return
  }

  const images = []
  const segments = srcset.split(',')

  for (const segment of segments) {
    const [href, width] = segment.trim().split(/\s+/)

    const image = {
      href: parseString(href),
      width: parseNumber(width?.replace(/w$/, '')),
    }

    images.push(image)
  }

  return trimArray(images, trimObject)
}

export const retrieveImages: ParsePartialUtil<Array<PodcastNs.Image>> = (value) => {
  return (
    parseArrayOf(value['podcast:image'], parseImage) ??
    parseSingularOf(value['podcast:images'], parseImages)
  )
}

export const parseLiveItem: ParsePartialUtil<PodcastNs.LiveItem<string>> = (value) => {
  if (!isObject(value)) {
    return
  }

  const liveItem = {
    ...retrieveItem(value),
    status: parseString(value['@status']),
    start: parseDate(value['@start']),
    end: parseDate(value['@end']),
    contentLinks: parseArrayOf(value['podcast:contentlink'], parseContentLink),
  }

  return trimObject(liveItem)
}

export const parseContentLink: ParsePartialUtil<PodcastNs.ContentLink> = (value) => {
  if (!isObject(value)) {
    return
  }

  const contentLink = {
    href: parseString(value['@href']),
    display: parseString(retrieveText(value)),
  }

  return trimObject(contentLink)
}

export const parseSocialInteract: ParsePartialUtil<PodcastNs.SocialInteract> = (value) => {
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

  return trimObject(socialInteract)
}

export const parseChat: ParsePartialUtil<PodcastNs.Chat> = (value) => {
  if (!isObject(value)) {
    return
  }

  const chat = {
    server: parseString(value['@server']),
    protocol: parseString(value['@protocol']),
    accountId: parseString(value['@accountid']),
    space: parseString(value['@space']),
  }

  return trimObject(chat)
}

export const parseBlock: ParsePartialUtil<PodcastNs.Block> = (value) => {
  const block = {
    value: parseYesNoBoolean(retrieveText(value)),
    id: parseString(value?.['@id']),
  }

  return trimObject(block)
}

export const parseTxt: ParsePartialUtil<PodcastNs.Txt> = (value) => {
  const txt = {
    display: parseString(retrieveText(value)),
    purpose: parseString(value?.['@purpose']),
  }

  return trimObject(txt)
}

export const parseRemoteItem: ParsePartialUtil<PodcastNs.RemoteItem> = (value) => {
  if (!isObject(value)) {
    return
  }

  const remoteItem = {
    feedGuid: parseString(value['@feedguid']),
    feedUrl: parseString(value['@feedurl']),
    itemGuid: parseString(value['@itemguid']),
    medium: parseString(value['@medium']),
  }

  return trimObject(remoteItem)
}

export const parsePodroll: ParsePartialUtil<PodcastNs.Podroll> = (value) => {
  if (!isObject(value)) {
    return
  }

  const podroll = {
    remoteItems: parseArrayOf(value['podcast:remoteitem'], parseRemoteItem),
  }

  return trimObject(podroll)
}

export const parseUpdateFrequency: ParsePartialUtil<PodcastNs.UpdateFrequency<string>> = (
  value,
) => {
  const updateFrequency = {
    display: parseString(retrieveText(value)),
    complete: parseBoolean(value?.['@complete']),
    dtstart: parseDate(value?.['@dtstart']),
    rrule: parseString(value?.['@rrule']),
  }

  return trimObject(updateFrequency)
}

export const parsePodping: ParsePartialUtil<PodcastNs.Podping> = (value) => {
  if (!isObject(value)) {
    return
  }

  const podping = {
    usesPodping: parseBoolean(value['@usespodping']),
  }

  return trimObject(podping)
}

export const parsePublisher: ParsePartialUtil<PodcastNs.Publisher> = (value) => {
  if (!isObject(value)) {
    return
  }

  const publisher = {
    remoteItem: parseSingularOf(value['podcast:remoteitem'], parseRemoteItem),
  }

  return trimObject(publisher)
}

export const parseValueTimeSplit: ParsePartialUtil<PodcastNs.ValueTimeSplit> = (value) => {
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

  return trimObject(valueTimeSplit)
}

export const retrieveItem: ParsePartialUtil<PodcastNs.Item> = (value) => {
  if (!isObject(value)) {
    return
  }

  const item = {
    transcripts: parseArrayOf(value['podcast:transcript'], parseTranscript),
    chapters: parseSingularOf(value['podcast:chapters'], parseChapters),
    soundbites: parseArrayOf(value['podcast:soundbite'], parseSoundbite),
    persons: parseArrayOf(value['podcast:person'], parsePerson),
    locations: parseArrayOf(value['podcast:location'], parseLocation),
    season: parseSingularOf(value['podcast:season'], parseSeason),
    episode: parseSingularOf(value['podcast:episode'], parseEpisode),
    license: parseSingularOf(value['podcast:license'], parseLicense),
    alternateEnclosures: parseArrayOf(value['podcast:alternateenclosure'], parseAlternateEnclosure),
    values: parseArrayOf(value['podcast:value'], parseValue),
    images: retrieveImages(value),
    socialInteracts: parseArrayOf(value['podcast:socialinteract'], parseSocialInteract),
    txts: parseArrayOf(value['podcast:txt'], parseTxt),
    chat: parseSingularOf(value['podcast:chat'], parseChat),

    // Deprecated fields for backward compatibility.
    location: parseSingularOf(value['podcast:location'], parseLocation),
    value: parseSingularOf(value['podcast:value'], parseValue),
    chats: parseArrayOf(value['podcast:chat'], parseChat),
  }

  return trimObject(item)
}

export const retrieveFeed: ParsePartialUtil<PodcastNs.Feed<string>> = (value) => {
  if (!isObject(value)) {
    return
  }

  const feed = {
    locked: parseSingularOf(value['podcast:locked'], parseLocked),
    fundings: parseArrayOf(value['podcast:funding'], parseFunding),
    persons: parseArrayOf(value['podcast:person'], parsePerson),
    locations: parseArrayOf(value['podcast:location'], parseLocation),
    trailers: parseArrayOf(value['podcast:trailer'], parseTrailer),
    license: parseSingularOf(value['podcast:license'], parseLicense),
    guid: parseSingularOf(value['podcast:guid'], (value) => parseString(retrieveText(value))),
    values: parseArrayOf(value['podcast:value'], parseValue),
    medium: parseSingularOf(value['podcast:medium'], (value) => parseString(retrieveText(value))),
    images: retrieveImages(value),
    liveItems: parseArrayOf(value['podcast:liveitem'], parseLiveItem),
    blocks: parseArrayOf(value['podcast:block'], parseBlock),
    txts: parseArrayOf(value['podcast:txt'], parseTxt),
    remoteItems: parseArrayOf(value['podcast:remoteitem'], parseRemoteItem),
    podroll: parseSingularOf(value['podcast:podroll'], parsePodroll),
    updateFrequency: parseSingularOf(value['podcast:updatefrequency'], parseUpdateFrequency),
    podping: parseSingularOf(value['podcast:podping'], parsePodping),
    chat: parseSingularOf(value['podcast:chat'], parseChat),
    publisher: parseSingularOf(value['podcast:publisher'], parsePublisher),

    // Deprecated fields for backward compatibility.
    location: parseSingularOf(value['podcast:location'], parseLocation),
    value: parseSingularOf(value['podcast:value'], parseValue),
    chats: parseArrayOf(value['podcast:chat'], parseChat),
  }

  return trimObject(feed)
}
