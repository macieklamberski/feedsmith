import { isPlainObject, trimObject } from 'trousse'
import type { DateLike, GenerateUtil } from '../../../common/types.js'
import {
  generateBoolean,
  generateCdataString,
  generateNumber,
  generatePlainString,
  generateRfc3339Date,
  generateTextOrCdataString,
  trimArray,
} from '../../../common/utils.js'
import {
  generateEntry as generateAtomEntry,
  generateFeed as generateAtomFeed,
} from '../../../feeds/atom/generate/utils.js'
import type { GdNs } from '../common/types.js'

const dateOnlyRegex = /^\d{4}-\d{2}-\d{2}$/

// A date-only startTime or endTime marks an all-day event, and a full timestamp would turn it into
// an instant at midnight UTC.
const generateDateOrDateTime: GenerateUtil<DateLike> = (value) => {
  if (typeof value === 'string' && dateOnlyRegex.test(value.trim())) {
    return value.trim()
  }

  return generateRfc3339Date(value)
}

const generateEnumValue: GenerateUtil<string> = (value) => {
  const generated = generatePlainString(value)

  if (!generated) {
    return
  }

  return { '@value': generated }
}

export const generateImage: GenerateUtil<GdNs.Image> = (image) => {
  if (!isPlainObject(image)) {
    return
  }

  const value = {
    '@src': generatePlainString(image.src),
    '@rel': generatePlainString(image.rel),
    '@width': generateNumber(image.width),
    '@height': generateNumber(image.height),
  }

  return trimObject(value)
}

export const generateFeedLink: GenerateUtil<GdNs.FeedLink<DateLike>> = (feedLink) => {
  if (!isPlainObject(feedLink)) {
    return
  }

  const value = {
    '@href': generatePlainString(feedLink.href),
    '@rel': generatePlainString(feedLink.rel),
    '@readOnly': generateBoolean(feedLink.readOnly),
    '@countHint': generateNumber(feedLink.countHint),
    ...generateAtomFeed(feedLink.feed),
  }

  return trimObject(value)
}

export const generateEntryLink: GenerateUtil<GdNs.EntryLink<DateLike>> = (entryLink) => {
  if (!isPlainObject(entryLink)) {
    return
  }

  const value = {
    '@href': generatePlainString(entryLink.href),
    '@rel': generatePlainString(entryLink.rel),
    '@readOnly': generateBoolean(entryLink.readOnly),
    entry: generateAtomEntry(entryLink.entry),
  }

  return trimObject(value)
}

export const generateComments: GenerateUtil<GdNs.Comments<DateLike>> = (comments) => {
  if (!isPlainObject(comments)) {
    return
  }

  const value = {
    '@rel': generatePlainString(comments.rel),
    'gd:feedLink': generateFeedLink(comments.feedLink),
  }

  return trimObject(value)
}

export const generateEmail: GenerateUtil<GdNs.Email> = (email) => {
  if (!isPlainObject(email)) {
    return
  }

  const value = {
    '@address': generatePlainString(email.address),
    '@displayName': generatePlainString(email.displayName),
    '@label': generatePlainString(email.label),
    '@rel': generatePlainString(email.rel),
    '@primary': generateBoolean(email.primary),
  }

  return trimObject(value)
}

export const generateExtendedProperty: GenerateUtil<GdNs.ExtendedProperty> = (extendedProperty) => {
  if (!isPlainObject(extendedProperty)) {
    return
  }

  const value = {
    '@name': generatePlainString(extendedProperty.name),
    '@value': generatePlainString(extendedProperty.value),
    '@realm': generatePlainString(extendedProperty.realm),
  }

  return trimObject(value)
}

export const generateGeoPt: GenerateUtil<GdNs.GeoPt<DateLike>> = (geoPt) => {
  if (!isPlainObject(geoPt)) {
    return
  }

  const value = {
    '@lat': generateNumber(geoPt.lat),
    '@lon': generateNumber(geoPt.lon),
    '@elev': generateNumber(geoPt.elev),
    '@label': generatePlainString(geoPt.label),
    '@time': generateRfc3339Date(geoPt.time),
  }

  return trimObject(value)
}

export const generateIm: GenerateUtil<GdNs.Im> = (im) => {
  if (!isPlainObject(im)) {
    return
  }

  const value = {
    '@address': generatePlainString(im.address),
    '@label': generatePlainString(im.label),
    '@rel': generatePlainString(im.rel),
    '@protocol': generatePlainString(im.protocol),
    '@primary': generateBoolean(im.primary),
  }

  return trimObject(value)
}

export const generateMoney: GenerateUtil<GdNs.Money> = (money) => {
  if (!isPlainObject(money)) {
    return
  }

  const value = {
    '@amount': generateNumber(money.amount),
    '@currencyCode': generatePlainString(money.currencyCode),
  }

  return trimObject(value)
}

