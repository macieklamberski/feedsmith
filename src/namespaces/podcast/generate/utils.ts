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

export const generateBaseItem: GenerateFunction<BaseItem> = (item) => {
  if (!isObject(item)) {
    return
  }

  return trimObject({
    'podcast:transcript': trimArray(item.transcripts?.map(generateTranscript)),
    'podcast:chapters': generateChapters(item.chapters),
    'podcast:soundbite': trimArray(item.soundbites?.map(generateSoundbite)),
    'podcast:person': trimArray(item.persons?.map(generatePerson)),
    'podcast:location': generateLocation(item.location),
    'podcast:season': generateSeason(item.season),
    'podcast:episode': generateEpisode(item.episode),
    'podcast:license': generateLicense(item.license),
    'podcast:alternateEnclosure': trimArray(
      item.alternateEnclosures?.map(generateAlternateEnclosure),
    ),
    'podcast:value': generateValue(item.value),
    'podcast:images': generateImages(item.images),
    'podcast:socialInteract': trimArray(item.socialInteracts?.map(generateSocialInteract)),
    'podcast:txt': trimArray(item.txts?.map(generateTxt)),
  })
}

export const generateTranscript: GenerateFunction<Transcript> = (transcript) => {
  if (!isObject(transcript)) {
    return
  }

  return trimObject({
    '@url': transcript.url,
    '@type': transcript.type,
    '@language': transcript.language,
    '@rel': transcript.rel,
  })
}

export const generateLocked: GenerateFunction<Locked> = (locked) => {
  if (!isObject(locked)) {
    return
  }

  return trimObject({
    '#text': generateYesNoBoolean(locked.value),
    '@owner': locked.owner,
  })
}

export const generateFunding: GenerateFunction<Funding> = (funding) => {
  if (!isObject(funding)) {
    return
  }

  return trimObject({
    '#text': funding.display,
    '@url': funding.url,
  })
}

export const generateChapters: GenerateFunction<Chapters> = (chapters) => {
  if (!isObject(chapters)) {
    return
  }

  return trimObject({
    '@url': chapters.url,
    '@type': chapters.type,
  })
}

export const generateSoundbite: GenerateFunction<Soundbite> = (soundbite) => {
  if (!isObject(soundbite)) {
    return
  }

  return trimObject({
    '#text': soundbite.display,
    '@startTime': soundbite.startTime,
    '@duration': soundbite.duration,
  })
}

export const generatePerson: GenerateFunction<Person> = (person) => {
  if (!isObject(person)) {
    return
  }

  return trimObject({
    '#text': person.display,
    '@role': person.role,
    '@group': person.group,
    '@img': person.img,
    '@href': person.href,
  })
}

export const generateLocation: GenerateFunction<Location> = (location) => {
  if (!isObject(location)) {
    return
  }

  return trimObject({
    '#text': location.display,
    '@geo': location.geo,
    '@osm': location.osm,
  })
}

export const generateSeason: GenerateFunction<Season> = (season) => {
  if (!isObject(season)) {
    return
  }

  return trimObject({
    '#text': season.number,
    '@name': season.name,
  })
}

export const generateEpisode: GenerateFunction<Episode> = (episode) => {
  if (!isObject(episode)) {
    return
  }

  return trimObject({
    '#text': episode.number,
    '@display': episode.display,
  })
}

export const generateTrailer: GenerateFunction<Trailer<Date>> = (trailer) => {
  if (!isObject(trailer)) {
    return
  }

  return trimObject({
    '#text': trailer.display,
    '@url': trailer.url,
    '@pubdate': generateRfc822Date(trailer.pubDate),
    '@length': trailer.length,
    '@type': trailer.type,
    '@season': trailer.season,
  })
}

export const generateLicense: GenerateFunction<License> = (license) => {
  if (!isObject(license)) {
    return
  }

  return trimObject({
    '#text': license.display,
    '@url': license.url,
  })
}

export const generateSource: GenerateFunction<Source> = (source) => {
  if (!isObject(source)) {
    return
  }

  return trimObject({
    '@uri': source.uri,
    '@contentType': source.contentType,
  })
}

export const generateIntegrity: GenerateFunction<Integrity> = (integrity) => {
  if (!isObject(integrity)) {
    return
  }

  return trimObject({
    '@type': integrity.type,
    '@value': integrity.value,
  })
}

export const generateAlternateEnclosure: GenerateFunction<AlternateEnclosure> = (enclosure) => {
  if (!isObject(enclosure)) {
    return
  }

  return trimObject({
    '@type': enclosure.type,
    '@length': enclosure.length,
    '@bitrate': enclosure.bitrate,
    '@height': enclosure.height,
    '@lang': enclosure.lang,
    '@title': enclosure.title,
    '@rel': enclosure.rel,
    '@codecs': enclosure.codecs,
    '@default': enclosure.default,
    'podcast:source': trimArray(enclosure.sources?.map(generateSource)),
    'podcast:integrity': generateIntegrity(enclosure.integrity),
  })
}

export const generateValueRecipient: GenerateFunction<ValueRecipient> = (recipient) => {
  if (!isObject(recipient)) {
    return
  }

  return trimObject({
    '@name': recipient.name,
    '@customKey': recipient.customKey,
    '@customValue': recipient.customValue,
    '@type': recipient.type,
    '@address': recipient.address,
    '@split': recipient.split,
    '@fee': recipient.fee,
  })
}

