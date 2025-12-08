// #region reference
export namespace OpdsNs {
  export type Price = {
    value: number
    currencyCode: string
  }

  export type IndirectAcquisition = {
    type: string
    indirectAcquisitions?: Array<IndirectAcquisition>
  }

  export type Link = {
    prices?: Array<Price>
    indirectAcquisitions?: Array<IndirectAcquisition>
    facetGroup?: string
    activeFacet?: boolean
  }
}
// #endregion reference
