type Nullish = null | undefined

const nullishSym = Symbol('NullishCheck')

export function isNullish<T extends unknown>(x: T | Nullish): x is Nullish {
  return (x ?? nullishSym) === nullishSym
}

export function isEmptyStr<T extends unknown>(x: T | string) {
  return x === ''
}

export function parseBoolean(x: string) {
  if (!['true', 'false'].includes(x.toLowerCase())) {
    throw new Error()
  }
  return x.toLowerCase() === 'true'
}

export function parseNumber(x: string) {
  if (Number.isNaN(Number.parseFloat(x))) {
    throw new Error()
  }
  return Number.parseFloat(x)
}

export function parseEnum<E extends string>(x: E, enumValues: E[]) {
  if (!enumValues.includes(x)) {
    throw new Error()
  }
  return x
}
