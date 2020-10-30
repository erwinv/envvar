type Nullish = null | undefined

const nullishSym = Symbol('NullishCheck')

export function isNullish<T extends unknown>(x: T | Nullish): x is Nullish {
  return (x ?? nullishSym) === nullishSym
}
export function isEmptyStr<T extends unknown>(x: T | string) {
  return x === ''
}

export function validateBoolean(x: string) {
  if (!['true', 'false'].includes(x.toLowerCase())) {
    throw new Error()
  }
}
export function validateNumber(x: string) {
  if (Number.isNaN(Number.parseFloat(x))) {
    throw new Error()
  }
}

export function parseBoolean(x: string) {
  return x.toLowerCase() === 'true'
}
export function parseNumber(x: string) {
  return Number.parseFloat(x)
}
