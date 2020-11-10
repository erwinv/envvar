import { bool, BoolResolver } from './bool'
import { UnsetError, ValueTypeError } from '../error'

const ENV_VAR_NAME = 'BOOL_VAR'
let boolResolver: BoolResolver

beforeEach(() => {
  boolResolver = bool()
})
afterEach(() => {
  delete process.env[ENV_VAR_NAME]
})

test('throw UnsetError', () => {
  boolResolver.required()

  expect(() => boolResolver.resolve(ENV_VAR_NAME))
    .toThrow(new UnsetError(ENV_VAR_NAME))
})
test('default value', () => {
  const defaultValue = true
  boolResolver.default(defaultValue)

  expect(() => boolResolver.resolve(ENV_VAR_NAME))
    .not.toThrow()
  expect(boolResolver.resolve(ENV_VAR_NAME))
    .toBe(defaultValue)
})

test('throw ValueTypeError', () => {
  process.env[ENV_VAR_NAME] = 'traeu'

  expect(() => boolResolver.resolve(ENV_VAR_NAME))
    .toThrow(new ValueTypeError(ENV_VAR_NAME, 'boolean', 'traeu'))
})

test('parse boolean', () => {
  for (const boolValue of [true, false]) {
    process.env[ENV_VAR_NAME] = `${boolValue}`
  
    expect(() => boolResolver.resolve(ENV_VAR_NAME))
      .not.toThrow()
    expect(boolResolver.resolve(ENV_VAR_NAME))
      .toBe(boolValue)
  }
})
