import { BaseEnvVarResolver } from './base'

class EnumResolver<E extends string> extends BaseEnvVarResolver<E> {
  private enumValues: E[]

  resolvedType: string

  constructor(enumValues: E[]) {
    super()
    this.enumValues = enumValues
    this.resolvedType = this.enumValues.join('|')
  }

  validate(valFromEnv: string) {
    return this.enumValues.includes(valFromEnv as E)
  }
  parse(valFromEnv: string) {
    return valFromEnv as E
  }
}

export function enu<E extends string>(enumValues: E[]) {
  return new EnumResolver<E>(enumValues)
}
