import type { DateLike, GenerateUtil } from '../../../common/types.js'
import {
  generateArrayOrSingular,
  generateBoolean,
  generateCdataString,
  generateNumber,
  generatePlainString,
  generateRfc822Date,
  generateRfc3339Date,
  generateSingularOrArray,
  generateTextOrCdataString,
  generateYesNoBoolean,
  isObject,
  trimArray,
  trimObject,
} from '../../../common/utils.js'
import type { PodcastNs } from '../common/types.js'

export const generateBaseItem: GenerateUtil<PodcastNs.BaseItem> = (baseItem) => {
  if (!isObject(baseItem)) {
    return
  }

  const value = {
    'podcast:transcript': trimArray(baseItem.transcripts, generateTranscript),
    'podcast:chapters': generateChapters(baseItem.chapters),
    'podcast:soundbite': trimArray(baseItem.soundbites, generateSoundbite),
    'podcast:person': trimArray(baseItem.persons, generatePerson),
    'podcast:location': generateArrayOrSingular(
      baseItem.locations,
      baseItem.location,
      generateLocation,
    ),
    'podcast:season': generateSeason(baseItem.season),
    'podcast:episode': generateEpisode(baseItem.episode),
    'podcast:license': generateLicense(baseItem.license),
    'podcast:alternateEnclosure': trimArray(
      baseItem.alternateEnclosures,
      generateAlternateEnclosure,
    ),
    'podcast:value': generateArrayOrSingular(baseItem.values, baseItem.value, generateValue),
    'podcast:image': trimArray(baseItem.images, generateImage),
    'podcast:socialInteract': trimArray(baseItem.socialInteracts, generateSocialInteract),
    'podcast:txt': trimArray(baseItem.txts, generateTxt),
    'podcast:chat': generateSingularOrArray(baseItem.chat, baseItem.chats, generateChat),
  }

  return trimObject(value)
}

