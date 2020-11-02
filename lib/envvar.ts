import {
  EnvVarError,
  EnvVarAggregateError,
  UnsetError,
  ValueTypeError,
} from './error'

import {
  isNullish,
  isEmptyStr,
  parseBoolean,
  parseNumber,
  parseEnum,
} from './util'

type EnvVarResolver<T> = {
  (p: string): T
}

type Templatize<T> = {
  [P in keyof T]: EnvVarResolver<T[P]>
}

export class EnvVars<T> {
  readonly template: Templatize<T>

  constructor(template: Templatize<T>) {
    this.template = template
  }

  validate() {
    let errors = [] as EnvVarError[]

    for (const k in this.template) {
      try {
        this.template[k](k)
      } catch(e: unknown) {
        if (e instanceof EnvVarError) {
          errors.push(e)
        } else {
          throw e
        }
      }
    }

    if (errors.length > 1) {
      throw new EnvVarAggregateError(errors)
    } else if (errors.length === 1) {
      throw errors[0]
    }
  }

  resolve() {
    this.validate()

    let result = {} as T

    for (const k in this.template) {
      result[k] = this.template[k](k)
    }

    return result
  }

  example() {
    return Object.keys(this.template).map(k => k + '=').join('\n')
  }
}

function getFromEnvStrict(name: string) {
  const valFromEnv = process.env[name]?.trim?.()
  if (isNullish(valFromEnv) || isEmptyStr(valFromEnv)) {
    throw new UnsetError(name)
  }
  return valFromEnv
}

export function bool(name: string) {
  const valFromEnv = getFromEnvStrict(name)
  try {
    return parseBoolean(valFromEnv)
  } catch {
    throw new ValueTypeError(name, 'boolean', valFromEnv)
  }
}

export function num(name: string) {
  const valFromEnv = getFromEnvStrict(name)
  try {
    return parseNumber(valFromEnv)
  } catch {
    throw new ValueTypeError(name, 'number', valFromEnv)
  }
}

export function str(name: string) {
  const valFromEnv = getFromEnvStrict(name)
  return valFromEnv
}

export class Enum<E extends string> {
  readonly enumValues: E[]
  constructor(enumVals: E[]) {
    this.enumValues = enumVals
  }
  _enum(name: string) {
    const valFromEnv = getFromEnvStrict(name)
    try {
      return parseEnum(valFromEnv as E, this.enumValues)
    } catch {
      throw new ValueTypeError(name, this.enumValues.join('|'), valFromEnv)
    }
  }
  enum = this._enum.bind(this)
}

export function optional<T>(envVarResolver: (name: string) => T, defaultValue: T) {
  return (name: string) => {
    try {
      return envVarResolver(name)
    } catch(e) {
      if (e instanceof UnsetError) {
        return defaultValue
      } else {
        throw e
      }
    }
  }
}
