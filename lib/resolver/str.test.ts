import { str, StrResolver } from './str'
import { UnsetError, ValueTypeError } from '../error'

const ENV_VAR_NAME = 'STR_VAR'
let strResolver: StrResolver

beforeEach(() => {
  strResolver = str()
})
afterEach(() => {
  delete process.env[ENV_VAR_NAME]
})

test('throw UnsetError', () => {
  strResolver.required()

  expect(() => strResolver.resolve(ENV_VAR_NAME))
    .toThrow(new UnsetError(ENV_VAR_NAME))
})
test('default value', () => {
  const defaultValue = 'foobar'
  strResolver.default(defaultValue)

  expect(() => strResolver.resolve(ENV_VAR_NAME))
    .not.toThrow()
  expect(strResolver.resolve(ENV_VAR_NAME))
    .toBe(defaultValue)
})

test('parse string', () => {
  for (const strValue of ['hello', 'world', 'foo', 'bar']) {
    process.env[ENV_VAR_NAME] = strValue
  
    expect(() => strResolver.resolve(ENV_VAR_NAME))
      .not.toThrow()
    expect(strResolver.resolve(ENV_VAR_NAME))
      .toBe(strValue)
  }
})
