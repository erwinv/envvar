import {
  EnvVarError,
  EnvVarAggregateError,
} from './error'

export interface Resolver<T> {
  resolve(name: string): T
  default(defaultValue: T): this
  required(): this
  defaultValue: T | null
}

type ResolverTemplate<T> = {
  [P in keyof T]: Resolver<T[P]>
}

export class EnvVars<T> {
  readonly template: ResolverTemplate<T>

  constructor(template: ResolverTemplate<T>) {
    this.template = template
  }

  validate() {
    let errors = [] as EnvVarError[]

    for (const k in this.template) {
      try {
        this.template[k].resolve(k)
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
      result[k] = this.template[k].resolve(k)
    }

    return result
  }

  example() {
    let result: string = ''

    for (const k in this.template) {
      result += k + '=' + this.template[k].defaultValue ?? ''
    }

    return result
  }
}
