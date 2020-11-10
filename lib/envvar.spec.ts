import {
  EnvVars,
  ResolverTemplate,
  Resolver,
} from './envvar'

import {
  EnvVarError,
  EnvVarAggregateError,
  UnsetError,
  ValueTypeError,
} from './error'

import { bool } from './resolver/bool'
import { num } from './resolver/num'
import { str } from './resolver/str'
import { enu } from './resolver/enu'
import { url } from './resolver/url'

const ENUM_VALUES = ['foo', 'bar', 'baz'] as const

type ResolvedT = {
  BOOL_VAR: boolean
  NUM_VAR: number
  STR_VAR: string
  ENUM_VAR: typeof ENUM_VALUES[number]
  URL_VAR: URL
}

const RESOLVER_TEMPLATE: ResolverTemplate<ResolvedT> = {
  BOOL_VAR: bool(),
  NUM_VAR: num(),
  STR_VAR: str(),
  ENUM_VAR: enu(ENUM_VALUES),
  URL_VAR: url(),
}

let envVars: EnvVars<ResolvedT>

beforeEach(() => {
  envVars = new EnvVars(RESOLVER_TEMPLATE)
})
afterEach(() => {
  delete process.env.BOOL_VAR
  delete process.env.NUM_VAR
  delete process.env.ENUM_VAR
  delete process.env.URL_VAR
  delete process.env.STR_VAR 
})

test('fail fast but throw all EnvVar errors', () => {
  process.env.BOOL_VAR = 'maybe'
  process.env.NUM_VAR = 'NaN'
  delete process.env.STR_VAR 
  process.env.ENUM_VAR = ENUM_VALUES[0] + 'BigOof'
  process.env.URL_VAR = 'not.a.valid/url'

  expect(() => envVars.resolve())
    .toThrow(new EnvVarAggregateError([
      new ValueTypeError('BOOL_VAR', 'boolean', 'maybe'),
      new ValueTypeError('NUM_VAR', 'number', 'NaN'),
      new UnsetError('STR_VAR'),
      new ValueTypeError('ENUM_VAR', ENUM_VALUES.join('|'), 'fooBigOof'),
      new ValueTypeError('URL_VAR', 'URL', 'not.a.valid/url'),
    ]))
})

test('do not aggregate if only 1 EnvVar error', () => {
  process.env.BOOL_VAR = 'true'
  process.env.NUM_VAR = '42'
  process.env.STR_VAR = 'hello'
  process.env.ENUM_VAR = ENUM_VALUES[0]
  process.env.URL_VAR = 'not.a.valid/url'

  expect(() => envVars.resolve())
    .toThrow(new ValueTypeError('URL_VAR', 'URL', 'not.a.valid/url'))
})

test('bubble up unexpected errors', () => {
  const customResolver: Resolver<boolean> = {
    resolve: () => {
      throw new Error('Unexpected (not an UnsetError or ValueTypeError)')
    },
    default: () => customResolver,
    required: () => customResolver,
    defaultValue: null,
  }

  const envVars = new EnvVars({
    BOOL_VAR: customResolver,
  })
  expect(() => envVars.resolve())
    .not.toThrow(EnvVarError)
})

test('happy path', () => {
  process.env.BOOL_VAR = 'true'
  process.env.NUM_VAR = '42'
  process.env.STR_VAR = 'hello'
  process.env.ENUM_VAR = ENUM_VALUES[0]
  process.env.URL_VAR = 'https://a.valid/url'

  expect(() => envVars.resolve())
    .not.toThrow()
  expect(envVars.resolve())
    .toStrictEqual({
      BOOL_VAR: true,
      NUM_VAR: 42,
      STR_VAR: 'hello',
      ENUM_VAR: ENUM_VALUES[0],
      URL_VAR: new URL('https://a.valid/url'),
    })
})

test('generate .env example', () => {
  const envVars = new EnvVars({
    NODE_ENV: enu(['development', 'staging', 'production']).default('development'),
    HOST: str().default('localhost'),
    PORT: num(),
    DEBUG: bool().default(true),
    AUTH_API_URL: url(),
  })
  expect(envVars.example())
    .toBe(dotenvFormat`
      NODE_ENV=development
      HOST=localhost
      PORT=
      DEBUG=true
      AUTH_API_URL=
    `)
})

function dotenvFormat(template: TemplateStringsArray) {
  return template.map(
    str => str.split(/\r?\n/)
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .join('\n')
  )
  .join('\n') + '\n'
}
