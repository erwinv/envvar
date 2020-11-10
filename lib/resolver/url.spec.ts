import { url, UrlResolver } from './url'
import { UnsetError, ValueTypeError } from '../error'

const ENV_VAR_NAME = 'URL_VAR'
let urlResolver: UrlResolver

beforeEach(() => {
  urlResolver = url()
})
afterEach(() => {
  delete process.env[ENV_VAR_NAME]
})

test('throw UnsetError', () => {
  urlResolver.required()

  expect(() => urlResolver.resolve(ENV_VAR_NAME))
    .toThrow(new UnsetError(ENV_VAR_NAME))
})
test('default value', () => {
  const defaultValue = new URL('https://www.example.com/')
  urlResolver.default(defaultValue)

  expect(() => urlResolver.resolve(ENV_VAR_NAME))
    .not.toThrow()
  expect(urlResolver.resolve(ENV_VAR_NAME))
    .toBe(defaultValue)
})

test('throw ValueTypeError', () => {
  process.env[ENV_VAR_NAME] = '/not/a/valid/url'

  expect(() => urlResolver.resolve(ENV_VAR_NAME))
    .toThrow(new ValueTypeError(ENV_VAR_NAME, 'URL', '/not/a/valid/url'))
})

test('parse URL', () => {
  const urls = [
    new URL('https://www.google.com'),
    new URL('https://www.microsoft.com'),
    new URL('https://en.wikipedia.org'),
  ]

  for (const url of urls) {
    process.env[ENV_VAR_NAME] = url.href
  
    expect(() => urlResolver.resolve(ENV_VAR_NAME))
      .not.toThrow()
    expect(urlResolver.resolve(ENV_VAR_NAME))
      .toStrictEqual(url)
  }
})
