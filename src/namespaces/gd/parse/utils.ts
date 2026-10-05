import { isPlainObject, trimObject } from 'trousse'
import type {
  DateAny,
  ParseMainOptions,
  ParseUtilPartial,
  Unreliable,
} from '../../../common/types.js'
import {
  parseArrayOf,
  parseBoolean,
  parseDate,
  parseNumber,
  parseSingularOf,
  parseString,
  retrieveText,
} from '../../../common/utils.js'
import {
  parseEntry as parseAtomEntry,
  parseFeed as parseAtomFeed,
} from '../../../feeds/atom/parse/utils.js'
import type { GdNs } from '../common/types.js'

type ParseOptions = ParseMainOptions<DateAny>

const parseTextContent = (value: Unreliable): string | undefined => {
  return parseString(retrieveText(value))
}

// See: https://developers.google.com/gdata/docs/2.0/elements#enums.
const parseEnumValue = (value: Unreliable): string | undefined => {
  return parseString(value?.['@value'])
}

export const parseImage: ParseUtilPartial<GdNs.Image> = (value) => {
  if (!isPlainObject(value)) {
    return
  }

  const image = {
    src: parseString(value['@src']),
    rel: parseString(value['@rel']),
    width: parseNumber(value['@width']),
    height: parseNumber(value['@height']),
  }

  return trimObject(image)
}

export const parseFeedLink: ParseUtilPartial<GdNs.FeedLink<DateAny>, ParseOptions> = (
  value,
  options,
) => {
  if (!isPlainObject(value)) {
    return
  }

  const feedLink = {
    href: parseString(value['@href']),
    rel: parseString(value['@rel']),
    readOnly: parseBoolean(value['@readonly']),
    countHint: parseNumber(value['@counthint']),
    feed: parseSingularOf(value.feed, (value) => parseAtomFeed(value, options)),
  }

  return trimObject(feedLink)
}

export const parseEntryLink: ParseUtilPartial<GdNs.EntryLink<DateAny>, ParseOptions> = (
  value,
  options,
) => {
  if (!isPlainObject(value)) {
    return
  }

  const entryLink = {
    href: parseString(value['@href']),
    rel: parseString(value['@rel']),
    readOnly: parseBoolean(value['@readonly']),
    entry: parseSingularOf(value.entry, (value) => parseAtomEntry(value, options)),
  }

  return trimObject(entryLink)
}

export const parseComments: ParseUtilPartial<GdNs.Comments<DateAny>, ParseOptions> = (
  value,
  options,
) => {
  if (!isPlainObject(value)) {
    return
  }

  const comments = {
    rel: parseString(value['@rel']),
    feedLink: parseSingularOf(value['gd:feedlink'], (value) => parseFeedLink(value, options)),
  }

  return trimObject(comments)
}

export const parseEmail: ParseUtilPartial<GdNs.Email> = (value) => {
  if (!isPlainObject(value)) {
    return
  }

  const email = {
    address: parseString(value['@address']),
    displayName: parseString(value['@displayname']),
    label: parseString(value['@label']),
    rel: parseString(value['@rel']),
    primary: parseBoolean(value['@primary']),
  }

  return trimObject(email)
}

export const parseExtendedProperty: ParseUtilPartial<GdNs.ExtendedProperty> = (value) => {
  if (!isPlainObject(value)) {
    return
  }

  const extendedProperty = {
    name: parseString(value['@name']),
    value: parseString(value['@value']),
    realm: parseString(value['@realm']),
  }

  return trimObject(extendedProperty)
}

export const parseGeoPt: ParseUtilPartial<GdNs.GeoPt<DateAny>, ParseOptions> = (value, options) => {
  if (!isPlainObject(value)) {
    return
  }

  const geoPt = {
    lat: parseNumber(value['@lat']),
    lon: parseNumber(value['@lon']),
    elev: parseNumber(value['@elev']),
    label: parseString(value['@label']),
    time: parseDate(value['@time'], options?.parseDateFn),
  }

  return trimObject(geoPt)
}

