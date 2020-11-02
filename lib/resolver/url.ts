import { BaseEnvVarResolver } from './base'

class UrlResolver extends BaseEnvVarResolver<URL> {
  resolvedType = 'URL'
  validate(valFromEnv: string) {
    try {
      new URL(valFromEnv)
      return true
    } catch {
      return false
    }
  }
  parse(valFromEnv: string) {
    return new URL(valFromEnv)
  }
}

export function url() {
  return new UrlResolver()
}