export const generateValueTimeSplit: GenerateFunction<ValueTimeSplit> = (split) => {
  if (!isObject(split)) {
    return
  }

  return trimObject({
    '@startTime': split.startTime,
    '@duration': split.duration,
    '@remoteStartTime': split.remoteStartTime,
    '@remotePercentage': split.remotePercentage,
    'podcast:remoteItem': generateRemoteItem(split.remoteItem),
    'podcast:valueRecipient': trimArray(split.valueRecipients?.map(generateValueRecipient)),
  })
}

export const generateValue: GenerateFunction<Value> = (value) => {
  if (!isObject(value)) {
    return
  }

  return trimObject({
    '@type': value.type,
    '@method': value.method,
    '@suggested': value.suggested,
    'podcast:valueRecipient': trimArray(value.valueRecipients?.map(generateValueRecipient)),
    'podcast:valueTimeSplit': trimArray(value.valueTimeSplits?.map(generateValueTimeSplit)),
  })
}

export const generateImages: GenerateFunction<Images> = (images) => {
  if (!isObject(images)) {
    return
  }

  return trimObject({
    '@srcset': images.srcset,
  })
}

export const generateContentLink: GenerateFunction<ContentLink> = (link) => {
  if (!isObject(link)) {
    return
  }

  return trimObject({
    '#text': link.display,
    '@href': link.href,
  })
}

export const generateLiveItem: GenerateFunction<LiveItem<Date>> = (liveItem) => {
  if (!isObject(liveItem)) {
    return
  }

  return trimObject({
    ...generateBaseItem(liveItem),
    '@status': liveItem.status,
    '@start': generateRfc3339Date(liveItem.start),
    '@end': generateRfc3339Date(liveItem.end),
    'podcast:contentLink': trimArray(liveItem.contentlinks?.map(generateContentLink)),
  })
}

export const generateSocialInteract: GenerateFunction<SocialInteract> = (interact) => {
  if (!isObject(interact)) {
    return
  }

  return trimObject({
    '@uri': interact.uri,
    '@protocol': interact.protocol,
    '@accountId': interact.accountId,
    '@accountUrl': interact.accountUrl,
    '@priority': interact.priority,
  })
}

export const generateBlock: GenerateFunction<Block> = (block) => {
  if (!isObject(block)) {
    return
  }

  return trimObject({
    '#text': generateYesNoBoolean(block.value),
    '@id': block.id,
  })
}

export const generateTxt: GenerateFunction<Txt> = (txt) => {
  if (!isObject(txt)) {
    return
  }

  return trimObject({
    '#text': txt.display,
    '@purpose': txt.purpose,
  })
}

export const generateRemoteItem: GenerateFunction<RemoteItem> = (remoteItem) => {
  if (!isObject(remoteItem)) {
    return
  }

  return trimObject({
    '@feedGuid': remoteItem.feedGuid,
    '@feedUrl': remoteItem.feedUrl,
    '@itemGuid': remoteItem.itemGuid,
    '@medium': remoteItem.medium,
  })
}

export const generatePodroll: GenerateFunction<Podroll> = (podroll) => {
  if (!isObject(podroll)) {
    return
  }

  return trimObject({
    'podcast:remoteItem': trimArray(podroll.remoteItems?.map(generateRemoteItem)),
  })
}

export const generateUpdateFrequency: GenerateFunction<UpdateFrequency<Date>> = (frequency) => {
  if (!isObject(frequency)) {
    return
  }

  return trimObject({
    '#text': frequency.display,
    '@complete': frequency.complete,
    '@dtstart': generateRfc3339Date(frequency.dtstart),
    '@rrule': frequency.rrule,
  })
}

export const generatePodping: GenerateFunction<Podping> = (podping) => {
  if (!isObject(podping)) {
    return
  }

  return trimObject({
    '@usesPodping': podping.usesPodping,
  })
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

  return trimObject({
    'podcast:locked': generateLocked(feed.locked),
    'podcast:funding': trimArray(feed.fundings?.map(generateFunding)),
    'podcast:person': trimArray(feed.persons?.map(generatePerson)),
    'podcast:location': generateLocation(feed.location),
    'podcast:trailer': trimArray(feed.trailers?.map(generateTrailer)),
    'podcast:license': generateLicense(feed.license),
    'podcast:guid': feed.guid,
    'podcast:value': generateValue(feed.value),
    'podcast:medium': feed.medium,
    'podcast:images': generateImages(feed.images),
    'podcast:liveItem': trimArray(feed.liveItems?.map(generateLiveItem)),
    'podcast:block': trimArray(feed.blocks?.map(generateBlock)),
    'podcast:txt': trimArray(feed.txts?.map(generateTxt)),
    'podcast:remoteItem': trimArray(feed.remoteItems?.map(generateRemoteItem)),
    'podcast:podroll': generatePodroll(feed.podroll),
    'podcast:updateFrequency': generateUpdateFrequency(feed.updateFrequency),
    'podcast:podping': generatePodping(feed.podping),
  })
}