export const generateTranscript: GenerateUtil<PodcastNs.Transcript> = (transcript) => {
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

export const generateLocked: GenerateUtil<PodcastNs.Locked> = (locked) => {
  if (!isObject(locked)) {
    return
  }

  const value = {
    '#text': generateYesNoBoolean(locked.value),
    '@owner': generatePlainString(locked.owner),
  }

  return trimObject(value)
}

export const generateFunding: GenerateUtil<PodcastNs.Funding> = (funding) => {
  if (!isObject(funding)) {
    return
  }

  const value = {
    ...generateTextOrCdataString(funding.display),
    '@url': generatePlainString(funding.url),
  }

  return trimObject(value)
}

export const generateChapters: GenerateUtil<PodcastNs.Chapters> = (chapters) => {
  if (!isObject(chapters)) {
    return
  }

  const value = {
    '@url': generatePlainString(chapters.url),
    '@type': generatePlainString(chapters.type),
  }

  return trimObject(value)
}

export const generateSoundbite: GenerateUtil<PodcastNs.Soundbite> = (soundbite) => {
  if (!isObject(soundbite)) {
    return
  }

  const value = {
    ...generateTextOrCdataString(soundbite.display),
    '@startTime': generateNumber(soundbite.startTime),
    '@duration': generateNumber(soundbite.duration),
  }

  return trimObject(value)
}

export const generatePerson: GenerateUtil<PodcastNs.Person> = (person) => {
  if (!isObject(person)) {
    return
  }

  const value = {
    ...generateTextOrCdataString(person.display),
    '@role': generatePlainString(person.role),
    '@group': generatePlainString(person.group),
    '@img': generatePlainString(person.img),
    '@href': generatePlainString(person.href),
  }

  return trimObject(value)
}

export const generateLocation: GenerateUtil<PodcastNs.Location> = (location) => {
  if (!isObject(location)) {
    return
  }

  const value = {
    ...generateTextOrCdataString(location.display),
    '@rel': generatePlainString(location.rel),
    '@geo': generatePlainString(location.geo),
    '@osm': generatePlainString(location.osm),
    '@country': generatePlainString(location.country),
  }

  return trimObject(value)
}

export const generateSeason: GenerateUtil<PodcastNs.Season> = (season) => {
  if (!isObject(season)) {
    return
  }

  const value = {
    '#text': generateNumber(season.number),
    '@name': generatePlainString(season.name),
  }

  return trimObject(value)
}

export const generateEpisode: GenerateUtil<PodcastNs.Episode> = (episode) => {
  if (!isObject(episode)) {
    return
  }

  const value = {
    '#text': generateNumber(episode.number),
    '@display': generatePlainString(episode.display),
  }

  return trimObject(value)
}

export const generateTrailer: GenerateUtil<PodcastNs.Trailer<DateLike>> = (trailer) => {
  if (!isObject(trailer)) {
    return
  }

  const value = {
    ...generateTextOrCdataString(trailer.display),
    '@url': generatePlainString(trailer.url),
    '@pubdate': generateRfc822Date(trailer.pubDate),
    '@length': generateNumber(trailer.length),
    '@type': generatePlainString(trailer.type),
    '@season': generateNumber(trailer.season),
  }

  return trimObject(value)
}

export const generateLicense: GenerateUtil<PodcastNs.License> = (license) => {
  if (!isObject(license)) {
    return
  }

  const value = {
    ...generateTextOrCdataString(license.display),
    '@url': generatePlainString(license.url),
  }

  return trimObject(value)
}

export const generateSource: GenerateUtil<PodcastNs.Source> = (source) => {
  if (!isObject(source)) {
    return
  }

  const value = {
    '@uri': generatePlainString(source.uri),
    '@contentType': generatePlainString(source.contentType),
  }

  return trimObject(value)
}

export const generateIntegrity: GenerateUtil<PodcastNs.Integrity> = (integrity) => {
  if (!isObject(integrity)) {
    return
  }

  const value = {
    '@type': generatePlainString(integrity.type),
    '@value': generatePlainString(integrity.value),
  }

  return trimObject(value)
}

export const generateAlternateEnclosure: GenerateUtil<PodcastNs.AlternateEnclosure> = (
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

export const generateValueRecipient: GenerateUtil<PodcastNs.ValueRecipient> = (valueRecipient) => {
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

export const generateValueTimeSplit: GenerateUtil<PodcastNs.ValueTimeSplit> = (valueTimeSplit) => {
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

export const generateValue: GenerateUtil<PodcastNs.Value> = (value) => {
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

export const generateImage: GenerateUtil<PodcastNs.Image> = (image) => {
  if (!isObject(image)) {
    return
  }

  const value = {
    '@href': generatePlainString(image.href),
    '@alt': generatePlainString(image.alt),
    '@aspect-ratio': generatePlainString(image.aspectRatio),
    '@width': generateNumber(image.width),
    '@height': generateNumber(image.height),
    '@type': generatePlainString(image.type),
    '@purpose': generatePlainString(image.purpose),
  }

  return trimObject(value)
}

export const generateContentLink: GenerateUtil<PodcastNs.ContentLink> = (contentLink) => {
  if (!isObject(contentLink)) {
    return
  }

  const value = {
    ...generateTextOrCdataString(contentLink.display),
    '@href': generatePlainString(contentLink.href),
  }

  return trimObject(value)
}

export const generateLiveItem: GenerateUtil<PodcastNs.LiveItem<DateLike>> = (liveItem) => {
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

export const generateSocialInteract: GenerateUtil<PodcastNs.SocialInteract> = (socialInteract) => {
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

export const generateChat: GenerateUtil<PodcastNs.Chat> = (chat) => {
  if (!isObject(chat)) {
    return
  }

  const value = {
    '@server': generatePlainString(chat.server),
    '@protocol': generatePlainString(chat.protocol),
    '@accountId': generatePlainString(chat.accountId),
    '@space': generatePlainString(chat.space),
  }

  return trimObject(value)
}

export const generateBlock: GenerateUtil<PodcastNs.Block> = (block) => {
  if (!isObject(block)) {
    return
  }

  const value = {
    '#text': generateYesNoBoolean(block.value),
    '@id': generatePlainString(block.id),
  }

  return trimObject(value)
}

export const generateTxt: GenerateUtil<PodcastNs.Txt> = (txt) => {
  if (!isObject(txt)) {
    return
  }

  const value = {
    ...generateTextOrCdataString(txt.display),
    '@purpose': generatePlainString(txt.purpose),
  }

  return trimObject(value)
}

export const generateRemoteItem: GenerateUtil<PodcastNs.RemoteItem> = (remoteItem) => {
  if (!isObject(remoteItem)) {
    return
  }

  const value = {
    '@feedGuid': generatePlainString(remoteItem.feedGuid),
    '@feedUrl': generatePlainString(remoteItem.feedUrl),
    '@itemGuid': generatePlainString(remoteItem.itemGuid),
    '@medium': generatePlainString(remoteItem.medium),
    '@title': generatePlainString(remoteItem.title),
  }

  return trimObject(value)
}

export const generatePodroll: GenerateUtil<PodcastNs.Podroll> = (podroll) => {
  if (!isObject(podroll)) {
    return
  }

  const value = {
    'podcast:remoteItem': trimArray(podroll.remoteItems, generateRemoteItem),
  }

  return trimObject(value)
}

export const generateUpdateFrequency: GenerateUtil<PodcastNs.UpdateFrequency<DateLike>> = (
  updateFrequency,
) => {
  if (!isObject(updateFrequency)) {
    return
  }

  const value = {
    ...generateTextOrCdataString(updateFrequency.display),
    '@complete': generateBoolean(updateFrequency.complete),
    '@dtstart': generateRfc3339Date(updateFrequency.dtstart),
    '@rrule': generatePlainString(updateFrequency.rrule),
  }

  return trimObject(value)
}

export const generatePodping: GenerateUtil<PodcastNs.Podping> = (podping) => {
  if (!isObject(podping)) {
    return
  }

  const value = {
    '@usesPodping': generateBoolean(podping.usesPodping),
  }

  return trimObject(value)
}

export const generatePublisher: GenerateUtil<PodcastNs.Publisher> = (publisher) => {
  if (!isObject(publisher)) {
    return
  }

  const value = {
    'podcast:remoteItem': generateRemoteItem(publisher.remoteItem),
  }

  return trimObject(value)
}

export const generateItem: GenerateUtil<PodcastNs.Item> = (item) => {
  if (!isObject(item)) {
    return
  }

  return generateBaseItem(item)
}

export const generateFeed: GenerateUtil<PodcastNs.Feed<DateLike>> = (feed) => {
  if (!isObject(feed)) {
    return
  }

  const value = {
    'podcast:locked': generateLocked(feed.locked),
    'podcast:funding': trimArray(feed.fundings, generateFunding),
    'podcast:person': trimArray(feed.persons, generatePerson),
    'podcast:location': generateArrayOrSingular(feed.locations, feed.location, generateLocation),
    'podcast:trailer': trimArray(feed.trailers, generateTrailer),
    'podcast:license': generateLicense(feed.license),
    'podcast:guid': generateCdataString(feed.guid),
    'podcast:value': generateArrayOrSingular(feed.values, feed.value, generateValue),
    'podcast:medium': generateCdataString(feed.medium),
    'podcast:image': trimArray(feed.images, generateImage),
    'podcast:liveItem': trimArray(feed.liveItems, generateLiveItem),
    'podcast:block': trimArray(feed.blocks, generateBlock),
    'podcast:txt': trimArray(feed.txts, generateTxt),
    'podcast:remoteItem': trimArray(feed.remoteItems, generateRemoteItem),
    'podcast:podroll': generatePodroll(feed.podroll),
    'podcast:updateFrequency': generateUpdateFrequency(feed.updateFrequency),
    'podcast:podping': generatePodping(feed.podping),
    'podcast:chat': generateSingularOrArray(feed.chat, feed.chats, generateChat),
    'podcast:publisher': generatePublisher(feed.publisher),
  }

  return trimObject(value)
}
