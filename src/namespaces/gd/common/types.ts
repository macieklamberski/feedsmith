import type { AtomFeed } from '../../../feeds/atom/common/types.js'

// #region reference
export namespace GdNs {
  export type Image = {
    src?: string
    rel?: string
    width?: number
    height?: number
  }

  export type Person = {
    image?: Image
  }

  export type FeedLink<TDate> = {
    href?: string
    rel?: string
    readOnly?: boolean
    countHint?: number
    feed?: AtomFeed.Feed<TDate>
  }

  export type EntryLink<TDate> = {
    href?: string
    rel?: string
    readOnly?: boolean
    entry?: AtomFeed.Entry<TDate>
  }

  export type Comments<TDate> = {
    rel?: string
    feedLink?: FeedLink<TDate>
  }

  export type Email = {
    address?: string
    displayName?: string
    label?: string
    rel?: string
    primary?: boolean
  }

  export type ExtendedProperty = {
    name?: string
    value?: string
    realm?: string
  }

  export type GeoPt<TDate> = {
    lat?: number
    lon?: number
    elev?: number
    label?: string
    time?: TDate
  }

  export type Im = {
    address?: string
    label?: string
    rel?: string
    protocol?: string
    primary?: boolean
  }

  export type Money = {
    amount?: number
    currencyCode?: string
  }

  export type PhoneticName = {
    value?: string
    yomi?: string
  }

  export type Name = {
    givenName?: PhoneticName
    additionalName?: PhoneticName
    familyName?: PhoneticName
    namePrefix?: string
    nameSuffix?: string
    fullName?: string
  }

  export type Reminder<TDate> = {
    absoluteTime?: TDate
    method?: string
    days?: number
    hours?: number
    minutes?: number
  }

  export type When<TDate> = {
    startTime?: TDate
    endTime?: TDate
    valueString?: string
    reminders?: Array<Reminder<TDate>>
  }

  export type Where<TDate> = {
    rel?: string
    label?: string
    valueString?: string
    entryLink?: EntryLink<TDate>
  }

  export type Who<TDate> = {
    rel?: string
    email?: string
    valueString?: string
    attendeeStatus?: string
    attendeeType?: string
    entryLink?: EntryLink<TDate>
  }

  export type Organization<TDate> = {
    label?: string
    rel?: string
    primary?: boolean
    orgDepartment?: string
    orgJobDescription?: string
    orgName?: PhoneticName
    orgSymbol?: string
    orgTitle?: string
    where?: Where<TDate>
  }

  export type OriginalEvent<TDate> = {
    id?: string
    href?: string
    when?: When<TDate>
  }

  export type PhoneNumber = {
    value?: string
    label?: string
    rel?: string
    uri?: string
    primary?: boolean
  }

  export type PostalAddress = {
    value?: string
    label?: string
    rel?: string
    primary?: boolean
  }

  export type Rating = {
    rel?: string
    value?: number
    average?: number
    min?: number
    max?: number
    numRaters?: number
  }

  export type RecurrenceException<TDate> = {
    specialized?: boolean
    entryLink?: EntryLink<TDate>
    originalEvent?: OriginalEvent<TDate>
  }

  export type Country = {
    value?: string
    code?: string
  }

  export type StructuredPostalAddress = {
    rel?: string
    mailClass?: string
    usage?: string
    label?: string
    primary?: boolean
    agent?: string
    housename?: string
    street?: string
    pobox?: string
    neighborhood?: string
    city?: string
    subregion?: string
    region?: string
    postcode?: string
    country?: Country
    formattedAddress?: string
  }

  export type Entry<TDate> = {
    comments?: Comments<TDate>
    deleted?: boolean
    emails?: Array<Email>
    eventStatus?: string
    extendedProperties?: Array<ExtendedProperty>
    /** @deprecated Deprecated by the GData reference in favour of GeoRSS. */
    geoPt?: GeoPt<TDate>
    ims?: Array<Im>
    money?: Money
    name?: Name
    organizations?: Array<Organization<TDate>>
    originalEvent?: OriginalEvent<TDate>
    phoneNumbers?: Array<PhoneNumber>
    /** @deprecated Replaced by structuredPostalAddresses in GData 2.0. */
    postalAddresses?: Array<PostalAddress>
    rating?: Rating
    recurrence?: string
    recurrenceExceptions?: Array<RecurrenceException<TDate>>
    resourceId?: string
    structuredPostalAddresses?: Array<StructuredPostalAddress>
    transparency?: string
    visibility?: string
    whens?: Array<When<TDate>>
    wheres?: Array<Where<TDate>>
    whos?: Array<Who<TDate>>
  }

  export type Feed<TDate> = {
    wheres?: Array<Where<TDate>>
  }
}
// #endregion reference
