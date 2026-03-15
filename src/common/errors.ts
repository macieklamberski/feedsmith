export class DetectError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'DetectError'
  }
}

export class ParseError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ParseError'
  }
}
