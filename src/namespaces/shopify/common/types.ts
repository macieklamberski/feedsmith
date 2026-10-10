// #region reference
export namespace ShopifyNs {
  export type Price = {
    value?: number
    currency?: string
  }

  export type Variant = {
    id?: string
    title?: string
    price?: Price
    sku?: string
    grams?: number
  }

  export type Item = {
    type?: string
    vendor?: string
    tags?: Array<string>
    variants?: Array<Variant>
  }
}
// #endregion reference
