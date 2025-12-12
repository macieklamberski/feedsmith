// #region reference
export namespace OpdsNs {
  export type Link = {
    prices?: Array<Price>
    indirectAcquisitions?: Array<IndirectAcquisition>
    facetGroup?: string
    activeFacet?: boolean
    availability?: Availability
    holds?: Holds
    copies?: Copies
  }

  export type Price = {
    value: number
    currencyCode: string
  }

  export type IndirectAcquisition = {
    type: string
    indirectAcquisitions?: Array<IndirectAcquisition>
  }

  // Unofficial extension for Library lending: availability status of a resource.
  export type Availability = {
    status: string
    since?: string
    until?: string
  }

  // Unofficial extension for Library lending: hold queue information.
  export type Holds = {
    total?: number
    position?: number
  }

  // Unofficial extension for Library lending: copy availability information.
  export type Copies = {
    total?: number
    available?: number
  }
}
// #endregion reference
