import type { GenerateFunction } from '@/common/types.js'
import {
  generateBoolean,
  generateCdataString,
  generateNumber,
  generatePlainString,
  generateRfc822Date,
  generateRfc3339Date,
  generateYesNoBoolean,
  isObject,
  trimArray,
  trimObject,
} from '@/common/utils.js'
import type {
  AlternateEnclosure,
  BaseItem,
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
} from '@/namespaces/podcast/common/types.js'

export const generateBaseItem: GenerateFunction<BaseItem> = (baseItem) => {
  if (!isObject(baseItem)) {
    return
  }

  const value = {
    'podcast:transcript': trimArray(baseItem.transcripts, generateTranscript),
    'podcast:chapters': generateChapters(baseItem.chapters),
    'podcast:soundbite': trimArray(baseItem.soundbites, generateSoundbite),
    'podcast:person': trimArray(baseItem.persons, generatePerson),
    'podcast:location': generateLocation(baseItem.location),
    'podcast:season': generateSeason(baseItem.season),
    'podcast:episode': generateEpisode(baseItem.episode),
    'podcast:license': generateLicense(baseItem.license),
    'podcast:alternateEnclosure': trimArray(
      baseItem.alternateEnclosures,
      generateAlternateEnclosure,
    ),
    'podcast:value': generateValue(baseItem.value),
    'podcast:images': generateImages(baseItem.images),
    'podcast:socialInteract': trimArray(baseItem.socialInteracts, generateSocialInteract),
    'podcast:txt': trimArray(baseItem.txts, generateTxt),
  }

  return trimObject(value)
}

export const generateTranscript: GenerateFunction<Transcript> = (transcript) => {
  if (!isObject(transcript)) {
    return
  }

  const value = {
    '@url': generatePlainString(transcript.url),
    '@type': generatePlainString(transcript.type),
    '@language': generatePlainString(transcript.language),
    '@rel': generatePlainString(transcript.rel),
  }

  return trimObject(value)
}

export const generateLocked: GenerateFunction<Locked> = (locked) => {
  if (!isObject(locked)) {
    return
  }

  const value = {
    '#text': generateYesNoBoolean(locked.value),
    '@owner': generatePlainString(locked.owner),
  }

  return trimObject(value)
}

export const generateFunding: GenerateFunction<Funding> = (funding) => {
  if (!isObject(funding)) {
    return
  }

  const value = {
    '#text': generateCdataString(funding.display),
    '@url': generatePlainString(funding.url),
  }

  return trimObject(value)
}

export const generateChapters: GenerateFunction<Chapters> = (chapters) => {
  if (!isObject(chapters)) {
    return
  }

  const value = {
    '@url': generatePlainString(chapters.url),
    '@type': generatePlainString(chapters.type),
  }

  return trimObject(value)
}

export const generateSoundbite: GenerateFunction<Soundbite> = (soundbite) => {
  if (!isObject(soundbite)) {
    return
  }

  const value = {
    '#text': generateCdataString(soundbite.display),
    '@startTime': generateNumber(soundbite.startTime),
    '@duration': generateNumber(soundbite.duration),
  }

  return trimObject(value)
}

export const generatePerson: GenerateFunction<Person> = (person) => {
  if (!isObject(person)) {
    return
  }

  const value = {
    '#text': generateCdataString(person.display),
    '@role': generatePlainString(person.role),
    '@group': generatePlainString(person.group),
    '@img': generatePlainString(person.img),
    '@href': generatePlainString(person.href),
  }

  return trimObject(value)
}

export const generateLocation: GenerateFunction<Location> = (location) => {
  if (!isObject(location)) {
    return
  }

  const value = {
    '#text': generateCdataString(location.display),
    '@geo': generatePlainString(location.geo),
    '@osm': generatePlainString(location.osm),
  }

  return trimObject(value)
}

export const generateSeason: GenerateFunction<Season> = (season) => {
  if (!isObject(season)) {
    return
  }

  const value = {
    '#text': generateNumber(season.number),
    '@name': generatePlainString(season.name),
  }

  return trimObject(value)
}

export const generateEpisode: GenerateFunction<Episode> = (episode) => {
  if (!isObject(episode)) {
    return
  }

  const value = {
    '#text': generateNumber(episode.number),
    '@display': generatePlainString(episode.display),
  }

  return trimObject(value)
}

