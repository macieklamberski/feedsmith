import type { GenerateFunction } from '../../../common/types.js'
import {
  generateRfc822Date,
  generateRfc3339Date,
  generateYesNoBoolean,
  isObject,
  trimArray,
  trimObject,
} from '../../../common/utils.js'
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
} from '../common/types.js'

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
      baseItem.alternateEnclosures?.map(generateAlternateEnclosure),
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
    '@url': transcript.url,
    '@type': transcript.type,
    '@language': transcript.language,
    '@rel': transcript.rel,
  }

  return trimObject(value)
}

export const generateLocked: GenerateFunction<Locked> = (locked) => {
  if (!isObject(locked)) {
    return
  }

  const value = {
    '#text': generateYesNoBoolean(locked.value),
    '@owner': locked.owner,
  }

  return trimObject(value)
}

export const generateFunding: GenerateFunction<Funding> = (funding) => {
  if (!isObject(funding)) {
    return
  }

  const value = {
    '#text': funding.display,
    '@url': funding.url,
  }

  return trimObject(value)
}

export const generateChapters: GenerateFunction<Chapters> = (chapters) => {
  if (!isObject(chapters)) {
    return
  }

  const value = {
    '@url': chapters.url,
    '@type': chapters.type,
  }

  return trimObject(value)
}

export const generateSoundbite: GenerateFunction<Soundbite> = (soundbite) => {
  if (!isObject(soundbite)) {
    return
  }

  const value = {
    '#text': soundbite.display,
    '@startTime': soundbite.startTime,
    '@duration': soundbite.duration,
  }

  return trimObject(value)
}

export const generatePerson: GenerateFunction<Person> = (person) => {
  if (!isObject(person)) {
    return
  }

  const value = {
    '#text': person.display,
    '@role': person.role,
    '@group': person.group,
    '@img': person.img,
    '@href': person.href,
  }

  return trimObject(value)
}

export const generateLocation: GenerateFunction<Location> = (location) => {
  if (!isObject(location)) {
    return
  }

  const value = {
    '#text': location.display,
    '@geo': location.geo,
    '@osm': location.osm,
  }

  return trimObject(value)
}

export const generateSeason: GenerateFunction<Season> = (season) => {
  if (!isObject(season)) {
    return
  }

  const value = {
    '#text': season.number,
    '@name': season.name,
  }

  return trimObject(value)
}

export const generateEpisode: GenerateFunction<Episode> = (episode) => {
  if (!isObject(episode)) {
    return
  }

  const value = {
    '#text': episode.number,
    '@display': episode.display,
  }

  return trimObject(value)
}

export const generateTrailer: GenerateFunction<Trailer<Date>> = (trailer) => {
  if (!isObject(trailer)) {
    return
  }

  const value = {
    '#text': trailer.display,
    '@url': trailer.url,
    '@pubdate': generateRfc822Date(trailer.pubDate),
    '@length': trailer.length,
    '@type': trailer.type,
    '@season': trailer.season,
  }

  return trimObject(value)
}

export const generateLicense: GenerateFunction<License> = (license) => {
  if (!isObject(license)) {
    return
  }

  const value = {
    '#text': license.display,
    '@url': license.url,
  }

  return trimObject(value)
}

export const generateSource: GenerateFunction<Source> = (source) => {
  if (!isObject(source)) {
    return
  }

  const value = {
    '@uri': source.uri,
    '@contentType': source.contentType,
  }

  return trimObject(value)
}

export const generateIntegrity: GenerateFunction<Integrity> = (integrity) => {
  if (!isObject(integrity)) {
    return
  }

  const value = {
    '@type': integrity.type,
    '@value': integrity.value,
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
    '@type': alternateEnclosure.type,
    '@length': alternateEnclosure.length,
    '@bitrate': alternateEnclosure.bitrate,
    '@height': alternateEnclosure.height,
    '@lang': alternateEnclosure.lang,
    '@title': alternateEnclosure.title,
    '@rel': alternateEnclosure.rel,
    '@codecs': alternateEnclosure.codecs,
    '@default': alternateEnclosure.default,
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
    '@name': valueRecipient.name,
    '@customKey': valueRecipient.customKey,
    '@customValue': valueRecipient.customValue,
    '@type': valueRecipient.type,
    '@address': valueRecipient.address,
    '@split': valueRecipient.split,
    '@fee': valueRecipient.fee,
  }

  return trimObject(value)
}

