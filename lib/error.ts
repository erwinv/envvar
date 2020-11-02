export class EnvVarError extends Error {
  readonly variableName: string

  constructor(name: string, ...params: Parameters<ErrorConstructor>) {
    super(...params)
    this.variableName = name
  }
}

export class EnvVarAggregateError extends Error {
  readonly name = 'EnvVarAggregateError'

  readonly errors: EnvVarError[]

  constructor(errors: EnvVarError[]) {
    super(errors.map(({ message }) => message).join('\n'))

    this.errors = errors
  }
}

export class UnsetError extends EnvVarError {
  readonly name = 'UnsetError'

  constructor(name: string) {
    super(name, `Missing environment variable: ${name}`)
  }
}

export class ValueTypeError extends EnvVarError {
  readonly name = 'ValueTypeError'

  readonly expectedType: string
  readonly actualValue: string

  constructor(name: string, type: string, value: string) {
    super(name, `Failed to parse ${name} to ${type}: ${value}`)

    this.expectedType = type
    this.actualValue = value
  }
}