export const generateTrailer: GenerateFunction<Trailer<Date>> = (trailer) => {
  if (!isObject(trailer)) {
    return
  }

  const value = {
    '#text': generateCdataString(trailer.display),
    '@url': generatePlainString(trailer.url),
    '@pubdate': generateRfc822Date(trailer.pubDate),
    '@length': generateNumber(trailer.length),
    '@type': generatePlainString(trailer.type),
    '@season': generateNumber(trailer.season),
  }

  return trimObject(value)
}

export const generateLicense: GenerateFunction<License> = (license) => {
  if (!isObject(license)) {
    return
  }

  const value = {
    '#text': generateCdataString(license.display),
    '@url': generatePlainString(license.url),
  }

  return trimObject(value)
}

export const generateSource: GenerateFunction<Source> = (source) => {
  if (!isObject(source)) {
    return
  }

  const value = {
    '@uri': generatePlainString(source.uri),
    '@contentType': generatePlainString(source.contentType),
  }

  return trimObject(value)
}

export const generateIntegrity: GenerateFunction<Integrity> = (integrity) => {
  if (!isObject(integrity)) {
    return
  }

  const value = {
    '@type': generatePlainString(integrity.type),
    '@value': generatePlainString(integrity.value),
  }

  return trimObject(value)
}

export const generateAlternateEnclosure: GenerateFunction<AlternateEnclosure> = (
  alternateEnclosure,
) => {
  if (!isObject(alternateEnclosure)) {
    return
  }

  const value = {
    '@type': generatePlainString(alternateEnclosure.type),
    '@length': generateNumber(alternateEnclosure.length),
    '@bitrate': generateNumber(alternateEnclosure.bitrate),
    '@height': generateNumber(alternateEnclosure.height),
    '@lang': generatePlainString(alternateEnclosure.lang),
    '@title': generatePlainString(alternateEnclosure.title),
    '@rel': generatePlainString(alternateEnclosure.rel),
    '@codecs': generatePlainString(alternateEnclosure.codecs),
    '@default': generateBoolean(alternateEnclosure.default),
    'podcast:source': trimArray(alternateEnclosure.sources, generateSource),
    'podcast:integrity': generateIntegrity(alternateEnclosure.integrity),
  }

  return trimObject(value)
}

export const generateValueRecipient: GenerateFunction<ValueRecipient> = (valueRecipient) => {
  if (!isObject(valueRecipient)) {
    return
  }

  const value = {
    '@name': generatePlainString(valueRecipient.name),
    '@customKey': generatePlainString(valueRecipient.customKey),
    '@customValue': generatePlainString(valueRecipient.customValue),
    '@type': generatePlainString(valueRecipient.type),
    '@address': generatePlainString(valueRecipient.address),
    '@split': generateNumber(valueRecipient.split),
    '@fee': generateBoolean(valueRecipient.fee),
  }

  return trimObject(value)
}

export const generateValueTimeSplit: GenerateFunction<ValueTimeSplit> = (valueTimeSplit) => {
  if (!isObject(valueTimeSplit)) {
    return
  }

  const value = {
    '@startTime': generateNumber(valueTimeSplit.startTime),
    '@duration': generateNumber(valueTimeSplit.duration),
    '@remoteStartTime': generateNumber(valueTimeSplit.remoteStartTime),
    '@remotePercentage': generateNumber(valueTimeSplit.remotePercentage),
    'podcast:remoteItem': generateRemoteItem(valueTimeSplit.remoteItem),
    'podcast:valueRecipient': trimArray(valueTimeSplit.valueRecipients, generateValueRecipient),
  }

  return trimObject(value)
}

export const generateValue: GenerateFunction<Value> = (value) => {
  if (!isObject(value)) {
    return
  }

  const valueOut = {
    '@type': generatePlainString(value.type),
    '@method': generatePlainString(value.method),
    '@suggested': generateNumber(value.suggested),
    'podcast:valueRecipient': trimArray(value.valueRecipients, generateValueRecipient),
    'podcast:valueTimeSplit': trimArray(value.valueTimeSplits, generateValueTimeSplit),
  }

  return trimObject(valueOut)
}

export const generateImages: GenerateFunction<Images> = (images) => {
  if (!isObject(images)) {
    return
  }

  const value = {
    '@srcset': generatePlainString(images.srcset),
  }

  return trimObject(value)
}

export const generateContentLink: GenerateFunction<ContentLink> = (contentLink) => {
  if (!isObject(contentLink)) {
    return
  }

  const value = {
    '#text': generateCdataString(contentLink.display),
    '@href': generatePlainString(contentLink.href),
  }

  return trimObject(value)
}