export const parseIm: ParseUtilPartial<GdNs.Im> = (value) => {
  if (!isPlainObject(value)) {
    return
  }

  const im = {
    address: parseString(value['@address']),
    label: parseString(value['@label']),
    rel: parseString(value['@rel']),
    protocol: parseString(value['@protocol']),
    primary: parseBoolean(value['@primary']),
  }

  return trimObject(im)
}

export const parseMoney: ParseUtilPartial<GdNs.Money> = (value) => {
  if (!isPlainObject(value)) {
    return
  }

  const money = {
    amount: parseNumber(value['@amount']),
    currencyCode: parseString(value['@currencycode']),
  }

  return trimObject(money)
}

export const parsePhoneticName: ParseUtilPartial<GdNs.PhoneticName> = (value) => {
  const phoneticName = {
    value: parseTextContent(value),
    yomi: parseString(value?.['@yomi']),
  }

  return trimObject(phoneticName)
}

export const parseName: ParseUtilPartial<GdNs.Name> = (value) => {
  if (!isPlainObject(value)) {
    return
  }

  const name = {
    givenName: parseSingularOf(value['gd:givenname'], parsePhoneticName),
    additionalName: parseSingularOf(value['gd:additionalname'], parsePhoneticName),
    familyName: parseSingularOf(value['gd:familyname'], parsePhoneticName),
    namePrefix: parseSingularOf(value['gd:nameprefix'], parseTextContent),
    nameSuffix: parseSingularOf(value['gd:namesuffix'], parseTextContent),
    fullName: parseSingularOf(value['gd:fullname'], parseTextContent),
  }

  return trimObject(name)
}

export const parseReminder: ParseUtilPartial<GdNs.Reminder<DateAny>, ParseOptions> = (
  value,
  options,
) => {
  if (!isPlainObject(value)) {
    return
  }

  const reminder = {
    absoluteTime: parseDate(value['@absolutetime'], options?.parseDateFn),
    method: parseString(value['@method']),
    days: parseNumber(value['@days']),
    hours: parseNumber(value['@hours']),
    minutes: parseNumber(value['@minutes']),
  }

  return trimObject(reminder)
}

export const parseWhen: ParseUtilPartial<GdNs.When<DateAny>, ParseOptions> = (value, options) => {
  if (!isPlainObject(value)) {
    return
  }

  const when = {
    startTime: parseDate(value['@starttime'], options?.parseDateFn),
    endTime: parseDate(value['@endtime'], options?.parseDateFn),
    valueString: parseString(value['@valuestring']),
    reminders: parseArrayOf(value['gd:reminder'], (value) => parseReminder(value, options)),
  }

  return trimObject(when)
}

export const parseWhere: ParseUtilPartial<GdNs.Where<DateAny>, ParseOptions> = (value, options) => {
  if (!isPlainObject(value)) {
    return
  }

  const where = {
    rel: parseString(value['@rel']),
    label: parseString(value['@label']),
    valueString: parseString(value['@valuestring']),
    entryLink: parseSingularOf(value['gd:entrylink'], (value) => parseEntryLink(value, options)),
  }

  return trimObject(where)
}

export const parseWho: ParseUtilPartial<GdNs.Who<DateAny>, ParseOptions> = (value, options) => {
  if (!isPlainObject(value)) {
    return
  }

  const who = {
    rel: parseString(value['@rel']),
    email: parseString(value['@email']),
    valueString: parseString(value['@valuestring']),
    attendeeStatus: parseSingularOf(value['gd:attendeestatus'], parseEnumValue),
    attendeeType: parseSingularOf(value['gd:attendeetype'], parseEnumValue),
    entryLink: parseSingularOf(value['gd:entrylink'], (value) => parseEntryLink(value, options)),
  }

  return trimObject(who)
}

