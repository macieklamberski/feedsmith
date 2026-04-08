import type { Requirable, Strict } from '../../../common/types.js'

// #region reference
export namespace Transcripts {
  export type Segment<TStrict extends boolean = false> = Strict<
    {
      speaker: Requirable<string> // Required in spec.
      startTime: Requirable<number> // Required in spec.
      body: Requirable<string> // Required in spec.
      endTime?: number
    },
    TStrict
  >

  export type Document<TStrict extends boolean = false> = Strict<
    {
      version: Requirable<string> // Required in spec.
      segments: Requirable<Array<Segment<TStrict>>> // Required in spec.
    },
    TStrict
  >
}
// #endregion reference
