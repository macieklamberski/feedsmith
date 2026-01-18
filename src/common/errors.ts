export class DetectError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'DetectError'
  }
}

export class ParseError extends Error {
  public readonly line?: number
  public readonly column?: number
  public readonly code?: string

  constructor(
    message: string,
    options?: {
      line?: number
      column?: number
      code?: string
      cause?: unknown
    },
  ) {
    let formattedMessage = message

    if (options?.line !== undefined && options?.column !== undefined) {
      formattedMessage = `${message} (line ${options.line}, column ${options.column})`
    }

    super(formattedMessage)
    this.name = 'ParseError'
    this.line = options?.line
    this.column = options?.column
    this.code = options?.code

    if (options?.cause) {
      this.cause = options.cause
    }
  }
}