export const parseOrganization: ParseUtilPartial<GdNs.Organization<DateAny>, ParseOptions> = (
  value,
  options,
) => {
  if (!isPlainObject(value)) {
    return
  }

  const organization = {
    label: parseString(value['@label']),
    rel: parseString(value['@rel']),
    primary: parseBoolean(value['@primary']),
    orgDepartment: parseSingularOf(value['gd:orgdepartment'], parseTextContent),
    orgJobDescription: parseSingularOf(value['gd:orgjobdescription'], parseTextContent),
    orgName: parseSingularOf(value['gd:orgname'], parsePhoneticName),
    orgSymbol: parseSingularOf(value['gd:orgsymbol'], parseTextContent),
    orgTitle: parseSingularOf(value['gd:orgtitle'], parseTextContent),
    where: parseSingularOf(value['gd:where'], (value) => parseWhere(value, options)),
  }

  return trimObject(organization)
}

export const parseOriginalEvent: ParseUtilPartial<GdNs.OriginalEvent<DateAny>, ParseOptions> = (
  value,
  options,
) => {
  if (!isPlainObject(value)) {
    return
  }

  const originalEvent = {
    id: parseString(value['@id']),
    href: parseString(value['@href']),
    when: parseSingularOf(value['gd:when'], (value) => parseWhen(value, options)),
  }

  return trimObject(originalEvent)
}

export const parsePhoneNumber: ParseUtilPartial<GdNs.PhoneNumber> = (value) => {
  const phoneNumber = {
    value: parseTextContent(value),
    label: parseString(value?.['@label']),
    rel: parseString(value?.['@rel']),
    uri: parseString(value?.['@uri']),
    primary: parseBoolean(value?.['@primary']),
  }

  return trimObject(phoneNumber)
}

export const parsePostalAddress: ParseUtilPartial<GdNs.PostalAddress> = (value) => {
  const postalAddress = {
    value: parseTextContent(value),
    label: parseString(value?.['@label']),
    rel: parseString(value?.['@rel']),
    primary: parseBoolean(value?.['@primary']),
  }

  return trimObject(postalAddress)
}

export const parseRating: ParseUtilPartial<GdNs.Rating> = (value) => {
  if (!isPlainObject(value)) {
    return
  }

  const rating = {
    rel: parseString(value['@rel']),
    value: parseNumber(value['@value']),
    average: parseNumber(value['@average']),
    min: parseNumber(value['@min']),
    max: parseNumber(value['@max']),
    numRaters: parseNumber(value['@numraters']),
  }

  return trimObject(rating)
}

export const parseRecurrenceException: ParseUtilPartial<
  GdNs.RecurrenceException<DateAny>,
  ParseOptions
> = (value, options) => {
  if (!isPlainObject(value)) {
    return
  }

  const recurrenceException = {
    specialized: parseBoolean(value['@specialized']),
    entryLink: parseSingularOf(value['gd:entrylink'], (value) => parseEntryLink(value, options)),
    originalEvent: parseSingularOf(value['gd:originalevent'], (value) => {
      return parseOriginalEvent(value, options)
    }),
  }

  return trimObject(recurrenceException)
}

export const parseCountry: ParseUtilPartial<GdNs.Country> = (value) => {
  const country = {
    value: parseTextContent(value),
    code: parseString(value?.['@code']),
  }

  return trimObject(country)
}

