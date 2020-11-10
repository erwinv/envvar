import { BaseEnvVarResolver } from './base'

export class EnumResolver<E extends string> extends BaseEnvVarResolver<E> {
  private enumValues: readonly E[]

  resolvedType: string

  constructor(enumValues: readonly E[]) {
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

export function enu<E extends string>(enumValues: readonly E[]) {
  return new EnumResolver<E>(enumValues)
}
