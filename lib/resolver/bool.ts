import { BaseEnvVarResolver } from './base'

export class BoolResolver extends BaseEnvVarResolver<boolean> {
  resolvedType = 'boolean'

  validate(valFromEnv: string) {
    return ['true', 'false'].includes(valFromEnv.toLowerCase())
  }

  parse(valFromEnv: string) {
    return valFromEnv.toLowerCase() === 'true'
  }
}

export function bool() {
  return new BoolResolver()
}