export const parseStructuredPostalAddress: ParseUtilPartial<GdNs.StructuredPostalAddress> = (
  value,
) => {
  if (!isPlainObject(value)) {
    return
  }

  const structuredPostalAddress = {
    rel: parseString(value['@rel']),
    mailClass: parseString(value['@mailclass']),
    usage: parseString(value['@usage']),
    label: parseString(value['@label']),
    primary: parseBoolean(value['@primary']),
    agent: parseSingularOf(value['gd:agent'], parseTextContent),
    housename: parseSingularOf(value['gd:housename'], parseTextContent),
    street: parseSingularOf(value['gd:street'], parseTextContent),
    pobox: parseSingularOf(value['gd:pobox'], parseTextContent),
    neighborhood: parseSingularOf(value['gd:neighborhood'], parseTextContent),
    city: parseSingularOf(value['gd:city'], parseTextContent),
    subregion: parseSingularOf(value['gd:subregion'], parseTextContent),
    region: parseSingularOf(value['gd:region'], parseTextContent),
    postcode: parseSingularOf(value['gd:postcode'], parseTextContent),
    country: parseSingularOf(value['gd:country'], parseCountry),
    formattedAddress: parseSingularOf(value['gd:formattedaddress'], parseTextContent),
  }

  return trimObject(structuredPostalAddress)
}

export const retrievePerson: ParseUtilPartial<GdNs.Person> = (value) => {
  if (!isPlainObject(value)) {
    return
  }

  const person = {
    image: parseSingularOf(value['gd:image'], parseImage),
  }

  return trimObject(person)
}

export const retrieveEntry: ParseUtilPartial<GdNs.Entry<DateAny>, ParseOptions> = (
  value,
  options,
) => {
  if (!isPlainObject(value)) {
    return
  }

  const entry = {
    comments: parseSingularOf(value['gd:comments'], (value) => parseComments(value, options)),
    // A marker element: its presence alone marks the entry deleted.
    deleted: value['gd:deleted'] !== undefined ? true : undefined,
    emails: parseArrayOf(value['gd:email'], parseEmail),
    eventStatus: parseSingularOf(value['gd:eventstatus'], parseEnumValue),
    extendedProperties: parseArrayOf(value['gd:extendedproperty'], parseExtendedProperty),
    geoPt: parseSingularOf(value['gd:geopt'], (value) => parseGeoPt(value, options)),
    ims: parseArrayOf(value['gd:im'], parseIm),
    money: parseSingularOf(value['gd:money'], parseMoney),
    name: parseSingularOf(value['gd:name'], parseName),
    organizations: parseArrayOf(value['gd:organization'], (value) => {
      return parseOrganization(value, options)
    }),
    originalEvent: parseSingularOf(value['gd:originalevent'], (value) => {
      return parseOriginalEvent(value, options)
    }),
    phoneNumbers: parseArrayOf(value['gd:phonenumber'], parsePhoneNumber),
    postalAddresses: parseArrayOf(value['gd:postaladdress'], parsePostalAddress),
    rating: parseSingularOf(value['gd:rating'], parseRating),
    recurrence: parseSingularOf(value['gd:recurrence'], parseTextContent),
    recurrenceExceptions: parseArrayOf(value['gd:recurrenceexception'], (value) => {
      return parseRecurrenceException(value, options)
    }),
    resourceId: parseSingularOf(value['gd:resourceid'], parseTextContent),
    structuredPostalAddresses: parseArrayOf(
      value['gd:structuredpostaladdress'],
      parseStructuredPostalAddress,
    ),
    transparency: parseSingularOf(value['gd:transparency'], parseEnumValue),
    visibility: parseSingularOf(value['gd:visibility'], parseEnumValue),
    whens: parseArrayOf(value['gd:when'], (value) => parseWhen(value, options)),
    wheres: parseArrayOf(value['gd:where'], (value) => parseWhere(value, options)),
    whos: parseArrayOf(value['gd:who'], (value) => parseWho(value, options)),
  }

  return trimObject(entry)
}

export const retrieveFeed: ParseUtilPartial<GdNs.Feed<DateAny>, ParseOptions> = (
  value,
  options,
) => {
  if (!isPlainObject(value)) {
    return
  }

  const feed = {
    wheres: parseArrayOf(value['gd:where'], (value) => parseWhere(value, options)),
  }

  return trimObject(feed)
}
