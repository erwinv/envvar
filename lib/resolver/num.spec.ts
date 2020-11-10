import { num, NumResolver } from './num'
import { UnsetError, ValueTypeError } from '../error'

const ENV_VAR_NAME = 'NUM_VAR'
let numResolver: NumResolver

beforeEach(() => {
  numResolver = num()
})
afterEach(() => {
  delete process.env[ENV_VAR_NAME]
})

test('throw UnsetError', () => {
  numResolver.required()

  expect(() => numResolver.resolve(ENV_VAR_NAME))
    .toThrow(new UnsetError(ENV_VAR_NAME))
})
test('default value', () => {
  const defaultValue = 69
  numResolver.default(defaultValue)

  expect(() => numResolver.resolve(ENV_VAR_NAME))
    .not.toThrow()
  expect(numResolver.resolve(ENV_VAR_NAME))
    .toBe(defaultValue)
})

test('throw ValueTypeError', () => {
  process.env[ENV_VAR_NAME] = '!@#$%^&*'

  expect(() => numResolver.resolve(ENV_VAR_NAME))
    .toThrow(new ValueTypeError(ENV_VAR_NAME, 'number', '!@#$%^&*'))
})

test('parse number', () => {
  for (const numValue of [-1, 0, 1, 2, 3, 5, 8, 13, 21]) {
    process.env[ENV_VAR_NAME] = `${numValue}`
  
    expect(() => numResolver.resolve(ENV_VAR_NAME))
      .not.toThrow()
    expect(numResolver.resolve(ENV_VAR_NAME))
      .toBe(numValue)
  }
})