export const generatePhoneticName: GenerateUtil<GdNs.PhoneticName> = (phoneticName) => {
  if (!isPlainObject(phoneticName)) {
    return
  }

  const value = {
    '@yomi': generatePlainString(phoneticName.yomi),
    ...generateTextOrCdataString(phoneticName.value),
  }

  return trimObject(value)
}

export const generateName: GenerateUtil<GdNs.Name> = (name) => {
  if (!isPlainObject(name)) {
    return
  }

  const value = {
    'gd:givenName': generatePhoneticName(name.givenName),
    'gd:additionalName': generatePhoneticName(name.additionalName),
    'gd:familyName': generatePhoneticName(name.familyName),
    'gd:namePrefix': generateCdataString(name.namePrefix),
    'gd:nameSuffix': generateCdataString(name.nameSuffix),
    'gd:fullName': generateCdataString(name.fullName),
  }

  return trimObject(value)
}

export const generateReminder: GenerateUtil<GdNs.Reminder<DateLike>> = (reminder) => {
  if (!isPlainObject(reminder)) {
    return
  }

  const value = {
    '@absoluteTime': generateRfc3339Date(reminder.absoluteTime),
    '@method': generatePlainString(reminder.method),
    '@days': generateNumber(reminder.days),
    '@hours': generateNumber(reminder.hours),
    '@minutes': generateNumber(reminder.minutes),
  }

  return trimObject(value)
}

export const generateWhen: GenerateUtil<GdNs.When<DateLike>> = (when) => {
  if (!isPlainObject(when)) {
    return
  }

  const value = {
    '@startTime': generateDateOrDateTime(when.startTime),
    '@endTime': generateDateOrDateTime(when.endTime),
    '@valueString': generatePlainString(when.valueString),
    'gd:reminder': trimArray(when.reminders, generateReminder),
  }

  return trimObject(value)
}

export const generateWhere: GenerateUtil<GdNs.Where<DateLike>> = (where) => {
  if (!isPlainObject(where)) {
    return
  }

  const value = {
    '@rel': generatePlainString(where.rel),
    '@label': generatePlainString(where.label),
    '@valueString': generatePlainString(where.valueString),
    'gd:entryLink': generateEntryLink(where.entryLink),
  }

  return trimObject(value)
}

export const generateWho: GenerateUtil<GdNs.Who<DateLike>> = (who) => {
  if (!isPlainObject(who)) {
    return
  }

  const value = {
    '@rel': generatePlainString(who.rel),
    '@email': generatePlainString(who.email),
    '@valueString': generatePlainString(who.valueString),
    'gd:attendeeStatus': generateEnumValue(who.attendeeStatus),
    'gd:attendeeType': generateEnumValue(who.attendeeType),
    'gd:entryLink': generateEntryLink(who.entryLink),
  }

  return trimObject(value)
}

export const generateOrganization: GenerateUtil<GdNs.Organization<DateLike>> = (organization) => {
  if (!isPlainObject(organization)) {
    return
  }

  const value = {
    '@label': generatePlainString(organization.label),
    '@rel': generatePlainString(organization.rel),
    '@primary': generateBoolean(organization.primary),
    'gd:orgDepartment': generateCdataString(organization.orgDepartment),
    'gd:orgJobDescription': generateCdataString(organization.orgJobDescription),
    'gd:orgName': generatePhoneticName(organization.orgName),
    'gd:orgSymbol': generateCdataString(organization.orgSymbol),
    'gd:orgTitle': generateCdataString(organization.orgTitle),
    'gd:where': generateWhere(organization.where),
  }

  return trimObject(value)
}

export const generateOriginalEvent: GenerateUtil<GdNs.OriginalEvent<DateLike>> = (
  originalEvent,
) => {
  if (!isPlainObject(originalEvent)) {
    return
  }

  const value = {
    '@id': generatePlainString(originalEvent.id),
    '@href': generatePlainString(originalEvent.href),
    'gd:when': generateWhen(originalEvent.when),
  }

  return trimObject(value)
}

export const generatePhoneNumber: GenerateUtil<GdNs.PhoneNumber> = (phoneNumber) => {
  if (!isPlainObject(phoneNumber)) {
    return
  }

  const value = {
    '@label': generatePlainString(phoneNumber.label),
    '@rel': generatePlainString(phoneNumber.rel),
    '@uri': generatePlainString(phoneNumber.uri),
    '@primary': generateBoolean(phoneNumber.primary),
    ...generateTextOrCdataString(phoneNumber.value),
  }

  return trimObject(value)
}

export const generatePostalAddress: GenerateUtil<GdNs.PostalAddress> = (postalAddress) => {
  if (!isPlainObject(postalAddress)) {
    return
  }

  const value = {
    '@label': generatePlainString(postalAddress.label),
    '@rel': generatePlainString(postalAddress.rel),
    '@primary': generateBoolean(postalAddress.primary),
    ...generateTextOrCdataString(postalAddress.value),
  }

  return trimObject(value)
}

