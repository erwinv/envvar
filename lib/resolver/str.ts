import { BaseEnvVarResolver } from './base'

class StrResolver extends BaseEnvVarResolver<string> {
  resolvedType = 'string'

  validate() {
    return true
  }

  parse(valFromEnv: string) {
    return valFromEnv
  }
}

export function str() {
  return new StrResolver()
}