export const generateLiveItem: GenerateFunction<LiveItem<Date>> = (liveItem) => {
  if (!isObject(liveItem)) {
    return
  }

  const value = {
    ...generateBaseItem(liveItem),
    '@status': generatePlainString(liveItem.status),
    '@start': generateRfc3339Date(liveItem.start),
    '@end': generateRfc3339Date(liveItem.end),
    'podcast:contentLink': trimArray(liveItem.contentLinks, generateContentLink),
  }

  return trimObject(value)
}

export const generateSocialInteract: GenerateFunction<SocialInteract> = (socialInteract) => {
  if (!isObject(socialInteract)) {
    return
  }

  const value = {
    '@uri': generatePlainString(socialInteract.uri),
    '@protocol': generatePlainString(socialInteract.protocol),
    '@accountId': generatePlainString(socialInteract.accountId),
    '@accountUrl': generatePlainString(socialInteract.accountUrl),
    '@priority': generateNumber(socialInteract.priority),
  }

  return trimObject(value)
}

export const generateBlock: GenerateFunction<Block> = (block) => {
  if (!isObject(block)) {
    return
  }

  const value = {
    '#text': generateYesNoBoolean(block.value),
    '@id': generatePlainString(block.id),
  }

  return trimObject(value)
}

export const generateTxt: GenerateFunction<Txt> = (txt) => {
  if (!isObject(txt)) {
    return
  }

  const value = {
    '#text': generateCdataString(txt.display),
    '@purpose': generatePlainString(txt.purpose),
  }

  return trimObject(value)
}

export const generateRemoteItem: GenerateFunction<RemoteItem> = (remoteItem) => {
  if (!isObject(remoteItem)) {
    return
  }

  const value = {
    '@feedGuid': generatePlainString(remoteItem.feedGuid),
    '@feedUrl': generatePlainString(remoteItem.feedUrl),
    '@itemGuid': generatePlainString(remoteItem.itemGuid),
    '@medium': generatePlainString(remoteItem.medium),
  }

  return trimObject(value)
}

export const generatePodroll: GenerateFunction<Podroll> = (podroll) => {
  if (!isObject(podroll)) {
    return
  }

  const value = {
    'podcast:remoteItem': trimArray(podroll.remoteItems, generateRemoteItem),
  }

  return trimObject(value)
}

export const generateUpdateFrequency: GenerateFunction<UpdateFrequency<Date>> = (
  updateFrequency,
) => {
  if (!isObject(updateFrequency)) {
    return
  }

  const value = {
    '#text': generateCdataString(updateFrequency.display),
    '@complete': generateBoolean(updateFrequency.complete),
    '@dtstart': generateRfc3339Date(updateFrequency.dtstart),
    '@rrule': generatePlainString(updateFrequency.rrule),
  }

  return trimObject(value)
}

export const generatePodping: GenerateFunction<Podping> = (podping) => {
  if (!isObject(podping)) {
    return
  }

  const value = {
    '@usesPodping': generateBoolean(podping.usesPodping),
  }

  return trimObject(value)
}

export const generateItem: GenerateFunction<Item> = (item) => {
  if (!isObject(item)) {
    return
  }

  return generateBaseItem(item)
}

export const generateFeed: GenerateFunction<Feed<Date>> = (feed) => {
  if (!isObject(feed)) {
    return
  }

  const value = {
    'podcast:locked': generateLocked(feed.locked),
    'podcast:funding': trimArray(feed.fundings, generateFunding),
    'podcast:person': trimArray(feed.persons, generatePerson),
    'podcast:location': generateLocation(feed.location),
    'podcast:trailer': trimArray(feed.trailers, generateTrailer),
    'podcast:license': generateLicense(feed.license),
    'podcast:guid': generateCdataString(feed.guid),
    'podcast:value': generateValue(feed.value),
    'podcast:medium': generateCdataString(feed.medium),
    'podcast:images': generateImages(feed.images),
    'podcast:liveItem': trimArray(feed.liveItems, generateLiveItem),
    'podcast:block': trimArray(feed.blocks, generateBlock),
    'podcast:txt': trimArray(feed.txts, generateTxt),
    'podcast:remoteItem': trimArray(feed.remoteItems, generateRemoteItem),
    'podcast:podroll': generatePodroll(feed.podroll),
    'podcast:updateFrequency': generateUpdateFrequency(feed.updateFrequency),
    'podcast:podping': generatePodping(feed.podping),
  }

  return trimObject(value)
}
