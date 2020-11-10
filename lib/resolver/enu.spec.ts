import { enu, EnumResolver } from './enu'
import { UnsetError, ValueTypeError } from '../error'

const ENV_VAR_NAME = 'ENUM_VAR'
const ENUM_VALUES = ['development', 'staging', 'production'] as const
let enumResolver: EnumResolver<typeof ENUM_VALUES[number]>

beforeEach(() => {
  enumResolver = enu(ENUM_VALUES)
})
afterEach(() => {
  delete process.env[ENV_VAR_NAME]
})

test('throw UnsetError', () => {
  enumResolver.required()

  expect(() => enumResolver.resolve(ENV_VAR_NAME))
    .toThrow(new UnsetError(ENV_VAR_NAME))
})

test('default value', () => {
  const defaultValue = ENUM_VALUES[0]
  enumResolver.default(defaultValue)

  expect(() => enumResolver.resolve(ENV_VAR_NAME))
    .not.toThrow()
  expect(enumResolver.resolve(ENV_VAR_NAME))
    .toBe(defaultValue)
})

test('throw ValueTypeError', () => {
  process.env[ENV_VAR_NAME] = 'traeu'

  expect(() => enumResolver.resolve(ENV_VAR_NAME))
    .toThrow(new ValueTypeError(ENV_VAR_NAME, ENUM_VALUES.join('|'), 'traeu'))
})

test('parse enum', () => {
  for (const enumValue of ENUM_VALUES) {
    process.env[ENV_VAR_NAME] = enumValue

    expect(() => enumResolver.resolve(ENV_VAR_NAME))
      .not.toThrow()
    expect(enumResolver.resolve(ENV_VAR_NAME))
      .toBe(enumValue)
  }
})
