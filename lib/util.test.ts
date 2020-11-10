import {
  isNullish,
  isEmptyStr,
} from './util'

test('isNullish', () => {
  for (const nullish of [null, undefined]) {
    expect(isNullish(nullish)).toBe(true)
  }

  for (const notNullish of [true, 0, '']) {
    expect(isNullish(notNullish)).toBe(false)
  }
})

test('isEmptyStr', () => {
  expect(isEmptyStr('')).toBe(true)
  expect(isEmptyStr('foobar')).toBe(false)
})