export const generateRating: GenerateUtil<GdNs.Rating> = (rating) => {
  if (!isPlainObject(rating)) {
    return
  }

  const value = {
    '@rel': generatePlainString(rating.rel),
    '@value': generateNumber(rating.value),
    '@average': generateNumber(rating.average),
    '@min': generateNumber(rating.min),
    '@max': generateNumber(rating.max),
    '@numRaters': generateNumber(rating.numRaters),
  }

  return trimObject(value)
}

export const generateRecurrenceException: GenerateUtil<GdNs.RecurrenceException<DateLike>> = (
  recurrenceException,
) => {
  if (!isPlainObject(recurrenceException)) {
    return
  }

  const value = {
    '@specialized': generateBoolean(recurrenceException.specialized),
    'gd:entryLink': generateEntryLink(recurrenceException.entryLink),
    'gd:originalEvent': generateOriginalEvent(recurrenceException.originalEvent),
  }

  return trimObject(value)
}

export const generateCountry: GenerateUtil<GdNs.Country> = (country) => {
  if (!isPlainObject(country)) {
    return
  }

  const value = {
    '@code': generatePlainString(country.code),
    ...generateTextOrCdataString(country.value),
  }

  return trimObject(value)
}

export const generateStructuredPostalAddress: GenerateUtil<GdNs.StructuredPostalAddress> = (
  structuredPostalAddress,
) => {
  if (!isPlainObject(structuredPostalAddress)) {
    return
  }

  const value = {
    '@rel': generatePlainString(structuredPostalAddress.rel),
    '@mailClass': generatePlainString(structuredPostalAddress.mailClass),
    '@usage': generatePlainString(structuredPostalAddress.usage),
    '@label': generatePlainString(structuredPostalAddress.label),
    '@primary': generateBoolean(structuredPostalAddress.primary),
    'gd:agent': generateCdataString(structuredPostalAddress.agent),
    'gd:housename': generateCdataString(structuredPostalAddress.housename),
    'gd:street': generateCdataString(structuredPostalAddress.street),
    'gd:pobox': generateCdataString(structuredPostalAddress.pobox),
    'gd:neighborhood': generateCdataString(structuredPostalAddress.neighborhood),
    'gd:city': generateCdataString(structuredPostalAddress.city),
    'gd:subregion': generateCdataString(structuredPostalAddress.subregion),
    'gd:region': generateCdataString(structuredPostalAddress.region),
    'gd:postcode': generateCdataString(structuredPostalAddress.postcode),
    'gd:country': generateCountry(structuredPostalAddress.country),
    'gd:formattedAddress': generateCdataString(structuredPostalAddress.formattedAddress),
  }

  return trimObject(value)
}

export const generatePerson: GenerateUtil<GdNs.Person> = (person) => {
  if (!isPlainObject(person)) {
    return
  }

  const value = {
    'gd:image': generateImage(person.image),
  }

  return trimObject(value)
}

export const generateEntry: GenerateUtil<GdNs.Entry<DateLike>> = (entry) => {
  if (!isPlainObject(entry)) {
    return
  }

  const value = {
    'gd:comments': generateComments(entry.comments),
    'gd:deleted': entry.deleted ? '' : undefined,
    'gd:email': trimArray(entry.emails, generateEmail),
    'gd:eventStatus': generateEnumValue(entry.eventStatus),
    'gd:extendedProperty': trimArray(entry.extendedProperties, generateExtendedProperty),
    'gd:geoPt': generateGeoPt(entry.geoPt),
    'gd:im': trimArray(entry.ims, generateIm),
    'gd:money': generateMoney(entry.money),
    'gd:name': generateName(entry.name),
    'gd:organization': trimArray(entry.organizations, generateOrganization),
    'gd:originalEvent': generateOriginalEvent(entry.originalEvent),
    'gd:phoneNumber': trimArray(entry.phoneNumbers, generatePhoneNumber),
    'gd:postalAddress': trimArray(entry.postalAddresses, generatePostalAddress),
    'gd:rating': generateRating(entry.rating),
    'gd:recurrence': generateCdataString(entry.recurrence),
    'gd:recurrenceException': trimArray(entry.recurrenceExceptions, generateRecurrenceException),
    'gd:resourceId': generateCdataString(entry.resourceId),
    'gd:structuredPostalAddress': trimArray(
      entry.structuredPostalAddresses,
      generateStructuredPostalAddress,
    ),
    'gd:transparency': generateEnumValue(entry.transparency),
    'gd:visibility': generateEnumValue(entry.visibility),
    'gd:when': trimArray(entry.whens, generateWhen),
    'gd:where': trimArray(entry.wheres, generateWhere),
    'gd:who': trimArray(entry.whos, generateWho),
  }

  return trimObject(value)
}

export const generateFeed: GenerateUtil<GdNs.Feed<DateLike>> = (feed) => {
  if (!isPlainObject(feed)) {
    return
  }

  const value = {
    'gd:where': trimArray(feed.wheres, generateWhere),
  }

  return trimObject(value)
}
