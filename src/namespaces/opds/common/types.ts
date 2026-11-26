import type { Requirable, Strict } from '../../../common/types.js'

// #region reference
export namespace OpdsNs {
  export type Link<TDate, TStrict extends boolean = false> = {
    prices?: Array<Price<TStrict>>
    indirectAcquisitions?: Array<IndirectAcquisition<TStrict>>
    facetGroup?: string
    activeFacet?: boolean
    availability?: Availability<TDate, TStrict>
    holds?: Holds
    copies?: Copies
  }

  export type Price<TStrict extends boolean = false> = Strict<
    {
      value: Requirable<number> // Required in spec
      currencyCode: Requirable<string> // Required in spec
    },
    TStrict
  >

  // The nested list sits outside Strict, whose mapped type cannot hold a recursive key.
  export type IndirectAcquisition<TStrict extends boolean = false> = Strict<
    {
      type: Requirable<string> // Required in spec
    },
    TStrict
  > & {
    indirectAcquisitions?: Array<IndirectAcquisition<TStrict>>
  }

  // Defined by OPDS For Library Patrons, not by OPDS 1.2.
  export type Availability<TDate, TStrict extends boolean = false> = Strict<
    {
      status: Requirable<string> // Required in spec
      since?: TDate
      until?: TDate
    },
    TStrict
  >

  // Defined by OPDS For Library Patrons, not by OPDS 1.2.
  export type Holds = {
    total?: number
    position?: number
  }

  // Defined by OPDS For Library Patrons, not by OPDS 1.2.
  export type Copies = {
    total?: number
    available?: number
  }
}
// #endregion reference
