export class DetectError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'DetectError'
  }
}

export class GenerateError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'GenerateError'
  }
}

export class MalformedError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'MalformedError'
  }
}

export class ParseError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ParseError'
  }
}
