type Nullish = null | undefined

const nullishSym = Symbol('NullishCheck')

export function isNullish<T extends unknown>(x: T | Nullish): x is Nullish {
  return (x ?? nullishSym) === nullishSym
}

export function isEmptyStr<T extends unknown>(x: T | string) {
  return x === ''
}
