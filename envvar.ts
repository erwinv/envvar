import {
  isNullish,
  isEmptyStr,
  validateBoolean,
  validateNumber,
  parseBoolean,
  parseNumber,
} from './util'

type SupportedTypes = {
  'string': string
  'boolean': boolean
  'number': number
}
type TypeMap<T extends keyof SupportedTypes> = SupportedTypes[T]

export function Required<T extends keyof SupportedTypes>(type: T, name: string): TypeMap<T> {
  const valFromEnv = process.env[name]?.trim?.()

  if (isNullish(valFromEnv) || isEmptyStr(valFromEnv)) {
    throw new Error(`Missing ${type} ENV var: ${name}`)
  }

  return parseEnvVar<T>(type, name, valFromEnv)
}

export function Optional<T extends keyof SupportedTypes>(type: T, name: string): TypeMap<T> | null {
  const valFromEnv = process.env[name]?.trim?.()

  if (isNullish(valFromEnv) || isEmptyStr(valFromEnv)) {
    return null
  }

  return parseEnvVar<T>(type, name, valFromEnv)
}

function parseEnvVar<T extends keyof SupportedTypes>(type: T, name: string, valFromEnv: string): TypeMap<T> {
  try {
    switch (type) {
      case 'boolean':
        validateBoolean(valFromEnv)
        return parseBoolean(valFromEnv) as TypeMap<T>
      case 'number':
        validateNumber(valFromEnv)
        return parseNumber(valFromEnv) as TypeMap<T>
      case 'string':
      default:
        return valFromEnv as TypeMap<T>
    }
  } catch {
    throw new Error(`Cannot parse ENV var ${name} with value ${valFromEnv} to ${type}`)
  }
}
