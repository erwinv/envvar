import { Resolver } from '../envvar'
import { UnsetError, ValueTypeError } from '../error'
import { isEmptyStr, isNullish } from '../util'

export abstract class BaseEnvVarResolver<T> implements Resolver<T> {
  defaultValue: T | null = null

  required(): this {
    this.defaultValue = null
    return this
  }
  default(defaultValue: T) {
    this.defaultValue = defaultValue
    return this
  }

  abstract resolvedType: string
  abstract validate(valFromEnv: string): boolean
  abstract parse(valFromEnv: string): T

  resolve(name: string) {
    const valFromEnv = process.env[name]?.trim()

    if (isNullish(valFromEnv) || isEmptyStr(valFromEnv)) {
      if (isNullish(this.defaultValue)) {
        throw new UnsetError(name)
      }
      return this.defaultValue
    }

    if (!this.validate(valFromEnv)) {
      throw new ValueTypeError(name, this.resolvedType, valFromEnv)
    }

    return this.parse(valFromEnv)
  }
}
