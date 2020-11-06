import { BaseEnvVarResolver } from './base'

class NumResolver extends BaseEnvVarResolver<number> {
  resolvedType = 'number'

  validate(valFromEnv: string) {
    return !Number.isNaN(Number.parseFloat(valFromEnv))
  }

  parse(valFromEnv: string) {
    return Number.parseFloat(valFromEnv)
  }
}

export function num() {
  return new NumResolver()
}
