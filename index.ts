export { EnvVars } from './lib/envvar'

export { BaseEnvVarResolver } from './lib/resolver/base'
export { bool } from './lib/resolver/bool'
export { enu } from './lib/resolver/enu'
export { num } from './lib/resolver/num'
export { str } from './lib/resolver/str'
export { url } from './lib/resolver/url'

export {
  EnvVarError,
  UnsetError,
  ValueTypeError,
} from './lib/error'