export const generateValueTimeSplit: GenerateFunction<ValueTimeSplit> = (valueTimeSplit) => {
  if (!isObject(valueTimeSplit)) {
    return
  }

  const value = {
    '@startTime': valueTimeSplit.startTime,
    '@duration': valueTimeSplit.duration,
    '@remoteStartTime': valueTimeSplit.remoteStartTime,
    '@remotePercentage': valueTimeSplit.remotePercentage,
    'podcast:remoteItem': generateRemoteItem(valueTimeSplit.remoteItem),
    'podcast:valueRecipient': trimArray(
      valueTimeSplit.valueRecipients?.map(generateValueRecipient),
    ),
  }

  return trimObject(value)
}

export const generateValue: GenerateFunction<Value> = (value) => {
  if (!isObject(value)) {
    return
  }

  const valueObj = {
    '@type': value.type,
    '@method': value.method,
    '@suggested': value.suggested,
    'podcast:valueRecipient': trimArray(value.valueRecipients, generateValueRecipient),
    'podcast:valueTimeSplit': trimArray(value.valueTimeSplits, generateValueTimeSplit),
  }

  return trimObject(valueObj)
}

export const generateImages: GenerateFunction<Images> = (images) => {
  if (!isObject(images)) {
    return
  }

  const value = {
    '@srcset': images.srcset,
  }

  return trimObject(value)
}

export const generateContentLink: GenerateFunction<ContentLink> = (contentLink) => {
  if (!isObject(contentLink)) {
    return
  }

  const value = {
    '#text': contentLink.display,
    '@href': contentLink.href,
  }

  return trimObject(value)
}

export const generateLiveItem: GenerateFunction<LiveItem<Date>> = (liveItem) => {
  if (!isObject(liveItem)) {
    return
  }

  const value = {
    ...generateBaseItem(liveItem),
    '@status': liveItem.status,
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
    '@uri': socialInteract.uri,
    '@protocol': socialInteract.protocol,
    '@accountId': socialInteract.accountId,
    '@accountUrl': socialInteract.accountUrl,
    '@priority': socialInteract.priority,
  }

  return trimObject(value)
}

export const generateBlock: GenerateFunction<Block> = (block) => {
  if (!isObject(block)) {
    return
  }

  const value = {
    '#text': generateYesNoBoolean(block.value),
    '@id': block.id,
  }

  return trimObject(value)
}

export const generateTxt: GenerateFunction<Txt> = (txt) => {
  if (!isObject(txt)) {
    return
  }

  const value = {
    '#text': txt.display,
    '@purpose': txt.purpose,
  }

  return trimObject(value)
}

export const generateRemoteItem: GenerateFunction<RemoteItem> = (remoteItem) => {
  if (!isObject(remoteItem)) {
    return
  }

  const value = {
    '@feedGuid': remoteItem.feedGuid,
    '@feedUrl': remoteItem.feedUrl,
    '@itemGuid': remoteItem.itemGuid,
    '@medium': remoteItem.medium,
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
    '#text': updateFrequency.display,
    '@complete': updateFrequency.complete,
    '@dtstart': generateRfc3339Date(updateFrequency.dtstart),
    '@rrule': updateFrequency.rrule,
  }

  return trimObject(value)
}

export const generatePodping: GenerateFunction<Podping> = (podping) => {
  if (!isObject(podping)) {
    return
  }

  const value = {
    '@usesPodping': podping.usesPodping,
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
    'podcast:guid': feed.guid,
    'podcast:value': generateValue(feed.value),
    'podcast:medium': feed.medium,
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
